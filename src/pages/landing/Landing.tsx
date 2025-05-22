import React from "react";
import GoogleSignin from "@/components/ui/google-signin";
import landingImage from "@/lib/images/landing.png";
import { useGoogleLogin } from "@react-oauth/google";
import useSWRMutation from "swr/mutation";

interface LandingScreenProps {
  onNext: () => void;
}

const loginWithGoogle = async (
  url: string,
  { arg }: { arg: { code: string } },
) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: arg.code }),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  return response.json(); // retorna { access, refresh, role }
};

const LandingScreen: React.FC<LandingScreenProps> = ({ onNext }) => {
  const { trigger } = useSWRMutation(
    "http://localhost:8000/auth/login/google/",
    loginWithGoogle,
  );

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const tokens = await trigger({ code });
        const { access, refresh, role } = tokens;

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("role", role);

        if (role === "provider") {
          window.location.href = "/acs-main-page";
        } else if (role === "person") {
          window.location.href = "/user-main-page";
        } else {
          onNext();
        }
      } catch (err) {
        console.error("Erro ao logar:", err);
      }
    },
    flow: "auth-code",
  });

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
        <div className="button-bottom bg-offwhite">
          <GoogleSignin onClick={login} />
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
