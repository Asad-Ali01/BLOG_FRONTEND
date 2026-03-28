import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }
          if (id.includes("react-router")) {
            return "router";
          }
          if (id.includes("@reduxjs") || id.includes("react-redux") || id.includes("redux-persist")) {
            return "state";
          }
          if (id.includes("antd") || id.includes("@ant-design") || id.includes("rc-")) {
            return "antd";
          }
          if (id.includes("@tinymce") || id.includes("tinymce")) {
            return "editor";
          }
          if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("motion")) {
            return "ui-libs";
          }
          return "vendor";
        },
      },
    },
  },
})
