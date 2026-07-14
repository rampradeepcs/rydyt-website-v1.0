import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// DEPLOY_BASE is set by the GitHub Pages workflow (e.g. /rydyt-website-v1.0/)
// PORT is assigned by the Claude Code preview harness (autoPort)
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_BASE ?? '/',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  preview: {
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
  },
})
