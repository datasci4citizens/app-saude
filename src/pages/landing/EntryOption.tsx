import { useState } from 'react';
import { User, Stethoscope, Check, ArrowLeft } from 'lucide-react';
import SelectableOption from '@/components/ui/selectable-button';
import ContinueButton from '@/components/ui/ContinueButton';

interface EntryOptionsScreenProps {
  onComplete: (userType: string) => void;
  onPrevious?: () => void;
  currentStep: number;
  totalSteps: number;
}

const EntryOptionsScreen: React.FC<EntryOptionsScreenProps> = ({
  onComplete,
  onPrevious,
  currentStep,
  totalSteps,
}) => {
  const [userType, setUserType] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleContinue = () => {
    setButtonClicked(true);

    setShowSuccessMessage(true);
    setTimeout(() => {
      onComplete(userType);
      setShowSuccessMessage(false);
    }, 1500);
  };

  // Usar as props para comportamentos condicionais
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const stepNumber = currentStep + 1;

  const userOptions = [
    {
      id: 'patient',
      label: 'Paciente',
      description: 'Busco apoio para minha saúde mental e bem-estar',
      icon: User,
      delay: 0,
    },
    {
      id: 'professional',
      label: 'Profissional de saúde',
      description: 'Trabalho na área da saúde ou sou ACS',
      icon: Stethoscope,
      delay: 100,
    },
  ];

  return (
    <div className="h-screen bg-homeblob2 flex flex-col overflow-hidden">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Header fixo */}
      <div className="flex-shrink-0 px-6 pt-8 pb-4">
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
            <h1 className="text-titulowindow font-work-sans text-white">Escolha seu perfil</h1>
          </div>

          {/* Progresso no header */}
          <div className="text-white/60 text-desc-titulo font-inter">
            {stepNumber} de {totalSteps}
          </div>
        </div>
      </div>

      {/* Área principal scrollável */}
      <div className="flex-1 flex flex-col min-h-0 px-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Opções de seleção */}
          <div className="space-y-4 mb-8">
            {userOptions.map((option) => (
              <SelectableOption
                key={option.id}
                label={option.label}
                description={option.description}
                Icon={option.icon}
                selected={userType === option.id}
                onClick={() => setUserType(option.id)}
                delay={option.delay}
              />
            ))}
          </div>

          {/* Mensagem de ajuda */}
          {!userType && (
            <div className="text-center mb-6 animate-bounce">
              <p className="text-white/80 text-desc-titulo font-inter">
                Selecione uma opção para continuar
              </p>
            </div>
          )}

          {/* Mensagem contextual baseada no step */}
          {userType && !showSuccessMessage && (
            <div className="text-center mb-6">
              <p className="text-white/80 text-desc-titulo font-inter">
                {isLastStep
                  ? `Perfeito! Você será direcionado para ${userType === 'patient' ? 'a área do paciente' : 'a área profissional'}`
                  : 'Ótima escolha! Vamos continuar'}
              </p>
            </div>
          )}

          {/* Mensagem de sucesso */}
          {showSuccessMessage && (
            <div className="bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg mb-4">
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5" />
                <span className="font-inter font-medium text-desc-titulo">
                  {userType === 'patient'
                    ? 'Redirecionando para área do paciente!'
                    : 'Redirecionando para área profissional!'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Área fixa do botão com espaçamento adequado */}
      <div className="flex-shrink-0 px-6 pb-28">
        {' '}
        {/* pb-28 para mais espaço para a progress bar */}
        <div className="w-full max-w-xs mx-auto">
          {' '}
          {/* max-w-xs para botão menor */}
          <ContinueButton
            isEnabled={userType !== '' && !buttonClicked}
            onClick={handleContinue}
            text={isLastStep ? 'FINALIZAR' : 'CONTINUAR'}
          />
        </div>
      </div>
    </div>
  );
};

export default EntryOptionsScreen;
