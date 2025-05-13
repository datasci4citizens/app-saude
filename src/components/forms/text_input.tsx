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
        <label htmlFor={id} className="block text-sm font-inter font-light text-typography mb-1">
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
        className={`text-typography font-inter font-normal focus:ring-primary focus:ring-offset-0 ${
          error ? 'border-destructive' : 'border-input'
        }`}
      />
      
      {helperText && <span className="text-xs font-inter font-light text-gray2-foreground">{helperText}</span>}
      {error && <p className="text-destructive text-xs font-inter font-light mt-1">{error}</p>}
    </div>
  );
}