import React from 'react';
import GoogleSignin from "@/components/ui/google-signin";
import landingImage from '@/lib/images/landing.png';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

interface LandingScreenProps {
  onNext: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNext }) => {
  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const tokens = await axios.post(
          'http://localhost:8000/auth/login/google/',
          { code },
          { withCredentials: true }
        );
        const { access, refresh, role } = tokens.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('role', role);

        if (role === 'provider') {
          window.location.href = '/acs-main-page';
        } else if (role === 'person') {
          window.location.href = '/user-main-page';
        } else {
          onNext();
        }
      } catch (err) {
        console.error('Erro ao logar:', err);
      }
    },
    flow: 'auth-code',
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
        <div className="button-bottom">
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
