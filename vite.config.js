import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PWA is hand-rolled (static public/manifest.webmanifest + public/sw.js)
// instead of vite-plugin-pwa, so the build has no workbox/native-binary
// dependency and runs on any Node version / OS.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
