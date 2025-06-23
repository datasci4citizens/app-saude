import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import '../globals.css'; // Import the global styles

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
      const savedTheme = localStorage.getItem('app-theme');
      return (savedTheme as Theme) || 'light'; // Return saved theme or default to "light"
    }
    return 'light'; // Default value for server-side rendering
  });

  // Effect to apply the theme class to the document and update localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark'); // Add dark theme class
    } else {
      root.classList.remove('theme-dark'); // Remove dark theme class
    }
    localStorage.setItem('app-theme', theme); // Store the current theme in localStorage
  }, [theme]); // Trigger effect when theme changes

  /**
   * Toggle between light and dark themes.
   */
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

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
