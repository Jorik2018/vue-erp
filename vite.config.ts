import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const period = currentDate.getHours() >= 12 ? 'PM' : 'AM';
  process.env.VITE_APP_BUILT_ON = `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
  //console.log('process.env.VITE_PUBLIC_PATH ', process.env.VITE_PUBLIC_PATH);
  console.log(process.env);
  if (process.env.WORKSPACE) {
    process.env.VITE_PUBLIC_PATH = '/erp'
    process.env.VITE_LOGIN_PATH = '/jwt-auth/v1/token'
  }
  const publicPath = process.env.VITE_PUBLIC_PATH || '/';
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: publicPath
  });
}
