import React, { useState } from 'react';
import { User, Plus, MoreVertical, LogOut, Moon, Sun } from 'lucide-react';
import type { Account } from './AccountManager';

interface AccountSelectionScreenProps {
  accounts: Account[];
  selectAccount: (account: Account) => void;
  confirmRemoveAccount: (account: Account) => void;
  navigateToLogin: () => void;
  isLoading?: boolean;
  error?: {
    show: boolean;
    message: string;
    retryFunction?: () => void;
  };
  setError?: (error: { show: boolean; message: string; retryFunction?: () => void }) => void;
}

const AccountSelectionScreen: React.FC<AccountSelectionScreenProps> = ({
  accounts,
  selectAccount,
  confirmRemoveAccount,
  navigateToLogin,
  isLoading = false,
}) => {
  const [showAccountOptions, setShowAccountOptions] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle tema geral (não afeta contas individuais)
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.className = newTheme ? 'theme-dark' : '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-titulo font-work-sans text-typography">Escolha sua conta</h1>
            <p className="text-desc-titulo text-gray2 mt-2">
              Selecione uma conta existente ou adicione uma nova
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray2/20 hover:bg-gray2/30 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-typography" />
            ) : (
              <Moon className="w-5 h-5 text-typography" />
            )}
          </button>
        </div>
      </div>

      {/* Lista de Contas */}
      <div className="px-4 py-6 space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="relative bg-card rounded-xl border border-card-border hover:border-selection/50 transition-all duration-200 overflow-hidden"
          >
            <div
              onClick={() => !isLoading && selectAccount(account)}
              className={`flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                {account.profilePicture ? (
                  <img
                    src={account.profilePicture}
                    alt={account.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-card-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent1 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                {/* Indicador de role */}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                    account.role === 'provider' ? 'bg-accent1' : 'bg-selection'
                  }`}
                />
              </div>

              {/* Informações da conta */}
              <div className="flex-1 ml-4">
                <h3 className="text-topicos2 font-work-sans text-typography">{account.name}</h3>
                <p className="text-campos-preenchimento2 text-gray2">{account.email}</p>
                <p className="text-desc-campos text-gray2 mt-1">
                  Último acesso: {account.lastLogin}
                </p>
              </div>

              {/* Badge do tipo de conta */}
              <div
                className={`px-3 py-1 rounded-full text-desc-campos font-medium mr-2 ${
                  account.role === 'provider'
                    ? 'bg-accent1/20 text-accent1'
                    : 'bg-selection/20 text-selection'
                }`}
              >
                {account.role === 'provider' ? 'Profissional' : 'Paciente'}
              </div>
            </div>

            {/* Botão de opções - SEMPRE VISÍVEL */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAccountOptions(showAccountOptions === account.id ? null : account.id);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              title="Opções da conta"
            >
              <MoreVertical className="w-4 h-4 text-gray2" />
            </button>

            {/* Menu de opções */}
            {showAccountOptions === account.id && (
              <div className="absolute top-12 right-4 bg-card border border-card-border rounded-lg shadow-lg z-10 min-w-[140px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmRemoveAccount(account);
                    setShowAccountOptions(null);
                  }}
                  className="w-full flex items-center px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Remover conta
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Botão Adicionar Nova Conta */}
        <button
          onClick={navigateToLogin}
          disabled={isLoading}
          className={`w-full bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active rounded-xl p-4 transition-all duration-200 button-press-effect group ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-button-primary font-work-sans text-white">
              {isLoading ? 'Aguarde...' : 'Adicionar nova conta'}
            </span>
          </div>
        </button>
      </div>

      {/* Clique fora para fechar menu */}
      {showAccountOptions && (
        <div className="fixed inset-0 z-5" onClick={() => setShowAccountOptions(null)} />
      )}
    </div>
  );
};

export default AccountSelectionScreen;
