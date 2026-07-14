import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// DEPLOY_BASE is set by the GitHub Pages workflow (e.g. /rydyt-website-v1.0/)
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_BASE ?? '/',
})
