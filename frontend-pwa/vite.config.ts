import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Nature GO',
        short_name: 'Nature GO',
        description: 'A wildlife identification game',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
          runtimeCaching: [
              {
                  urlPattern: /^https:\/\/.*\.google\.com\/.*/i,
                  handler: 'StaleWhileRevalidate',
                  options: {
                    cacheName: 'google-fonts-cache',
                    expiration: {
                      maxEntries: 10,
                      maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                    },
                    cacheableResponse: {
                      statuses: [0, 200]
                    }
                  }
              },
               {
                  urlPattern: /\/api\/.*$/,
                  handler: 'NetworkFirst',
                  options: {
                      cacheName: 'api-cache',
                      backgroundSync: {
                          name: 'myQueueName',
                          options: {
                              maxRetentionTime: 24 * 60
                          }
                      }
                  }
               },
               {
                  urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)/,
                  handler: 'CacheFirst',
                  options: {
                      cacheName: 'image-cache',
                      expiration: {
                          maxEntries: 50,
                          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                      }
                  }
               }
          ]
      }
    })
  ]
});
