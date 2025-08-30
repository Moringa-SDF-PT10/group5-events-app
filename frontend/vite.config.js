import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  server: {
  proxy: {
    "/tickets": {
      target: "https://group5-events-app.onrender.com",
      changeOrigin: true,
      secure: false,
    },
    "/auth": {
      target: "https://group5-events-app.onrender.com",
      changeOrigin: true,
      secure: false,
    },
    "/events": {
      target: "https://group5-events-app.onrender.com",
      changeOrigin: true,
      secure: false,
    },
  },
},


});
