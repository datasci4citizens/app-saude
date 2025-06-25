import type React from 'react';
import { useEffect, useRef, useCallback } from 'react';

interface LandingThemeProviderProps {
  children: React.ReactNode;
}

/**
 * LandingThemeProvider - Força o modo de cor root (light theme) para páginas de landing
 * Este componente garante que as páginas de landing sempre usem o tema claro,
 * independentemente da preferência do usuário salva no localStorage.
 */
export function LandingThemeProvider({ children }: LandingThemeProviderProps) {
  const originalTheme = useRef<string | null>(null);
  const originalUseDarkMode = useRef<string | null>(null);
  const isRestored = useRef(false);

  const restoreOriginalTheme = useCallback(() => {
    if (isRestored.current) return;

    const root = document.documentElement;
    root.removeAttribute('data-landing-theme');

    console.log('LandingThemeProvider: Restaurando tema original');

    // Restaura o tema original se era dark
    if (originalUseDarkMode.current === 'true' || originalTheme.current === 'dark') {
      root.classList.add('theme-dark');
    }

    isRestored.current = true;
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Salva o tema atual antes de modificar
    originalTheme.current = localStorage.getItem('app-theme');
    originalUseDarkMode.current = localStorage.getItem('useDarkMode');

    // Remove qualquer classe de tema dark e força o light theme
    root.classList.remove('theme-dark');

    // Adiciona um marcador para identificar que estamos nas landing pages
    root.setAttribute('data-landing-theme', 'true');

    console.log('LandingThemeProvider: Forçando tema claro');

    // Cleanup function para quando o componente for desmontado
    return () => {
      if (!isRestored.current) {
        restoreOriginalTheme();
      }
    };
  }, [restoreOriginalTheme]);

  // Garante que o tema permaneça light durante toda a renderização
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const root = document.documentElement;
          if (root.classList.contains('theme-dark') && root.hasAttribute('data-landing-theme')) {
            console.log('LandingThemeProvider: Impedindo mudança para tema escuro');
            root.classList.remove('theme-dark');
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Adiciona um listener para quando navegar para fora das landing pages
  useEffect(() => {
    const handleNavigation = () => {
      const isStillOnLanding =
        window.location.pathname === '/' ||
        window.location.pathname === '/login' ||
        window.location.pathname === '/welcome' ||
        window.location.pathname.includes('/terms');

      if (!isStillOnLanding && !isRestored.current) {
        restoreOriginalTheme();
      }
    };

    // Escuta mudanças na URL
    window.addEventListener('popstate', handleNavigation);

    // Também escuta mudanças no histórico (para navegação programática)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      setTimeout(handleNavigation, 0);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(handleNavigation, 0);
    };

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [restoreOriginalTheme]);

  return <>{children}</>;
}
