import React, { useState } from 'react';

const SegmentedToggle = () => {
  const [selected, setSelected] = useState<'left' | 'right'>('left');

  return (
    <div className="flex w-[40%] h-[39px] bg-[#E8E9F1] rounded-lg overflow-hidden">
      <button
        className={`flex-1 relative ${selected === 'left' ? 'text-[#1F2024]' : 'text-[#71727A]'}`}
        onClick={() => setSelected('left')}
      >
        <span className="relative z-10 font-inter font-bold text-xs">
          Todos
        </span>
        {selected === 'left' && (
          <div className="absolute inset-0 w-[90%] h-[31px] m-auto bg-white rounded-md shadow-sm"></div>
        )}
      </button>

      <div className="w-px h-full bg-[#D1D1D6]"></div>

      <button
        className={`flex-1 relative ${selected === 'right' ? 'text-[#1F2024]' : 'text-[#71727A]'}`}
        onClick={() => setSelected('right')}
      >
        <span className="relative z-10 font-inter font-bold text-xs">
          Urgentes
        </span>
        {selected === 'right' && (
          <div className="absolute inset-0 w-[90%] h-[31px] m-auto bg-white rounded-md shadow-sm"></div>
        )}
      </button>
    </div>
  );
};

export default SegmentedToggle;