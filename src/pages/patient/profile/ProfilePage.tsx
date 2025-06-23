import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "@/components/ui/profile-banner";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { AccountService } from "@/api/services/AccountService";
import { ApiService } from "@/api/services/ApiService";
import { LogoutService } from "@/api/services/LogoutService";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";

interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onClick: () => void;
  hasArrow?: boolean;
  variant?: "default" | "danger" | "warning";
  disabled?: boolean;
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
  name = localStorage.getItem("fullname") ?? "Usuário",
  profileImage = localStorage.getItem("profileImage") ?? "",
  onEditProfile,
}) => {
  const navigate = useNavigate();
  const [personId, setPersonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  // Fetch person_id on mount
  useEffect(() => {
    const fetchPersonId = async () => {
      try {
        const userEntity = await ApiService.apiUserEntityRetrieve();
        setPersonId(userEntity.person_id);
      } catch (error) {
        console.error("Erro ao buscar person_id:", error);
        setError("Erro ao carregar informações do usuário.");
      }
    };
    fetchPersonId();
  }, []);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      setError("Token de autenticação não encontrado. Faça login novamente.");
      return;
    }

    setLoadingItem("logout");
    setError(null);

    try {
      await LogoutService.authLogoutCreate({ refresh });
      setSuccess("Logout realizado com sucesso!");

      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/welcome");
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.message
        ? `Erro ao fazer logout: ${error.message}`
        : "Erro ao fazer logout. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoadingItem(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!personId) {
      setError("ID do usuário não encontrado. Tente recarregar a página.");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ ATENÇÃO: Esta ação irá excluir permanentemente sua conta e todos os dados associados.\n\nEsta ação NÃO PODE ser desfeita.\n\nTem certeza que deseja continuar?",
    );

    if (!confirmed) return;

    // Segunda confirmação para ações críticas
    const doubleConfirmed = window.confirm(
      "Digite 'EXCLUIR' para confirmar a exclusão da conta:",
    );

    if (!doubleConfirmed) return;

    setLoadingItem("delete");
    setError(null);

    try {
      await AccountService.accountsDestroy();
      setSuccess("Conta excluída com sucesso!");

      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/welcome");
      }, 1500);
    } catch (error) {
      setError("Erro ao excluir conta. Tente novamente.");
      console.error(error);
    } finally {
      setLoadingItem(null);
    }
  };

  const menuSections: ProfileMenuSection[] = [
    {
      title: "Meus Dados",
      items: [
        {
          id: "diary-history",
          title: "Histórico de diários",
          subtitle: "Visualizar entradas anteriores",
          icon: "📖",
          onClick: () => navigate("/my-diaries"),
          hasArrow: true,
        },
        {
          id: "edit-profile",
          title: "Editar perfil",
          subtitle: "Alterar informações pessoais",
          icon: "✏️",
          onClick: () => onEditProfile?.(),
          hasArrow: true,
        },
      ],
    },
    {
      title: "Profissionais de Saúde",
      items: [
        {
          id: "manage-professionals",
          title: "Gerenciar profissionais",
          subtitle: "Visualizar e desvincular",
          icon: "👨‍⚕️",
          onClick: () => navigate("/manage-professionals"),
          hasArrow: true,
        },
      ],
    },
    {
      title: "Suporte e Informações",
      items: [
        {
          id: "terms",
          title: "Termos e condições",
          subtitle: "Políticas de uso",
          icon: "📋",
          onClick: () => navigate("/terms?from=profile"),
          hasArrow: true,
        },
        {
          id: "help",
          title: "Central de ajuda",
          subtitle: "Dúvidas e suporte",
          icon: "❓",
          onClick: () => navigate("/help"),
          hasArrow: true,
        },
      ],
    },
    {
      title: "Conta",
      items: [
        {
          id: "logout",
          title: "Sair da conta",
          subtitle: "Fazer logout do aplicativo",
          icon: "🚪",
          onClick: handleLogout,
          variant: "warning" as const,
          disabled: loadingItem === "logout",
        },
        {
          id: "delete",
          title: "Excluir conta",
          subtitle: "Remover conta permanentemente",
          icon: "🗑️",
          onClick: handleDeleteAccount,
          variant: "danger" as const,
          disabled: loadingItem === "delete",
        },
      ],
    },
  ];

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        break;
    }
  };

  const getItemStyles = (item: ProfileMenuItem) => {
    const baseStyles =
      "p-4 rounded-xl transition-all duration-200 cursor-pointer border";

    if (item.disabled || loadingItem) {
      return `${baseStyles} opacity-50 cursor-not-allowed bg-card border-card-border`;
    }

    switch (item.variant) {
      case "danger":
        return `${baseStyles} bg-destructive/5 border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30`;
      case "warning":
        return `${baseStyles} bg-yellow/5 border-yellow/20 hover:bg-yellow/10 hover:border-yellow/30`;
      default:
        return `${baseStyles} bg-card border-card-border hover:bg-card-muted hover:border-selection/20 hover:shadow-sm`;
    }
  };

  const getTextStyles = (item: ProfileMenuItem) => {
    switch (item.variant) {
      case "danger":
        return "text-destructive";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-card-foreground";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      {/* Profile Banner */}
      <ProfileBanner
        name={name}
        profileImage={profileImage}
        onEditClick={onEditProfile}
      />

      {/* Content Area */}
      <div className="flex-1 mt-[-20px] relative z-10">
        <div className="bg-background rounded-t-3xl min-h-full px-4 pt-6 pb-[100px]">
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {success && (
              <SuccessMessage
                message={success}
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
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="text-card-foreground font-semibold text-sm uppercase tracking-wide opacity-70 px-2">
                  {section.title}
                </h3>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={getItemStyles(item)}
                      onClick={
                        item.disabled || loadingItem ? undefined : item.onClick
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-selection/10 rounded-full flex items-center justify-center text-lg">
                            {loadingItem === item.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-selection/20 border-t-selection"></div>
                            ) : (
                              item.icon
                            )}
                          </div>

                          <div className="flex-1">
                            <h4
                              className={`font-medium text-sm ${getTextStyles(item)}`}
                            >
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-xs text-gray2 mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.hasArrow && !loadingItem && (
                          <div
                            className={`text-lg ${getTextStyles(item)} opacity-50`}
                          >
                            <span className="mgc_right_line"></span>
                          </div>
                        )}
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
    </div>
  );
};

export default ProfilePage;
