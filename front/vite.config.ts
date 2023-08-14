import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            "react",
            "react-dom",
            "react-router",
          ],
          reactflow: [
            "reactflow",
          ],
          vendor: [
            "bootstrap",
            "bootstrap/dist/css/bootstrap.min.css",
            "bootstrap/dist/js/bootstrap.min.js",
            "@fortawesome/fontawesome-svg-core",
            "@fortawesome/free-solid-svg-icons",
            "@fortawesome/react-fontawesome",
            "json5",
          ]
        },
      },
    },
  }
});
