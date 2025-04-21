import React, { useState } from 'react';

interface UploadFieldProps {
  label: string;
  size?: 'medium' | 'compact' | 'large';
  error?: string;
  variant?: 'static-orange' | 'dynamic-gray-to-orange';
}

export function UploadField({
  label,
  size = 'medium',
  error,
  variant = 'dynamic-gray-to-orange'
}: UploadFieldProps) {
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState('');

  const labelStyle = "block text-[14px] font-['Inter'] font-bold text-[#141B36] mb-2";

  const sizeClasses = {
    medium: 'w-[85%] md:w-[85%] h-[48px] px-4',
    compact: 'w-[36%] h-[48px] px-3',
    large: 'w-[85%] min-h-[120px] md:min-h-[152px] px-4 py-4'
  };

  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (variant === 'static-orange') return 'border-[#FA6E5A]';
    return hasFile ? 'border-[#FA6E5A]' : 'border-[#A1A4B2]';
  };

  const getIconColor = () => {
    if (error) return '#EF4444';
    if (variant === 'static-orange') return '#FA6E5A';
    return hasFile ? '#FA6E5A' : '#A1A4B2';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasFile(true);
      setFileName(file.name);
    } else {
      setHasFile(false);
      setFileName('');
    }
  };

  return (
    <div className={`mb-4 ${size === 'compact' ? 'inline-block w-[48%]' : 'block'}`}>
      {label && <label className={labelStyle}>{label}</label>}

      <label
        className={`
          flex items-center gap-2 justify-start 
          border ${getBorderColor()}
          rounded-lg cursor-pointer
          transition-colors
          font-['Inter'] font-normal text-[#141B36] 
          ${sizeClasses[size]}
        `}
      >
        <span role="img"  className='mgn_upload_2_line' color={getIconColor()}></span>
        <span className="text-sm truncate">
          {hasFile ? fileName : 'Clique para enviar'}
        </span>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
