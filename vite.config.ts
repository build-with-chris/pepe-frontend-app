import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy deps into their own async chunks
          recharts: ["recharts"],
          radix: [
            "@radix-ui/react-tooltip",
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-toggle-group",
          ],
          supabase: ["@supabase/supabase-js"],
          ui_misc: ["sonner"],
        },
      },
    },
    // Only a warning threshold; actual size optimised via lazy routes + vendor chunks
    chunkSizeWarningLimit: 1500,
  },
});