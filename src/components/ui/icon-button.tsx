import type React from 'react';

interface TextIconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  text?: string;
  icon?: string;
}

const TextIconButton: React.FC<TextIconButtonProps> = ({
  onClick,
  className = '',
  text = '',
  icon = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center justify-between
        w-full bg-selection hover:bg-selected
        text-typography font-medium
        py-3 px-4
        rounded-xl
        transition-colors duration-200
        ${className}
      `}
    >
      <span>{text}</span>
      {icon}
    </button>
  );
};

export default TextIconButton;
