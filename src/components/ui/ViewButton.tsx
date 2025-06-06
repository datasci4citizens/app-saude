import React from "react";

interface ViewButtonProps {
  dateText: string;
  mainText: string;
  subText: string;
  onClick?: () => void;
}

const ViewButton: React.FC<ViewButtonProps> = ({
  dateText,
  mainText,
  subText,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-offwhite text-typography p-4 rounded-lg shadow-md focus:outline-none focus:ring-2"
    >
      <div className="text-left">
        <p className="text-desc-titulo text-typography mb-1">{dateText}</p>
        <p className="text-topicos2 mb-1">{mainText}</p>{" "}
        {/* text-topicos2 includes font weight */}
        <p className="text-campos-preenchimento2 text-typography truncate">
          {subText}
        </p>
      </div>
    </button>
  );
};

export default ViewButton;
