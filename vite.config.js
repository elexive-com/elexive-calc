import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX runtime
      jsxRuntime: 'automatic'
    })
  ],
  
  // Build configuration
  build: {
    outDir: 'build',
    sourcemap: true,
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          fontawesome: ['@fortawesome/fontawesome-svg-core', '@fortawesome/react-fontawesome'],
          pdf: ['@react-pdf/renderer']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Environment variables (Vite uses VITE_ prefix instead of REACT_APP_)
  define: {
    'process.env.VITE_ENV': JSON.stringify(process.env.VITE_ENV || 'development'),
    'process.env.VITE_DEBUG': JSON.stringify(process.env.VITE_DEBUG || 'false')
  },
  
  // Handle legacy environment variables
  envPrefix: ['VITE_', 'REACT_APP_'],
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js'
  },
  
  // Public directory
  publicDir: 'public',
  
  // Resolve configuration
  resolve: {
    alias: {
      // Add any path aliases if needed
    }
  },
  
  // Configure esbuild to handle JSX in .js files
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  
  // Optimize dependencies
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})
