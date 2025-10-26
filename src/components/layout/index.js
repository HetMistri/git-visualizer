/**
 * Layout Components
 *
 * Barrel export for layout-level components.
 * These are typically positioned globally and used across features.
 *
 * @example
 * import { ThemeToggle, HomeButton } from '@/components/layout';
 */

export { default as ThemeToggle } from "./ThemeToggle";
export { default as HomeButton } from "./HomeButton";

// If you also need named exports, re-export from source files directly.
// Avoid duplicating the same symbol name in this barrel to prevent build errors.
