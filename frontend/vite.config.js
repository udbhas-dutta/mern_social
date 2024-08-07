import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': { // Ensure this matches the path of your API requests
        target: 'http://localhost:5000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Optional: rewrites the path if necessary
      }
    },
    alias:{
      path: "path-browserify"
    }
  },
})
