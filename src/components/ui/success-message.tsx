import React from "react";

interface SuccessMessageProps {
  message: string;
  className?: string;
  icon?: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className = "",
  icon = true,
}) => {
  return (
    <div className={`bg-success border border-success-foreground rounded-lg p-4 text-success-text mt-4 mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && (
          <svg 
            className="w-5 h-5 text-success-text flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;