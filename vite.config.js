import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-icon.svg'],
      manifest: {
        name: '(RE)SOURCES RELATIONNELLES',
        short_name: 'RE)SOURCES',
        description: 'Plateforme de ressources pour améliorer vos relations humaines',
        theme_color: '#4f46e5',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        lang: 'fr',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Met en cache tous les assets statiques (JS, CSS, fonts, images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Routes de l'API exclues du cache offline
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Cache les ressources API en "network first" — données fraîches si connecté
            urlPattern: /^https?:\/\/.*\/api\/v1\/(ressources|categories|tags|activites)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    allowedHosts: ['pleat-isolation-radiation.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173,
    allowedHosts: [
      'localhost',
      'pleat-isolation-radiation.ngrok-free.dev'
    ]
  }
})
