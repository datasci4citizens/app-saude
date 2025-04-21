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
      className={`text-2xl p-2 h-auto hover:bg-gray-100 ${className}`}
      aria-label="Go back"
    >
      <span role="img" aria-label="arrow" className="mgc_arrow_left_line"></span>
    </Button>
  );
};

export default BackArrow;