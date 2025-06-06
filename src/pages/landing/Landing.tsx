import React from "react";
import GoogleSignin from "@/components/ui/google-signin";
import landingImage from "@/lib/images/landing.png";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { AuthService } from "@/api/services/AuthService";
import { Capacitor } from "@capacitor/core";
import { useGoogleLogin } from "@react-oauth/google";
import { AccountService } from "@/api";

const isMobile = Capacitor.isNativePlatform();

interface LandingScreenProps {
  onNext: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNext }) => {
  const loginMobile = async () => {
    try {
      await GoogleAuth.signOut(); // força novo login completo
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;
      localStorage.removeItem("accessToken");
      const { access, refresh, role } = await AuthService.authLoginGoogleCreate(
        {
          token: idToken,
        },
      );

      handleLoginSuccess(access, refresh, role);
    } catch (err: any) {
      const message = err?.message || err;
      const full = JSON.stringify(err, Object.getOwnPropertyNames(err));

      alert("Erro ao logar:\n" + message + "\n\nDetalhes:\n" + full);
      console.error("Erro ao logar (mobile):", err);
    }
  };

  const loginWeb = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        localStorage.removeItem("accessToken");
        const { access, refresh, role } =
          await AuthService.authLoginGoogleCreate({
            code: code,
          });

        handleLoginSuccess(access, refresh, role);
      } catch (err) {
        console.error("Erro ao logar (web):", err);
      }
    },
  });

  const handleLogin = () => {
    if (isMobile) {
      loginMobile();
    } else {
      loginWeb();
    }
  };

  const handleLoginSuccess = async (
    access: string,
    refresh: string,
    role: string,
  ) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("role", role);

    try {
      const accountData = await AccountService.apiAccountList();
      localStorage.setItem("fullname", accountData.full_name || "");
    } catch (err) {
      console.error("Erro ao buscar conta:", err);
      localStorage.setItem("fullname", "");
    }

    if (role === "provider") {
      window.location.href = "/acs-main-page";
    } else if (role === "person") {
      window.location.href = "/user-main-page";
    } else {
      onNext();
    }
  };


  return (
    <div className="onboarding-screen landing-screen">
      <div className="content">
        <h1>SAÚDE</h1>
        <p className="subtitle">
          Aplicativo dedicado à sua saúde mental e tratamento
        </p>

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

        <div className="button-bottom">
          <GoogleSignin onClick={handleLogin} />
        </div>

        <div className="progress-indicator">
          <div className="indicator active" />
          <div className="indicator" />
          <div className="indicator" />
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
