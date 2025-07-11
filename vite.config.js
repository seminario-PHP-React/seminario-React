import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
    proxy: {
      
      '/login': 'http://seminariophp.localhost:80',
      '/registro': 'http://seminariophp.localhost:80',
      '/usuarios': 'http://seminariophp.localhost:80',
      '/mazos': 'http://seminariophp.localhost:80',
      '/cartas': 'http://seminariophp.localhost:80',
      '/partidas': 'http://seminariophp.localhost:80',
      '/jugadas': 'http://seminariophp.localhost:80',
      '/estadisticas': 'http://seminariophp.localhost:80',
      '/usuario': 'http://seminariophp.localhost:80',
    }
  }
})
