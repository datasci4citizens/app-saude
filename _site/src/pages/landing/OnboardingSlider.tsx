import { useState } from 'react';
import LoginScreen from './LoginScreen';
import TermsScreen from './Terms';
import EntryOptionsScreen from './EntryOption';
import './loginScreen.css';
import type { Account } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingSliderProps {
  addAccount: (accountData: Account, isNew: boolean) => void;
}

const OnboardingSlider = (props: OnboardingSliderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [userAccountData, setUserAccountData] = useState<Account | null>(null); // Dados da conta temporários
  const totalSteps = 3;
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < totalSteps - 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setAnimating(false);
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setAnimating(false);
      }, 500);
    }
  };

  // Callback para quando login é bem-sucedido
  const handleLoginSuccess = (accountData: Account) => {
    console.log('Login bem-sucedido:', accountData);
    if (accountData.role && accountData.role !== 'none') {
      props.addAccount(accountData, false);
      if (accountData.role === 'provider') {
        navigate('/acs-main-page');
      } else {
        navigate('/user-main-page');
      }
      return;
    }

    console.log('Usuário sem role, salvando dados temporariamente');
    // Se usuário não tem role, salvar dados temporariamente e continuar onboarding
    setUserAccountData(accountData);
    handleNext(); // Vai para termos
  };

  const handleComplete = async (userType: string) => {
    setAnimating(true);

    // Se temos dados da conta, atualizar role
    if (userAccountData) {
      const finalAccountData: Account = {
        ...userAccountData,
        role: userType === 'professional' ? 'provider' : 'person',
        lastLogin: new Date().toLocaleString('pt-BR'),
      };

      // Aguarda o addAccount terminar
      await new Promise<void>((resolve) => {
        props.addAccount(finalAccountData, true);
        setTimeout(() => resolve(), 1000);
      });

      // Só navega depois que o processo terminou
      if (userType === 'professional') {
        navigate('/forms-prof');
      } else {
        navigate('/forms-user');
      }
    } else {
      console.error('Dados da conta não disponíveis para completar onboarding');
    }

    setAnimating(false);
  };

  // Função para ir diretamente para um step (útil para desenvolvimento/debug)
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(step);
        setAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="onboarding-slider bg-homeblob2 relative overflow-hidden">
      <div className="slider-background" />

      {/* Container principal dos slides */}
      <div
        className={`
          slider-container transition-transform duration-500 ease-in-out
          ${animating ? 'pointer-events-none' : ''}
        `}
        style={{
          transform: `translateY(-${currentStep * (100 / totalSteps)}%)`,
          // Adiciona um leve blur durante a transição para suavizar
          filter: animating ? 'blur(1px)' : 'blur(0px)',
        }}
      >
        {/* Slide 1: Landing */}
        <LoginScreen
          onAccountAdded={handleLoginSuccess} // Callback para login
          isAddingAccount={false} // Flag indicando que é onboarding
        />

        {/* Slide 2: Terms */}
        <TermsScreen
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        {/* Slide 3: Entry Options */}
        <EntryOptionsScreen
          onComplete={handleComplete}
          onPrevious={handlePrevious}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </div>

      {/* Overlay de carregamento durante animações */}
      {animating && (
        <div className="fixed inset-0 bg-black/10 z-40 pointer-events-none transition-opacity duration-300" />
      )}

      {/* Debug controls (remover em produção) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-black/50 rounded-lg p-2 space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <button
              key={`debug-btn-${index}-${totalSteps}`}
              onClick={() => goToStep(index)}
              className={`
                px-2 py-1 rounded text-xs font-medium transition-colors
                ${
                  currentStep === index
                    ? 'bg-white text-black'
                    : 'bg-white/20 text-white hover:bg-white/40'
                }
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnboardingSlider;
