import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: number;
  label: string;
  [key: string]: any;
}

interface AutocompleteFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string, selectedOption?: Option) => void;
  options: Option[];
  error?: string;
  isLoading?: boolean;
  placeholder?: string;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  isLoading = false,
  placeholder = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions([]);
      return;
    }

    const filtered = options
      .filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      .slice(0, 10); // Limit to 10 results for performance

    setFilteredOptions(filtered);
  }, [inputValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    onChange(value);
  };

  // Handle option selection
  const handleSelectOption = (option: Option) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange(option.label, option);
  };

  return (
    <div className="mb-4 relative">
      <label
        htmlFor={id}
        className="block text-typography text-sm mb-2 font-medium font-inter"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={isLoading}
          className={`w-full h-14 px-4 py-2 bg-offwhite border ${
            error ? "border-destructive" : "border-input"
          } rounded-lg focus:outline-none focus:border-info focus:ring-1 focus:ring-info font-inter`}
          placeholder={isLoading ? "Carregando..." : placeholder}
          autoComplete="off"
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-info"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-background border border-gray2-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-selected hover:opacity-68 cursor-pointer text-typography"
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && inputValue && filteredOptions.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-gray2-border rounded-md shadow-lg p-4 text-gray2-foreground font-medium">
          Nenhum resultado encontrado
        </div>
      )}

      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
};
