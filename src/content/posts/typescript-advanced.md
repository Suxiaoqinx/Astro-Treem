---
title: TypeScript 高级类型实战
description: 探索 TypeScript 中的映射类型、条件类型等高级特性，提升代码类型安全性。
date: 2025-12-03
tags: [TypeScript, 前端, 进阶]
category: 技术教程
cover: https://eopfapi.2b2x.cn/pic?img=img&id=103
---

## TypeScript 高级类型

TypeScript 不仅仅是给 JS 加上类型注解，它还提供了一套强大的类型系统，可以帮助我们编写更健壮的代码。

### 泛型 (Generics)

泛型是复用代码的重要工具。它允许我们编写可以处理多种类型的组件，而不仅仅是单一类型。

### 映射类型 (Mapped Types)

映射类型允许我们基于旧类型创建新类型。例如，我们可以使用 `Partial<T>` 将类型 T 的所有属性变为可选。

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 条件类型 (Conditional Types)

条件类型类似于 JS 中的三元运算符，但在类型层面上运作。

```typescript
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  "object";
```
