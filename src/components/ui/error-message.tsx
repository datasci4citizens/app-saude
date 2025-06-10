// filepath: /home/who/Documents/1s2025/mx/app-saude/src/components/ui/error-message.tsx
import React from "react";

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  className?: string;
  closable?: boolean;
  retryable?: boolean;
  icon?: boolean;
  variant?: "destructive";
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  onRetry,
  className = "",
  closable = true,
  retryable = true,
  icon = true,
  variant = "red",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive border-destructive text-white";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "destructive":
        return "text-white";
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          close: "text-white hover:text-gray-2",
          retry: "text-white hover:text-gray-2"
        };
    }
  };

  const variantStyles = getVariantStyles();
  const iconColor = getIconColor();
  const buttonStyles = getButtonStyles();

  return (
    <div className={`${variantStyles} border rounded-lg p-4 mt-4 mb-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {icon && (
            <svg 
              className={`w-5 h-5 ${iconColor} flex-shrink-0`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
          <p className="text-sm">{message}</p>
        </div>
        {closable && onClose && (
          <button
            onClick={onClose}
            className={`${buttonStyles.close} text-lg font-bold ml-2 flex-shrink-0`}
            aria-label="Fechar erro"
            type="button"
          >
            ×
          </button>
        )}
      </div>
      {retryable && onRetry && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className={`text-sm ${buttonStyles.retry} underline`}
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;