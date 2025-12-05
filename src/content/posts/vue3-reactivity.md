---
title: Vue 3 响应式系统深读
description: 剖析 Vue 3 基于 Proxy 的响应式系统实现原理，对比 Vue 2 的 Object.defineProperty。
date: 2025-12-04
tags: [Vue, JavaScript, 源码分析]
category: 技术深读
cover: https://eopfapi.2b2x.cn/ri/h/329.webp
---

## Vue 3 响应式基础

Vue 3 的响应式系统是其核心特性之一，它允许我们定义数据，并在数据变化时自动更新 DOM。

### Proxy vs Object.defineProperty

Vue 2 使用 `Object.defineProperty` 来劫持对象的 getter 和 setter。这种方法有一些局限性，例如无法检测属性的添加或删除，以及数组索引的变化。

Vue 3 引入了 `Proxy`，它可以拦截对象的各种操作，包括属性访问、赋值、枚举、函数调用等。这使得 Vue 3 的响应式系统更加强大和灵活。

### ref 和 reactive

在 Vue 3 中，我们主要使用 `ref` 和 `reactive` 来创建响应式数据。

- `ref` 用于基本类型数据。
- `reactive` 用于对象和数组。

理解它们的区别对于编写高效的 Vue 3 代码至关重要。
