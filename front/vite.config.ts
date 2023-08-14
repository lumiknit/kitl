import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteYaml from "@modyfi/vite-plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteYaml()],
  base: "",
  build: {
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router", "react-router-dom"],
          reactflow: ["reactflow", "reactflow/dist/style.css"],
          yaml: ["yaml"],
          vendor: [
            "bootstrap",
            "bootstrap/dist/css/bootstrap.min.css",
            "bootstrap/dist/js/bootstrap.min.js",
            "react-hot-toast",
            "i18next",
            "i18next-browser-languagedetector",
            "react-i18next",
          ],
          icons: [
            "react-icons",
          ]
        },
      },
    },
  },
});
