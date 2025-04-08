//
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // 確保相對路徑
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, '/src') // 正確指向 renderer/src
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
})
