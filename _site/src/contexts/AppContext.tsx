import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AuthService } from '@/api/services/AuthService';
import { LogoutService, type Logout } from '@/api';

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

export interface AppContextType {
  // Account related
  accounts: Account[];
  currentAccount: Account | null;
  logoutCurrentAccount: () => Promise<void>;
  addAccount: (account: Omit<Account, 'lastLogin'>, isNew: boolean) => void;
  selectAccount: (account: Account, isNew: boolean) => Promise<void>;
  removeAccount: (userId: string) => Promise<void>;
  confirmRemoveAccount: (account: Account) => void;
  accountToRemove: Account | null;
  navigateToLogin: () => void;
  navigateToAccountSelection: () => void;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  isLoading: boolean;
  error: {
    show: boolean;
    message: string;
    retryFunction?: () => void;
  };
  setError: (error: { show: boolean; message: string; retryFunction?: () => void }) => void;

  // Theme related
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const CURRENT_USER_ID_KEY = 'current_user_id';
const ACCOUNTS_STORAGE_KEY = 'saved_accounts';
const THEME_STORAGE_KEY = 'app_theme';

// Função utilitária para usar fora de componentes (getCurrentAccount exportada)
export function getCurrentAccount(): Account | null {
  const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
  if (!userId) return null;

  const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!accountsJson) return null;

