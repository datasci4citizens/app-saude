import TermsText from './TermsText';
import { ScrollText } from 'lucide-react';
import { useState, useEffect } from 'react';
import ContinueButton from '@/components/ui/ContinueButton';
import SuccessMessage from '@/components/ui/success-message';
import Header from '@/components/ui/header';
import { useNavigate, useLocation } from 'react-router-dom';

interface TermsScreenProps {
  onNext?: () => void;
  onPrevious?: () => void;
  currentStep?: number;
  totalSteps?: number;
  isViewOnly?: boolean;
}

const TermsScreen = ({
  onNext,
  onPrevious,
  currentStep = 0,
  totalSteps = 1,
  isViewOnly,
}: TermsScreenProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isFromProfile, setIsFromProfile] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fromQuery = urlParams.get('from');

    const fromProfile =
      fromQuery === 'profile' ||
      location.state?.from === 'profile' ||
      location.pathname.includes('/profile/terms') ||
      document.referrer.includes('/profile') ||
      document.referrer.includes('/acs-profile') ||
      document.referrer.includes('/user-profile') ||
      isViewOnly ||
      window.history.state?.from === 'profile';

    console.log('Terms Screen Debug:', {
      fromQuery,
      locationState: location.state,
      pathname: location.pathname,
      referrer: document.referrer,
      isViewOnly,
      fromProfile,
    });

    setIsFromProfile(fromProfile);
  }, [location, isViewOnly]);

  interface ScrollEventTarget extends EventTarget {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }

  interface ScrollEvent extends React.UIEvent<HTMLDivElement> {
    target: ScrollEventTarget;
  }

  const handleScroll = (e: ScrollEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsScrolledToBottom(isAtBottom);
  };

  const handleContinue = () => {
    if (isFromProfile) {
      navigate(-1);
      return;
    }

    setShowSuccessMessage(true);
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
      setShowSuccessMessage(false);
    }, 1500);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const getPageTitle = () => {
    if (isFromProfile) return 'Termos e Condições';
    return 'Aceitar Termos';
  };

  const getButtonText = () => {
    if (isFromProfile) return 'VOLTAR';
    if (isLastStep) return 'FINALIZAR';
    return 'CONTINUAR';
  };

  const getInstructionMessage = () => {
    if (isFromProfile) {
      return 'Consulte os termos a qualquer momento';
    }
    if (!isScrolledToBottom) {
      return 'Role até o final para continuar';
    }
    if (isLastStep) {
      return 'Pronto para finalizar o processo';
    }
    return 'Pronto para o próximo passo';
  };

  return (
    <div className="h-screen bg-homebg flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Header
            title={getPageTitle()}
            onBackClick={() => {
              if (!isFirstStep && onPrevious && !isFromProfile) onPrevious();
              else handleBackClick();
            }}
            variant="transparent"
            textClassName="!text-white"
            backButtonClassName="bg-transparent hover:bg-white/10"
            arrowClassName="text-white"
          />

          {/* Badge "Somente leitura" se for do perfil */}
          {isFromProfile && (
            <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
              📖 Consulta
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-4">
        {/* Container do conteúdo scrollável */}
        <div className="flex-1 min-h-0 mb-4 max-h-[calc(100vh-280px)]">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 h-full overflow-y-auto 
                       scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent
                       border border-white/20"
            onScroll={handleScroll}
          >
            <TermsText />
          </div>
        </div>

        {/* Área do botão - condicional */}
        <div className="flex-shrink-0 pb-28">
          <div className="flex flex-col items-center space-y-4">
            {/* Botão - sempre visível mas com comportamento diferente */}
            <div className="w-full max-w-xs mx-auto">
              {isFromProfile ? (
                // Botão simples para voltar quando vem do perfil
                <button
                  onClick={handleBackClick}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30"
                >
                  ← VOLTAR
                </button>
              ) : (
                // Botão de aceitar termos para fluxo de cadastro
                <ContinueButton
                  isEnabled={isScrolledToBottom}
                  onClick={handleContinue}
                  text={getButtonText()}
                />
              )}
            </div>

            {/* Mensagens de instrução */}
            {!isFromProfile && !isScrolledToBottom && (
              <div className="flex items-center space-x-2 text-white/80 animate-bounce">
                <ScrollText className="h-4 w-4" />
                <p className="text-sm font-inter font-medium">Role até o final para continuar</p>
              </div>
            )}

            {/* Mensagem contextual */}
            {(isFromProfile || (!isFromProfile && isScrolledToBottom && !showSuccessMessage)) && (
              <div className="text-center">
                <p className="text-white/80 text-sm font-inter">{getInstructionMessage()}</p>
              </div>
            )}

            {/* Mensagem de sucesso usando o componente SuccessMessage */}
            {!isFromProfile && showSuccessMessage && (
              <div className="w-full max-w-xs mx-auto">
                <SuccessMessage
                  message="Termos aceitos com sucesso!"
                  className="animate-in slide-in-from-bottom-2 duration-300 mb-0 mt-0"
                  icon={true}
                />
              </div>
            )}

            {/* Info adicional se for do perfil */}
            {isFromProfile && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">ℹ️</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Já aceito anteriormente</h4>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Você já aceitou estes termos durante o cadastro. Esta é apenas uma consulta
                      para referência.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsScreen;
