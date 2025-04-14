import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
}

export function SelectField({
  id,
  name,
  label,
  value,
  options,
  onChange,
  error,
  placeholder = "Selecione"
}: SelectFieldProps) {
  const baseStyle = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#FA6E5A] focus:border-[#FA6E5A] font-['Inter'] font-normal";
  const selectStyle = error 
    ? `${baseStyle} border-red-500 text-[#141B36]` 
    : `${baseStyle} border-gray-300 text-[#141B36]`;
  
  const labelStyle = "block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1";
  const errorTextStyle = "text-red-500 text-xs font-['Inter'] font-light mt-1";

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={labelStyle}>
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={selectStyle}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={errorTextStyle}>{error}</p>}
    </div>
  );
}