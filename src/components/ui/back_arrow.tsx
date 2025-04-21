import React from "react";
import { Button } from "@/components/ui/button";

interface BackArrowProps {
  onClick?: () => void;
  className?: string;
}

const BackArrow: React.FC<BackArrowProps> = ({ onClick, className }) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`group flex items-center p-2 h-auto space-x-2 hover:bg-gray-100 ${className}`}
      aria-label="Go back"
    >
      {/* MingCute arrow icon with line */}
      <div className="flex items-center">
        <span 
          role="img" 
          aria-label="arrow" 
          className="mgc_arrow_left_line text-3xl"
        ></span>
      </div>
    </Button>
  );
};

export default BackArrow;



