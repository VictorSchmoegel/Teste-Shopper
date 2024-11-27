import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carregar o arquivo .env
dotenv.config({ path: resolve(__dirname, '../.env') });

export default defineConfig({
  define: {
    // Mapear GOOGLE_API_KEY como VITE_GOOGLE_API_KEY para o frontend
    'import.meta.env.VITE_GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
  },
  server: {
    port: 80,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
});
