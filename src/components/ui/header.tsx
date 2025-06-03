import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  rightIcon?: React.ReactNode;
  subtitleClassName?: string; // Added subtitleClassName
  centered?: boolean; // Added centered prop
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackClick,
  rightIcon,
  subtitleClassName, // Added subtitleClassName
  centered = false, // Added centered prop with default false
}) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button
        className="bg-primary border-none cursor-pointer flex items-center justify-center mr-3"
        onClick={handleBackClick}
      >
        <span className="mgc_arrow_left_line w-7 h-7 text-titulo text-typography"></span>{" "}
        {/* text-titulo for icon size */}
      </button>

      <div className="flex flex-nowrap items-between justify-between">
        <div className={`flex-1 flex flex-col ${centered ? 'items-center' : 'items-start'} justify-center my-3`}>
          <h1 className="text-titulo m-0 font-inter text-typography">
            {" "}
            {/* Use text-titulo */}
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-desc-titulo m-0 font-inter ${subtitleClassName || "text-gray2"}`}
            >
              {subtitle}
            </p> // Use text-desc-titulo
          )}
        </div>

        {/* Optional Icon */}
        {rightIcon && (
          <div className="ml-3 flex items-center justify-center text-titulo text-typography ">
            {" "}
            {/* text-titulo for icon size */}
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
