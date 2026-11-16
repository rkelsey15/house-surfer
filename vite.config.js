import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` must match the GitHub repo name so the site works at
// https://<user>.github.io/house-surfer/
export default defineConfig({
  base: '/house-surfer/',
  plugins: [react()],
})
