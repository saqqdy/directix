---
title: Playground
description: 交互式配置和生成 Directix 指令代码
---

# Directix Playground

交互式配置指令并生成 Vue 2、Vue 3、组合式函数和 Nuxt 代码。

<Playground />

## 快速开始

1. **选择指令** - 从 57+ 指令中选择，按类别组织
2. **选择 Vue 版本** - 切换 Vue 2 或 Vue 3
3. **选择输出格式** - 指令语法或组合式函数
4. **复制代码** - 点击复制并粘贴到您的项目中

## 功能特性

- **57+ 指令** - 覆盖所有 Directix 指令
- **41+ 组合式函数** - 每个指令对应的组合式 API
- **Vue 2 & Vue 3** - 生成任意版本代码
- **TypeScript 支持** - 完整类型定义
- **15 个分类** - 按使用场景组织

## 分类

| 分类 | 描述 | 指令 |
|------|------|------|
| **事件** | 事件处理 | v-click-outside, v-debounce, v-throttle, v-long-press, v-hover, v-hotkey, v-click-delay, v-click-wave, v-context-menu, v-copy |
| **可见性** | 可见性控制 | v-lazy, v-intersect, v-visible, v-loading, v-blur, v-skeleton |
| **滚动** | 滚动行为 | v-scroll, v-infinite-scroll, v-sticky, v-parallax, v-progress |
| **交互** | 用户交互 | v-ripple |
| **格式化** | 文本格式化 | v-uppercase, v-lowercase, v-capitalcase, v-number, v-money, v-truncate, v-ellipsis, v-trim |
| **UI** | UI 增强 | v-tooltip, v-draggable, v-image-preview, v-countdown, v-watermark, v-print |
| **表单** | 表单处理 | v-focus, v-mask |
| **安全** | 安全功能 | v-permission, v-sanitize |
| **观察者** | DOM 观察 | v-resize, v-mutation |
| **性能** | 性能优化 | v-virtual-list |
| **移动端** | 触摸手势 | v-touch, v-swipe, v-pan, v-pinch, v-rotate-gesture, v-pull-refresh |
| **动画** | 动画效果 | v-fade, v-typewriter, v-counter, v-lottie |
| **数据** | 数据处理 | v-export, v-highlight |
| **媒体** | 媒体控制 | v-fullscreen |
| **输入** | 输入处理 | v-emoji |

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

## v1.11.0 功能

- 🏢 **企业级功能** - 权限管理、审计日志、配置中心
- ⚡ **性能优化** - 包体积减小、运行时性能提升
- 🛡️ **安全增强** - 高级 XSS 防护、CSP 兼容性
- 📊 **监控告警** - 性能指标、健康检查、告警规则

## v2.0.0 即将推出

- 🧩 **Web Components 支持** - 在自定义元素中使用指令
- ⚡ **Vue 3 条件优化** - markRaw、shallowReactive 增强
- 🔄 **完全 Vue 2 兼容** - 持续支持 Vue 2.x

## 需要帮助？

- [文档](/zh/guide/) - 完整文档
- [API 参考](/zh/api/) - 完整 API 参考
- [示例](/zh/examples/) - 实际示例
- [GitHub](https://github.com/saqqdy/directix) - 源代码
