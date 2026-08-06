/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'

//import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
//import vueJsx from '@vitejs/plugin-vue-jsx'
//import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default ({ mode }:any) => {

  // 🔹 cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const period = currentDate.getHours() >= 12 ? 'PM' : 'AM';
  process.env.VITE_APP_BUILT_ON = `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
  const pkg = require('./package.json')
  process.env.VITE_APP_VERSION = pkg.version;
  //const env =  process.env;
  //console.log('process.env.VITE_PUBLIC_PATH ', process.env.VITE_PUBLIC_PATH);
  console.log(
    Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key.startsWith('VITE_'))
    )
  );
  console.log('env.VITE_BASE_URL_AUTH_API',env.VITE_BASE_URL_AUTH_API);
  const publicPath = process.env.VITE_PUBLIC_PATH || '/erp';
  /*return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      legacy(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: publicPath
  });*/
  return defineConfig({
    plugins: [
      vue(),
      legacy(),
       {
    name: 'mock-validate-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/auth/validate', (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'ok' }))
      })
    }
  }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: publicPath,
    server: {
      proxy: {
        // 🔐 AUTH API (tu caso principal)
        '/api/auth': {
          target: env.VITE_BASE_URL_AUTH_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/auth/, '')
        },
        '/api/file': {
          target: env.VITE_BASE_URL_FILE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/file/, '/file')
        },
        '/api/bpm': {
          target: env.VITE_BASE_URL_BPM_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/bpm/, '')
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  })

}