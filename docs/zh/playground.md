---
layout: page
title: Playground
description: 交互式配置和生成 Directix 指令代码
---

# Directix Playground

交互式配置指令并生成 Vue 2、Vue 3、组合式函数和 Nuxt 代码。

<Playground />

## 快速开始

1. **选择指令** - 从下拉菜单中选择
2. **选择 Vue 版本** - 切换 Vue 2 或 Vue 3
3. **选择输出格式** - 模板语法或组合式函数
4. **复制代码** - 点击复制并粘贴到您的项目中

## 功能特性

- **57+ 指令** - 覆盖所有 Directix 指令
- **Vue 2 & Vue 3** - 生成任意版本代码
- **组合式函数** - 生成组合式 API 代码
- **TypeScript 支持** - 完整类型定义

## 分类

| 分类 | 描述 | 指令 |
|------|------|------|
| **事件** | 事件处理指令 | v-click-outside, v-debounce, v-throttle, v-long-press, v-hover, v-hotkey, v-click-delay |
| **表单** | 表单输入指令 | v-copy, v-focus, v-mask, v-trim |
| **格式化** | 文本格式化指令 | v-uppercase, v-lowercase, v-capitalcase, v-number, v-money, v-truncate, v-ellipsis |
| **可见性** | 可见性控制 | v-lazy, v-intersect, v-visible, v-loading |
| **滚动** | 滚动行为 | v-scroll, v-infinite-scroll, v-sticky |
| **安全** | 安全功能 | v-permission, v-sanitize |
| **UI** | UI 增强 | v-ripple, v-click-wave, v-tooltip, v-draggable, v-context-menu, v-fullscreen, v-skeleton, v-blur, v-fade |
| **数据** | 数据可视化 | v-counter, v-progress, v-countdown |
| **工具** | 工具指令 | v-watermark, v-print, v-export, v-highlight |

## 使用示例

```vue
<template>
  <!-- 在此使用生成的指令代码 -->
  <input v-debounce="{ handler: handleSearch, wait: 300 }" />
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')

function handleSearch(event) {
  console.log('搜索:', event.target.value)
}
</script>
```

## 需要帮助？

- [文档](/zh/guide/) - 完整文档
- [API 参考](/zh/api/) - 完整 API 参考
- [示例](/zh/examples/) - 实际示例
