import type React from 'react';
import { useState } from 'react';
import GoogleSignin from '@/components/ui/google-signin';
import landingImage from '@/lib/images/landing.png';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthenticationService, type AuthTokenResponse } from '@/api';
import type { Auth } from '@/api/models/Auth';
import './loginScreen.css';
import type { Account } from '../../contexts/AppContext';

const isMobile = Capacitor.isNativePlatform();

interface LoginScreenProps {
  onAccountAdded: (accountData: Account) => void;
  isAddingAccount?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onAccountAdded,
  isAddingAccount = false,
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

      const tokenRequest = {
        token: idToken,
      };
      const loginResponse = await AuthenticationService.authLoginGoogleCreate(tokenRequest);

      handleLoginSuccess(loginResponse);
    } catch (err: unknown) {
      const full = JSON.stringify(err, Object.getOwnPropertyNames(err));
      console.error('Erro ao logar (mobile):', full);
      setError('Falha ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWeb = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      try {
        setIsLoading(true);
        const codeRequest: Auth = {
          code: code,
        };
        const loginResponse = await AuthenticationService.authLoginGoogleCreate(codeRequest);

        handleLoginSuccess(loginResponse);
      } catch (err) {
        console.error('Erro ao logar (web):', err);
        setError('Falha ao fazer login. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Erro ao logar (web):', error);
      setError('Falha ao fazer login. Por favor, tente novamente.');
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
    // Se está sendo usado pelo sistema de múltiplas contas
    const accountData: Account = {
      userId: String(loginResponse.user_id),
      lastLogin: new Date().toISOString(),
      name: loginResponse.full_name || loginResponse.social_name || 'Usuário',
      email: loginResponse.email || `user${loginResponse.user_id}@app.com`,
      profilePicture: loginResponse.profile_picture || '',
      refreshToken: loginResponse.refresh,
      accessToken: loginResponse.access,
      role:
        loginResponse.role === 'provider' || loginResponse.role === 'person'
          ? loginResponse.role
          : 'none',
      useDarkMode: loginResponse.use_dark_mode ?? false,
      socialName: loginResponse.social_name || '',
    };

    onAccountAdded(accountData);
    return;
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="onboarding-screen landing-screen relative">
      <div className="content">
        <h1>{isAddingAccount ? 'ADICIONAR CONTA' : 'SAÚDE'}</h1>
        <p className="subtitle">
          {isAddingAccount
            ? 'Faça login para adicionar uma nova conta'
            : 'Aplicativo dedicado à sua saúde mental e tratamento'}
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
              <div key={`circle-${i + 1}`} className={`circle circle-${i + 1}`} />
            ))}
          </div>
          <img src={landingImage} alt="Landing illustration" className="landing-illustration" />
        </div>

        {/* Área do botão com espaçamento adequado */}
        <div className="button-bottom mb-20">
          <GoogleSignin onClick={handleLogin} disabled={isLoading} />

          {/* Loading indicator melhorado */}
          {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-flex flex-col items-center space-y-3">
                {/* Spinner melhorado */}
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-white/30 border-t-white" />
                  <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-white animate-pulse" />
                </div>

                {/* Texto de loading */}
                <div className="text-white/90 text-sm font-medium">
                  {isAddingAccount ? 'Adicionando conta...' : 'Fazendo login...'}
                </div>

                {/* Barra de progresso animada */}
                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-loading-bar" />
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

export default LoginScreen;
