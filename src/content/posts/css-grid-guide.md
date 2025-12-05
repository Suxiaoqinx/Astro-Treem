---
title: CSS Grid 布局完全指南
description: 告别 float 和 flex 的局限，拥抱二维布局系统的强大能力。
date: 2025-11-15
tags: [CSS, 前端, 布局]
category: 技术教程
cover: https://eopfapi.2b2x.cn/pic?img=img&id=110
---

## 二维布局的王者

CSS Grid 是 Web 历史上最强大的布局系统。

### Grid vs Flexbox

Flexbox 是一维布局（行或列），而 Grid 是二维布局（行和列）。

### 常用属性

- `display: grid`
- `grid-template-columns`
- `grid-template-rows`
- `grid-gap`
- `grid-area`

### 实战案例

实现一个响应式的圣杯布局从未如此简单：

```css
.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
}
```
