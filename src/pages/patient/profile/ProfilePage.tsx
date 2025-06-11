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
  title: string;
  onClick: () => void;
  hasArrow?: boolean;
}

interface ProfilePageProps {
  name?: string;
  profileImage?: string;
  onEditProfile?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  name = localStorage.getItem("fullname") ?? "undefined",
  profileImage = localStorage.getItem("profileImage") ?? "",
  onEditProfile,
}) => {
  const navigate = useNavigate();
  const [personId, setPersonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      setError("Token de autenticação não encontrado. Faça login novamente.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await LogoutService.authLogoutCreate({ refresh });
      setSuccess("Logout realizado com sucesso!");

      // Clear tokens and navigate after showing success message
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
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!personId) {
      setError("ID do usuário não encontrado. Tente recarregar a página.");
      return;
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a sua conta? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      await AccountService.accountsDestroy();
      setSuccess("Conta excluída com sucesso!");

      // Clear tokens and navigate after showing success message
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/welcome");
      }, 1500);
    } catch (error) {
      setError("Erro ao excluir conta. Tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems: ProfileMenuItem[] = [
    {
      title: "Histórico de diários",
      onClick: () => navigate("/my-diaries"),
      hasArrow: true,
    },
    {
      title: "Adicionar profissional da saúde",
      onClick: () => navigate("/add-professional"),
      hasArrow: true,
    },
    {
      title: "Termos e condições",
      onClick: () => navigate("/terms"),
      hasArrow: true,
    },
    {
      title: "Logout",
      onClick: handleLogout,
      hasArrow: false,
    },
    {
      title: "Excluir conta",
      onClick: async () => {
        try {
          const confirmed = window.confirm(
            `Tem certeza que deseja excluir a sua conta? Esta ação não pode ser desfeita.`,
          );
          if (!confirmed) return;
          // alert(`A conta com o ID ${personId} será excluída.`);
          await AccountService.accountsDestroy();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/welcome");
        } catch (error) {
          alert("Erro ao excluir conta. Tente novamente.");
          console.error(error);
        }
      },
      hasArrow: false,
    },
  ];

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Profile Banner */}
      <ProfileBanner
        name={name}
        profileImage={profileImage}
        onEditClick={onEditProfile}
      />

      {/* Menu Items */}
      <div className="z-10 h-[calc(100vh-12rem)] mt-[-15px]">
        <div className="px-4 bg-primary rounded-xl shadow-sm h-full pt-4">
          {/* Success Message */}
          {success && <SuccessMessage message={success} className="mb-4" />}

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onClose={clearError}
              onRetry={clearError}
              variant="destructive"
              className="mb-4"
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-4 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-selected mr-2"></div>
              <span className="text-typography text-sm">Processando...</span>
            </div>
          )}

          <ul className="overflow-hidden">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <li
                  className={`px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray1 transition-colors rounded-md ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={item.onClick}
                >
                  <span className="text-typography font-inter text-sm">
                    {item.title}
                  </span>
                  {item.hasArrow && (
                    <span className="mgc_right_line text-md"></span>
                  )}
                </li>
                {index < menuItems.length - 1 && (
                  <div className="border-b border-gray1 mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>

      <BottomNavigationBar
        variant="user"
        initialActiveId="profile"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

export default ProfilePage;
