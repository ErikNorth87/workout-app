import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const pagesBase = process.env.GITHUB_PAGES === 'true' ? '/workout-app/' : '/'

export default defineConfig({
  base: pagesBase,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      devOptions: { enabled: true },
      manifest: {
        name: 'Workout Tracker',
        short_name: 'Workouts',
        description: '5/3/1 + Boring But Big workout tracker',
        theme_color: '#0c0d10',
        background_color: '#0c0d10',
        display: 'standalone',
        orientation: 'portrait',
        start_url: pagesBase,
        scope: pagesBase,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
