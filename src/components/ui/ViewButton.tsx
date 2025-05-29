import React from 'react';

interface ViewButtonProps {
  dateText: string;
  mainText: string;
  subText: string;
  onClick?: () => void;
}

const ViewButton: React.FC<ViewButtonProps> = ({ dateText, mainText, subText, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      <div className="text-left">
        <p className="text-sm text-gray-300 mb-1">{dateText}</p>
        <p className="font-semibold text-lg mb-1">{mainText}</p>
        <p className="text-sm text-gray-200 truncate">{subText}</p>
      </div>
    </button>
  );
};

export default ViewButton;
