// frontend/vite.config.ts
/* eslint-disable @typescript-eslint/naming-convention */
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type PluginOption } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  return {
    plugins: [
      // Tailwind CSS v4
      tailwindcss(),

      // TanStack Router mit FSD-konformen Routes
      tanstackRouter({
        routesDirectory: './src/pages',
        generatedRouteTree: './src/app/routeTree.gen.ts',
        quoteStyle: 'single',
      }),

      // React mit SWC für 20x schnellere Builds
      react({
        jsxImportSource: 'react',
        tsDecorators: true,
        plugins: [
          ['@swc/plugin-styled-jsx', {}],
          isProd && ['@swc/plugin-remove-console', {}],
        ].filter(Boolean) as [string, Record<string, unknown>][],
      }),

      // Bundle Analyzer nur bei Bedarf
      isProd &&
        process.env['ANALYZE'] &&
        visualizer({
          open: true,
          filename: './dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean) as PluginOption[],

    // FSD Path Resolution
    resolve: {
      alias: {
        '@app': resolve(__dirname, './src/app'),
        '@pages': resolve(__dirname, './src/pages'),
        '@widgets': resolve(__dirname, './src/widgets'),
        '@features': resolve(__dirname, './src/features'),
        '@entities': resolve(__dirname, './src/entities'),
        '@shared': resolve(__dirname, './src/shared'),
        '@': resolve(__dirname, './src'),
      },
    },

    // Development Server
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      open: true,
      cors: true,
      hmr: {
        overlay: true,
        protocol: 'ws',
        host: 'localhost',
      },
      fs: {
        allow: ['..'], // Erlaubt Zugriff auf Dateien außerhalb des Projektverzeichnisses
      },
      // Proxy für EasyVerein API
      proxy: {
        '/api/easyverein': {
          target: env['VITE_EASYVEREIN_API_URL'] ?? 'https://api.easyverein.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/easyverein/, ''),
          secure: true,
        },
      },
    },

    // Preview Server
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
      cors: true,
    },
    publicDir: 'public',
    // Build Optimizations
    build: {
      target: 'esnext',
      minify: isProd ? 'terser' : false,
      ...(isProd && {
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.debug'],
            passes: 2,
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
            ecma: 2020,
          },
        },
      }),
      sourcemap: isDev ? 'inline' : false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000,

      // Rollup Options für optimales Chunking
      rollupOptions: {
        output: {
          // Manuelle Chunks für besseres Caching
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-tanstack': [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table',
            ],
            'vendor-ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
            ],
            'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          },
          // Asset Naming
          entryFileNames: isDev ? '[name].js' : 'assets/js/[name]-[hash].js',
          chunkFileNames: isDev ? '[name].js' : 'assets/js/[name]-[hash].js',
          assetFileNames: assetInfo => {
            const info = assetInfo.names[0]?.split('.');
            const ext = info?.[info.length - 1];
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.names[0] ?? '')) {
              return isDev ? '[name][extname]' : 'assets/images/[name]-[hash][extname]';
            }
            if (ext === 'css') {
              return isDev ? '[name].css' : 'assets/css/[name]-[hash].css';
            }
            return isDev ? '[name][extname]' : 'assets/[ext]/[name]-[hash][extname]';
          },
        },
        // Tree-shaking Optimierungen
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },

      // Worker Options
      modulePreload: {
        polyfill: true,
      },

      // Reporting
      reportCompressedSize: true,
    },

    // Dependency Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@tanstack/react-router',
        '@tanstack/react-table',
        'react-hook-form',
        'zod',
        'date-fns',
        'clsx',
        'tailwind-merge',
      ],
      exclude: ['@vite/client', '@vite/env'],
      esbuildOptions: {
        target: 'es2020',
        jsx: 'automatic',
      },
    },

    // CSS Configuration
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isDev ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:8]',
      },
      devSourcemap: isDev,
    },

    // Performance
    esbuild: {
      target: 'es2020',
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: isProd,
      minifySyntax: isProd,
      minifyWhitespace: isProd,
    },

    // SSR/SSG (für zukünftige Erweiterungen)
    ssr: {
      noExternal: ['@tanstack/*'],
    },

    // Environment Variables
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __DEV__: JSON.stringify(isDev),
      __PROD__: JSON.stringify(isProd),
    },
  };
});
