---
title: Element Plus 使用心得
description: 在 Astro 项目中集成 Element Plus 的一些坑与解决方案。
date: 2025-11-28
tags: [Element Plus, Vue, UI组件库]
category: 技术笔记
cover: https://eopfapi.2b2x.cn/pic?img=img&id=107
---

## Element Plus 简介

Element Plus 是基于 Vue 3 的组件库，设计优雅，功能丰富。

### 按需引入

为了减小包体积，我们通常采用按需引入的方式。使用 `unplugin-vue-components` 和 `unplugin-auto-import` 可以自动导入组件。

### Astro 集成

在 Astro 中使用 Element Plus 需要注意 SSR 兼容性问题。有些组件依赖浏览器环境，需要用 `client:only` 或 `client:visible` 指令加载。

```astro
<ElButton client:visible>点击我</ElButton>
```
