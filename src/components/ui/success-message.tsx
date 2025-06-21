import type React from "react";

interface SuccessMessageProps {
  message: string;
  className?: string;
  icon?: boolean;
  onClose?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className = "",
  icon = true,
  onClose,
}) => {
  return (
    <div
      className={`bg-success border border-success-foreground rounded-lg p-4 text-success-text mt-4 mb-4 ${className}`}
    >
      <div className="flex items-center justify-between">
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
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-success-text hover:text-success-text/80"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
