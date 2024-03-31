import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/A2Z-dsa-tracker/',
    build: {
        chunkSizeWarningLimit: 1600,
    },
})
