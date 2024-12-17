import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from any IP address
    port: 4173,        // Make sure this matches the port exposed in Docker
  },
})
