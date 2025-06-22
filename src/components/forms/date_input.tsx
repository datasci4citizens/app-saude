import type React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  placeholder = "dd/mm/aaaa",
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Apply cursor position after render
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const originalPosition = input.selectionStart || 0;
    let newValue = input.value;

    // Only allow digits and slashes
    newValue = newValue.replace(/[^\d/]/g, "");

    // Store current cursor position before we modify the string
    let newCursorPosition = originalPosition;

    // Format as user types, but be smarter about it
    if (newValue.length > 0) {
      // Remove any existing slashes first
      const digitsOnly = newValue.replace(/\//g, "");

      // Apply new formatting
      let formattedValue = "";

      for (let i = 0; i < digitsOnly.length && i < 8; i++) {
        if (i === 2 || i === 4) {
          formattedValue += "/";
        }
        formattedValue += digitsOnly[i];
      }

      // Figure out new cursor position
      // If user was typing at position where a slash was added, move cursor forward
      if (originalPosition === 3 && formattedValue.charAt(2) === "/") {
        newCursorPosition = 4;
      } else if (originalPosition === 6 && formattedValue.charAt(5) === "/") {
        newCursorPosition = 7;
      } else if (
        formattedValue.length > newValue.length &&
        originalPosition > 0
      ) {
        // If we added a slash and cursor was already past that point
        const slashesBeforeOriginal = (
          newValue.substring(0, originalPosition).match(/\//g) || []
        ).length;
        const slashesBeforeFormatted = (
          formattedValue.substring(0, originalPosition + 1).match(/\//g) || []
        ).length;
        newCursorPosition =
          originalPosition + (slashesBeforeFormatted - slashesBeforeOriginal);
      }

      newValue = formattedValue;
    }

    // Update the state and cursor position
    onChange(newValue);
    setCursorPosition(newCursorPosition);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "mb-1 text-desc-titulo text-typography", // Updated classes
          )}
        >
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
          // do NOT change bg color of date
          "w-full h-14 px-4 py-2 rounded-md border bg-primary text-campos-preenchimento text-typography focus:border-accent1 focus:outline-none", // Updated classes
          error ? "border-destructive" : "border-gray2-border",
        )}
        ref={inputRef}
      />
      {error && (
        <p
          className={cn(
            "mt-1 text-destructive text-desc-campos", // Updated classes
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
