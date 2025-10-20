/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.md'],
  define: {
    global: 'window'
  },
  resolve: {
    alias: {
      'buffer': 'buffer',
      '~': resolve(__dirname, './src')
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      reportsDirectory: 'coverage-reports',
      include: ['src/**'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'coverage/**',
        'coverage-reports/**',
        '**/*.config.*',
        '**/*.setup.*',
        '**/vite/**',
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/test-setup.ts'
      ]
    }
  }
})
