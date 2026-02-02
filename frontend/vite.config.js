import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuration Vite – BTS SIO
 * Définit l'entrée, le port et le proxy optionnel vers l'API Laravel.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Optionnel : proxy vers le backend Laravel pour éviter CORS en dev
    // proxy: { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true } },
  },
})
