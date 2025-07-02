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
  height?: number;
  isLoading: boolean;
  // Nova prop para controlar z-index em diálogos
  inDialog?: boolean;
}

export function SelectField({
  id,
  name,
  label,
  value,
  options,
  onChange,
  error,
  height = 14,
  isLoading = false,
  placeholder = 'Selecione',
  inDialog = false,
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
          className={`bg-background h-${height} text-typography font-['Inter'] font-normal focus:border-selection ${
            error ? 'border-selection' : 'border-gray1'
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={`bg-background ${inDialog ? 'z-[10000]' : ''}`}
          // Força o portal para fora do dialog quando necessário
          position="popper"
          side="bottom"
          align="start"
        >
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Carregando...
            </SelectItem>
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
