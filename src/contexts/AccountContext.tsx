import { createContext, useContext } from 'react';
import type { Account } from '../pages/landing/AccountManager';

export interface AccountContextType {
  accounts: Account[];
  removeAccount: (userId: string) => void;
  addAccount: (account: Omit<Account, 'lastLogin'>, isNew: boolean) => void;
  selectAccount: (account: Account, isNew: boolean) => void;
  currentAccount: Account | null;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount deve ser usado dentro de AccountProvider');
  }
  return context;
};
