import React from 'react';

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  type?: string;
  maxLength?: number;
  step?: string;
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  type = 'text',
  maxLength,
  step
}: TextFieldProps) {
  const baseStyle = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#FA6E5A] focus:border-[#FA6E5A] font-['Inter'] font-normal";
  const inputStyle = error 
    ? `${baseStyle} border-red-500 text-[#141B36]` 
    : `${baseStyle} border-gray-300 text-[#141B36]`;
  
  const labelStyle = "block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1";
  const helperTextStyle = "text-xs font-['Inter'] font-light text-[#A0A3B1]";
  const errorTextStyle = "text-red-500 text-xs font-['Inter'] font-light mt-1";

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={labelStyle}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        step={step}
        className={inputStyle}
      />
      {helperText && <span className={helperTextStyle}>{helperText}</span>}
      {error && <p className={errorTextStyle}>{error}</p>}
    </div>
  );
}