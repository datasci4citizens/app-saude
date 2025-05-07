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
  options: { value: string | number; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  isLoading: boolean;
}

export function SelectField({
  id,
  name,
  label,
  value,
  options,
  onChange,
  error,
  isLoading = false,
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
          disabled={isLoading}
          className={`text-[#141B36] font-['Inter'] font-normal ring-offset-0 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
        <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <option value="" disabled>Carregando...</option>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {error && <p className="text-red-500 text-xs font-inter font-light mt-1">{error}</p>}
    </div>
  );
}