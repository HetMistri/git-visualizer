/**
 * ThemeToggle Component
 *
 * A fixed-position theme toggle button that switches between light and dark modes.
 * Uses the ThemeContext for global theme management.
 *
 * @example
 * <ThemeToggle />
 */

import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = ({ className = "" }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
