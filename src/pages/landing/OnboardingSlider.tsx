import { useState } from 'react';
import LandingScreen from './LoginScreen';
import TermsScreen from './Terms';
import EntryOptionsScreen from './EntryOption';
import './loginScreen.css';
import { LandingThemeProvider } from '@/components/ui/LandingThemeProvider';

// Componente de Indicador de Progresso
const ProgressIndicator = ({
  currentStep,
  totalSteps,
  className = '',
}: {
  currentStep: number;
  totalSteps: number;
  className?: string;
}) => {
  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-black/20 backdrop-blur-sm rounded-full px-6 py-3">
        <div className="flex justify-center items-center space-x-4">
          {/* Indicadores visuais */}
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={`indicator-${index}-${totalSteps}`}
                className={`
                  h-2 rounded-full transition-all duration-500 ease-out
                  ${
                    index === currentStep
                      ? 'w-8 bg-white shadow-lg'
                      : index < currentStep
                        ? 'w-3 bg-white/80'
                        : 'w-2 bg-white/30'
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>

          {/* Contador textual */}
          <div className="text-white/80 text-sm font-medium">
            {currentStep + 1} de {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingSlider = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [userAccountData, setUserAccountData] = useState<any>(null); // Dados da conta temporários
  const totalSteps = 3;

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
  const handleLoginSuccess = (accountData: any) => {
    // Se usuário já tem role definido, pula onboarding e vai direto
    if (accountData.role && accountData.role !== 'none') {
      // Salvar conta e ir direto para app
      const newAccount = {
        ...accountData,
        id: Date.now().toString(),
        lastLogin: new Date().toLocaleString('pt-BR'),
      };

      // Salvar no localStorage
      const existingAccounts = JSON.parse(localStorage.getItem('saved_accounts') || '[]');
      const updatedAccounts = [...existingAccounts, newAccount];
      localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));

      // Definir tokens
      localStorage.setItem('accessToken', accountData.accessToken);
      localStorage.setItem('refreshToken', accountData.refreshToken);
      localStorage.setItem('role', accountData.role);
      localStorage.setItem('userId', accountData.userId);
      localStorage.setItem('fullname', accountData.name);
      localStorage.setItem('social_name', accountData.socialName || '');
      localStorage.setItem('profileImage', accountData.profilePicture || '');
      localStorage.setItem('useDarkMode', String(accountData.useDarkMode));
      localStorage.setItem('onboarding_completed', 'true');

      // Aplicar tema
      document.documentElement.className = accountData.useDarkMode ? 'theme-dark' : '';

      // Redirecionar
      if (accountData.role === 'provider') {
        window.location.href = '/acs-main-page';
      } else {
        window.location.href = '/user-main-page';
      }
      return;
    }

    // Se usuário não tem role, salvar dados temporariamente e continuar onboarding
    setUserAccountData(accountData);
    handleNext(); // Vai para termos
  };

  const handleComplete = (userType: string) => {
    setAnimating(true);

    // Se temos dados da conta, atualizar role
    if (userAccountData) {
      const finalAccountData = {
        ...userAccountData,
        role: userType === 'professional' ? 'provider' : 'person',
      };

      // Salvar conta completa
      const newAccount = {
        ...finalAccountData,
        id: Date.now().toString(),
        lastLogin: new Date().toLocaleString('pt-BR'),
      };

      // Salvar no localStorage
      const existingAccounts = JSON.parse(localStorage.getItem('saved_accounts') || '[]');
      const updatedAccounts = [...existingAccounts, newAccount];
      localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));

      // Definir tokens
      localStorage.setItem('accessToken', finalAccountData.accessToken);
      localStorage.setItem('refreshToken', finalAccountData.refreshToken);
      localStorage.setItem('role', finalAccountData.role);
      localStorage.setItem('userId', finalAccountData.userId);
      localStorage.setItem('fullname', finalAccountData.name);
      localStorage.setItem('social_name', finalAccountData.socialName || '');
      localStorage.setItem('profileImage', finalAccountData.profilePicture || '');
      localStorage.setItem('useDarkMode', String(finalAccountData.useDarkMode));
      localStorage.setItem('onboarding_completed', 'true');

      // Aplicar tema
      document.documentElement.className = finalAccountData.useDarkMode ? 'theme-dark' : '';
    }

    // Adiciona um pequeno delay para feedback visual
    setTimeout(() => {
      if (userType === 'professional') {
        window.location.href = '/forms-prof';
      } else {
        window.location.href = '/forms-user';
      }
    }, 800);
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
    <LandingThemeProvider>
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
          <LandingScreen
            onNext={handleNext}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onAccountAdded={handleLoginSuccess} // Callback para login
            showBackButton={false} // Não mostrar botão voltar no onboarding
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

        {/* Indicador de Progresso Global */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          className="animate-fade-in"
        />

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
    </LandingThemeProvider>
  );
};

export default OnboardingSlider;
