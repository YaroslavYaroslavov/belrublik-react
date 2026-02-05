import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Указываем папку docs для финальной сборки
    outDir: "docs",
    // Опционально: очищать папку перед каждой новой сборкой
    emptyOutDir: true,
  },
});
