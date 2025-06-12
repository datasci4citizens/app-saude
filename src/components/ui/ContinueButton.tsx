import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";

type ContinueButtonProps = {
  // Props para diferentes cenários de uso
  isEnabled: boolean;  // Genérico: pode ser isScrolledToBottom, userType !== "", etc.
  onClick?: () => void;
  
  // Props opcionais para customização
  text?: string;           // Texto padrão do botão
  successText?: string;    // Texto quando clicado com sucesso
  variant?: 'default' | 'compact';  // Variantes de tamanho
  showProgressBar?: boolean;  // Se deve mostrar barra de progresso
  showShimmer?: boolean;      // Se deve mostrar efeito shimmer
  isLoading?: boolean;        // ✅ Novo: estado de loading
  loadingText?: string;       // ✅ Novo: texto durante loading
};

const ContinueButton = ({ 
  isEnabled, 
  onClick,
  text = "CONTINUAR",
  successText = "ACEITO E CONCORDO", 
  variant = 'default',
  showProgressBar = true,
  showShimmer = true,
  isLoading = false,          // ✅ Novo
  loadingText = "Processando..." // ✅ Novo
}: ContinueButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isEnabled && !isLoading) { // ✅ Não clica se estiver loading
      setIsClicked(true);
      setTimeout(() => {
        if (onClick) onClick();
        setIsClicked(false);
      }, 800);
    }
  };

  // Estilos baseados na variante
  const sizeClasses = variant === 'compact' 
    ? 'px-6 py-3 text-sm' 
    : 'px-8 py-3 text-base';

  // ✅ Verifica se deve estar desabilitado (original + loading)
  const isDisabled = !isEnabled || isLoading;

  return (
    <div className="relative w-full">
      <button 
        onClick={handleClick}
        disabled={isDisabled} // ✅ Atualizado
        className={`
          relative overflow-hidden w-full ${sizeClasses} rounded-xl font-semibold
          transition-all duration-500 transform focus:outline-none focus:ring-4 
          ${!isDisabled // ✅ Atualizado
            ? `bg-white text-blue-700 hover:bg-gray-50 shadow-xl hover:shadow-2xl 
               hover:scale-105 focus:ring-blue-300/50 cursor-pointer border border-blue-200
               ${isClicked ? 'scale-95' : ''}` 
            : 'bg-gray-400/60 text-gray-500 cursor-not-allowed shadow-md border border-gray-300'
          }
        `}
      >
        {/* Efeito de ondulação */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800
          transition-transform duration-700 ${isClicked ? 'scale-100' : 'scale-0'}
          rounded-xl
        `} />
        
        {/* Conteúdo do botão */}
        <div className="relative flex items-center justify-center space-x-3">
          {isLoading ? ( // ✅ Novo: estado de loading
            <>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="font-inter">{loadingText}</span>
            </>
          ) : isClicked ? (
            <>
              <Check className="h-6 w-6 text-white animate-bounce" />
              <span className="text-white font-inter">{successText}</span>
            </>
          ) : (
            <>
              <span className="font-inter">{text}</span>
              {!isDisabled && ( // ✅ Atualizado
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </>
          )}
        </div>
        
        {/* Barra de progresso quando habilitado */}
        {!isDisabled && !isClicked && !isLoading && showProgressBar && ( // ✅ Atualizado
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-100 rounded-b-xl">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-b-xl animate-pulse" />
          </div>
        )}
      </button>
      
      {/* Efeito de brilho quando habilitado */}
      {!isDisabled && !isClicked && !isLoading && showShimmer && ( // ✅ Atualizado
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                        animate-shimmer rounded-xl pointer-events-none" 
             style={{
               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
               animation: 'shimmer 2s infinite'
             }} />
      )}
    </div>
  );
};

export default ContinueButton;