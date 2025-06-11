import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "@/components/ui/profile-banner";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { AccountService } from "@/api/services/AccountService";
import { LogoutService } from "@/api/services/LogoutService";
import { SuccessMessage } from "@/components/ui/success-message";
import { ErrorMessage } from "@/components/ui/error-message";

interface AcsProfileMenuItem {
  title: string;
  onClick: () => void;
  hasArrow?: boolean;
}

interface AcsProfilePageProps {
  name?: string;
  profileImage?: string;
  onEditProfile?: () => void;
}

const AcsProfilePage: React.FC<AcsProfilePageProps> = ({
  name = localStorage.getItem("fullname") ?? "undefined",
  profileImage = localStorage.getItem("profileImage") ?? "",
  onEditProfile,
}) => {
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const userEntity = await ApiService.apiUserEntityRetrieve();
        setProviderId(userEntity.provider_id);
      } catch (error) {
        console.error("Erro ao buscar provider_id:", error);
        setError("Erro ao carregar informações do profissional.");
      }
    };
    fetchProviderId();
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
    if (!providerId) {
      setError("ID do profissional não encontrado. Tente recarregar a página.");
      return;
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      await AccountService.apiAccountDestroy(providerId);
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

  const menuItems: AcsProfileMenuItem[] = [
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
            `Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.`,
          );
          if (!confirmed) return;
          // alert(`A conta com o ID ${providerId} será excluída.`);
          await AccountService.accountsDestroy();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/welcome");
        } catch (error) {
          setError("Erro ao excluir conta. Tente novamente.");
          console.error(error);
        }
      },
      hasArrow: false,
    },
  ];

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/acs-main-page");
        break;
      case "patients":
        navigate("/patients");
        break;
      case "emergency":
        navigate("/emergencies");
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
      <div className="z-10 h-[calc(100vh-12rem)] pt-2">
        <div className="px-4 bg-white rounded-xl shadow-sm h-full pt-4">
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
                  className={`px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors rounded-md ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={item.onClick}
                >
                  <span className="text-gray-800 font-inter text-sm">
                    {item.title}
                  </span>
                  {item.hasArrow && (
                    <span className="mgc_right_line text-md"></span>
                  )}
                </li>
                {index < menuItems.length - 1 && (
                  <div className="border-b border-gray-100 mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>

      <BottomNavigationBar
        variant="acs"
        initialActiveId="profile"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

export default AcsProfilePage;
