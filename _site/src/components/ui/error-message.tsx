import type React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  className?: string;
  closable?: boolean;
  retryable?: boolean;
  icon?: boolean;
  variant?: 'destructive';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  onRetry,
  className = '',
  closable = true,
  retryable = true,
  icon = true,
  variant,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive border-destructive text-destructive-foreground';
      default:
        return 'bg-destructive/10 border-destructive text-destructive';
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          close: 'text-destructive-foreground hover:text-offwhite',
          retry: 'text-destructive-foreground hover:text-offwhite',
        };
      default:
        return {
          close: 'text-destructive hover:text-destructive/70',
          retry: 'text-destructive hover:text-destructive/70',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const buttonStyles = getButtonStyles();

  return (
    <div className={`${variantStyles} border rounded-lg p-4 mt-4 mb-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {icon && (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <p className="text-sm font-medium">{message}</p>
        </div>
        {closable && onClose && (
          <button
            onClick={onClose}
            className={`${buttonStyles.close} transition-colors duration-200 ml-2 flex-shrink-0`}
            aria-label="Fechar erro"
            type="button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {retryable && onRetry && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className={`text-sm ${buttonStyles.retry} underline transition-colors duration-200`}
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
