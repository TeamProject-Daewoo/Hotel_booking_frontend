import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig(({ mode }) => { // ✅ mode 받아오기
  const env = loadEnv(mode, process.cwd()) // ✅ 여기서 env 불러오기

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host : true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // ✅ 이렇게 사용
          changeOrigin: true,
        },
      },
    },
  }
})