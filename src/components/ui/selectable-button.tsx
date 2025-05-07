import React from "react";

interface SelectableOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectableOption: React.FC<SelectableOptionProps> = ({
  label,
  selected,
  onClick,
}) => {
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        className="w-full max-w-[400px] h-[56px] bg-background flex items-center rounded-2xl px-6 shadow-sm"
      >
        <div className="relative flex-shrink-0">
          <div
            className={`w-6 h-6 rounded-full border ${
              selected ? "border-dark_blue border-2" : "border-dark_blue"
            }`}
          >
            {selected && (
              <div className="absolute w-5 h-5 rounded-full bg-lime top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
        <span className="text-[18px] font-medium ml-4 text-dark_blue truncate">
          {label}
        </span>
      </button>
    </div>
  );
};
