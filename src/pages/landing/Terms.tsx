import TermsText from "./TermsText";
import { Check, ScrollText, ArrowLeft } from "lucide-react";
import { useState } from "react";
import ContinueButton from "@/components/ui/ContinueButton";
import Header from "@/components/ui/header";
import { useNavigate, useLocation } from "react-router-dom";

interface TermsScreenProps {
  onNext: () => void;
  onPrevious?: () => void;
  currentStep: number;
  totalSteps: number;
}

const TermsScreen = ({
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: TermsScreenProps) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    setShowSuccessMessage(true);
    setTimeout(() => {
      onNext();
      setShowSuccessMessage(false);
    }, 1500);
  };

  // Usar as props para comportamentos condicionais
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const stepNumber = currentStep + 1;

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); // This goes back one page in history
  };

  return (
    <div className="h-screen bg-homeblob2 flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!isFirstStep && onPrevious && (
              <button
                onClick={onPrevious}
                className="mr-3 p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            )}
            <Header
              title=""
              onBackClick={handleBackClick}
              headerClassName="bg-transparent"
              backButtonClassName="bg-transparent"
              arrowClassName="text-white"
            />

            {/*<h1 className="text-titulowindow font-work-sans text-white">
              Termos e condições
            </h1>*/}
          </div>

          {/* Progresso no header */}
          <div className="text-white/60 text-desc-titulo font-inter">
            {stepNumber} de {totalSteps}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-4">
        {/* Container do conteúdo scrollável - altura reduzida */}
        <div className="flex-1 min-h-0 mb-4 max-h-[calc(100vh-280px)]">
          {" "}
          {/* ✅ max-height para limitar área */}
          <div
            className="bg-primary/20 backdrop-blur-sm rounded-lg p-4 h-full overflow-y-auto 
                       scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
            onScroll={handleScroll}
          >
            <TermsText />
          </div>
        </div>

        {/* Área fixa do botão com mais espaço */}
        <div className="flex-shrink-0 pb-28">
          {" "}
          {/* ✅ pb-28 para dar espaço à progress bar */}
          <div className="flex flex-col items-center space-y-4">
            {/* Container do botão centralizado */}
            <div className="w-full max-w-xs mx-auto">
              <ContinueButton
                isEnabled={isScrolledToBottom}
                onClick={handleContinue}
                text={isLastStep ? "FINALIZAR" : "CONTINUAR"}
                successText="ACEITO E CONCORDO"
              />
            </div>

            {/* Mensagem de instrução */}
            {!isScrolledToBottom && (
              <div className="flex items-center space-x-2 text-white/80 animate-bounce">
                <ScrollText className="h-4 w-4" />
                <p className="text-desc-titulo font-inter font-medium">
                  Role até o final para continuar
                </p>
              </div>
            )}

            {/* Mensagem contextual baseada no step */}
            {isScrolledToBottom && !showSuccessMessage && (
              <div className="text-center">
                <p className="text-white/80 text-desc-titulo font-inter">
                  {isLastStep
                    ? "Pronto para finalizar o processo"
                    : "Pronto para o próximo passo"}
                </p>
              </div>
            )}

            {/* Mensagem de sucesso */}
            {showSuccessMessage && (
              <div className="bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span className="font-inter font-medium text-desc-titulo">
                    Termos aceitos com sucesso!
                  </span>
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
