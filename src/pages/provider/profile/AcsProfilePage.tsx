import type React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileBanner from '@/components/ui/profile-banner';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import { AccountService } from '@/api/services/AccountService';
import { LogoutService } from '@/api/services/LogoutService';
import { SuccessMessage } from '@/components/ui/success-message';
import { ErrorMessage } from '@/components/ui/error-message';
import { ApiService } from '@/api/services/ApiService';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';

interface AcsProfileMenuItem {
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

interface AcsProfileMenuSection {
  title: string;
  items: AcsProfileMenuItem[];
}

interface AcsProfilePageProps {
  name?: string;
  profileImage?: string;
  onEditProfile?: () => void;
}

const AcsProfilePage: React.FC<AcsProfilePageProps> = ({
  name = localStorage.getItem('fullname') ?? 'ACS',
  profileImage = localStorage.getItem('profileImage') ?? '',
  onEditProfile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data states
  const [providerId, setProviderId] = useState<number | null>(null);

  // UI states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const userEntity = await ApiService.apiUserEntityRetrieve();
        setProviderId(userEntity.provider_id);
      } catch (error) {
        console.error('Erro ao buscar provider_id:', error);
        setError('Erro ao carregar informações do profissional.');
      }
    };
    fetchProviderId();
  }, []);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

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
    } catch (error) {
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
    if (!providerId) {
      setError('ID do profissional não encontrado. Tente recarregar a página.');
      return;
    }

    const confirmed = window.confirm(
      '⚠️ ATENÇÃO: Esta ação irá excluir permanentemente sua conta e todos os dados associados.\n\nEsta ação NÃO PODE ser desfeita.\n\nTem certeza que deseja continuar?',
    );

    if (!confirmed) return;

    // Segunda confirmação para ações críticas
    const doubleConfirmed = window.confirm("Digite 'EXCLUIR' para confirmar a exclusão da conta:");

    if (!doubleConfirmed) return;

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

  const menuSections: AcsProfileMenuSection[] = [
    {
      title: 'Meus Dados',
      items: [
        //{
        //  id: "edit-profile",
        //  title: "Editar perfil",
        //  subtitle: "Alterar informações pessoais",
        //  icon: "✏️",
        //  onClick: () => onEditProfile?.(),
        //  hasArrow: true,
        //},
        //  {
        //   id: "professional-info",
        //   title: "Informações profissionais",
        //   subtitle: "Registro, especialidade e dados",
        //   icon: "👨‍⚕️",
        //   onClick: () => navigate("/professional-info"),
        //   hasArrow: true,
        // },
      ],
    },
    {
      title: 'Gerenciar Pacientes',
      items: [
        {
          id: 'manage-patients',
          title: 'Gerenciar pacientes',
          subtitle: 'Visualizar e gerenciar vinculações',
          icon: '👥',
          onClick: () => navigate('/patients'),
          hasArrow: true,
        },
        // {
        //   id: "patient-requests",
        //   title: "Solicitações pendentes",
        //   subtitle: "Pedidos de vinculação",
        //   icon: "📋",
        //   onClick: () => navigate("/patient-requests"),
        //   hasArrow: true,
        // },
      ],
    },
    // {
    //   title: "Atendimento",
    //   items: [
    //     {
    //       id: "appointments",
    //       title: "Consultas agendadas",
    //       subtitle: "Visualizar agenda",
    //       icon: "📅",
    //       onClick: () => navigate("/appointments"),
    //       hasArrow: true,
    //     },
    //     {
    //       id: "emergency-alerts",
    //       title: "Alertas de emergência",
    //       subtitle: "Pedidos de ajuda recebidos",
    //       icon: "🚨",
    //       onClick: () => navigate("/emergencies"),
    //       hasArrow: true,
    //     },
    //   ],
    // },
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
    if (location.pathname.startsWith('/acs-main-page')) return 'home';
    if (location.pathname.startsWith('/appointments')) return 'consults';
    if (location.pathname.startsWith('/patients')) return 'patients';
    if (location.pathname.startsWith('/emergencies')) return 'emergency';
    if (location.pathname.startsWith('/acs-profile')) return 'profile';
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'home':
        navigate('/acs-main-page');
        break;
      case 'patients':
        navigate('/patients');
        break;
      case 'emergency':
        navigate('/emergencies');
        break;
      case 'profile':
        navigate('/acs-profile');
        break;
    }
  };

  const getItemStyles = (item: AcsProfileMenuItem) => {
    const baseStyles = 'p-4 rounded-xl transition-all duration-200 cursor-pointer border';

    if (item.disabled || loadingItem) {
      return `${baseStyles} opacity-50 cursor-not-allowed bg-card border-card-border`;
    }

    switch (item.variant) {
      case 'danger':
        return `${baseStyles} bg-destructive/5 border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30`;
      case 'warning':
        return `${baseStyles} bg-yellow/5 border-yellow/20 hover:bg-yellow/10 hover:border-yellow/30`;
      default:
        return `${baseStyles} bg-card border-card-border hover:bg-card-muted hover:border-selection/20 hover:shadow-sm`;
    }
  };

  const getTextStyles = (item: AcsProfileMenuItem) => {
    switch (item.variant) {
      case 'danger':
        return 'text-destructive';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-card-foreground';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      {/* Profile Banner */}
      <ProfileBanner name={name} profileImage={profileImage} onEditClick={onEditProfile} />

      {/* Content Area */}
      <div className="flex-1 mt-[-20px] relative z-10">
        <div className="bg-background rounded-t-3xl min-h-full px-4 pt-6 pb-[100px]">
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {success && (
              <SuccessMessage
                message={success}
                onClose={clearSuccess}
                className="animate-in slide-in-from-top-2 duration-300"
              />
            )}

            {error && (
              <ErrorMessage
                message={error}
                onClose={clearError}
                onRetry={clearError}
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              />
            )}
          </div>

          {/* Menu Sections */}
          <div className="space-y-8">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-card-foreground font-semibold text-sm uppercase tracking-wide opacity-70 px-2">
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
                          <div className="w-10 h-10 bg-selection/10 rounded-full flex items-center justify-center text-lg">
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
                              <p className="text-xs text-gray2 mt-0.5">{item.subtitle}</p>
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
            <p className="text-gray2 text-xs">
              Versão 1.0.0 • Aplicativo para profissionais de saúde
            </p>
          </div>
        </div>
      </div>

      <BottomNavigationBar
        variant="acs"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

export default AcsProfilePage;
