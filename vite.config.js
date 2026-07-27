import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Local dev: forward booking API calls to the Express server (npm start in /server)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
