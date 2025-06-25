import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

type ContinueButtonProps = {
  isEnabled: boolean;
  onClick?: () => void;
  text?: string;
  isLoading?: boolean;
  loadingText?: string;
};

const ContinueButton = ({
  isEnabled,
  onClick,
  text = 'CONTINUAR',
  isLoading = false,
  loadingText = 'Processando...',
}: ContinueButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (isEnabled && !isLoading && onClick) {
      onClick();
    }
  };

  const handleMouseDown = () => {
    if (isEnabled && !isLoading) setIsPressed(true);
  };

  const handleMouseUp = () => setIsPressed(false);

  const isDisabled = !isEnabled || isLoading;

  return (
    <div className="w-full max-w-xs mx-auto">
      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={isDisabled}
        className={`
          w-full px-8 py-3 h-12 rounded-full font-bold
          font-inter tracking-wide flex items-center justify-center gap-3
          transition-all duration-300 ease-button-smooth
          bg-card text-typography border-2 border-accent1 shadow-button-soft
          ${
            !isDisabled
              ? `hover:shadow-button-hover hover:bg-card/80 cursor-pointer
                 active:shadow-button-active
                 ${isPressed ? 'scale-[0.98]' : ''}`
              : 'opacity-40 cursor-not-allowed border-gray2'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-gray2 border-t-typography rounded-full animate-spin" />
            <span className="font-inter font-bold text-typography">{loadingText}</span>
          </>
        ) : (
          <>
            <span className="font-inter font-bold text-typography">{text}</span>
            {!isDisabled && (
              <ChevronRight className="h-5 w-5 text-accent1 transition-transform duration-300 hover:translate-x-1" />
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default ContinueButton;
