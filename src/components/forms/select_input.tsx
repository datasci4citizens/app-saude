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
  label: string | React.ReactNode;
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
        <label htmlFor={id} className="block text-sm font-inter font-light text-gray_buttons mb-1">
          {label}
        </label>
      )}
      
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger 
          id={id}
          className={`text-dark_blue font-inter font-normal focus-visible:ring-orange focus-visible:ring-offset-0 ${
            error ? "border-red-500" : "border-gray_buttons"
          }`}
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
      
      {error && <p className="text-red-500 text-xs font-inter font-light mt-1">{error}</p>}
    </div>
  );
}