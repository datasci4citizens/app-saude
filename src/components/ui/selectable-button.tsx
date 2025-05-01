import React from 'react';

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
    <button
      onClick={onClick}
      className="w-[85%] h-[43px] bg-[#F9F9FF] flex items-center rounded-lg px-4"
    >
      <div
        className={`w-4 h-4 rounded-full mr-3 ${
          selected ? 'bg-[#DDFC8E]' : 'bg-[#F9F9FF] border border-[#141B36]'
        }`}
      />
      <span className="text-[16px] font-inter text-[#141B36]">{label}</span>
    </button>
  );
};