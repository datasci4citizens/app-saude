import React from "react";

interface HabitCardProps {
  title: string;
  className?: string;
  isAttentionPoint?: boolean;
  providerName?: string;
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
}) => {
  return (
      <div
        className={`
          relative
          ${isAttentionPoint ? "bg-red-600 border-2 border-yellow-300 animate-pulse" : "bg-selection"}
          text-primary-foreground
          font-inter
          font-bold
          text-lg
          py-2.5
          px-4
          rounded-xl
          flex
          items-center
          gap-2
          shadow-sm
          mb-1
          mt-3 ml-2
          ${className}
        `}
      >
      {/* Ícone de informação no canto superior direito */}
      {isAttentionPoint && (
        <div className="absolute -top-2 -right-2 group cursor-help z-10">
          <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
            i
          </div>
          <div className="absolute bottom-full right-0 mb-1 w-56 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20">
            Essa área foi marcada como ponto de atenção por {providerName}. Preencha com mais detalhes ou atenção especial.
            <div className="absolute top-full right-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black"></div>
          </div>
        </div>
      )}

      {isAttentionPoint && (
        <span className="text-yellow-200 text-base flex items-center justify-center">
          ⚠️
        </span>
      )}
      <span className="leading-none">{title}</span>
    </div>
  );
};

export default HabitCard;
