/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // PORT lets a second dev server (e.g. a preview) run beside the usual one.
    port: Number(process.env.PORT) || 5173,
    // Needed for file watching through the Docker bind mount.
    watch: { usePolling: !!process.env.DOCKER },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
