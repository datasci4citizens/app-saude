import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
  // Label and error styling remain the same
  const labelStyle = "block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1";
  const errorTextStyle = "text-red-500 text-xs font-['Inter'] font-light mt-1";

  // Handle value change and convert to expected event format
  const handleValueChange = (newValue: string) => {
    // Create synthetic event to match the onChange API expected by parent components
    const syntheticEvent = {
      target: {
        name,
        value: newValue
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={labelStyle}>
          {label}
        </label>
      )}
      
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger 
          id={id}
          className={`text-[#141B36] font-['Inter'] font-normal ring-offset-0 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          style={{
            // avoiding double ringing
            '--tw-ring-offset-width': '0px',
            '--tw-ring-color': '#FA6E5A',
            '--tw-ring-opacity': '1',
          }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && <p className={errorTextStyle}>{error}</p>}
    </div>
  );
}