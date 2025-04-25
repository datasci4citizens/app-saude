import React from 'react';
import { Input } from '@/components/forms/input'; // Assuming you have this component

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  type?: string;
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  type = 'text'
}: TextFieldProps) {
  // styling for label, helper text, and error message
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
      
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-[#141B36] font-['Inter'] font-normal ring-offset-0 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        style={{
          // Use style to override focus ring if needed
          // This ensures React's style prop takes precedence
          '--tw-ring-offset-width': '0px',
          '--tw-ring-color': '#FA6E5A',
          '--tw-ring-opacity': '1',
        }}
      />
      
      {helperText && <span className={helperTextStyle}>{helperText}</span>}
      {error && <p className={errorTextStyle}>{error}</p>}
    </div>
  );
}