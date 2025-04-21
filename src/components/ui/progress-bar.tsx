import React from "react";

type ProgressVariant = "first" | "second" | "third";

interface ProgressBarProps {
  variant: ProgressVariant;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ variant, className }) => {
  // Calculate width based on variant
  const progressWidth = {
    first: "33%",
    second: "66%", 
    third: "100%"
  }[variant];

  return (
    <div className={`w-[85%] mx-auto ${className}`}>
      {/* Background line (full width) */}
      <div className="w-full h-1 bg-[#F8F9FE] rounded-full overflow-hidden">
        {/* Progress line (dynamic width based on variant) */}
        <div 
          className="h-full bg-[#CEFA5A] transition-all duration-300 ease-out"
          style={{ width: progressWidth }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;