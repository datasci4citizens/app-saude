import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray1 text-typography"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <span>☀️</span> : <span>🌙</span>}
    </button>
  );
}
