import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Plugin untuk menyalin folder cases ke public
const copyCasesPlugin = () => ({
  name: 'copy-cases',
  closeBundle() {
    const srcCases = path.resolve(__dirname, '../cases')
    const destCases = path.resolve(__dirname, 'public/cases')
    
    if (fs.existsSync(srcCases)) {
      if (!fs.existsSync(destCases)) {
        fs.mkdirSync(destCases, { recursive: true })
      }
      fs.readdirSync(srcCases).forEach(file => {
        if (file.endsWith('.json')) {
          fs.copyFileSync(
            path.join(srcCases, file),
            path.join(destCases, file)
          )
        }
      })
      console.log('✅ Cases copied to public/cases')
    }
  }
})

export default defineConfig({
  plugins: [react(), copyCasesPlugin()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true }
    }
  }
})
