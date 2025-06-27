import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'url'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/pages',
      generatedRouteTree: './src/app/routeTree.gen.ts',
      routeFilePrefix: '~',
      quoteStyle: 'single',
    }),
    react(),
    tailwindcss(),
  ],
  css: {
    transformer: 'lightningcss',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
