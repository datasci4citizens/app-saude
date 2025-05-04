import React from 'react';
import { cn } from '@/lib/utils';

interface DateFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (formattedValue: string) => void;
  error?: string;
  placeholder?: string;
}

export function DateField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder = "dd/mm/aaaa"
}: DateFieldProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove non-digits
    value = value.replace(/\D/g, '');
    
    // Apply mask as user types
    if (value.length > 0) {
      value = value.substring(0, 8); // Limit to 8 digits
      
      // Format as dd/mm/yyyy
      if (value.length > 4) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
      } else if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`;
      }
    }
    
    onChange(value);
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-inter font-light text-gray_buttons mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => handleDateChange(e)}
        placeholder={placeholder}
        maxLength={10}
        className={cn(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange font-inter font-normal",
          error 
            ? "border-red-500 text-dark_blue" 
            : "border-gray-300 text-dark_blue"
        )}
      />
      {error && <p className="text-red-500 text-xs font-inter font-light mt-1">{error}</p>}
    </div>
  );
}