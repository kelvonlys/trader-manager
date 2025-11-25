'use client';

import ButtonDefault from "@/components/Buttons/ButtonDefault";
import PopupBox from "@/components/Popup/BasicPopup";
import { useState, useEffect } from "react";

type Position = {
  position_id: number;
  symbol: string;
  price_open: number;
  price_current: number;
  stop_loss: number;
  take_profit: number;
  profit: number;
  volume: number;
  type: "buy" | "sell";
  time: number;
  digits: number;
};

const InstrutmentTable = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch positions + refresh every 1 second for live P&L
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/open-positions`);
        if (!res.ok) throw new Error("Cannot to connect to server");
        const data = await res.json();
        if (data.status === "success") {
          setPositions(data.positions);
        } else {
          throw new Error(data.message || "Unknown error");
        }
      } catch (err: any) {
        setError(err.message || "Could not connect to server");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    // First load
    fetchPositions();

    // Then every 1 second → floating P&L
    const interval = setInterval(fetchPositions, 1000);

    return () => clearInterval(interval);
  }, []);

  const closePosition = async (ticket: number) => {
    if (!confirm(`Close position #${ticket}?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/close/${ticket}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Close failed");
      }

      alert(`Ticket #${ticket} closed successfully\nProfit: ${data.profit?.toFixed(2) || 'N/A'} USD`);

      // Immediate refresh after close
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/open-positions`);
      const refreshData = await refreshRes.json();
      if (refreshData.status === "success") {
        setPositions(refreshData.positions);
      }
    } catch (err: any) {
      alert(`Cannot close #${ticket}\n${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white px-7.5 py-20 shadow-1 dark:bg-gray-dark text-center">
        <p className="text-gray-500">Loading open positions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[10px] bg-white px-7.5 py-10 shadow-1 dark:bg-gray-dark text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Please refresh the page and try again
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-xl font-bold text-dark dark:text-white">
        Current Position
      </h4>

      <div className="flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-3 sm:grid-cols-8">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Symbol</h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base sm:block">Type</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base sm:block">Entry Price</h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">S/L</h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">T/P</h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Volume</h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Profit</h5>
          </div>
          <div className=" px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base"></h5>
          </div>
        </div>

        {/* Rows */}
        {positions.length === 0 ? (
          <div className="py-10 text-center text-gray-500 ">
            No open positions
          </div>
        ) : (
          positions.map((position, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-8 hover:bg-gray-100 rounded-[10px] dark:hover:bg-gray-700 group hover:rounded-lg ${
                key === positions.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-dark-3"
              }`}
              key={position.position_id}
            >
              <div className="flex items-center gap-3.5 px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {position.symbol}
                </p>
              </div>

              <div className="hidden flex items-center justify-center px-2 py-4  sm:flex">
                <p className="font-medium text-dark dark:text-white">
                  {position.type.toUpperCase()}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {position.price_open}
                </p>
              </div>

              <div className="hidden items-center justify-center px-2 py-4  sm:flex">
                <p className="font-medium text-dark dark:text-white">
                  {position.stop_loss === 0 ? "-" : position.stop_loss}
                </p>
              </div>

              <div className="hidden items-center justify-center px-2 py-4  sm:flex">
                <p className="font-medium text-dark dark:text-white">
                  {position.take_profit === 0 ? "-" : position.take_profit}
                </p>
              </div>

              <div className="hidden items-center justify-center px-2 py-4 sm:flex">
                <p className="font-medium text-dark dark:text-white">
                  {position.volume}
                </p>
              </div>

              <div className="hidden items-center justify-center px-2 py-4 sm:flex">
                <p
                  className={` ${
                    position.profit >= 0 ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  {position.profit >= 0 ? "+" : ""}{position.profit.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4 col-span-1">
                <ButtonDefault
                  label="Close"
                  onClick={() => closePosition(position.position_id)}
                  customClasses="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 text-xs rounded"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <PopupBox isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Manage Position</h3>
          <p className="text-sm text-gray-600">
            You can later pass the selected position here and add Close/Modify buttons.
          </p>
        </div>
      </PopupBox>
    </div>
  );
};

export default InstrutmentTable;