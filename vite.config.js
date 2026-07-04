import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon-64.png'],
      manifest: {
        name: 'DEANY',
        short_name: 'DEANY',
        description: 'Learn Islam, beautifully.',
        start_url: '/?app=1',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBFAF6',
        theme_color: '#22A39A',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}'],
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // Tailwind is loaded from CDN at runtime - cache it so the app styles offline
            urlPattern: ({ url }) => url.origin === 'https://cdn.tailwindcss.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'tailwind-cdn', expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
