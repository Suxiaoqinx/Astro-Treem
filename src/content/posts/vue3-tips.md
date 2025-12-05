---
title: Vue 3 组合式 API 实战技巧
description: 深入理解 Vue 3 Composition API，掌握更优雅的状态管理和逻辑复用方式。
date: 2025-12-06
updated: 2025-12-06
id: vue3-tips
categories: [技术]
tags: [Vue3, 前端, 教程]
cover: https://eopfapi.2b2x.cn/ri/h/370.webp
coverSide: left
recommend: true
top: false
hide: false
comment: true
---

Vue 3 引入的 **组合式 API (Composition API)** 是对 Vue 开发模式的一次重大革新。它不仅解决了 Options API 在大型组件中逻辑分散的问题，还带来了更强大的逻辑复用能力。

## 1. `setup` 语法糖

使用 `<script setup>` 是目前最推荐的写法，它更简洁，且有更好的运行时性能。

```vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

## 2. 逻辑复用：Hooks (Composables)

在 Vue 2 中，我们通常使用 Mixins 来复用逻辑，但 Mixins 存在命名冲突和数据来源不清晰的问题。Vue 3 的 Composables 完美解决了这些问题。

举个例子，我们封装一个鼠标位置追踪的 Hook：

```javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```

在组件中使用：

```vue
<script setup>
import { useMouse } from './useMouse';

const { x, y } = useMouse();
</script>

<template>
  Mouse position: {{ x }}, {{ y }}
</template>
```

## 3. `watch` vs `watchEffect`

- **`watch`**：需要显式指定侦听的数据源，且默认是懒执行的（只有数据变化时才执行回调）。
- **`watchEffect`**：自动收集依赖，并且在组件初始化时会立即执行一次。

```javascript
const count = ref(0);

// watch
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// watchEffect
watchEffect(() => {
  console.log(`Current count is: ${count.value}`);
});
```

## 4. 最佳实践

1.  **保持组件扁平**：尽量将逻辑拆分到 Composables 中，保持组件 `<script setup>` 的整洁。
2.  **命名规范**：Composables 推荐以 `use` 开头，如 `useTheme`, `useUser`。
3.  **类型安全**：结合 TypeScript 使用 Composition API，体验更佳。

## 结语

组合式 API 刚开始上手可能需要适应一下思维的转变，但一旦习惯，你会发现它在处理复杂业务逻辑时的强大之处。
