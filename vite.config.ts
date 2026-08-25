import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      devOptions: { enabled: true },
      manifest: {
        name: 'Workout Tracker',
        short_name: 'Workouts',
        description: '5/3/1 + Boring But Big workout tracker',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
