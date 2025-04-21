import React from 'react';

interface ToggleSelectorProps {
  options: string[];
  selected: string;
  onSelect: (selected: string) => void;
}

export const ToggleSelector: React.FC<ToggleSelectorProps> = ({ options, selected, onSelect }) => {
  return (
    <div className="flex border rounded-[20px] overflow-hidden">
      {options.map((option, index) => (
        <div
          key={index}
          className={`flex-1 py-[7px] cursor-pointer text-center ${
            selected === option ? 'bg-white text-dark-400 border-[3px] border-dark-400' : 'text-dark-100'
          }`}
          onClick={() => onSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

