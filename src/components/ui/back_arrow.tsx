import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackArrowProps {
  className?: string;
}

const BackArrow: React.FC<BackArrowProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)} // Go back in history
      className={`group flex items-center p-2 h-auto space-x-2 hover:bg-gray-100 ${className}`}
      aria-label="Go back"
    >
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