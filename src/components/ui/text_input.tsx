import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  type?: string;
  size?: 'medium' | 'compact' | 'large';
  multiline?: boolean;
  variant?: 'static-orange' | 'dynamic-gray-to-orange'; // New variant prop
}

export function TextField({
  label,
  defaultValue = '',
  placeholder,
  error,
  type = 'text',
  size = 'medium',
  multiline = false,
  variant = 'static-orange' // Default to always orange
}: TextFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [hasInput, setHasInput] = useState(false);

  const labelStyle = "block text-[14px] font-['Inter'] font-bold text-[#141B36] mb-2";

  // Size configurations
  const sizeClasses = {
    medium: 'w-[325px] h-[48px] py-2 px-4',
    compact: 'w-[142px] h-[48px] py-2 px-3',
    large: 'w-[325px] min-h-[152px] py-4 px-4'
  };

  // Dynamic border color logic
  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (variant === 'static-orange') return 'border-[#FA6E5A]';
    return hasInput ? 'border-[#FA6E5A]' : 'border-[#A1A4B2]';
  };

  const getFocusColor = () => {
    return variant === 'static-orange' 
      ? 'focus-visible:ring-[#FA6E5A]' 
      : 'focus-visible:ring-[#A1A4B2]';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setHasInput(e.target.value.length > 0);
  };

  const baseClasses = `
    bg-transparent
    border ${getBorderColor()}
    text-[#141B36]
    font-['Inter']
    font-normal
    rounded-lg
    ${getFocusColor()}
    focus-visible:ring-1
    transition-colors
    ${sizeClasses[size]}
    ${multiline ? 'whitespace-pre-wrap overflow-y-auto' : ''}
  `;

  return (
    <div className="mb-4">
      {label && <label htmlFor='' className={labelStyle}>{label}</label>}
      
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            ${baseClasses}
            resize-none
          `}
          style={{
            lineHeight: '1.5',
            minHeight: '152px' // Use minHeight instead of height
          }}
          wrap="soft" // Changed to soft for better wrapping
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      
    </div>
  );
}