import React from 'react';

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
  const baseStyle = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#FA6E5A] focus:border-[#FA6E5A] font-['Inter'] font-normal";
  const inputStyle = error 
    ? `${baseStyle} border-red-500 text-[#141B36]` 
    : `${baseStyle} border-gray-300 text-[#141B36]`;
  
  const labelStyle = "block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1";
  const errorTextStyle = "text-red-500 text-xs font-['Inter'] font-light mt-1";

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
        <label htmlFor={id} className={labelStyle}>
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
        className={inputStyle}
      />
      {error && <p className={errorTextStyle}>{error}</p>}
    </div>
  );
}