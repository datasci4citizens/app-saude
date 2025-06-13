import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  rightIcon?: React.ReactNode;
  subtitleClassName?: string;
  centered?: boolean;
  headerClassName?: string;
  backButtonClassName?: string;
  arrowClassName?: string;
  showBackButton?: boolean; // New: Option to hide back button
  variant?: "default" | "transparent" | "gradient"; // New: Visual variants
  size?: "sm" | "md" | "lg"; // New: Size variants
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackClick,
  rightIcon,
  subtitleClassName,
  centered = false,
  headerClassName = "",
  backButtonClassName,
  arrowClassName,
  showBackButton = true,
  variant = "default",
  size = "md",
}) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  // Variant styles
  const variantStyles = {
    default: "bg-homebg border-b border-homebg/20", // Usa o azul do tema
    transparent: "bg-transparent",
    gradient: "bg-gradient-to-r from-homebg to-homebg/80 text-white",
  };

  // Size styles
  const sizeStyles = {
    sm: {
      container: "py-2",
      title: "text-lg font-semibold",
      subtitle: "text-xs",
      button: "w-8 h-8",
      icon: "w-5 h-5",
    },
    md: {
      container: "py-3",
      title: "text-titulo font-bold",
      subtitle: "text-desc-titulo",
      button: "w-10 h-10",
      icon: "w-6 h-6",
    },
    lg: {
      container: "py-4",
      title: "text-2xl font-bold",
      subtitle: "text-base",
      button: "w-12 h-12",
      icon: "w-7 h-7",
    },
  };

  // Dynamic button styles
  const getBackButtonStyles = () => {
    if (backButtonClassName) return backButtonClassName;

    const baseStyles =
      "rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50";

    switch (variant) {
      case "transparent":
        return `${baseStyles} bg-white/10 backdrop-blur-sm hover:bg-white/20`;
      case "gradient":
        return `${baseStyles} bg-white/20 backdrop-blur-sm hover:bg-white/30`;
      default:
        return `${baseStyles} bg-gray2/10 hover:bg-gray2/20`;
    }
  };

  // Dynamic arrow styles
  const getArrowStyles = () => {
    if (arrowClassName) return arrowClassName;

    switch (variant) {
      case "transparent":
        return "text-typography"; // Adapta ao tema
      case "gradient":
      case "default":
        return "text-white"; // Branco para fundos coloridos
    }
  };

  // Dynamic title styles
  const getTitleStyles = () => {
    const baseStyles = `${sizeStyles[size].title} font-inter m-0`;

    switch (variant) {
      case "transparent":
        return `${baseStyles} text-typography`; // Adapta ao tema atual
      case "gradient":
      case "default":
        return `${baseStyles} text-white`; // Branco para fundos coloridos
    }
  };

  // Dynamic subtitle styles
  const getSubtitleStyles = () => {
    if (subtitleClassName) return subtitleClassName;

    const baseStyles = `${sizeStyles[size].subtitle} font-inter m-0`;

    switch (variant) {
      case "transparent":
        return `${baseStyles} text-gray2`; // Adapta ao tema
      case "gradient":
      case "default":
        return `${baseStyles} text-white/80`; // Branco transparente para fundos coloridos
    }
  };

  return (
    <header
      className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size].container}
        ${headerClassName}
        safe-area-top
      `}
      role="banner"
    >
      <div className="flex items-center justify-between px-4 max-w-screen-xl mx-auto">
        {/* Back Button */}
        {showBackButton && (
          <button
            className={`
              ${getBackButtonStyles()}
              ${sizeStyles[size].button}
              flex items-center justify-center
              mr-3 flex-shrink-0
            `}
            onClick={handleBackClick}
            aria-label="Voltar"
            type="button"
          >
            <span
              className={`
                mgc_arrow_left_line 
                ${sizeStyles[size].icon}
                ${getArrowStyles()}
              `}
              aria-hidden="true"
            />
          </button>
        )}

        {/* Title Section */}
        <div
          className={`
            flex-1 flex flex-col justify-center
            ${centered ? "items-center text-center" : "items-start"}
            ${!showBackButton ? "ml-0" : ""}
          `}
        >
          <h1 className={getTitleStyles()}>{title}</h1>
          {subtitle && (
            <p className={`${getSubtitleStyles()} mt-0.5`}>{subtitle}</p>
          )}
        </div>

        {/* Right Icon */}
        <div className="flex items-center justify-center ml-3 flex-shrink-0">
          {rightIcon && (
            <div
              className={`
                ${sizeStyles[size].icon}
                ${variant === "transparent" ? "text-typography" : "text-white"}
                flex items-center justify-center
              `}
              role="button"
              tabIndex={0}
            >
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
