import React, { useState } from "react";
import GoogleSignin from "@/components/ui/google-signin";
import landingImage from "@/lib/images/landing.png";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { AuthService } from "@/api/services/AuthService";
import { Capacitor } from "@capacitor/core";
import { useGoogleLogin } from "@react-oauth/google";
import { type AuthTokenResponse } from "@/api";
import { type Auth } from "@/api/models/Auth";

const isMobile = Capacitor.isNativePlatform();

interface LandingScreenProps {
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onNext,
  currentStep,
  totalSteps,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginMobile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await GoogleAuth.signOut(); // força novo login completo
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;
      localStorage.removeItem("accessToken");

      const tokenRequest = {
        token: idToken,
      };
      const loginResponse =
        await AuthService.authLoginGoogleCreate(tokenRequest);

      handleLoginSuccess(loginResponse);
    } catch (err: any) {
      const full = JSON.stringify(err, Object.getOwnPropertyNames(err));
      console.error("Erro ao logar (mobile):", full);
      alert("Erro ao logar (mobile): " + full);
      setError("Falha ao fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWeb = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        localStorage.removeItem("accessToken");
        const codeRequest: Auth = {
          code: code,
        };
        const loginResponse =
          await AuthService.authLoginGoogleCreate(codeRequest);

        handleLoginSuccess(loginResponse);
      } catch (err) {
        console.error("Erro ao logar (web):", err);
        setError("Falha ao fazer login. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Erro ao logar (web):", error);
      setError("Falha ao fazer login. Por favor, tente novamente.");
      setIsLoading(false);
    },
  });

  const handleLogin = () => {
    if (isMobile) {
      loginMobile();
    } else {
      loginWeb();
    }
  };

  const handleLoginSuccess = async (loginResponse: AuthTokenResponse) => {
    localStorage.setItem("accessToken", loginResponse.access);
    localStorage.setItem("refreshToken", loginResponse.refresh);
    localStorage.setItem("role", loginResponse.role);
    localStorage.setItem("userId", String(loginResponse.user_id));
    localStorage.setItem("fullname", loginResponse.full_name || "");
    localStorage.setItem("social_name", loginResponse.social_name || "");
    localStorage.setItem("profileImage", loginResponse.profile_picture || "");

    // Usar o role para decidir navegação
    if (loginResponse.role === "provider") {
      window.location.href = "/acs-main-page";
    } else if (loginResponse.role === "person") {
      window.location.href = "/user-main-page";
    } else {
      // Se o usuário não tem role definido, continua no onboarding
      onNext();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="onboarding-screen landing-screen relative">
      <div className="content">
        <h1>SAÚDE</h1>
        <p className="subtitle">
          Aplicativo dedicado à sua saúde mental e tratamento
        </p>

        {/* Error Message Display */}
        {error && (
          <div className="bg-destructive border-destructive rounded-lg p-4 text-white mt-4 mx-4">
            <div className="flex justify-between items-start">
              <p className="text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-white hover:text-white text-lg font-bold ml-2"
                aria-label="Fechar erro"
              >
                ×
              </button>
            </div>
            <div className="mt-2">
              <button
                onClick={() => setError(null)}
                className="text-sm text-white hover:text-white underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        <div className="illustration-container">
          <div className="meditation-circles">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`circle circle-${i + 1}`} />
            ))}
          </div>
          <img
            src={landingImage}
            alt="Landing illustration"
            className="landing-illustration"
          />
        </div>

        {/* Área do botão com espaçamento adequado */}
        <div className="button-bottom mb-20">
          {" "}
          {/* Adicionada margem bottom para evitar sobreposição */}
          <GoogleSignin onClick={handleLogin} disabled={isLoading} />
          {/* Loading indicator melhorado */}
          {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-flex flex-col items-center space-y-3">
                {/* Spinner melhorado */}
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-white/30 border-t-white"></div>
                  <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-white animate-pulse"></div>
                </div>

                {/* Texto de loading */}
                <div className="text-white/90 text-sm font-medium">
                  Fazendo login...
                </div>

                {/* Barra de progresso animada */}
                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-loading-bar"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animações CSS customizadas */}
      <style>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        /* Animação para os pontos do progress */
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingScreen;
