import { cn } from '@/lib/utils';
import { Button } from '@/components/forms/button';
import { Check } from 'lucide-react';

type SelectableOptionProps = {
  selected: boolean;
  label: string;
  description?: string;
  Icon: React.ComponentType<{ className?: string }>;
  delay?: number;
  isPressed?: boolean;
  onClick?: () => void;
};

export default function SelectableOption({
  selected,
  label,
  description,
  Icon,
  delay = 0,
  isPressed,
  onClick,
}: SelectableOptionProps) {
  return (
    <div className="px-2 sm:px-4">
      <Button
        onClick={onClick}
        variant={selected ? 'white' : 'glassy'}
        className={cn(
          'w-full px-2 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-6 md:pb-8 pr-10 sm:pr-12 md:pr-14 rounded-3xl text-left transition-all duration-300 transform relative',
          'flex flex-row items-start gap-2 sm:gap-3 md:gap-4 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] whitespace-normal overflow-visible',
          'shadow-button-hover hover:shadow-button-glow',
          selected && 'scale-[1.02] shadow-button-glow bg-gradient-to-br from-card to-card/95',
          !selected &&
            'hover:scale-[1.01] bg-card/90 hover:bg-card border-2 border-card-border backdrop-blur-md shadow-button-soft',
          isPressed && 'scale-95',
        )}
        style={{
          animationDelay: `${delay}ms`,
          animation: 'slideInUp 0.6s ease-out both',
        }}
      >
        {/* Ícone do lado esquerdo */}
        <div
          className={cn(
            'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-button-soft transition-all duration-300 border self-center',
            selected
              ? 'bg-primary/15 text-primary shadow-button-hover border-primary/20'
              : 'bg-card text-typography border-card shadow-button-soft',
          )}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300" />
        </div>

        {/* Texto ao lado */}
        <div className="flex flex-col flex-1 justify-center py-1 sm:py-2 min-w-0 pr-2 sm:pr-3">
          <span className="text-xs sm:text-sm md:text-base font-bold text-typography mb-1 sm:mb-2 leading-tight break-words hyphens-auto word-break overflow-wrap-anywhere">
            {label}
          </span>
          {description && (
            <span
              className={cn(
                'text-xs sm:text-sm leading-relaxed sm:leading-loose font-medium break-words hyphens-auto word-break overflow-wrap-anywhere',
                selected ? 'text-muted-foreground' : 'text-typography/80',
              )}
            >
              {description}
            </span>
          )}
        </div>

        {/* Indicador de seleção no canto superior direito */}
        <div
          className={cn(
            'absolute top-3 sm:top-5 right-3 sm:right-5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-button-soft',
            selected
              ? 'bg-primary border-primary scale-110 shadow-button-hover'
              : 'bg-card border-card-border scale-90 backdrop-blur-sm',
          )}
        >
          {selected && <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />}
        </div>

        {/* Efeito de brilho quando selecionado */}
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent animate-button-shimmer rounded-3xl pointer-events-none opacity-50" />
        )}
      </Button>
    </div>
  );
}
