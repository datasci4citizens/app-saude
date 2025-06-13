import React from "react";

interface GoogleSigninProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "default" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
}

const GoogleSignin: React.FC<GoogleSigninProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  variant = "default",
  size = "md",
}) => {
  const handleClick = () => {
    if (!disabled && !isLoading) {
      onClick();
    }
  };

  // Size variants
  const sizeStyles = {
    sm: {
      button: "px-4 py-2.5 text-sm",
      icon: "w-4 h-4",
      arrow: "w-3 h-3",
      gap: "space-x-2",
    },
    md: {
      button: "px-6 py-4 text-base",
      icon: "w-5 h-5",
      arrow: "w-4 h-4",
      gap: "space-x-3",
    },
    lg: {
      button: "px-8 py-5 text-lg",
      icon: "w-6 h-6",
      arrow: "w-5 h-5",
      gap: "space-x-4",
    },
  };

  // Variant styles
  const variantStyles = {
    default: {
      button:
        "bg-card border-card-border hover:bg-card-muted hover:border-selection/30 shadow-md hover:shadow-lg",
      text: "text-card-foreground",
      spinner: "border-gray2 border-t-selection",
      arrow: "text-gray2 group-hover:text-selection",
      ripple: "bg-selection/10",
      shimmer: "from-transparent via-selection/5 to-transparent",
    },
    outline: {
      button:
        "bg-transparent border-2 border-card-border hover:border-selection hover:bg-selection/5",
      text: "text-card-foreground",
      spinner: "border-selection/30 border-t-selection",
      arrow: "text-gray2 group-hover:text-selection",
      ripple: "bg-selection/10",
      shimmer: "from-transparent via-selection/10 to-transparent",
    },
    minimal: {
      button:
        "bg-gray2/5 border-transparent hover:bg-gray2/10 hover:border-gray2/20",
      text: "text-typography",
      spinner: "border-gray2/50 border-t-selection",
      arrow: "text-gray2 group-hover:text-typography",
      ripple: "bg-gray2/10",
      shimmer: "from-transparent via-gray2/5 to-transparent",
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative group w-full max-w-sm mx-auto rounded-2xl 
        transition-all duration-300 transform font-inter font-semibold
        border focus:outline-none focus:ring-2 focus:ring-selection focus:ring-opacity-50
        ${currentSize.button}
        ${currentVariant.button}
        ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        }
        overflow-hidden
      `}
      type="button"
      aria-label={isLoading ? "Conectando com Google..." : "Entrar com Google"}
    >
      {/* Shimmer effect on hover */}
      {!disabled && !isLoading && (
        <div
          className={`
            absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 
            transition-opacity duration-700 animate-shimmer
            ${currentVariant.shimmer}
          `}
        />
      )}

      {/* Button content */}
      <div
        className={`relative flex items-center justify-center ${currentSize.gap}`}
      >
        {/* Google icon or loading spinner */}
        <div className="flex-shrink-0">
          {isLoading ? (
            <div
              className={`
                ${currentSize.icon} border-2 rounded-full animate-spin
                ${currentVariant.spinner}
              `}
            />
          ) : (
            <svg
              className={currentSize.icon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
        </div>

        {/* Button text */}
        <span className={`font-medium ${currentVariant.text}`}>
          {isLoading ? "Conectando..." : "Entrar com Google"}
        </span>

        {/* Arrow icon (hidden when loading) */}
        {!isLoading && (
          <div
            className={`
              flex-shrink-0 transition-all duration-300 
              group-hover:translate-x-1 ${currentVariant.arrow}
            `}
          >
            <svg
              className={currentSize.arrow}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Loading progress bar */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray2/20 overflow-hidden rounded-b-2xl">
          <div className="h-full bg-gradient-to-r from-selection to-accent1 animate-progress-bar rounded-b-2xl" />
        </div>
      )}

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className={`
            absolute inset-0 scale-0 group-active:scale-100 
            transition-transform duration-200 rounded-2xl
            ${currentVariant.ripple}
          `}
        />
      </div>
    </button>
  );
};

export default GoogleSignin;
