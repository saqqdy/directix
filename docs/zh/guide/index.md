# 介绍

**Directix** 是一个功能全面、易于使用且高性能的 Vue 自定义指令库，同时支持 Vue 2 和 Vue 3。

## 为什么选择 Directix？

- **🎯 功能全面** - 提供 30+ 常用指令，满足日常开发需求
- **🔄 Vue 2/3 兼容** - 单一代码库无缝支持两个版本
- **📦 Tree-shakable** - 按需引入，最小化打包体积
- **🔒 TypeScript** - 完整的 TypeScript 支持和类型定义
- **🚀 SSR 友好** - 支持 Nuxt 等 SSR 框架
- **🎨 零依赖** - 轻量级，无外部依赖

## 快速示例

```vue
<template>
  <!-- 点击外部关闭下拉菜单 -->
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">切换</button>
    <div v-if="show">下拉菜单内容</div>
  </div>

  <!-- 复制文本到剪贴板 -->
  <button v-copy="textToCopy">复制到剪贴板</button>

  <!-- 防抖输入 -->
  <input v-debounce:500ms="handleInput" />

  <!-- 自动聚焦 -->
  <input v-focus />
</template>
```

## 浏览器支持

Directix 支持所有现代浏览器：

| 浏览器 | 支持  |
| ------ | ----- |
| Chrome | ✅    |
| Firefox | ✅   |
| Safari | ✅    |
| Edge   | ✅    |

## 许可证

[MIT 许可证](https://github.com/saqqdy/directix/blob/main/LICENSE)
