import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno desde la raíz del proyecto
  const env = loadEnv(mode, '../', ['SERVER_IP', 'SERVER_PORT', 'SERVER_PROTOCOL']);
  
  // Configurar URLs del servidor
  const serverIP = env.SERVER_IP || '192.168.54.10';
  const serverPort = env.SERVER_PORT || '8080';
  const serverProtocol = env.SERVER_PROTOCOL || 'http';
  
  const nginxUrl = `${serverProtocol}://${serverIP}:${serverPort}`;
  const backendUrl = `${serverProtocol}://${serverIP}:8000`;
  
  return {
    plugins: [react()],
    build: {
      outDir: 'build',
    },
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/mock': {
          target: 'http://localhost:3000',
          rewrite: (path) => path.replace(/^\/mock/, '/public/mock')
        },
        '/api': {
          target: "http://192.168.54.10:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
        '/media': {
          target: "http://192.168.54.10:8000",
          changeOrigin: true
        }
      }
    },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@data': path.resolve(__dirname, './src/data'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@Layout': path.resolve(__dirname, './src/Layout'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@api': path.resolve(__dirname, './src/api'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@router': path.resolve(__dirname, './src/router'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
    define: {
      'process.env': {
        VITE_SERVER_IP: JSON.stringify(serverIP),
        VITE_SERVER_PORT: JSON.stringify(serverPort),
        VITE_SERVER_PROTOCOL: JSON.stringify(serverProtocol),
        VITE_NGINX_URL: JSON.stringify(nginxUrl),
        VITE_BACKEND_URL: JSON.stringify(backendUrl),
        VITE_API_BASE_URL: JSON.stringify(`${nginxUrl}/api`),
        VITE_MEDIA_BASE_URL: JSON.stringify(`${nginxUrl}/media`),
      },
    },
    optimizeDeps: {
      include: ['util'],
    },
  };
});
