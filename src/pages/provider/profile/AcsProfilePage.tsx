import React, { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = () => {
    setError(null);
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
      <div className="flex-1 px-8 py-6 pb-24">
        {/* Success Message */}
        {success && <SuccessMessage message={success} className="mb-6" />}

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onClose={clearError}
            variant="destructive"
            className="mb-6"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8 mb-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground text-sm">
              Processando...
            </span>
          </div>
        )}

        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const isDestructiveAction = item.title === "Excluir conta";
            const baseClasses = `w-full px-6 py-4 flex justify-between items-center cursor-pointer transition-all duration-200 rounded-lg border font-medium text-sm ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`;

            const variantClasses = isDestructiveAction
              ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10 active:bg-destructive/15 text-destructive"
              : "border-border bg-card hover:bg-muted/50 active:bg-muted/70 text-card-foreground";

            return (
              <button
                key={index}
                className={`${baseClasses} ${variantClasses}`}
                onClick={item.onClick}
                disabled={isLoading}
              >
                <span>{item.title}</span>
                {item.hasArrow && (
                  <span className="mgc_right_line text-muted-foreground text-lg"></span>
                )}
              </button>
            );
          })}
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
