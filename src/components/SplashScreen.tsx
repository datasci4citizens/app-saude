import React, { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-[#3b82f6] flex items-center justify-center relative overflow-hidden">
      {/* Conteúdo principal */}
      <div className="relative z-10 text-center px-8">
        {/* Logo principal */}
        <div
          className={`transition-all duration-1000 ease-out transform ${phase >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-110 opacity-0 translate-y-6'
            } ${phase >= 3 ? 'scale-95 opacity-0 -translate-y-4' : ''}`}
        >
          {/* Título principal */}
          <div
            className={`transition-all duration-800 ease-out delay-300 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } ${phase >= 3 ? 'opacity-0 -translate-y-2' : ''}`}
          >
            <h1 className="text-5xl font-bold text-white mb-3 font-work-sans tracking-wider">
              SAÚDE
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-accent1 to-selection mx-auto rounded-full mb-4" />
          </div>
          <div className="relative mt-48">
            {/* Heart Animation */}
            <div className="heart-animation-container">
              <div className="loader">
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS customizado */}
      <style>{`
        /* Heart Animation */
        .heart-animation-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          position: relative;
        }

        .loader {
          height: 175px;
          width: 175px;
          position: relative;
          margin: auto;
        }

        .loader div:nth-child(1) {
          background-color: var(--accent1);
          height: 100px;
          width: 62px;
          position: absolute;
          margin: auto;
          top: 0;
          bottom: 0;
          left: 20px;
          right: 0;
          transform: rotate(45deg);
          border-radius: 50px 50px 5px 5px;
          transform-origin: 50% 69%;
          animation: flip1 2.5s linear infinite; /* Reduced from 4s to 2.5s */
        }

        @keyframes flip1 {
          25% {
            transform: rotate(45deg) rotateX(180deg);
          }
          50% {
            transform: rotate(45deg) rotateX(180deg);
          }
          75% {
            transform: rotate(45deg);
          }
        }

        .loader div:nth-child(2) {
          height: 100px;
          width: 62px;
          background-color: var(--accent1);
          position: absolute;
          top: 75px;
          left: 66px;
          transform: rotate(135deg);
          transform-origin: 50% 31%;
          border-radius: 5px 5px 50px 50px;
          animation: flip2 2.5s 0.6s linear infinite; /* Reduced from 4s to 2.5s and delay from 1s to 0.6s */
        }

        @keyframes flip2 {
          25% {
            transform: rotate(135deg) rotateX(180deg);
          }
          50% {
            transform: rotate(135deg) rotateX(180deg);
          }
          75% {
            transform: rotate(135deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;