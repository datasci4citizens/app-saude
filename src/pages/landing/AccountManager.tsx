import React from 'react';
import AccountSelectionScreen from './AccountSelectionScreen';
import ConfirmLogoutScreen from './ConfirmLogoutScreen';
import OnboardingSlider from './OnboardingSlider';
import { ErrorMessage } from '@/components/ui/error-message';
import { useApp } from '@/contexts/AppContext';

const AccountManager: React.FC = () => {
  const {
    accounts,
    addAccount,
    selectAccount,
    removeAccount,
    confirmRemoveAccount,
    accountToRemove,
    navigateToLogin,
    navigateToAccountSelection,
    currentScreen,
    isLoading,
    error,
    setError,
  } = useApp();

  // Props compartilhadas para os componentes filhos
  const sharedProps = {
    accounts,
    addAccount,
    selectAccount,
    removeAccount,
    confirmRemoveAccount,
    accountToRemove,
    navigateToLogin,
    navigateToAccountSelection,
  };

  // Render da tela atual
  const renderCurrentScreen = () => {
    console.log('Tela atual:', currentScreen);
    switch (currentScreen) {
      case 'account-selection':
        return <AccountSelectionScreen {...sharedProps} />;

      case 'onboarding':
        return <OnboardingSlider {...sharedProps} />;

      case 'confirm-logout':
        return <ConfirmLogoutScreen {...sharedProps} />;

      default:
        return <AccountSelectionScreen {...sharedProps} />;
    }
  };

  return (
    <div className="font-work-sans">
      {error.show && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <ErrorMessage
            message={error.message}
            onClose={() => setError({ show: false, message: '', retryFunction: undefined })}
            onRetry={error.retryFunction}
            variant="destructive"
            retryable={!!error.retryFunction}
          />
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-selection border-t-transparent" />
              <span className="text-typography font-work-sans">Acessando conta...</span>
            </div>
          </div>
        </div>
      )}

      {renderCurrentScreen()}
    </div>
  );
};

export default AccountManager;
