import type React from "react";
import { useState, useRef, useEffect } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectCustomProps {
  id: string;
  label?: string;
  options: Option[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  error?: string;
}

export function MultiSelectCustom({
  id,
  label,
  options,
  value,
  onChange,
  isLoading = false,
  placeholder = "Selecione",
  error,
}: MultiSelectCustomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle toggle selection
  const toggleOption = (optionValue: string) => {
    const isSelected = value.includes(optionValue);
    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Handle removing a selected item
  const removeItem = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  // Get selected items with their labels
  const selectedItems = options.filter((option) =>
    value.includes(option.value.toString()),
  );

  return (
    <div className="mb-2" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-inter font-light text-gray2 mb-1"
        >
          {label}
        </label>
      )}

      <div
        className={`relative rounded-lg border ${error ? "border-destructive" : "border-gray2"} 
          ${isOpen ? "border-selection" : ""} bg-primary`}
      >
        {/* Selected items and input container */}
        <div
          className="min-h-[56px] px-3 py-2 flex flex-wrap gap-2 cursor-text"
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          {selectedItems.map((item) => (
            <div
              key={item.value}
              className="bg-selection bg-opacity-20 text-selection text-sm font-medium px-2 py-1 rounded-md flex items-center gap-2"
            >
              <span>{item.label}</span>
              <button
                type="button"
                className="text-selection hover:text-white hover:bg-selection rounded-full w-4 h-4 flex items-center justify-center transition-all duration-200"
                onClick={(e) => removeItem(e, item.value.toString())}
              >
                &times;
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            type="text"
            className="bg-transparent flex-1 outline-none min-w-[80px] text-typography placeholder:text-gray2"
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            disabled={isLoading}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-1 bg-primary border border-gray2 rounded-lg shadow-lg z-10 transition-all duration-200 overflow-hidden ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
            {isLoading ? (
              <div className="p-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full px-3 py-2 bg-primary border-b border-gray2 focus:outline-none focus:border-selection text-sm text-typography placeholder-gray2"
                />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-2 text-center text-gray2">
                Nenhuma opção encontrada
              </div>
            ) : (
              <ul className="max-h-48 overflow-y-auto p-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-150 flex items-center justify-between font-inter font-light text-typography 
                    ${value.includes(option.value.toString()) ? "bg-selection bg-opacity-20" : ""}`}
                    onClick={() => toggleOption(option.value.toString())}
                  >
                    <span>{option.label}</span>
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-selection bg-primary border-gray2 rounded focus:ring-selection transition-all duration-200"
                      checked={value.includes(option.value.toString())}
                      readOnly
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-xs font-inter font-light mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
