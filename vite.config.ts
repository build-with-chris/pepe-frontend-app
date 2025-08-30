import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Workaround für Porsche Cookie Banner Loader
      "@porscheofficial/cookie-consent-banner/loader":
        "@porscheofficial/cookie-consent-banner/dist/loader",
    },
  },
  optimizeDeps: {
    include: ["@porscheofficial/cookie-consent-banner-react"],
    exclude: [
      // Damit esbuild den fehlerhaften Entry nicht anfasst
      "@porscheofficial/cookie-consent-banner/loader",
    ],
  },
});