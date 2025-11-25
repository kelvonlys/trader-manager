import React, { useState, useEffect, useRef } from 'react';

interface TradePopupBoxProps {
  isOpen: boolean;
  onClose: () => void;
  symbol?: string;
  bid?: number;
  ask?: number;
}

const TradePopupBox: React.FC<TradePopupBoxProps> = ({ isOpen, onClose, symbol = "EURUSD", bid, ask }) => {
  const [isTakeProfitChecked, setIsTakeProfitChecked] = useState(true);
  const [isStopLossChecked, setIsStopLossChecked] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const executeTrade = async (side: "buy" | "sell") => {
    if (loading) return;
    setLoading(true);
    setMessage('');

    const lotsInput = document.querySelector('input[placeholder="Enter Position Size"]') as HTMLInputElement;
    const inputValue = lotsInput?.value.trim() || "";
    const lots = parseFloat(inputValue);
    
    if (!inputValue || isNaN(lots) || lots <= 0) {
      setMessage("Invalid position size");
      setLoading(false);
      return;
    }

    if (lots < 0.01) {
      setMessage("Minimum position size is 0.01 lots");
      setLoading(false);
      return;
    }

    const price = side === "buy" ? ask : bid;
    if (!price) {
      setMessage('Error: Price not available');
      setLoading(false);
      return;
    }

    let sl = 0;
    let tp = 0;

    // Get SL/TP values only if enabled
    if (isStopLossChecked) {
      const slInput = document.querySelector('input[placeholder="Price"][data-type="sl"]') as HTMLInputElement;
      if (slInput?.value) {
        sl = parseFloat(slInput.value);
        if (isNaN(sl)) {
          setMessage('Invalid Stop Loss');
          setLoading(false);
          return;
        }
        if ((side === "buy" && sl >= price) || (side === "sell" && sl <= price)) {
          setMessage(side === "buy" ? 'Stop loss must be below price' : 'Stop loss must be above price');
          setLoading(false);
          return;
        }
      }
    }

    if (isTakeProfitChecked) {
      const tpInput = document.querySelector('input[placeholder="Price"][data-type="tp"]') as HTMLInputElement;
      if (tpInput?.value) {
        tp = parseFloat(tpInput.value);
        if (isNaN(tp)) {
          setMessage('Invalid Take Profit');
          setLoading(false);
          return;
        }
        if ((side === "buy" && tp <= price) || (side === "sell" && tp >= price)) {
          setMessage(side === "buy" ? 'Take profit must be above price' : 'Take profit must be below price');
          setLoading(false);
          return;
        }
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol,
          action: side,
          volume: lots,
          sl: sl || 0,
          tp: tp || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = "Trade failed";

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (data.detail?.message) {
          errorMessage = data.detail.message;
        } else if (data.message) {
          errorMessage = data.message;
        }

        throw new Error(errorMessage);
      }

      setMessage('Order executed • Market filled');
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-999">
      <div ref={popupRef} className="bg-black p-7 pt-8 rounded-lg w-1/3 sm:w-2/3 md:w-1/3 min-w-[80%] md:min-w-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-200">Manage Position</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Position Size */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Position Size (Lots) *</label>
          <input type="text" className="w-full px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Enter Position Size" defaultValue="0.01" />
        </div>

        {/* Take Profit Section */}
        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center text-gray-400">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isTakeProfitChecked}
                onChange={(e) => setIsTakeProfitChecked(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full ${isTakeProfitChecked ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isTakeProfitChecked ? 'transform translate-x-full' : ''}`}></div>
            </div>
            <span className="ml-3">Take Profit</span>
          </label>
        </div>
        {isTakeProfitChecked && (
          <>
            <div className="flex mb-1">
              <label className="block mb-2 text-gray-400">Take Profit</label>
            </div>
            <div className="flex mb-10 space-x-7">
              {/* <input type="text" data-type="tp" className="w-1/2 px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Price" />
              <input type="text" className="w-1/2 px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Pips" />
               */}
              <input type="text" data-type="tp" className="w-full px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Price" />
              
            </div>
          </>
        )}

        {/* Stop Loss Section */}
        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center text-gray-400">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isStopLossChecked}
                onChange={(e) => setIsStopLossChecked(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full ${isStopLossChecked ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isStopLossChecked ? 'transform translate-x-full' : ''}`}></div>
            </div>
            <span className="ml-3">Stop Loss</span>
          </label>
        </div>
        {isStopLossChecked && (
          <>
            <div className="flex mb-4">
              <label className="block mb-2 text-gray-400">Stop Loss</label>
            </div>
            <div className="flex mb-10 space-x-7">
              {/* <input type="text" data-type="sl" className="w-1/2 px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Price" />
              <input type="text" className="w-1/2 px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Pips" /> */}
              <input type="text" data-type="sl" className="w-full px-3 py-3 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" placeholder="Price" />
              

            </div>
          </>
        )}

        {/* Buy or Sell Buttons */}
        <div className="mb-1">
          <div className="flex space-x-0.5">
            <button
              onClick={() => executeTrade('sell')}
              disabled={loading}
              className="w-1/2 px-3 py-2 rounded-l-2xl border-r-0 bg-red-400 text-gray-200 hover:bg-red-700 disabled:opacity-50 transition"
            >
              <div>{loading ? 'Sending...' : 'Sell'}</div>
              <div>{ask ?? '-'}</div>
            </button>
            <button
              onClick={() => executeTrade('buy')}
              disabled={loading}
              className="w-1/2 px-3 py-2 rounded-r-2xl border-l-0 bg-blue-500 text-gray-200 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <div>{loading ? 'Sending...' : 'Buy'}</div>
              <div>{bid ?? '-'}</div>
            </button>
          </div>
        </div>

        {message && (
          <div className={`text-center mt-6 text-lg font-bold ${message.includes('Volume') || message.includes('must') ||  message.includes('volume') || message.includes('position') || 
            message.includes('failed') ? 'text-red-400' : 'text-gray-200'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradePopupBox;