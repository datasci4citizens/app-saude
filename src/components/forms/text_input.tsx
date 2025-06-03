import React from "react";
import { Input } from "@/components/forms/input";

interface TextFieldProps {
  id: string;
  name: string;
  label?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void; // Update type
  placeholder?: string;
  helperText?: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  type = "text",
  multiline = false,
  rows = 3,
  className = "",
}: TextFieldProps) {
  // Common styling for both input and textarea
  const baseClasses = `
    text-typography bg-primary font-inter font-normal 
    rounded-md px-3 py-2 w-full
    transition-colors duration-200
    focus:border-selection focus:ring-1 focus:ring-selection focus:outline-none
    ${error ? "border-destructive" : "border-gray2"}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-inter font-light text-typography mb-1"
        >
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClasses} resize-y min-h-[80px]`}
          style={{
            caretColor: "var(--typography)",
            color: "var(--typography)",
          }}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
          style={{
            caretColor: "var(--typography)",
            color: "var(--typography)",
          }}
          onAnimationStart={(e) => {
            // Chrome/Safari trigger this animation when autofilling
            if (e.animationName.includes("onAutoFillStart")) {
              e.currentTarget.classList.add("autofilled");
            }
          }}
        />
      )}

      {helperText && (
        <span className="text-xs font-inter font-light text-gray2">
          {helperText}
        </span>
      )}
      {error && (
        <p className="text-destructive text-xs font-inter font-light mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
