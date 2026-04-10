import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/YooBees/' to match your GitHub repository name for Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/YooBees/',
})
