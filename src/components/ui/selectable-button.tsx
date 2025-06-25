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
    <div className="px-4">
      <Button
        onClick={onClick}
        variant={selected ? 'white' : 'glassy'}
        className={cn(
          'w-full px-6 pt-6 pb-10 pr-16 rounded-3xl text-left transition-all duration-300 transform relative',
          'flex flex-row items-start gap-4 min-h-[135px] whitespace-normal',
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
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-button-soft transition-all duration-300 border self-center',
            selected
              ? 'bg-primary/15 text-primary shadow-button-hover border-primary/20'
              : 'bg-card text-typography border-card shadow-button-soft',
          )}
        >
          <Icon className="w-6 h-6 transition-transform duration-300" />
        </div>

        {/* Texto ao lado */}
        <div className="flex flex-col flex-1 justify-start py-1 min-w-0">
          <span className="text-titulowindow font-bold text-typography mb-2 leading-tight break-words">
            {label}
          </span>
          {description && (
            <span
              className={cn(
                'text-topicos leading-normal font-medium break-words',
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
            'absolute top-5 right-5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-button-soft',
            selected
              ? 'bg-primary border-primary scale-110 shadow-button-hover'
              : 'bg-card border-card-border scale-90 backdrop-blur-sm',
          )}
        >
          {selected && <Check className="h-4 w-4 text-primary-foreground" />}
        </div>

        {/* Efeito de brilho quando selecionado */}
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent animate-button-shimmer rounded-3xl pointer-events-none opacity-50" />
        )}
      </Button>
    </div>
  );
}
