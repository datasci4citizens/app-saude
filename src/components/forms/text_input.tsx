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
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-inter font-light text-gray_buttons mb-1">
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
        className={`text-dark_blue font-inter font-normal focus:ring-orange focus:ring-offset-0 ${
          error ? 'border-red-500' : 'border-gray_buttons'
        }`}
      />
      
      {helperText && <span className="text-xs font-inter font-light text-gray_buttons">{helperText}</span>}
      {error && <p className="text-red-500 text-xs font-inter font-light mt-1">{error}</p>}
    </div>
  );
}