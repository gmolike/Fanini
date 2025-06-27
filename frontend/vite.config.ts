import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterPlugin } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [TanStackRouterPlugin(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
