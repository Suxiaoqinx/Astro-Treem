---
title: Astro 路由原理解析
description: 深入了解 Astro 的文件路由系统，包括动态路由、静态路径生成等核心概念。
date: 2025-12-05
tags: [Astro, 前端, 路由]
category: 技术教程
cover: https://eopfapi.2b2x.cn/pic?img=img&id=101
---

## Astro 路由系统

Astro 使用基于文件的路由系统，这意味着 `src/pages/` 目录下的每个文件都会自动成为网站上的一个页面。

### 静态路由

最简单的路由是静态路由。例如，`src/pages/about.astro` 会对应 `/about` 路径。

### 动态路由

对于博客文章或产品页面，我们通常需要动态路由。在 Astro 中，这通过文件名中的方括号来实现，例如 `src/pages/posts/[slug].astro`。

```javascript
// src/pages/posts/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

通过这种方式，我们可以为每篇文章生成一个独立的页面。
