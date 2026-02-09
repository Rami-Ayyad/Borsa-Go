import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // GitHub Pages base path for repo: https://rami-ayyad.github.io/Borsa-Go/
  base: "/Borsa-Go/",
  build: {
    // Output to `docs` so GitHub Pages can serve from main/docs
    outDir: "docs",
  },
});
