import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // base: '/A2Z-dsa-tracker/',
    build: {
        chunkSizeWarningLimit: 1600,
    },
    define: {
        'process.env': JSON.stringify(dotenv.config().parsed),
    },
})
