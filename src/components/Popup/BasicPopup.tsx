import React from 'react';

interface PopupBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupBox: React.FC<PopupBoxProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;  // Only render the popup if it's open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Set Take Profit & Stop Loss</h2>
        
        {/* First Row: Checkbox and Take Profit text */}
        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Take Profit</span>
          </label>
        </div>
        
        {/* Second Row: Take Profit and two text boxes */}
        <div className="mb-4">
          <label className="block mb-2">Take Profit Price:</label>
          <input type="text" className="w-full px-2 py-1 border rounded mb-2" placeholder="Price" />
          <label className="block mb-2">Take Profit Pips:</label>
          <input type="text" className="w-full px-2 py-1 border rounded" placeholder="Pips" />
        </div>
        
        {/* Third Row: Stop Loss and two text boxes */}
        <div className="mb-4">
          <label className="block mb-2">Stop Loss Price:</label>
          <input type="text" className="w-full px-2 py-1 border rounded mb-2" placeholder="Price" />
          <label className="block mb-2">Stop Loss Pips:</label>
          <input type="text" className="w-full px-2 py-1 border rounded" placeholder="Pips" />
        </div>

        {/* Bottom Row: Save and Cancel buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupBox;
