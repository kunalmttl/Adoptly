import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // * When the frontend sees a request starting with '/images'...
      '/images': {
        // * ...forward it to the backend server.
        target: 'http://localhost:3000',
        // * This is necessary for the proxy to work correctly.
        changeOrigin: true,
      },
    }
  }
})