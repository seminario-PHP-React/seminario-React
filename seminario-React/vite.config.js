import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // cambiamos el puerto a uno clásico y confiable
  }
})
