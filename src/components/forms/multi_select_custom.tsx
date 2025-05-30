import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectCustomProps {
  id: string;
  name: string;
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
  name,
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
    value.includes(option.value),
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
          {selectedItems.length > 0 &&
            selectedItems.map((item) => (
              <div
                key={item.value}
                className="bg-selection bg-opacity-20 text-typography px-2 py-1 rounded-md flex items-center text-sm"
              >
                {item.label}
                <button
                  type="button"
                  onClick={(e) => removeItem(e, item.value)}
                  className="ml-1 text-primary hover:bg-gray1  hover:bg-opacity-20 rounded-full h-5 w-5 flex items-center justify-center"
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
          <div className="absolute z-10 w-full mt-1 bg-primary border-gray2 rounded-lg shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="p-2 text-center text-gray2">Carregando...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-2 text-center text-gray2">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray1 hover:bg-opacity-10 
                    ${value.includes(option.value) ? "bg-selection bg-opacity-20" : ""}`}
                  onClick={() => toggleOption(option.value)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 accent-primary"
                      checked={value.includes(option.value)}
                      onChange={() => {}}
                    />
                    <span className="text-typography">{option.label}</span>
                  </div>
                </div>
              ))
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
