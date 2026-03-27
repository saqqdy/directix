# 安装

## 包管理器

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

## Vue 2 支持

对于 Vue 2.0-2.6，需要安装 `@vue/composition-api`：

```bash
npm install @vue/composition-api
```

Vue 2.7+ 内置了 Composition API 支持，无需额外依赖。

## CDN

你也可以通过 CDN 使用 Directix：

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<!-- Vue 2.7+ -->
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

CDN 构建版本内置了 `vue-demi`，可以无缝支持 Vue 2 和 Vue 3。

## 环境要求

- Vue 2.0+ 或 Vue 3.0+
- Node.js 12.20+ (用于构建工具)
- Vue 2.0-2.6 需要：`@vue/composition-api`

## 下一步

- [快速上手](/zh/guide/quick-start) - 学习如何使用 Directix
- [事件指令](/zh/guide/events) - 探索事件相关指令
- [表单指令](/zh/guide/forms) - 探索表单相关指令
