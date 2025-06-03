import { useTheme } from "../../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border-2 border-primary-foreground/20 hover:bg-primary/90 transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <span className="text-lg">☀️</span>
      ) : (
        <span className="text-lg">🌙</span>
      )}
    </button>
  );
}
