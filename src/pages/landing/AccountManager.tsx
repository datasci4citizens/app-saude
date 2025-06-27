import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSelectionScreen from './AccountSelectionScreen';
import ConfirmLogoutScreen from './ConfirmLogoutScreen';
import { AuthService } from '@/api/services/AuthService';
import { LogoutService, type Logout } from '@/api';
import { ErrorMessage } from '@/components/ui/error-message';
import { useTheme } from '@/contexts/ThemeContext';
import OnboardingSlider from './OnboardingSlider';
import { AccountContext } from '@/contexts/AccountContext';

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

const CURRENT_USER_ID_KEY = 'current_user_id';
const ACCOUNTS_STORAGE_KEY = 'saved_accounts';

export function getCurrentAccount(): Account | null {
  const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
  if (!userId) return null;

  const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!accountsJson) return null;

  const accounts: Account[] = JSON.parse(accountsJson);
  return accounts.find((acc) => acc.userId === userId) || null;
}

type ScreenType = 'account-selection' | 'confirm-logout' | 'onboarding';

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
    console.log('Contas atualizadas:', accounts);
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
    } else {
      // Adiciona nova conta
      setAccounts((prev) => [...prev, newAccount]);
    }

    selectAccount(newAccount, isNew);
  };

  // Função para selecionar conta existente
  const selectAccount = async (account: Account, isNew: boolean) => {
    try {
      console.log('Selecionando conta:', account);
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

      console.log('Conta atualizada:', updatedAccount);

      setAccounts((prevAccounts) => {
        const updatedAccounts = prevAccounts.map((acc) =>
          acc.userId === account.userId ? updatedAccount : acc,
        );
        console.log('Contas atualizadas após seleção:', updatedAccounts);
        return updatedAccounts;
      });

      // Aplicar tema da conta
      setTheme(updatedAccount.useDarkMode ? 'dark' : 'light');

      // Definir tokens
      localStorage.setItem(CURRENT_USER_ID_KEY, updatedAccount.userId);
      setIsLoading(true);

      // Adiciona um pequeno delay para feedback visual
      setTimeout(() => {
        if (isNew) {
          if (updatedAccount.role === 'provider') {
            navigate('/forms-prof');
          } else if (updatedAccount.role === 'person') {
            navigate('/forms-user');
          } else {
            setCurrentScreen('onboarding');
          }
        } else {
          if (updatedAccount.role === 'provider') {
            navigate('/acs-main-page');
          } else if (updatedAccount.role === 'person') {
            navigate('/user-main-page');
          } else {
            setCurrentScreen('onboarding');
          }
        }
      }, 800);
    } catch (error) {
      console.log('Erro ao atualizar token da conta:', error);
      // Refresh token inválido, expirado ou erro de rede
      setError({
        show: true,
        message: 'Erro ao atualizar token da conta.',
        retryFunction: () => selectAccount(account, false),
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
    if (account) {
      account.refreshToken = refreshToken;
    }

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
    <AccountContext.Provider
      value={{
        accounts,
        removeAccount,
        addAccount,
        selectAccount,
        currentAccount: getCurrentAccount(),
      }}
    >
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
    </AccountContext.Provider>
  );
};

export default AccountManager;
