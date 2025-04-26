import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/proxy/3000/',
  server: {
    port: 3000,
    host: true,
    cors: true,
    strictPort: true,
    hmr: {
      clientPort: 443
    },
    allowedHosts: ['d3ha44vk70xudr.cloudfront.net', 'localhost']
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true
  }
})
