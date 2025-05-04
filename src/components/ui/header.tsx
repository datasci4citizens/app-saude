import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  rightIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackClick,
  rightIcon,
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
        className="bg-transparent border-none cursor-pointer flex items-center justify-center mr-3" 
        onClick={handleBackClick}
      >
        <span className="mgc_arrow_left_line w-7 h-7 text-[28px] text-dark_blue"></span>
      </button>
      
      <div className="flex flex-nowrap items-between justify-between">
        <div className="flex-1 flex flex-col items-start justify-center my-3">
          <h1 className="text-[28px] font-bold m-0 font-work-sans text-dark_blue">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm m-0 font-inter text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Optional Icon */}
        {rightIcon && (
          <div className="ml-3 flex items-center justify-center text-xl text-purple">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
