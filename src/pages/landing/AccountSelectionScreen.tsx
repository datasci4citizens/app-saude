import React, { useState } from 'react';
import { User, Plus, MoreVertical, LogOut, Moon, Sun } from 'lucide-react';
import { useApp, type Account } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

interface AccountSelectionScreenProps {
  accounts: Account[];
  selectAccount: (account: Account, isNew: boolean) => void;
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
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null); // Estado para loading por conta
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  async function overwriteSelectAccount(account: Account) {
    if (loadingAccount || isLoading) return; // Previne cliques múltiplos

    console.log('Selecionando conta:', account.name);
    setLoadingAccount(account.userId); // Mostra loading para esta conta

    try {
      // Aguarda selectAccount completar
      await new Promise<void>((resolve) => {
        selectAccount(account, false);
        // Aguarda um pouco para o processo interno terminar
        setTimeout(() => resolve(), 1000);
      });

      // Agora navega baseado na role da conta (não no currentAccount)
      // todo: if account is in selection but not finished onbording, redirect to onboarding
      if (account.role === 'provider') {
        navigate('/acs-main-page');
      } else {
        navigate('/user-main-page');
      }
    } catch (error) {
      console.error('Erro ao selecionar conta:', error);
    } finally {
      setLoadingAccount(null);
    }
  }

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
            {theme == 'light' ? (
              <Sun className="w-5 h-5 text-typography" />
            ) : (
              <Moon className="w-5 h-5 text-typography" />
            )}
          </button>
        </div>
      </div>

      {/* Lista de Contas */}
      <div className="px-4 py-6 space-y-3">
        {accounts.map((account) => {
          const isAccountLoading = loadingAccount === account.userId;

          return (
            <div
              key={account.userId}
              className={`relative bg-card rounded-xl border border-card-border transition-all duration-200 overflow-hidden ${
                isAccountLoading
                  ? 'border-selection/50 shadow-lg scale-[0.98]'
                  : 'hover:border-selection/50 hover:shadow-sm'
              }`}
            >
              <div
                onClick={() => !isLoading && !isAccountLoading && overwriteSelectAccount(account)}
                className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${
                  isLoading || isAccountLoading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-muted/50 active:scale-[0.99]'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {account.profilePicture ? (
                    <img
                      src={account.profilePicture}
                      alt={account.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 transition-all duration-200 border-card-border`}
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full bg-accent1 flex items-center justify-center transition-all duration-200 ${
                        isAccountLoading ? 'animate-pulse' : ''
                      }`}
                    >
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Indicador de role - Ajustado para não esmagar o avatar */}
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-card transform translate-x-1 translate-y-1 transition-all duration-200 ${
                      account.role === 'provider' ? 'bg-accent1' : 'bg-selection'
                    } ${isAccountLoading ? 'animate-pulse' : ''}`}
                  />
                </div>
                {/* Informações da conta */}
                <div className="flex-1 ml-4 min-w-0">
                  {' '}
                  {/* min-w-0 é crucial para permitir truncamento */}
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3
                      className={`text-topicos2 font-work-sans text-typography transition-colors duration-200 ${
                        isAccountLoading ? 'text-selection' : ''
                      }`}
                    >
                      {account.name}
                    </h3>
                    {/* Badge ao lado do nome */}
                    <div
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        account.role === 'provider'
                          ? 'bg-accent1/20 text-accent1'
                          : 'bg-selection/20 text-selection'
                      } ${isAccountLoading ? 'animate-pulse' : ''}`}
                    >
                      {account.role === 'provider' ? 'Profissional' : 'Paciente'}
                    </div>
                  </div>
                  {/* Email com truncamento */}
                  <p className="text-campos-preenchimento2 text-gray2 truncate">{account.email}</p>
                  <p className="text-desc-campos text-gray2 mt-1">
                    {isAccountLoading ? 'Acessando...' : `Último acesso: ${account.lastLogin}`}
                  </p>
                </div>
                {/* Loading indicator */}
                {isAccountLoading && (
                  <div className="mr-2 flex-shrink-0">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-selection border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Botão de opções - SEMPRE VISÍVEL */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAccountLoading) {
                    setShowAccountOptions(
                      showAccountOptions === account.userId ? null : account.userId,
                    );
                  }
                }}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${
                  isAccountLoading
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-muted/50 hover:scale-110'
                }`}
                title="Opções da conta"
                disabled={isAccountLoading}
              >
                <MoreVertical className="w-4 h-4 text-gray2" />
              </button>

              {/* Menu de opções */}
              {showAccountOptions === account.userId && !isAccountLoading && (
                <div className="absolute top-12 right-4 bg-card border border-card-border rounded-lg shadow-lg z-10 min-w-[140px] animate-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmRemoveAccount(account);
                      setShowAccountOptions(null);
                    }}
                    className="w-full flex items-center px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors text-sm rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Remover conta
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Botão Adicionar Nova Conta */}
        <button
          onClick={navigateToLogin}
          disabled={isLoading || !!loadingAccount}
          className={`w-full bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active rounded-xl p-4 transition-all duration-200 group ${
            isLoading || !!loadingAccount
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-center">
            <div
              className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 transition-transform duration-200 ${
                !(isLoading || !!loadingAccount)
                  ? 'group-hover:scale-110 group-hover:rotate-90'
                  : ''
              }`}
            >
              <Plus className="w-5 h-5 text-white transition-transform duration-200" />
            </div>
            <span className="text-button-primary font-work-sans text-white">
              {isLoading || !!loadingAccount ? 'Aguarde...' : 'Adicionar nova conta'}
            </span>
          </div>
        </button>
      </div>

      {/* Loading overlay global */}
      {(isLoading || !!loadingAccount) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 shadow-lg animate-in zoom-in-50 duration-200">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-selection border-t-transparent" />
              <span className="text-typography font-work-sans">
                {loadingAccount ? 'Acessando conta...' : 'Carregando...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Clique fora para fechar menu */}
      {showAccountOptions && (
        <div className="fixed inset-0 z-5" onClick={() => setShowAccountOptions(null)} />
      )}
    </div>
  );
};

export default AccountSelectionScreen;
