---
title: 测试文章：样式与功能验证
description: 覆盖图片、列表、代码、高亮、表格、引用等组件表现
date: 2025-12-05
updated: 2025-12-05
id: post-test
categories: []
tags: [测试, 演示, 样式]
cover: https://eopfapi.2b2x.cn/ri/h/355.webp
coverSide: left
recommend: true
top: false
hide: false
comment: true
---

## 概述

本篇用于验证文章页的布局与功能，包括图片查看、代码高亮、表格渲染、引用样式以及锚点目录生成。

> 引用示例：统一排版与留白，提升可读性。

### 列表示例

- 要点一：文章卡片左内边距 16px 对齐
- 要点二：封面固定尺寸裁剪，保持一致性
- 要点三：图片支持点击放大预览

1. 步骤一：加载页面框架
2. 步骤二：渲染正文内容
3. 步骤三：启用目录与图片查看器

### 图片示例

![测试图片](https://eopfapi.2b2x.cn/ri/h/355.webp)

### 代码块示例

```ts
type User = { id: string; name: string }
function greet(u: User) { return `Hello, ${u.name}!` }
console.log(greet({ id: '1', name: 'Astro' }))
```

```js
const nums = [1,2,3]
console.log(nums.map(n => n*n))
```

```python
def add(a, b):
    return a + b
print(add(2, 3))
```

```bash
echo "build project"
npm run build
```

```json
{ "name": "astro-treem-blog", "private": true, "scripts": { "dev": "astro dev" } }
```

```html
<div class="card"><span>hello</span></div>
```

### Table 表格 基础表格 支持短代码

| 表头 | 表头 | 表头 | 
| :--: | :--: | :--: | 
| 鸡头 | 鸭头 | 狗头 | 
| 鸡头 | 鸭头 | 狗头 | 
| 鸡头 | 鸭头 | 狗头 |

---

更多内容与样式可根据需要继续扩展。

<!-- 按钮组件演示 -->

::btn[查看官网]{link="https://element-plus.org" type="info"}

::btn[打赏支付宝]{link="/assets/donate/alipay.png" type="import"}

::btn[联系微信]{link="/assets/donate/wechat.png" type="success"}
