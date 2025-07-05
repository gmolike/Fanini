// frontend/vite.config.ts
/* eslint-disable @typescript-eslint/naming-convention */
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { type ConfigEnv, defineConfig, loadEnv, type PluginOption } from 'vite';

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isTest = mode === 'test';

  return {
    plugins: [
      // Tailwind CSS v4
      tailwindcss(),

      // TanStack Router mit FSD-konformen Routes (nicht im Test-Modus)
      !isTest &&
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

    // Test Configuration für Vitest
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.stories.tsx',
          '**/*.test.tsx',
          '**/index.ts',
          'src/app/routeTree.gen.ts',
        ],
      },
      // Browser-basierte Tests für Storybook
      browser: {
        enabled: false, // Aktiviere nur wenn benötigt
        name: 'chromium',
        provider: 'playwright',
      },
    },

    // Development Server
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      open: !isTest, // Nicht im Test-Modus öffnen
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
        // Storybook dependencies
        ...(isTest ? ['@storybook/react', '@storybook/addon-docs', '@storybook/addon-vitest'] : []),
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
      __TEST__: JSON.stringify(isTest),
    },
  };
});
