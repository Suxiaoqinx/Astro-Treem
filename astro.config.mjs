import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [vue({ appEntrypoint: '/src/pages/_app' }), sitemap()],
})
