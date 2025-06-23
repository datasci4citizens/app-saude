import type React from 'react';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface SelectableOptionProps {
  label: string;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}

const SelectableOption: React.FC<SelectableOptionProps> = ({
  label,
  description,
  icon: Icon,
  selected,
  onClick,
  delay = 0,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative w-full p-5 rounded-2xl transition-all duration-300 transform
        ${
          selected
            ? 'bg-white text-blue-800 shadow-2xl scale-105'
            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-102'
        }
        ${isPressed ? 'scale-95' : ''}
        focus:outline-none focus:ring-4 focus:ring-white/30
      `}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out both',
      }}
    >
      {/* Indicador de seleção */}
      <div
        className={`
        absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300
        ${selected ? 'bg-blue-600 border-blue-600 scale-100' : 'border-white/50 scale-90'}
        flex items-center justify-center
      `}
      >
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>

      {/* Ícone principal */}
      <div
        className={`
        mb-3 p-3 rounded-xl inline-flex items-center justify-center transition-all duration-300
        ${selected ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-white'}
      `}
      >
        <Icon className="h-6 w-6" />
      </div>

      {/* Texto */}
      <div className="text-left">
        <h3
          className={`
          font-bold text-lg mb-1 transition-colors duration-300
          ${selected ? 'text-blue-800' : 'text-white'}
        `}
        >
          {label}
        </h3>
        <p
          className={`
          text-sm transition-colors duration-300
          ${selected ? 'text-blue-600' : 'text-white/80'}
        `}
        >
          {description}
        </p>
      </div>

      {/* Efeito de brilho quando selecionado */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-2xl pointer-events-none" />
      )}
    </button>
  );
};

export default SelectableOption;
