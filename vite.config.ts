import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const copy404Plugin = (): Plugin => ({
  name: 'copy-404-html',
  closeBundle() {
    const distDir = path.resolve(import.meta.dirname || process.cwd(), 'dist')
    const distIndex = path.resolve(distDir, 'index.html')
    const dist404 = path.resolve(distDir, '404.html')
    if (fs.existsSync(distIndex)) {
      fs.copyFileSync(distIndex, dist404)
      console.log('Successfully generated dist/404.html for GitHub Pages SPA routing.')
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copy404Plugin()],
  base: '/habit-tracker-widget/',
})

