import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {}
    }
  },
  plugins: [vue(), vueJsx()]
})
