import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/", // root deployment path (critical for Vercel)
  publicDir: "public", // ensures static assets are copied correctly
  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true, // clean dist before each build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          reactflow: ["@xyflow/react"],
          animations: ["gsap", "framer-motion"],
        },
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
