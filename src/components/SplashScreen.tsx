// src/components/SplashScreen.tsx - Versão customizada para app de saúde mental
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // em milissegundos
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 2500 }) => {
  const [phase, setPhase] = useState(0);
  // Phases: 0 = inicial, 1 = logo aparece, 2 = título aparece, 3 = fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), duration - 600),
      setTimeout(() => onComplete(), duration),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-homeblob1 via-homeblob2 to-background-hero flex items-center justify-center relative overflow-hidden">
      {/* Blobs de fundo com as cores do seu tema */}
      <div className="absolute inset-0">
        <div className="absolute top-32 -right-32 w-80 h-80 bg-accent1/15 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-32 -left-32 w-64 h-64 bg-selection/15 rounded-full blur-2xl animate-float-slow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl animate-float-slow"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Círculos de meditação (igual ao landing) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="meditation-circles-splash">
          {[...Array(3)].map((_, i) => (
            <div
              key={`splash-circle-${i + 1}`}
              className={`circle-splash circle-splash-${i + 1} ${phase >= 1 ? 'animate-in' : ''}`}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center px-8">
        {/* Logo principal */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            phase >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-110 opacity-0 translate-y-6'
          } ${phase >= 3 ? 'scale-95 opacity-0 -translate-y-4' : ''}`}
        >
          <div className="relative mb-8">
            {/* Coração principal com glow */}
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent1 to-selection rounded-full animate-pulse-gentle" />
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-8 h-8 text-selection animate-heartbeat" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Título principal */}
          <div
            className={`transition-all duration-800 ease-out delay-300 ${
              phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${phase >= 3 ? 'opacity-0 -translate-y-2' : ''}`}
          >
            <h1 className="text-5xl font-bold text-white mb-3 font-work-sans tracking-wider">
              SAÚDE
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-accent1 to-selection mx-auto rounded-full mb-4" />
            <p className="text-white/90 text-lg font-work-sans font-light">Cuidando da sua mente</p>
          </div>
        </div>

        {/* Indicador de carregamento sutil */}
        <div
          className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
            phase >= 2 && phase < 3 ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={`dot-${i}`}
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS customizado */}
      <style>{`
        /* Animação de flutuação suave */
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        /* Animação do coração */
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.1);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(1);
          }
        }
        
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }

        /* Pulse suave */
        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        /* Círculos de meditação para splash */
        .meditation-circles-splash {
          position: relative;
          width: 300px;
          height: 300px;
        }

        .circle-splash {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          transition: all 1s ease-out;
        }

        .circle-splash.animate-in {
          opacity: 0.6;
          animation: expand-fade 3s ease-out infinite;
        }

        .circle-splash-1 {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, var(--accent1), var(--selection));
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .circle-splash-2 {
          width: 180px;
          height: 180px;
          background: linear-gradient(45deg, var(--selection), var(--homeblob1));
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .circle-splash-3 {
          width: 260px;
          height: 260px;
          background: linear-gradient(45deg, var(--homeblob1), var(--accent1));
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes expand-fade {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
