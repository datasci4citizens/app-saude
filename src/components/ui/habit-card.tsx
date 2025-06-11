import React from "react";

interface HabitCardProps {
  title: string;
  className?: string;
  isAttentionPoint?: boolean;
  providerName?: string;
  isOpen?: boolean;
}

/**
 * HabitCard - Componente para exibir um hábito como card
 *
 * @param title - Texto do hábito (obrigatório)
 * @param className - Classes adicionais para customização
 */
const HabitCard: React.FC<HabitCardProps> = ({
  title,
  className = "",
  isAttentionPoint = false,
  providerName = "",
  isOpen,
}) => {
  const baseClasses = `
    relative
    font-inter
    font-bold
    text-lg
    py-2.5
    px-4
    rounded-xl
    flex
    items-center
    justify-between
    shadow-sm
    w-full
    space-y-1
    transition-colors
  `;

  const colorClasses = isAttentionPoint
    ? "bg-destructive border-2 border-yellow text-white"
    : "bg-selection text-white dark:bg-selection";

  return (
    <div className={`${baseClasses} ${colorClasses} ${className}`}>
      <div className="flex items-center justify-between w-full">
        {/* Área da esquerda: ⚠️ + título */}
        <div className="flex items-center gap-2">
          {isAttentionPoint && providerName && (
            <div className="group relative">
              <span className="text-yellow cursor-help">⚠️</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 max-w-xs bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20">
                Essa área foi marcada como ponto de atenção por {providerName}.
              </div>
            </div>
          )}

          <span className="font-semibold">{title}</span>
        </div>

        {/* Seta colapsável (alinhada à direita sempre) */}
        {isOpen !== undefined && (
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
