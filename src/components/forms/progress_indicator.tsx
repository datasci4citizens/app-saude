import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  activeColor?: string; 
  inactiveColor?: string;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  activeColor = "bg-[#CEFA5A]",
  inactiveColor = "bg-transparent", 
  className = "",
}) => {
  // Create an array of steps to map through
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className={`mt-[30px] mb-6 mx-8 ${className}`}>
      <div className="flex h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        {steps.map((step) => (
          <div
            key={step}
            className={`h-full ${currentStep === step ? activeColor : inactiveColor}`}
            style={{ width: `${100 / totalSteps}%` }}
          />
        ))}
      </div>
    </div>
  );
};