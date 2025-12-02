import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://blog.toubiec.cn',
  integrations: [vue({ appEntrypoint: '/src/pages/_app' }), sitemap()],
})
