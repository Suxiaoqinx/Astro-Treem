import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    id: z.string().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    category: z.string().optional(),
    cover: z.string().optional(),
    recommend: z.boolean().default(false),
    top: z.boolean().default(false),
    hide: z.boolean().default(false),
    comment: z.boolean().default(true),
    coverSide: z.enum(['left', 'right']).optional()
  })
})

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: z.string().optional(),
    comment: z.boolean().default(true)
  })
})

export const collections = { posts, pages }
