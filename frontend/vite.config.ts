import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fromSrc = (dir: string) =>
  fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Same absolute imports as before (e.g. "features/tasks/...") – keep in sync with tsconfig.app.json "paths"
    alias: {
      app: fromSrc("app"),
      features: fromSrc("features"),
      shared: fromSrc("shared"),
    },
  },
  server: {
    // The backend's CORS / FRONTEND_URL defaults expect the frontend on port 3000
    port: 3000,
  },
});
