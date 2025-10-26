/**
 * Landing Feature Module
 *
 * Main export for the landing/home page feature.
 * Exports the Landing component and its sub-components.
 *
 * @example
 * import Landing from '@/features/landing';
 * import { Hero, Features } from '@/features/landing';
 */

export { default } from "./Landing";
export { default as Landing } from "./Landing";

// Export sub-components for flexibility
export { default as Hero } from "./components/Hero";
export { default as Features } from "./components/Features";
export { default as Demo } from "./components/Demo";
export { default as Stats } from "./components/Stats";
export { default as CTA } from "./components/CTA";
export { default as Footer } from "./components/Footer";
