
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const mode = process.env.NODE_ENV;

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: "info",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: false,
    sourcemap: true,
  },
  server: {
    port: 8080
  }
});
