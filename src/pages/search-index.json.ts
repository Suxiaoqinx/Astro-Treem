import { getCollection } from 'astro:content'

export async function GET() {
  const posts = await getCollection('posts')
  const index = posts.map((p) => ({
    slug: p.slug,
    title: (p.data as any).title || '',
    description: (p.data as any).description || '',
    tags: ((p.data as any).tags || []) as string[],
  }))
  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

