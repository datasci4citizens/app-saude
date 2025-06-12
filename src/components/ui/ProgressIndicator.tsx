const ProgressIndicator = ({
  currentStep,
  totalSteps,
  className = "",
}: {
  currentStep: number;
  totalSteps: number;
  className?: string;
}) => {
  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
    >
      <div className="flex justify-center space-x-3">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`
              h-2 rounded-full transition-all duration-500 ease-out
              ${
                index === currentStep
                  ? "w-8 bg-white shadow-lg scale-110"
                  : index < currentStep
                    ? "w-3 bg-white/80 shadow-md"
                    : "w-2 bg-white/40"
              }
            `}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Texto auxiliar opcional */}
      <div className="text-center mt-2">
        <span className="text-white/60 text-xs font-medium">
          {currentStep + 1} de {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
