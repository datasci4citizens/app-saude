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
      className="w-full bg-accent2 text-typography p-4 rounded-lg shadow-md focus:outline-none focus:ring-2"
    >
      <div className="text-left">
        <p className="text-sm text-typography mb-1">{dateText}</p>
        <p className="font-semibold text-lg mb-1">{mainText}</p>
        <p className="text-sm text-typography truncate">{subText}</p>
      </div>
    </button>
  );
};

export default ViewButton;
