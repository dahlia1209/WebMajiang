import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      transformAssetUrls: {
        tags: {

          audio: ["src"],
          video: ["src", "poster"],
          source: ["src"],
          img: ["src"],
          image: ["xlink:href", "href"],
          use: ["xlink:href", "href"],
        }
      }
    }
  }),
  inject({
    $: 'jquery',
    jQuery: 'jquery',
  })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "jquery-ui": "jquery-ui-dist/jquery-ui.js",
    }
  },
  server: {
    host: true
  },
})
