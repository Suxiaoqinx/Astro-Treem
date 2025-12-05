import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import remarkDirective from 'remark-directive'
import btnShortcode, { remarkBtnShortcode } from './src/markdown/btnShortcode.js'

export default defineConfig({
  site: 'https://blog.toubiec.cn',
  integrations: [vue({ appEntrypoint: '/src/pages/_app' }), sitemap()],
  markdown: { remarkPlugins: [remarkDirective, btnShortcode] }
})
