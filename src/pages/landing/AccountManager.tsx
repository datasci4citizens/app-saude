import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSelectionScreen from './AccountSelectionScreen';
import ConfirmLogoutScreen from './ConfirmLogoutScreen';
import LoginScreen from './LoginScreen';
import { LandingThemeProvider } from '@/components/ui/LandingThemeProvider';
import { AuthService } from '@/api/services/AuthService';
import { LogoutService, type Logout } from '@/api';
import { ErrorMessage } from '@/components/ui/error-message';

export interface Account {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  lastLogin: string;
  refreshToken: string;
  accessToken: string;
  role: 'provider' | 'person';
  useDarkMode: boolean;
  userId: string;
  socialName?: string;
}

type ScreenType = 'account-selection' | 'login' | 'confirm-logout';

const ACCOUNTS_STORAGE_KEY = 'saved_accounts';

const AccountManager: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountToRemove, setAccountToRemove] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    show: boolean;
    message: string;
    retryFunction?: () => void;
  }>({
    show: false,
    message: '',
    retryFunction: undefined,
  });

  // Carregar contas salvas na inicialização
  useEffect(() => {
    const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (savedAccounts) {
      const parsedAccounts: Account[] = JSON.parse(savedAccounts);
      setAccounts(parsedAccounts);

      // Se tem contas salvas, vai para seleção
      if (parsedAccounts.length > 0) {
        setCurrentScreen('account-selection');
      }
    }
  }, []);

  // Salvar contas no localStorage sempre que mudar
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } else {
      localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    }
  }, [accounts]);

  // Função para adicionar nova conta (chamada pelo LoginScreen)
  const addAccount = (accountData: Omit<Account, 'id' | 'lastLogin'>) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
      lastLogin: new Date().toLocaleString('pt-BR'),
    };

    // Verifica se a conta já existe (por userId)
    const existingAccountIndex = accounts.findIndex((acc) => acc.userId === newAccount.userId);

    if (existingAccountIndex >= 0) {
      // Atualiza conta existente
      const updatedAccounts = [...accounts];
      updatedAccounts[existingAccountIndex] = newAccount;
      setAccounts(updatedAccounts);
    } else {
      // Adiciona nova conta
      setAccounts((prev) => [...prev, newAccount]);
    }

    // Aplicar tema da conta
    document.documentElement.className = newAccount.useDarkMode ? 'theme-dark' : '';

    // Definir tokens no localStorage para compatibilidade
    localStorage.setItem('accessToken', newAccount.accessToken);
    localStorage.setItem('refreshToken', newAccount.refreshToken);
    localStorage.setItem('role', newAccount.role);
    localStorage.setItem('userId', newAccount.userId);
    localStorage.setItem('fullname', newAccount.name);
    localStorage.setItem('social_name', newAccount.socialName || '');
    localStorage.setItem('profileImage', newAccount.profilePicture || '');
    localStorage.setItem('useDarkMode', String(newAccount.useDarkMode));

    // Marcar onboarding como completo
    localStorage.setItem('onboarding_completed', 'true');

    // Navegar para a página principal do app baseado no role
    if (newAccount.role === 'provider') {
      navigate('/acs-main-page');
    } else {
      navigate('/user-main-page');
    }
  };

  // Função para selecionar conta existente
  const selectAccount = async (account: Account) => {
    try {
      const response = await AuthService.authTokenRefreshCreate({
        access: '',
        refresh: account.refreshToken,
      });

      localStorage.setItem('accessToken', response.access);

      // Atualiza último login
      const updatedAccount = {
        ...account,
        accessToken: response.access,
        lastLogin: new Date().toLocaleString('pt-BR'),
      };

      const updatedAccounts = accounts.map((acc) => (acc.id === account.id ? updatedAccount : acc));

      setAccounts(updatedAccounts);

      // Aplicar tema da conta
      document.documentElement.className = updatedAccount.useDarkMode ? 'theme-dark' : '';

      // Definir tokens no localStorage
      localStorage.setItem('accessToken', updatedAccount.accessToken);
      localStorage.setItem('refreshToken', updatedAccount.refreshToken);
      localStorage.setItem('role', updatedAccount.role);
      localStorage.setItem('userId', updatedAccount.userId);
      localStorage.setItem('fullname', updatedAccount.name);
      localStorage.setItem('social_name', updatedAccount.socialName || '');
      localStorage.setItem('profileImage', updatedAccount.profilePicture || '');
      localStorage.setItem('useDarkMode', String(updatedAccount.useDarkMode));

      // Navegar para a página principal do app baseado no role
      if (updatedAccount.role === 'provider') {
        navigate('/acs-main-page');
      } else {
        navigate('/user-main-page');
      }
    } catch (error) {
      // Refresh token inválido, expirado ou erro de rede
      console.error('Erro ao atualizar token da conta:', error);

      // Remover conta com refresh token inválido das contas salvas
      const updatedAccounts = accounts.filter((acc) => acc.id !== account.id);
      setAccounts(updatedAccounts);

      // Informar usuário sobre o problema
      alert(
        `A sessão da conta "${account.name}" expirou ou é inválida. A conta foi removida da lista. Você precisará fazer login novamente.`,
      );

      removeAccount(account.id);
      setCurrentScreen('login');
    }
  };

  // Função para remover conta
  const removeAccount = async (accountId: string) => {
    const logoutBody: Logout = {
      refresh: accounts.find((acc) => acc.id === accountId)?.refreshToken || '',
    };
    await LogoutService.authLogoutCreate(logoutBody);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
    setAccountToRemove(null);

    // Se não sobrou nenhuma conta, vai para login
    const remainingAccounts = accounts.filter((acc) => acc.id !== accountId);
    if (remainingAccounts.length === 0) {
      setCurrentScreen('login');
      localStorage.clear();
    } else {
      setCurrentScreen('account-selection');
    }
  };

  // Navegação
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToAccountSelection = () => setCurrentScreen('account-selection');

  const confirmRemoveAccount = (account: Account) => {
    setAccountToRemove(account);
    setCurrentScreen('confirm-logout');
  };

  // Props compartilhadas
  const sharedProps = {
    accounts,
    selectAccount,
    removeAccount,
    confirmRemoveAccount,
    accountToRemove,
    navigateToLogin,
    navigateToAccountSelection,
  };

  // Render da tela atual
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'account-selection':
        return <AccountSelectionScreen {...sharedProps} />;

      case 'login':
        return (
          <LandingThemeProvider>
            <div className="onboarding-slider bg-homeblob2 relative overflow-hidden">
              <div className="slider-background" />
              <LoginScreen
                onNext={() => {}} // Não usado neste contexto
                currentStep={0}
                totalSteps={1}
                onAccountAdded={addAccount} // Callback para adicionar conta
                showBackButton={accounts.length > 0} // Mostrar botão voltar se tem contas
                onBack={navigateToAccountSelection} // Voltar para seleção
                isAddingAccount={accounts.length > 0} // Flag indicando que está adicionando conta
              />
            </div>
          </LandingThemeProvider>
        );

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
