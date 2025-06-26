import React from 'react';
import { LogOut, User } from 'lucide-react';
import type { Account } from './AccountManager';

interface ConfirmLogoutScreenProps {
  accountToRemove: Account | null;
  removeAccount: (accountId: string) => void;
  navigateToAccountSelection: () => void;
  isLoading?: boolean;
  error?: {
    show: boolean;
    message: string;
    retryFunction?: () => void;
  };
  setError?: (error: { show: boolean; message: string; retryFunction?: () => void }) => void;
}

const ConfirmLogoutScreen: React.FC<ConfirmLogoutScreenProps> = ({
  accountToRemove,
  removeAccount,
  navigateToAccountSelection,
  isLoading = false,
}) => {
  if (!accountToRemove) {
    return null;
  }

  const handleConfirmRemoval = () => {
    removeAccount(accountToRemove.id);
  };

  const handleCancel = () => {
    navigateToAccountSelection();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card rounded-xl border border-card-border p-6 w-full max-w-sm">
        {/* Ícone */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-titulowindow font-work-sans text-typography mb-2">Remover conta</h3>
          <p className="text-campos-preenchimento text-gray2">
            Tem certeza que deseja remover a conta de{' '}
            <span className="font-semibold text-typography">{accountToRemove.name}</span> deste
            dispositivo?
          </p>
        </div>

        {/* Preview da Conta */}
        <div className="bg-muted rounded-lg p-3 mb-6 border border-card-border">
          <div className="flex items-center">
            {accountToRemove.profilePicture ? (
              <img
                src={accountToRemove.profilePicture}
                alt={accountToRemove.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent1 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="ml-3 flex-1">
              <p className="text-topicos font-work-sans text-typography">{accountToRemove.name}</p>
              <p className="text-desc-campos text-gray2">{accountToRemove.email}</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-desc-campos mt-1 ${
                  accountToRemove.role === 'provider'
                    ? 'bg-accent1/20 text-accent1'
                    : 'bg-selection/20 text-selection'
                }`}
              >
                {accountToRemove.role === 'provider' ? 'Profissional' : 'Paciente'}
              </div>
            </div>
          </div>
        </div>

        {/* Aviso */}
        <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-3 mb-6">
          <p className="text-desc-campos text-typography">
            <strong>Atenção:</strong> Esta ação irá remover a conta apenas deste dispositivo. Você
            poderá fazer login novamente a qualquer momento.
          </p>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={handleConfirmRemoval}
            className="w-full bg-destructive hover:bg-destructive/90 active:bg-destructive text-white rounded-lg p-3 transition-colors text-button-compact font-work-sans button-press-effect"
          >
            Sim, remover conta
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-muted hover:bg-gray2/30 active:bg-gray2/50 text-typography rounded-lg p-3 transition-colors text-button-compact font-work-sans button-press-effect"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutScreen;
