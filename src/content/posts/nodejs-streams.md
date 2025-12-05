---
title: Node.js Stream 流处理详解
description: 掌握 Node.js 中的 Stream 模块，高效处理大文件读写。
date: 2025-11-20
tags: [Node.js, 后端, 性能优化]
category: 技术教程
cover: https://eopfapi.2b2x.cn/pic?img=img&id=109
---

## 什么是 Stream？

Stream 是 Node.js 中处理流式数据的抽象接口。

### 为什么要用 Stream？

当我们需要处理大文件时，一次性将文件读入内存可能会导致内存溢出。Stream 允许我们分块读取和处理数据，极大地降低了内存占用。

### 四种流类型

- Readable: 可读流
- Writable: 可写流
- Duplex: 双工流（可读可写）
- Transform: 转换流（在读写过程中修改数据）

```javascript
const fs = require('fs');
const readStream = fs.createReadStream('./bigfile.txt');
const writeStream = fs.createWriteStream('./output.txt');

readStream.pipe(writeStream);
```
