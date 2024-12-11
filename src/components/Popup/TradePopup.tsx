import React, { useState, useEffect, useRef } from 'react';
import ButtonDefault from "@/components/Buttons/ButtonDefault";

interface TradePopupBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const TradePopupBox: React.FC<TradePopupBoxProps> = ({ isOpen, onClose }) => {
  const [isTakeProfitChecked, setIsTakeProfitChecked] = useState(true);
  const [isStopLossChecked, setIsStopLossChecked] = useState(true);
  const [selectedSide, setSelectedSide] = useState('buy');
  const popupRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-999">
      <div ref={popupRef} className="bg-white p-10 rounded-lg w-1/3 sm:w-2/3 md:w-1/3 min-w-[80%] md:min-w-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Manage Position</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Position Size */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-500">Position Size (Lots) *</label>
          <input type="text" className="w-full px-3 py-3 border rounded-lg" placeholder="Enter Position Size" />
        </div>

        {/* Take Profit Section */}
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2" 
              checked={isTakeProfitChecked}
              onChange={(e) => setIsTakeProfitChecked(e.target.checked)}
            />
            <span>Take Profit</span>
          </label>
        </div>

        {isTakeProfitChecked && (
          <>
            <div className="flex mb-1">
              <label className="block mb-2">Take Profit</label>
            </div>

            <div className="flex mb-10 space-x-7">
              <input type="text" className="w-1/2 px-3 py-3 border rounded-lg" placeholder="Price" />
              <input type="text" className="w-1/2 px-3 py-3 border rounded-lg" placeholder="Pips" />
            </div>
          </>
        )}

        {/* Stop Loss Section */}
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2" 
              checked={isStopLossChecked}
              onChange={(e) => setIsStopLossChecked(e.target.checked)}
            />
            <span>Stop Loss</span>
          </label>
        </div>

        {isStopLossChecked && (
          <>
            <div className="flex mb-4">
              <label className="block mb-2">Stop Loss</label>
            </div>
            <div className="flex mb-10 space-x-7">
              <input type="text" className="w-1/2 px-3 py-3 border rounded-lg" placeholder="Price" />
              <input type="text" className="w-1/2 px-3 py-3 border rounded-lg" placeholder="Pips" />
            </div>
          </>
        )}
              
        {/* Buy or Sell Side */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-500">Side *</label>
          <div className="relative">
            <select 
              value={selectedSide}
              onChange={(e) => setSelectedSide(e.target.value)}
              className="block appearance-none w-full px-3 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Row: Save and Cancel buttons */}
        <div className="flex space-x-2">
          <ButtonDefault
            label="Close"
            onClick={onClose}
            customClasses="bg-gray-400 text-white px-5 py-2.5 text-sm"
          />
          <ButtonDefault
            label="Save"
            onClick={onClose}
            customClasses="bg-blue-700 text-white px-4 py-2.5 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default TradePopupBox;
