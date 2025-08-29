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
    "/auth": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
    "/events": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
    "/tickets": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  },
},

});
