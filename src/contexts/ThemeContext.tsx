import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { AccountService } from '@/api/services/AccountService';

// Define the possible theme types
type Theme = 'light' | 'dark';

// Define the shape of the theme context
type ThemeContextType = {
  theme: Theme; // Current theme value
  toggleTheme: () => void; // Function to toggle between light and dark themes
  setTheme: (theme: Theme) => void; // Function to set a specific theme
};

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component to manage and provide theme context to child components.
 *
 * @param {React.ReactNode} children - The child components that will have access to the theme context.
 * @returns {JSX.Element} The ThemeProvider wrapping its children with context.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // State to hold the current theme, with initial value from localStorage or default to "light"
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const useDarkMode = localStorage.getItem('useDarkMode');
      // Convert string to boolean and then to theme
      if (useDarkMode === 'true') {
        return 'dark';
      } else if (useDarkMode === 'false') {
        return 'light';
      }
      // Fallback to old key for compatibility
      const savedTheme = localStorage.getItem('app-theme');
      return (savedTheme as Theme) || 'light';
    }
    return 'light'; // Default value for server-side rendering
  });

  // Effect to apply the theme class to the document and update localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark'); // Usar sua classe customizada
    } else {
      root.classList.remove('theme-dark'); // Remover sua classe customizada
    }

    // Update both localStorage keys
    localStorage.setItem('useDarkMode', String(theme === 'dark'));
    localStorage.setItem('app-theme', theme); // Keep for compatibility
  }, [theme]); // Trigger effect when theme changes

  /**
   * Toggle between light and dark themes.
   */
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update localStorage immediately
    localStorage.setItem('useDarkMode', String(newTheme === 'dark'));

    // Call API to sync with backend
    try {
      await AccountService.accountThemeCreate();
    } catch (error) {
      console.error('Erro ao salvar tema no servidor:', error);
      // Theme change still works locally even if API fails
    }
  };

  // Provide the current theme state and functions to the context
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to access the theme context.
 *
 * @returns {ThemeContextType} The current theme context values.
 * @throws {Error} Throws an error if used outside of a ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider'); // Error message in Portuguese
  }
  return context; // Return the theme context
}
