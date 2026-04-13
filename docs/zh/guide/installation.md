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

### Vue 2.7+

Vue 2.7 内置了 Composition API 支持，无需额外依赖。

```bash
npm install directix
```

### Vue 2.6 及以下版本

对于 Vue 2.0-2.6，需要安装 `@vue/composition-api` 作为依赖：

```bash
npm install directix @vue/composition-api
```

::: warning 重要提示
Directix 内部使用了 Composition API 特性。Vue 2.6 及以下版本需要 `@vue/composition-api` 来提供这些特性。
:::

确保在使用 Directix 之前注册 `@vue/composition-api`：

```typescript
// Vue 2.6 及以下版本
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Directix from 'directix'

Vue.use(VueCompositionAPI)
Vue.use(Directix)
```

## CDN

你也可以通过 CDN 使用 Directix：

### Vue 3

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

### Vue 2.7+

```html
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

### Vue 2.6 及以下版本

对于 Vue 2.6 及以下版本使用 CDN，需要引入 `@vue/composition-api`：

```html
<script src="https://unpkg.com/vue@2.6/dist/vue.js"></script>
<script src="https://unpkg.com/@vue/composition-api/dist/vue-composition-api.prod.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

## 环境要求

| Vue 版本 | 额外依赖 |
|---------|---------|
| Vue 3.0+ | 无 |
| Vue 2.7+ | 无 |
| Vue 2.0-2.6 | `@vue/composition-api` |

**Node.js**: 12.20+ (用于构建工具)

## 手动版本检测

某些情况下，可能需要手动指定 Vue 版本：

```typescript
import { setVueVersion } from 'directix'

// Vue 2.6
setVueVersion(2)

// Vue 2.7
setVueVersion(2.7)

// Vue 3
setVueVersion(3)
```

或通过环境变量：

```bash
# Vue 2.6
DIRECTIX_VUE_VERSION=2

# Vue 2.7
DIRECTIX_VUE_VERSION=2.7

# Vue 3
DIRECTIX_VUE_VERSION=3
```

## 下一步

- [快速上手](/zh/guide/quick-start) - 学习如何使用 Directix
- [Nuxt 模块](/zh/guide/nuxt) - 在 Nuxt 3 中使用 Directix
- [VS Code 插件](/zh/guide/vscode-extension) - 提升开发体验
- [事件指令](/zh/guide/events) - 探索事件相关指令
- [表单指令](/zh/guide/forms) - 探索表单相关指令
