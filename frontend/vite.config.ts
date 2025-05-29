import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 3000,
    fs: {
      strict: false
    },
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://backend:8001',
        changeOrigin: true
      }
    }
  }
})
