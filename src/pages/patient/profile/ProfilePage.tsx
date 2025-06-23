import type React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileBanner from '@/components/ui/profile-banner';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import { AccountService } from '@/api/services/AccountService';
import { ApiService } from '@/api/services/ApiService';
import { LogoutService } from '@/api/services/LogoutService';
import { ErrorMessage } from '@/components/ui/error-message';
import { SuccessMessage } from '@/components/ui/success-message';
import { useTheme } from '@/contexts/ThemeContext';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { TextField } from '@/components/forms/text_input';
import { Switch } from '@/components/ui/switch';

interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onClick: () => void;
  hasArrow?: boolean;
  variant?: 'default' | 'danger' | 'warning';
  disabled?: boolean;
  isToggle?: boolean;
  toggleState?: boolean;
}

interface ProfileMenuSection {
  title: string;
  items: ProfileMenuItem[];
}

interface ProfilePageProps {
  name?: string;
  profileImage?: string;
  onEditProfile?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  name = localStorage.getItem('fullname') ?? 'Usuário',
  profileImage = localStorage.getItem('profileImage') ?? '',
  onEditProfile,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [personId, setPersonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [_isLoading, _setIsLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch person_id on mount
  useEffect(() => {
    const fetchPersonId = async () => {
      try {
        const userEntity = await ApiService.apiUserEntityRetrieve();
        setPersonId(userEntity.person_id);
      } catch (error) {
        console.error('Erro ao buscar person_id:', error);
        setError('Erro ao carregar informações do usuário.');
      }
    };
    fetchPersonId();
  }, []);

  const clearError = () => setError(null);

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      setError('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    setLoadingItem('logout');
    setError(null);

    try {
      await LogoutService.authLogoutCreate({ refresh });
      setSuccess('Logout realizado com sucesso!');

      setTimeout(() => {
        localStorage.clear();
        navigate('/welcome');
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? `Erro ao fazer logout: ${error.message}`
          : 'Erro ao fazer logout. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoadingItem(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!personId) {
      setError('ID do usuário não encontrado. Tente recarregar a página.');
      return;
    }

    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmText.toUpperCase() !== 'EXCLUIR') {
      return; // O botão já está desabilitado, mas mantemos a verificação
    }

    setShowDeleteDialog(false);
    setDeleteConfirmText('');
    setLoadingItem('delete');
    setError(null);

    try {
      await AccountService.accountsDestroy();
      setSuccess('Conta excluída com sucesso!');

      setTimeout(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/welcome');
      }, 1500);
    } catch (error) {
      setError('Erro ao excluir conta. Tente novamente.');
      console.error(error);
    } finally {
      setLoadingItem(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteConfirmText('');
  };

  const menuSections: ProfileMenuSection[] = [
    {
      title: 'Meus Dados',
      items: [
        {
          id: 'diary-history',
          title: 'Histórico de diários',
          subtitle: 'Visualizar entradas anteriores',
          icon: '📖',
          onClick: () => navigate('/my-diaries'),
          hasArrow: true,
        },
        {
          id: 'edit-profile',
          title: 'Editar perfil',
          subtitle: 'Alterar informações pessoais',
          icon: '✏️',
          onClick: () => onEditProfile?.(),
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Profissionais de Saúde',
      items: [
        {
          id: 'manage-professionals',
          title: 'Gerenciar profissionais',
          subtitle: 'Visualizar e desvincular',
          icon: '👨‍⚕️',
          onClick: () => navigate('/manage-professionals'),
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Suporte e Informações',
      items: [
        {
          id: 'terms',
          title: 'Termos e condições',
          subtitle: 'Políticas de uso',
          icon: '📋',
          onClick: () => navigate('/terms?from=profile'),
          hasArrow: true,
        },
        {
          id: 'help',
          title: 'Central de ajuda',
          subtitle: 'Dúvidas e suporte',
          icon: '❓',
          onClick: () => navigate('/help'),
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Conta',
      items: [
        {
          id: 'theme',
          title: 'Tema escuro',
          subtitle: theme === 'dark' ? 'Ativado' : 'Desativado',
          icon: theme === 'dark' ? '🌙' : '☀️',
          onClick: toggleTheme,
          isToggle: true,
          toggleState: theme === 'dark',
        },
        {
          id: 'logout',
          title: 'Sair da conta',
          subtitle: 'Fazer logout do aplicativo',
          icon: '🚪',
          onClick: handleLogout,
          variant: 'warning' as const,
          disabled: loadingItem === 'logout',
        },
        {
          id: 'delete',
          title: 'Excluir conta',
          subtitle: 'Remover conta permanentemente',
          icon: '🗑️',
          onClick: handleDeleteAccount,
          variant: 'danger' as const,
          disabled: loadingItem === 'delete',
        },
      ],
    },
  ];

  const getActiveNavId = () => {
    if (location.pathname.startsWith('/user-main-page')) return 'home';
    if (location.pathname.startsWith('/reminders')) return 'meds';
    if (location.pathname.startsWith('/diary')) return 'diary';
    if (location.pathname.startsWith('/emergency-user')) return 'emergency';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'home':
        navigate('/user-main-page');
        break;
      case 'meds':
        navigate('/reminders');
        break;
      case 'diary':
        navigate('/diary');
        break;
      case 'emergency':
        navigate('/emergency-user');
        break;
      case 'profile':
        break;
    }
  };

  const getItemStyles = (item: ProfileMenuItem) => {
    const baseStyles =
      'p-4 rounded-xl transition-all duration-200 cursor-pointer border shadow-sm hover:shadow-md';

    if (item.disabled || loadingItem) {
      return `${baseStyles} opacity-50 cursor-not-allowed bg-card border-card-border`;
    }

    switch (item.variant) {
      case 'danger':
        return `${baseStyles} bg-destructive/10 border-destructive/20 hover:bg-destructive/20 hover:border-destructive/30 hover:shadow-lg`;
      case 'warning':
        return `${baseStyles} bg-yellow/10 border-yellow/20 hover:bg-yellow/20 hover:border-yellow/30 hover:shadow-lg`;
      default:
        return `${baseStyles} bg-card border-card-border hover:bg-card-muted hover:border-selection/20 hover:shadow-lg`;
    }
  };

  const getTextStyles = (item: ProfileMenuItem) => {
    switch (item.variant) {
      case 'danger':
        return 'text-destructive';
      case 'warning':
        return 'text-yellow';
      default:
        return 'text-typography';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      {/* Profile Banner */}
      <ProfileBanner name={name} profileImage={profileImage} onEditClick={onEditProfile} />

      {/* Content Area */}
      <div className="flex-1 mt-[-20px] relative z-10">
        <div className="bg-background rounded-t-3xl min-h-full px-4 pt-6 pb-[100px] shadow-lg">
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {success && (
              <SuccessMessage
                message={success}
                className="animate-in slide-in-from-top-2 duration-300 shadow-sm"
              />
            )}

            {error && (
              <ErrorMessage
                message={error}
                onClose={clearError}
                onRetry={clearError}
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300 shadow-sm"
              />
            )}
          </div>

          {/* Menu Sections */}
          <div className="space-y-8">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-muted-foreground font-semibold text-sm uppercase tracking-wide opacity-70 px-2">
                  {section.title}
                </h3>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={getItemStyles(item)}
                      onClick={item.disabled || loadingItem ? undefined : item.onClick}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-selection/10 rounded-full flex items-center justify-center text-lg shadow-sm">
                            {loadingItem === item.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-selection/20 border-t-selection" />
                            ) : (
                              item.icon
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className={`font-medium text-sm ${getTextStyles(item)}`}>
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.isToggle ? (
                          <Switch checked={item.toggleState || false} onChange={item.onClick} />
                        ) : item.hasArrow && !loadingItem ? (
                          <div className={`text-lg ${getTextStyles(item)} opacity-50`}>
                            <span className="mgc_right_line" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* App Info */}
          <div className="mt-12 pt-6 border-t border-card-border text-center">
            <p className="text-muted-foreground text-xs">
              Versão 1.0.0 • Feito com ❤️ para sua saúde mental
            </p>
          </div>
        </div>
      </div>

      <BottomNavigationBar
        variant="user"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="⚠️ Excluir Conta"
        onConfirm={confirmDeleteAccount}
        onCancel={handleCloseDeleteDialog}
        confirmText="Excluir Conta"
        cancelText="Cancelar"
        confirmVariant="destructive"
        disabled={deleteConfirmText.toUpperCase() !== 'EXCLUIR'}
      >
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-destructive font-medium mb-2">
              ⚠️ ATENÇÃO: Esta ação é irreversível!
            </p>
            <p className="text-sm text-destructive-foreground">
              Esta ação irá excluir permanentemente sua conta e todos os dados associados. Esta
              operação <strong>NÃO PODE</strong> ser desfeita.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-typography mb-2">
              Para confirmar, digite <strong>EXCLUIR</strong> no campo abaixo:
            </label>
            <TextField
              id="delete-confirm-text"
              name="delete-confirm-text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Digite EXCLUIR"
              className="w-full shadow-sm"
            />
          </div>

          {deleteConfirmText && deleteConfirmText.toUpperCase() !== 'EXCLUIR' && (
            <p className="text-sm text-destructive">
              Texto incorreto. Digite exatamente "EXCLUIR" para continuar.
            </p>
          )}
        </div>
      </ConfirmDialog>
    </div>
  );
};

export default ProfilePage;
