import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    // strictPort: true prevents Vite from auto-switching to another port if 5173 is busy.
    // This is critical because the backend CORS allowlist and auth redirects are
    // hardcoded to http://localhost:5173. Any port change would silently break auth.
    strictPort: true,
  },
})