  try {
    const accounts: Account[] = JSON.parse(accountsJson);
    return accounts.find((acc) => acc.userId === userId) || null;
  } catch {
    return null;
  }
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

// Hooks específicos para compatibilidade
export const useAccount = () => {
  const context = useApp();
  return {
    accounts: context.accounts,
    currentAccount: context.currentAccount,
    addAccount: context.addAccount,
    selectAccount: context.selectAccount,
    removeAccount: context.removeAccount,
    confirmRemoveAccount: context.confirmRemoveAccount,
    accountToRemove: context.accountToRemove,
    navigateToLogin: context.navigateToLogin,
    navigateToAccountSelection: context.navigateToAccountSelection,
    currentScreen: context.currentScreen,
    setCurrentScreen: context.setCurrentScreen,
    isLoading: context.isLoading,
    error: context.error,
    setError: context.setError,
  };
};

export const useTheme = () => {
  const context = useApp();
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    toggleTheme: context.toggleTheme,
  };
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountToRemove, setAccountToRemove] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [logoutTrigger, setLogoutTrigger] = useState(0);
  const [error, setError] = useState<{
    show: boolean;
    message: string;
    retryFunction?: () => void;
  }>({
    show: false,
    message: '',
    retryFunction: undefined,
  });

  const applyThemeToDOM = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
  };

  // ✅ Função para atualizar tema no localStorage de todas as contas
  const updateAccountThemeInStorage = (userId: string, useDarkMode: boolean) => {
    const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        const updatedAccounts = accounts.map((acc: Account) =>
          acc.userId === userId ? { ...acc, useDarkMode } : acc,
        );
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
      } catch (error) {
        console.error('Erro ao atualizar tema da conta no localStorage:', error);
      }
    }
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    console.log('Mudando tema para:', newTheme);

    // Atualizar estado do tema
    setThemeState(newTheme);

    // Salvar tema global
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Aplicar no DOM
    applyThemeToDOM(newTheme);

    const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (currentUserId) {
      const useDarkMode = newTheme === 'dark';

      // Atualizar no estado
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) => (acc.userId === currentUserId ? { ...acc, useDarkMode } : acc)),
      );

      // Atualizar no localStorage
      updateAccountThemeInStorage(currentUserId, useDarkMode);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggle theme:', theme, '→', newTheme);
    setTheme(newTheme);
  };

  // useEffect para gerenciar navegação automaticamente baseado no número de contas
  useEffect(() => {
    const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);

    console.log('Verificando estado:');
    console.log('- Accounts:', accounts.length);
    console.log('- Current User ID:', !!currentUserId);
    console.log('- Current Screen:', currentScreen);

    if (accounts.length === 0) {
      console.log('Nenhuma conta -> onboarding');
      setCurrentScreen('onboarding');
      localStorage.removeItem(CURRENT_USER_ID_KEY);
      setTheme('light');
    } else if (accounts.length > 0 && !currentUserId) {
      console.log('Contas disponíveis mas nenhuma logada -> account-selection');
      setCurrentScreen('account-selection');
    }
  }, [accounts.length, logoutTrigger]);

  // Carregar dados iniciais
  useEffect(() => {
    console.log('Carregando dados iniciais...');

    // Carregar contas
    const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (savedAccounts) {
      try {
        const parsedAccounts: Account[] = JSON.parse(savedAccounts);
        setAccounts(parsedAccounts);
        console.log('Contas carregadas:', parsedAccounts.length);
      } catch (error) {
        console.error('Erro ao carregar contas:', error);
      }
    }

    const currentAccount = getCurrentAccount();
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark';

    let themeToApply: 'light' | 'dark' = 'light';

    if (currentAccount) {
      // Prioridade 1: Tema da conta atual
      themeToApply = currentAccount.useDarkMode ? 'dark' : 'light';
      console.log('Aplicando tema da conta atual:', themeToApply);
    } else if (savedTheme) {
      // Prioridade 2: Tema salvo globalmente
      themeToApply = savedTheme;
      console.log('Aplicando tema salvo:', themeToApply);
    }

    setThemeState(themeToApply);
    applyThemeToDOM(themeToApply);
  }, []);

  // Salvar contas
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      console.log('Contas salvas no localStorage:', accounts.length);
    } else {
      localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    }
  }, [accounts]);

  useEffect(() => {
    console.log('Tema atual:', theme);
  }, [theme]);

  const logoutCurrentAccount = async () => {
    const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!currentUserId) {
      console.log('Nenhum usuário logado para fazer logout');
      return;
    }

    const currentAccount = accounts.find((acc) => acc.userId === currentUserId);
    if (!currentAccount?.refreshToken) {
      console.log('Token de refresh não encontrado');
      localStorage.removeItem(CURRENT_USER_ID_KEY);
      setLogoutTrigger((prev) => prev + 1); // Força re-check
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      console.log('Simulando delay de logout...');
    }, 1000);
    setIsLoading(false);

    console.log('Removendo current user do localStorage...');
    localStorage.removeItem(CURRENT_USER_ID_KEY);

    setLogoutTrigger((prev) => prev + 1);

    console.log('Logout concluído. Conta permanece na lista.');
  };

  const addAccount = (accountData: Omit<Account, 'lastLogin'>, isNew: boolean) => {
    const newAccount: Account = {
      ...accountData,
      lastLogin: new Date().toLocaleString('pt-BR'),
    };

    const existingAccountIndex = accounts.findIndex((acc) => acc.userId === newAccount.userId);

    if (existingAccountIndex >= 0) {
      const updatedAccounts = [...accounts];
      updatedAccounts[existingAccountIndex] = newAccount;
      setAccounts(updatedAccounts);
    } else {
      setAccounts((prev) => [...prev, newAccount]);
    }

    contextValue.selectAccount(newAccount, isNew);
  };

  const selectAccount = async (account: Account, isNew: boolean) => {
    try {
      setIsLoading(true);
      console.log('Selecionando conta:', account.name);

      const response = await AuthService.authTokenRefreshCreate({
        access: '',
        refresh: account.refreshToken,
      });

      const updatedAccount = {
        ...account,
        accessToken: response.access,
        lastLogin: new Date().toLocaleString('pt-BR'),
      };

      setAccounts((prevAccounts) => {
        const updatedAccounts = prevAccounts.map((acc) =>
          acc.userId === account.userId ? updatedAccount : acc,
        );
        return updatedAccounts;
      });

      const accountTheme = updatedAccount.useDarkMode ? 'dark' : 'light';
      console.log('Aplicando tema da conta selecionada:', accountTheme);
      setThemeState(accountTheme);
      applyThemeToDOM(accountTheme);
      localStorage.setItem(CURRENT_USER_ID_KEY, updatedAccount.userId);
    } catch (error) {
      console.error('Erro ao atualizar token da conta:', error);
      localStorage.removeItem(CURRENT_USER_ID_KEY);

      setError({
        show: true,
        message: 'Erro ao atualizar token da conta.',
        retryFunction: () => contextValue.selectAccount(account, false),
      });

      const updatedAccounts = accounts.filter((acc) => acc.userId !== account.userId);
      setAccounts(updatedAccounts);

      alert(
        `A sessão da conta "${account.name}" expirou ou é inválida. A conta foi removida da lista.`,
      );

      contextValue.removeAccount(account.userId);
      setCurrentScreen('onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAccount = async (accountId: string) => {
    console.log('Iniciando removeAccount...');

    // Cleanup imediato para garantir
    const immediateCleanup = () => {
      console.log('Fazendo cleanup imediato...');
      setIsLoading(false);

      const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
      if (currentUserId === accountId) {
        localStorage.removeItem(CURRENT_USER_ID_KEY);
      }

      setAccounts((prev) => prev.filter((acc) => acc.userId !== accountId));
      setAccountToRemove(null);
    };

    // força cleanup após 5 segundos
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout - forçando cleanup');
      immediateCleanup();
    }, 5000);

    try {
      setIsLoading(true);
      const account = accounts.find((acc) => acc.userId === accountId);
      const refreshToken = account?.refreshToken || '';
      const logoutBody: Logout = {
        refresh: refreshToken,
      };

      await Promise.race([
        LogoutService.authLogoutCreate(logoutBody),
        new Promise((_, reject) => setTimeout(() => reject('timeout'), 8000)),
      ]);
    } catch (error) {
      console.log('Erro no logout:', error);
    } finally {
      clearTimeout(safetyTimeout);
      immediateCleanup();
    }
  };

  const navigateToLogin = () => setCurrentScreen('onboarding');
  const navigateToAccountSelection = () => setCurrentScreen('account-selection');

  const confirmRemoveAccount = (account: Account) => {
    setAccountToRemove(account);
    setCurrentScreen('confirm-logout');
  };

  const getCurrentAccountFromContext = (): Account | null => {
    const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!userId) return null;
    return accounts.find((acc) => acc.userId === userId) || null;
  };

  const contextValue: AppContextType = {
    accounts,
    currentAccount: getCurrentAccountFromContext(),
    logoutCurrentAccount,
    addAccount,
    selectAccount,
    removeAccount,
    confirmRemoveAccount,
    accountToRemove,
    navigateToLogin,
    navigateToAccountSelection,
    currentScreen,
    setCurrentScreen,
    isLoading,
    error,
    setError,
    theme,
    setTheme,
    toggleTheme,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
