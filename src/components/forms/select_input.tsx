import type React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  placeholder = 'Selecione',
}: SelectFieldProps) {
  // Handle value change and convert to expected event format
  const handleValueChange = (newValue: string) => {
    // Create synthetic event to match the onChange API expected by parent components
    const syntheticEvent = {
      target: {
        name,
        value: newValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-inter font-light text-typography mb-1">
          {label}
        </label>
      )}

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger
          id={id}
          disabled={isLoading}
          className={`bg-background h-14 text-typography font-['Inter'] font-normal focus:border-selection ${
            error ? 'border-selection' : 'border-gray1'
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background">
          {isLoading ? (
            <option value="" disabled>
              Carregando...
            </option>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                className="text-typography hover:bg-gray1 hover:bg-opacity-20"
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-typography text-xs font-inter font-light mt-1">{error}</p>}
    </div>
  );
}
