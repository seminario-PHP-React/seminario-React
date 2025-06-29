import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // cambiamos el puerto a uno clásico y confiable
    proxy: {
      // Redirige todas las requests que empiecen con /usuarios a tu backend
      '/usuarios': 'http://localhost:8000',
      // Si tienes otros endpoints, agrégalos aquí
      // '/registro': 'http://localhost:8000',
    }
  }
})
