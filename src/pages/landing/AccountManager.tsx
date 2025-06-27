import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSelectionScreen from './AccountSelectionScreen';
import ConfirmLogoutScreen from './ConfirmLogoutScreen';
import { AuthService } from '@/api/services/AuthService';
import { LogoutService, type Logout } from '@/api';
import { ErrorMessage } from '@/components/ui/error-message';
import { useTheme } from '@/contexts/ThemeContext';
import OnboardingSlider from './OnboardingSlider';

export interface Account {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  lastLogin: string;
  refreshToken: string;
  accessToken: string;
  role: 'provider' | 'person' | 'none';
  useDarkMode: boolean;
  socialName?: string;
}

type ScreenType = 'account-selection' | 'confirm-logout' | 'onboarding';

const ACCOUNTS_STORAGE_KEY = 'saved_accounts';

const AccountManager: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountToRemove, setAccountToRemove] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme();
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

      if (parsedAccounts.length > 0) {
        setCurrentScreen('account-selection');
      } else {
        setCurrentScreen('onboarding');
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
  const addAccount = (accountData: Omit<Account, 'lastLogin'>, isNew: boolean) => {
    const newAccount: Account = {
      ...accountData,
      lastLogin: new Date().toLocaleString('pt-BR'),
    };

    // Verifica se a conta já existe (por userId)
    const existingAccountIndex = accounts.findIndex((acc) => acc.userId === newAccount.userId);

    if (existingAccountIndex >= 0) {
      // Atualiza conta existente
      const updatedAccounts = [...accounts];
      updatedAccounts[existingAccountIndex] = newAccount;
      setAccounts(updatedAccounts);
      localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));
    } else {
      // Adiciona nova conta
      setAccounts((prev) => [...prev, newAccount]);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, newAccount]));
    }

    if (isNew) {
      // Adiciona um pequeno delay para feedback visual
      setTimeout(() => {
        if (newAccount.role === 'provider') {
          window.location.href = '/forms-prof';
        } else if (newAccount.role === 'person') {
          window.location.href = '/forms-user';
        } else {
          // Se não tem role, vai para onboarding
          console.log('Usuário sem role, indo para onboarding');
          setCurrentScreen('onboarding');
        }
      }, 800);
    } else {
      selectAccount(newAccount); // Seleciona a nova conta automaticamente
    }
  };

  // Função para selecionar conta existente
  const selectAccount = async (account: Account) => {
    try {
      const response = await AuthService.authTokenRefreshCreate({
        access: '',
        refresh: account.refreshToken,
      });

      // Atualiza último login
      const updatedAccount = {
        ...account,
        accessToken: response.access,
        lastLogin: new Date().toLocaleString('pt-BR'),
      };

      const updatedAccounts = accounts.map((acc) =>
        acc.userId === account.userId ? updatedAccount : acc,
      );
      setAccounts(updatedAccounts);

      // Aplicar tema da conta
      setTheme(updatedAccount.useDarkMode ? 'dark' : 'light');

      // Definir tokens no localStorage
      localStorage.setItem('accessToken', updatedAccount.accessToken);
      localStorage.setItem('refreshToken', updatedAccount.refreshToken);
      localStorage.setItem('role', updatedAccount.role);
      localStorage.setItem('userId', updatedAccount.userId);
      localStorage.setItem('fullname', updatedAccount.name);
      localStorage.setItem('social_name', updatedAccount.socialName || '');
      localStorage.setItem('profileImage', updatedAccount.profilePicture || '');
      localStorage.setItem('useDarkMode', String(updatedAccount.useDarkMode));
      localStorage.setItem('onboarding_completed', 'true');

      setIsLoading(true);

      // Navegar para a página principal do app baseado no role
      if (updatedAccount.role === 'provider') {
        navigate('/acs-main-page');
      } else if (updatedAccount.role === 'person') {
        navigate('/user-main-page');
      } else {
        // Role is none, redirect to onboarding
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      // Refresh token inválido, expirado ou erro de rede
      setError({
        show: true,
        message: 'Erro ao atualizar token da conta.',
        retryFunction: () => selectAccount(account),
      });
      console.error('Erro ao atualizar token da conta:', error);

      // Remover conta com refresh token inválido das contas salvas
      const updatedAccounts = accounts.filter((acc) => acc.userId !== account.userId);
      setAccounts(updatedAccounts);

      // Informar usuário sobre o problema
      alert(
        `A sessão da conta "${account.name}" expirou ou é inválida. A conta foi removida da lista. Você precisará fazer login novamente.`,
      );

      removeAccount(account.userId);
      setCurrentScreen('onboarding');
    }
  };

  // Função para remover conta
  const removeAccount = async (accountId: string) => {
    const account = accounts.find((acc) => acc.userId === accountId);
    const refreshToken = account?.refreshToken || '';
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', account?.accessToken || '');
    const logoutBody: Logout = {
      refresh: refreshToken,
    };

    setIsLoading(true);
    try {
      await LogoutService.authLogoutCreate(logoutBody);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }

    setAccounts((prev) => prev.filter((acc) => acc.userId !== accountId));
    setAccountToRemove(null);

    // Se não sobrou nenhuma conta, vai para login
    const remainingAccounts = accounts.filter((acc) => acc.userId !== accountId);
    sharedProps.accounts = remainingAccounts; // Atualiza contas compartilhadas
    console.log('Contas restantes:', remainingAccounts);
    if (remainingAccounts.length === 0) {
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen('account-selection');
    }
  };

  // Navegação
  const navigateToLogin = () => setCurrentScreen('onboarding');
  const navigateToAccountSelection = () => setCurrentScreen('account-selection');

  const confirmRemoveAccount = (account: Account) => {
    setAccountToRemove(account);
    setCurrentScreen('confirm-logout');
  };

  // Props compartilhadas
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
