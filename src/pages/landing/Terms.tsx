import TermsText from "./TermsText";
import { Check, ScrollText, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import ContinueButton from "@/components/ui/ContinueButton";
import Header from "@/components/ui/header";
import { useNavigate, useLocation } from "react-router-dom";

interface TermsScreenProps {
  onNext?: () => void;
  onPrevious?: () => void;
  currentStep?: number;
  totalSteps?: number;
  // Nova prop para identificar contexto
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

  // Detectar se veio do perfil
  const [isFromProfile, setIsFromProfile] = useState(false);

  useEffect(() => {
    // Múltiplas formas de detectar se veio do perfil
    const urlParams = new URLSearchParams(location.search);
    const fromQuery = urlParams.get("from");

    const fromProfile =
      // Via query parameter (mais confiável)
      fromQuery === "profile" ||
      // Via state passado na navegação
      location.state?.from === "profile" ||
      // Via pathname atual
      location.pathname.includes("/profile/terms") ||
      // Via referrer
      document.referrer.includes("/profile") ||
      document.referrer.includes("/acs-profile") ||
      document.referrer.includes("/user-profile") ||
      // Via props
      isViewOnly ||
      // Via histórico do navegador
      window.history.state?.from === "profile" ||
      // Via localStorage (backup)
      localStorage.getItem("navigatedFromProfile") === "true";

    console.log("Terms Screen Debug:", {
      fromQuery,
      locationState: location.state,
      pathname: location.pathname,
      referrer: document.referrer,
      isViewOnly,
      fromProfile,
    });

    setIsFromProfile(fromProfile);

    // Limpar flag do localStorage se existir
    if (localStorage.getItem("navigatedFromProfile")) {
      localStorage.removeItem("navigatedFromProfile");
    }
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
      // Se veio do perfil, apenas voltar
      navigate(-1);
      return;
    }

    // Fluxo normal de cadastro/onboarding
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

  // Propriedades condicionais
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const stepNumber = currentStep + 1;

  // Determinar se deve mostrar o botão de aceitar
  const shouldShowAcceptButton = !isFromProfile;

  // Título baseado no contexto
  const getPageTitle = () => {
    if (isFromProfile) return "Termos e Condições";
    return "Aceitar Termos";
  };

  // Texto do botão baseado no contexto
  const getButtonText = () => {
    if (isFromProfile) return "VOLTAR";
    if (isLastStep) return "FINALIZAR";
    return "CONTINUAR";
  };

  // Mensagem de instrução baseada no contexto
  const getInstructionMessage = () => {
    if (isFromProfile) {
      return "Consulte os termos a qualquer momento";
    }
    if (!isScrolledToBottom) {
      return "Role até o final para continuar";
    }
    if (isLastStep) {
      return "Pronto para finalizar o processo";
    }
    return "Pronto para o próximo passo";
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
            headerClassName="bg-transparent"
            backButtonClassName="bg-transparent hover:bg-white/10"
            arrowClassName="text-white"
          />

          {/* Progresso no header - apenas se não for do perfil */}
          {!isFromProfile && (
            <div className="text-white/60 text-sm font-inter">
              {stepNumber} de {totalSteps}
            </div>
          )}

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
                  successText="ACEITO E CONCORDO"
                  showShimmer={false}
                />
              )}
            </div>

            {/* Mensagens de instrução */}
            {!isFromProfile && !isScrolledToBottom && (
              <div className="flex items-center space-x-2 text-white/80 animate-bounce">
                <ScrollText className="h-4 w-4" />
                <p className="text-sm font-inter font-medium">
                  Role até o final para continuar
                </p>
              </div>
            )}

            {/* Mensagem contextual */}
            {(isFromProfile ||
              (!isFromProfile &&
                isScrolledToBottom &&
                !showSuccessMessage)) && (
              <div className="text-center">
                <p className="text-white/80 text-sm font-inter">
                  {getInstructionMessage()}
                </p>
              </div>
            )}

            {/* Mensagem de sucesso - apenas no fluxo de cadastro */}
            {!isFromProfile && showSuccessMessage && (
              <div className="bg-success/90 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span className="font-inter font-medium text-sm">
                    Termos aceitos com sucesso!
                  </span>
                </div>
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
                    <h4 className="text-white font-medium text-sm mb-1">
                      Já aceito anteriormente
                    </h4>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Você já aceitou estes termos durante o cadastro. Esta é
                      apenas uma consulta para referência.
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
