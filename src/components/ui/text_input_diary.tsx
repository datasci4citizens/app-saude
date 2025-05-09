import React, { useState } from 'react';
import type { ChangeEvent } from 'react'; // Type-only import
import { Input } from '@/components/forms/input';

interface TextFieldProps {
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  type?: string;
  size?: 'medium' | 'compact' | 'large';
  multiline?: boolean;
  variant?: 'static-orange' | 'dynamic-gray-to-orange';
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function TextField({
  label,
  value: propValue,
  defaultValue = '',
  placeholder,
  error,
  type = 'text',
  size = 'medium',
  multiline = false,
  variant = 'static-orange',
  onChange: propOnChange
}: TextFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hasInput, setHasInput] = useState(false);

  const value = propValue !== undefined ? propValue : internalValue;

  const labelStyle = "block text-[14px] font-inter font-bold text-dark_blue mb-2";

  const sizeClasses = {
    medium: 'w-[85%] md:w-[85%] h-[48px] py-2 px-4',
    compact: 'w-[36%] h-[48px] py-2 px-3',
    large: 'w-[85%] min-h-[120px] md:min-h-[152px] py-4 px-4'
  };

  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (variant === 'static-orange') return 'border-orange';
    return hasInput ? 'border-orange' : 'border-gray_buttons';
  };

  const baseClasses = `
    bg-transparent
    border ${getBorderColor()}
    text-dark_blue
    font-inter
    font-normal
    rounded-lg
    focus-visible:ring-1
    focus-visible:ring-orange
    transition-colors
    ${sizeClasses[size]}
    ${multiline ? 'whitespace-pre-wrap overflow-y-auto' : ''}
  `;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (propOnChange) {
      propOnChange(e);
    } else {
      setInternalValue(e.target.value);
    }
    setHasInput(e.target.value.length > 0);
  };

  return (
    <div className={`mb-4 ${size === 'compact' ? 'inline-block w-[48%]' : 'block'}`}>
      {label && <label className={labelStyle}>{label}</label>}
      
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
          rows={6}
          style={{ lineHeight: '1.5' }}
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
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}