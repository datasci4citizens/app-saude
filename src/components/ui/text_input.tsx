import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  type?: string;
  size?: 'medium' | 'compact' | 'large';
  multiline?: boolean;
  variant?: 'static-orange' | 'dynamic-gray-to-orange';
}

export function TextField({
  label,
  defaultValue = '',
  placeholder,
  error,
  type = 'text',
  size = 'medium',
  multiline = false,
  variant = 'static-orange'
}: TextFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [hasInput, setHasInput] = useState(false);

  const labelStyle = "block text-[14px] font-['Inter'] font-bold text-[#141B36] mb-2";

  // Responsive size configurations
  const sizeClasses = {
    medium: 'w-[85%] md:w-[85%] h-[48px] py-2 px-4', // Full width on mobile, constrained on desktop
    compact: 'w-[36%] h-[48px] py-2 px-3', // Takes ~half width for side-by-side
    large: 'w-[85%] min-h-[120px] md:min-h-[152px] py-4 px-4' // 6 lines of text (~24px per line * 6)
  };

  // Dynamic border color logic (unchanged)
  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (variant === 'static-orange') return 'border-[#FA6E5A]';
    return hasInput ? 'border-[#FA6E5A]' : 'border-[#A1A4B2]';
  };

  const baseClasses = `
    bg-transparent
    border ${getBorderColor()}
    text-[#141B36]
    font-['Inter']
    font-normal
    rounded-lg
    focus-visible:ring-1
    transition-colors
    ${sizeClasses[size]}
    ${multiline ? 'whitespace-pre-wrap overflow-y-auto' : ''}
  `;

  return (
    <div className={`mb-4 ${size === 'compact' ? 'inline-block w-[48%]' : 'block'}`}>
      {label && <label className={labelStyle}>{label}</label>}
      
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setHasInput(e.target.value.length > 0);
          }}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
          rows={6} // Ensures 6 lines visible by default
          style={{ lineHeight: '1.5' }}
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setHasInput(e.target.value.length > 0);
          }}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}