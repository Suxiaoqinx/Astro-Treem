# Astro Treem Blog

一个基于 `Astro` + `Vue 3` + `Element Plus` 的轻量博客框架，支持 AJAX 局部刷新导航、标签与归档时间线、分页、侧边栏统计、文章字数统计与阅读时长、RSS、快捷搜索等功能。

## 项目简介
- 技术栈：`Astro`、`@astrojs/vue`、`Vue 3`、`Element Plus`
- 内容集合：Markdown 文章统一管理（`src/content/posts/`），并通过 `astro:content` 校验 frontmatter
- 站点地图与 RSS：集成 `@astrojs/sitemap` 与 `@astrojs/rss`

## 功能特性
- 无刷新导航（AJAX）：主容器 `#pjax-container`，站内链接添加 `data-ajax="post"`
- 文章列表分页与标签筛选
- 标签索引与详情页（时间线展示）
- 归档索引与年份详情（时间线展示）
- 文章字数统计与预计阅读时长
- 快捷搜索弹窗（Ctrl/Cmd+K），索引接口：`/search-index.json`
- RSS 订阅：`/rss.xml`
- 图片懒加载与失败占位

## 目录结构
```text
src/
  components/        # Vue 组件（卡片、时间线、分页、侧边栏、标签列表等）
  layouts/           # 页面布局与内联 AJAX 导航（BaseLayout.astro）
  pages/             # Astro 路由页面（首页、标签、归档、文章详情、分页）
    posts/[slug].astro
    tags/index.astro
    tags/[tag].astro
    archives/index.astro
    archives/[year].astro
    page/[page].astro
    rss.xml.ts       # RSS 输出
    search-index.json.ts  # 搜索索引接口
  content/           # 内容集合（posts）与 schema（config.ts）
```

## 开发与构建
- 环境要求：`Node.js >= 18`
- 安装依赖：`npm install`
- 开发启动：`npm run dev`（默认 `http://localhost:4321`）
- 类型/诊断检查：`npm run check`
- 生产构建：`npm run build`（输出至 `dist/`）
- 本地预览：`npm run preview`

## 编写文章
文章放在 `src/content/posts/` 目录，文件名建议使用 `slug` 风格（例如 `my-first-post.md`）。frontmatter 示例：

```md
---
title: 标题
description: 描述（可选）
date: 2024-12-01
tags: [前端, Astro]
category: 技术
cover: https://example.com/cover.jpg
coverSide: left # 或 right（可选）
---

正文内容使用 Markdown 书写……
```

frontmatter 的校验见 `src/content/config.ts`，字段包括：`title`、`description?`、`date`、`tags[]`、`category?`、`cover?`、`coverSide?`。

## 页面说明
- 首页：`src/pages/index.astro`，包含分页与侧边栏统计
- 文章详情：`src/pages/posts/[slug].astro`，计算字数与阅读时长
- 标签索引：`src/pages/tags/index.astro`
- 标签详情：`src/pages/tags/[tag].astro`
- 归档索引：`src/pages/archives/index.astro`
- 归档详情：`src/pages/archives/[year].astro`
- 分页路由：`src/pages/page/[page].astro`

- 关于页：`src/pages/about.astro`（内容来自 `src/content/pages/about.md`）
- 友链页：`src/pages/friends.astro`（数据来自 `src/data/friends.json`）
- 捐助页：`src/pages/donate.astro`（支持微信/支付宝二维码）

## AJAX 导航
- 布局文件 `src/layouts/BaseLayout.astro` 定义容器 `#pjax-container` 与全局 `window.ajaxNavigate(url)`
- 给站内链接添加 `data-ajax="post"`，即可启用局部刷新导航
- 浏览器前进/后退通过 `popstate` 已接管，无需额外处理
- 片段脚本与样式同步机制已内置，切换页面后仍可正常运行

## 搜索
- 按 `Ctrl/Cmd+K` 打开搜索弹窗
- 索引来源：内联注入或接口 `GET /search-index.json`
- 匹配标题、描述与标签；回车打开第一条匹配结果

## 静态资源
将图片等静态资源放到 `public/` 目录，构建后会原样复制到产物。页面中可通过 `/xxx.png` 直接引用。

- 捐助二维码放置在 `public/assets/donate/`，文件名为 `wechat.png` 与 `alipay.png`

## 自定义与配置
- 修改站点域名：`astro.config.mjs:6` 的 `site`
- 修改首页个人信息：`src/pages/index.astro:22` 的 `profile`
- 修改关于页内容：`src/content/pages/about.md`
- 修改友链数据：`src/data/friends.json`
- AJAX 导航函数定义：`src/layouts/BaseLayout.astro:229`，全局挂载于 `src/layouts/BaseLayout.astro:295`

## 部署
- 构建：`npm run build`
- 将 `dist/` 目录部署至任意静态托管（Nginx、Vercel、Netlify 等）
- 将 `astro.config.mjs` 的 `site` 设置为生产域名（用于 sitemap 与 RSS）：

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://your.domain',
  integrations: [vue({ appEntrypoint: '/src/pages/_app' }), sitemap()],
})
```
