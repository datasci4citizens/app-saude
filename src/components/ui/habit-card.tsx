import type React from 'react';
import { Lock } from 'lucide-react';

interface HabitCardProps {
  title: string;
  className?: string;
  isAttentionPoint?: boolean;
  providerName?: string;
  isOpen?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode; // Para conteúdo adicional se necessário
}

/**
 * HabitCard - Componente para exibir um hábito como card
 *
 * @param title - Texto do hábito (obrigatório)
 * @param className - Classes adicionais para customização
 * @param isAttentionPoint - Se é um ponto de atenção (adiciona ⚠️)
 * @param providerName - Nome do profissional que marcou como atenção
 * @param isOpen - Estado de expansão (undefined = não mostra seta)
 * @param readOnly - Modo somente leitura (adiciona ícone de cadeado)
 * @param children - Conteúdo adicional (opcional)
 */
const HabitCard: React.FC<HabitCardProps> = ({
  title,
  className = '',
  isAttentionPoint = false,
  providerName = '',
  isOpen,
  readOnly = false,
  children,
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

  // ✨ Ajuste de opacidade no modo read-only
  const colorClasses = isAttentionPoint
    ? `bg-destructive border-2 border-yellow text-white ${readOnly ? 'opacity-75' : ''}`
    : `bg-selection text-white dark:bg-selection ${readOnly ? 'opacity-75' : ''}`;

  return (
    <div className={`${baseClasses} ${colorClasses} ${className}`}>
      <div className="flex items-center justify-between w-full">
        {/* Área da esquerda: ⚠️ + título */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isAttentionPoint && providerName && (
            <div className="group relative flex-shrink-0">
              <span className="text-yellow cursor-help">⚠️</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 max-w-xs bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20">
                Essa área foi marcada como ponto de atenção por {providerName}.
              </div>
            </div>
          )}

          <span className="font-semibold truncate">{title}</span>
        </div>

        {/* Área da direita: indicadores + seta */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* ✨ Ícone de read-only */}
          {readOnly && (
            <div className="group relative">
              <Lock size={16} className="text-white/70 cursor-help" />
              <div className="absolute bottom-full right-0 mb-1 max-w-xs bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20 whitespace-nowrap">
                Modo somente leitura
              </div>
            </div>
          )}

          {/* Seta colapsável (aparece quando isOpen está definido, mesmo no read-only) */}
          {isOpen !== undefined && (
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? 'rotate-90' : 'rotate-0'
              } ${readOnly ? 'opacity-70' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Conteúdo adicional (se fornecido) */}
      {children && <div className="mt-2 w-full">{children}</div>}
    </div>
  );
};

export default HabitCard;
