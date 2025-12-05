# Astro Treem Blog

一个基于 `Astro` + `Vue 3` + `Element Plus` 的轻量博客框架，内置标签/归档时间线、侧边栏统计、文章字数与阅读时长、RSS、站内搜索、捐助卡片等。

## 项目简介
- 技术栈：`Astro`、`@astrojs/vue`、`Vue 3`、`Element Plus`
- 内容集合：Markdown 文章统一管理（`src/content/posts/`），通过 `astro:content` 校验 frontmatter
- 站点地图与 RSS：集成 `@astrojs/sitemap` 与 `@astrojs/rss`

## 功能特性
- **UI/UX 交互**：
  - 页面入场动画：首页头图、侧边栏、文章列表与文章详情统一使用 `fade-up`
  - 全局回到顶部组件（BackToTop）：页面右下角常驻，一键平滑返回顶部
  - 侧边栏目录（TOC）：使用 Element Plus Anchor 组件，支持平滑滚动与当前位置高亮
  - 线路切换测速：侧边栏提供多线路切换与手动延迟测试功能
- **文章阅读体验**：
  - 图片灯箱（Viewer.js）：仅文章正文区域启用（选择器：`#pjax-container .post-content-card .prose`）
  - 表格优化：自动包裹 `.table-wrapper`，移动端强制全宽并支持横向滚动，解决排版错位问题
  - URL 净化：文章版权区域自动移除 URL 查询参数与锚点，仅保留纯净链接
  - 字数统计与预计阅读时长
- **内容组织**：
  - 标签索引与详情（时间线）
  - 归档索引与年度时间线（左侧对齐优化）
  - 搜索弹窗（Ctrl/Cmd+K），索引来自内联或接口 `GET /search-index.json`
  - RSS 订阅：`/rss.xml`

## 目录结构
```text
src/
  components/        # Vue 组件
    BackToTop.vue    # 回到顶部组件
    SidebarCard.vue  # 侧边栏卡片（含 TOC、线路切换）
    DonateButtons.vue # 捐赠按钮
    ...
  layouts/           # 页面布局（BaseLayout.astro）、搜索弹窗与图片灯箱初始化
  pages/             # Astro 路由页面（首页、标签、归档、文章详情、分页等）
    posts/[slug].astro
    tags/index.astro
    tags/[tag].astro
    archives/index.astro
    archives/[year].astro
    page/[page].astro
  content/           # 内容集合（posts）与 schema（config.ts）
```

## 开发与构建
- 环境要求：`Node.js >= 18`
- 安装依赖：`npm install`
- 开发启动：`npm run dev`（默认 `http://localhost:4321`）
- 诊断检查：`npm run check`
- 生产构建：`npm run build`（输出至 `dist/`）
- 本地预览：`npm run preview`

## 编写文章
文章放在 `src/content/posts/`，frontmatter 示例（完整字段）：

```md
---
title: 标题
description: 描述（可选）
id: 唯一ID（可选）
date: 2025-12-01
updated: 2025-12-02 # 更新日期（可选）
categories: [分类A, 分类B]
tags: [前端, Astro]
category: 技术 # 单分类（可选）
cover: https://example.com/cover.jpg
coverSide: left # 或 right（可选）
recommend: false # 是否推荐
top: false # 是否置顶
hide: false # 是否隐藏（隐藏后不会出现在列表）
comment: true # 是否开启评论
---

正文内容使用 Markdown 书写……
```

页面 frontmatter 示例：

```md
---
title: 友链
type: links
comment: false # 关闭该页面的评论
---
```

字段校验见 `src/content/config.ts`。

## 页面说明
- 首页：`src/pages/index.astro`
- 文章详情：`src/pages/posts/[slug].astro`
- 标签索引：`src/pages/tags/index.astro`
- 标签详情：`src/pages/tags/[tag].astro`
- 归档索引：`src/pages/archives/index.astro`
- 归档详情：`src/pages/archives/[year].astro`
- 关于页：`src/pages/about.astro`
- 友链页：`src/pages/friends.astro`
- 捐助页：`src/pages/donate.astro`
- 说说页：`src/pages/talks.astro`（数据来自 `src/data/talks.json`）

## 搜索
- 按 `Ctrl/Cmd+K` 打开搜索弹窗
- 索引来源：内联注入或接口 `GET /search-index.json`
- 匹配标题、描述与标签；回车打开第一条匹配结果

## 静态资源
- 将图片等静态资源放到 `public/` 目录，构建后会原样复制到产物
- 捐助二维码位于 `public/assets/donate/`（`wechat.png`、`alipay.png`）

## 说说数据格式
`src/data/talks.json`

```json
[
  {
    "id": "t-2025-12-02-1",
    "date": "2025-12-02T10:15:00+08:00",
    "content": "清晨的风很温柔，写点代码，喝口咖啡。",
    "images": ["https://example.com/pic.jpg"]
  }
]
```

## 自定义与配置
- 站点信息：`src/site.config.ts`（标题、作者、头像、Hero 文案、公告等）
- 主容器样式：`BaseLayout.astro` 中 `.main-container`
  - 移动端适配：`<=900px` 时自动调整内边距与表格样式
  - 自动逻辑：`wrapTables()` 自动包裹表格，`setupDonateOverlay()` 处理 URL 净化
- 文章版权卡片：`src/pages/posts/[slug].astro`（背景白、边框与阴影可按需调整）
- 归档页对齐：`src/pages/archives/index.astro` 与 `src/pages/archives/[year].astro`（左侧内边距优化）

### 置顶与隐藏
- 置顶角标：文章列表卡片在 `top: true` 时显示“置顶”角标（`src/components/PostCard.vue`）
- 列表排序：首页按置顶优先，其次按日期倒序（`src/pages/index.astro`）
- 隐藏文章：设置 `hide: true` 后将从首页列表中过滤

### 评论区
- 配置服务地址：在 `src/site.config.ts` 设置 `comments.serverURL`
- 文章关闭评论：在文章 frontmatter 设置 `comment: false`
- 组件：`src/components/WalineComments.vue`（基于 `sodesu-comment/aio`）

### 图片与高亮
- 图片灯箱：仅在文章正文启用（`#pjax-container .post-content-card .prose`）
- 语法高亮：使用 Shiki 默认主题；如需更换，在 `astro.config.mjs` 配置 `markdown.shikiConfig.theme`

## 部署
- 构建：`npm run build`
- 将 `dist/` 目录部署至任意静态托管（Nginx、Vercel、Netlify 等）
- 在 `astro.config.mjs` 中设置 `site` 为生产域名（用于 sitemap 与 RSS）
