import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { siteConfig } from 'src/site.config'

export async function GET(context: APIContext) {
  const posts = await getCollection('posts')
  // sort by date desc
  posts.sort((a, b) => (b.data.date as Date).getTime() - (a.data.date as Date).getTime())
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || 'http://localhost:4321',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      link: `/posts/${p.slug}/`,
      pubDate: p.data.date as Date
    }))
  })
}
