import React, { useState } from "react";

interface FileUploaderProps {
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUploader({ onChange, error }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file?.name || null);
    onChange(file);
  };

  return (
    <div>
      <div className="flex items-center">
        <label
          htmlFor="file-upload"
          className="flex items-center px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted font-inter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-gray2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="text-typography">Selecionar arquivo</span>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileName && (
          <span className="ml-3 text-sm font-inter text-gray2">{fileName}</span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm font-inter text-destructive">{error}</p>
      )}
    </div>
  );
}
