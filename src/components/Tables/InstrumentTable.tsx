'use client';
import { INSTRUMENT } from "@/types/instrument";
import Image from "next/image";
import Link from 'next/link'; // Import Link component
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { useState } from "react";
import PopupBox from "@/components/Popup/BasicPopup"

const positionData: INSTRUMENT[] = [
  {
    pair: "USDJPY",
    ticket: "2134519",
    time: "11.18 07:05:59",
    type: "sell",
    entryPrice: 109.4,
    stopLoss: 110,
    takeProfit: 120,
    currentPrice: 109,
    swap: -2,
    profit: 3035.35,
  },
  {
    pair: "USDJPY",
    ticket: "2134519",
    time: "11.18 07:05:59",
    type: "sell",
    entryPrice: 109.4,
    stopLoss: 110,
    takeProfit: 120,
    currentPrice: 109,
    swap: -2,
    profit: -300.22,
  },
];

const InstrutmentTable = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Current Position
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-7">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Symbol
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Type
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Entry Price
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              S / L
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              T / P
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Profit
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Current Price
            </h5>
          </div>
        </div>

        {positionData.map((position, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-7 ${
              key === positionData.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {position.pair}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {position.type}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {position.entryPrice}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {position.stopLoss}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {position.takeProfit}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className={`font-medium ${
                position.profit > 0 ? 'text-blue-500' : 'text-red-500'}`
              }>
                {position.profit}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <ButtonDefault
                label="Manage"
                // onClick={() => { alert("Manage button clicked!"); }}
                onClick={openPopup}
                customClasses="bg-blue-700 text-white px-10 py-3 text-xs sm:px-4"
              />
              <PopupBox isOpen={isPopupOpen} onClose={closePopup} />
            </div>
          </div>

          
        ))}
      </div>
    </div>
  );
};

export default InstrutmentTable;
