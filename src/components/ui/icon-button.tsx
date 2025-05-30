import React from "react";

interface TextIconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  text?: string;
  icon?: string;
}

const TextIconButton: React.FC<TextIconButtonProps> = ({
  onClick,
  className = "",
  text = "",
  icon = "",
}) => {
  return (
    <button
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    </button>
  );
};

export default TextIconButton;
