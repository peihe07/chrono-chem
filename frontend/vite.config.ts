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
    port: 5173,
    fs: {
      strict: false,
      allow: ['..']  // 允許訪問上級目錄
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true
      }
    }
  },
  publicDir: 'public',  // 明確指定公共資源目錄
  assetsInclude: ['**/*.glb']  // 確保 .glb 文件被識別為資源
})
