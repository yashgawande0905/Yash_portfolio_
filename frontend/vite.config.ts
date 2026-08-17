import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Contact form posts to /api/contact; forward it to the local Flask server.
    proxy: {
      '/api': 'http://127.0.0.1:5000'
    }
  },
  build: {
    outDir: 'dist',
    // Hashed bundle output goes to /build, leaving /assets exclusively for the
    // files copied verbatim from public/. That split lets the CDN cache the
    // fingerprinted bundles forever while photos stay replaceable.
    assetsDir: 'build',
    sourcemap: false,
    // Vendor chunks change far less often than the site content, so splitting
    // them keeps repeat visits mostly cached.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
})
