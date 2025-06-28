import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/pages',
      generatedRouteTree: './src/app/routeTree.gen.ts',
      routeFilePrefix: '~',
      quoteStyle: 'single',
    }),
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
  ],

  server: {
    port: 5173,
    host: true,
    hmr: { overlay: true },
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx'],
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@tanstack/react-table',
    ],
    exclude: ['@vite/client', '@vite/env'],
    needsInterop: ['react-dom'],
    force: false,
  },

  esbuild: {
    target: 'esnext',
    sourcemap: true,
    jsx: 'automatic',
    jsxDev: true,
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.svg'],

  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          tanstack: ['@tanstack/react-query', '@tanstack/react-table'],
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },

    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@pages': resolve(__dirname, './src/pages'),
      '@widgets': resolve(__dirname, './src/widgets'),
      '@features': resolve(__dirname, './src/features'),
      '@entities': resolve(__dirname, './src/entities'),
      '@shared': resolve(__dirname, './src/shared'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  css: {
    devSourcemap: true,
    transformer: 'lightningcss',
    lightningcss: {
      drafts: { customMedia: true },
    },
  },
});
