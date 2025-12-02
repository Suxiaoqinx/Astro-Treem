# Astro Treem Blog

一个基于 `Astro` + `Vue 3` + `Element Plus` 的轻量博客框架，支持 PJAX 局部刷新、标签/分类/归档时间线、分页、侧边栏统计、文章字数统计与阅读时长、RSS 等功能。

## 项目简介
- 技术栈：`Astro`、`@astrojs/vue`、`Vue 3`、`Element Plus`
- PJAX：所有站内链接支持无刷新跳转与进度条展示（`src/scripts/pjax.ts`）
- 内容集合：Markdown 文章统一管理（`src/content/posts/`），并通过 `astro:content` 校验 frontmatter

## 功能特性
- 文章列表支持列表/网格切换
- 标签、分类、归档索引页以徽章样式展示，支持点击跳转
- 标签、分类、归档详情页以时间线形式展示文章
- 文章页展示字数统计与阅读时长
- RSS 订阅：`/rss.xml`

## 目录结构
```text
src/
  components/        # Vue 组件（卡片、时间线、分页、侧边栏、标签列表等）
  layouts/           # 页面布局，入口处加载 PJAX（BaseLayout.astro）
  pages/             # Astro 路由页面（首页、标签、分类、归档、文章详情）
  content/           # 内容集合（posts）
  scripts/pjax.ts    # PJAX 导航与进度条逻辑
```

## 开发与构建
- 安装依赖：`npm install`
- 开发启动：`npm run dev`（默认 `http://localhost:4321`）
- 类型/诊断检查：`npm run check`
- 生产构建：`npm run build`（输出至 `dist/`）
- 本地预览：`npm run preview`

## 编写文章
文章放在 `src/content/posts/` 目录，文件名建议使用 `slug` 风格（例如 `my-first-post.md`）。frontmatter 字段如下：

```md
---
title: 标题
description: 描述（可选）
date: 2024-12-01
tags: [前端, Astro]
category: 技术
cover: https://example.com/cover.jpg
---

正文内容使用 Markdown 书写……
```

frontmatter 的校验见 `src/content/config.ts`，字段包括：`title`、`description?`、`date`、`tags[]`、`category?`、`cover?`。

## 页面说明
- 首页：`src/pages/index.astro`，包含分页与侧边栏统计
- 文章详情：`src/pages/posts/[slug].astro`，计算字数与阅读时长
- 标签索引：`src/pages/tags/index.astro`（按标签展示徽章，可点击）
- 标签详情：`src/pages/tags/[tag].astro`（时间线列表）
- 分类索引：`src/pages/categories/index.astro`
- 分类详情：`src/pages/categories/[category].astro`
- 归档索引：`src/pages/archives/index.astro`
- 归档详情：`src/pages/archives/[year].astro`

## PJAX 使用
- 布局文件 `src/layouts/BaseLayout.astro` 中加载了 PJAX 脚本，主容器为 `#pjax-container`
- 站内链接使用 `data-pjax` 标记，或直接调用全局 `window.pjaxNavigate(url)` 进行导航

## 静态资源
将图片等静态资源放到 `public/` 目录，构建后会原样复制到产物。页面中可通过 `/xxx.png` 直接引用。

## 部署
- 构建：`npm run build`
- 将 `dist/` 目录部署至任意静态托管（Nginx、Vercel、Netlify 等）

## 许可证
根据你的仓库设置选择合适的许可证；若未指定，默认遵循本仓库的使用约定。
