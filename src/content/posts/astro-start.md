---
title: Astro 初体验：构建高性能静态网站
description: 探索 Astro 框架的核心特性，以及为何它成为构建内容驱动型网站的首选。
date: 2025-12-06
updated: 2025-12-06
id: astro-start
categories: [技术]
tags: [Astro, 前端, 静态网站]
cover: https://eopfapi.2b2x.cn/ri/h/360.webp
coverSide: left
recommend: true
top: false
hide: false
comment: true
---

## 什么是 Astro？

Astro 是一个为了构建快速内容驱动型网站而生的现代 Web 框架。它最大的特点是 **零 JavaScript 运行时**（默认情况下），这意味着它会将你的页面渲染成纯 HTML 和 CSS，只在需要的时候按需加载 JavaScript。

## 核心特性

### 1. 岛屿架构 (Islands Architecture)

Astro 的核心思想是"岛屿架构"。想象一下，你的页面是一片静态的 HTML 海洋，而其中漂浮着几个交互式的"岛屿"（组件）。

- **静态优先**：大部分页面内容是静态的，加载速度极快。
- **按需交互**：只有那些需要交互的组件（比如轮播图、搜索框）才会加载 JavaScript。

### 2. UI 框架无关

你可以在 Astro 中使用你喜欢的任何 UI 框架：
- React
- Vue
- Svelte
- Solid
- Preact

甚至可以在同一个页面中混合使用它们！

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
import MyVueComponent from '../components/MyVueComponent.vue';
---

<MyReactComponent client:load />
<MyVueComponent client:visible />
```

## 为什么选择 Astro？

1.  **性能卓越**：默认输出 0kb JS，Lighthouse 评分通常是满分。
2.  **开发体验好**：支持 `.astro` 文件组件化开发，类似 JSX 但更简单。
3.  **内容集合**：内置强大的 Markdown 和 MDX 支持，非常适合写博客。

## 快速开始

```bash
# 创建新项目
npm create astro@latest

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 总结

如果你正在构建一个博客、文档站、作品集或者电商营销页，Astro 绝对是一个值得尝试的选择。它在保证极致性能的同时，并没有牺牲开发者的开发体验。
