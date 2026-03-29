# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)

**[English](README.md)**

一个功能全面、易于使用且高性能的 Vue 自定义指令库，同时支持 Vue 2 和 Vue 3。

## 特性

- 🎯 **功能全面** - 提供 21+ 常用指令
- 🔄 **Vue 2/3 兼容** - 单一代码库同时支持 Vue 2 和 Vue 3
- 📦 **支持 Tree-shaking** - 按需引入，减小打包体积
- 🔒 **TypeScript** - 完整的 TypeScript 类型支持
- 🚀 **SSR 友好** - 7 个指令开箱即用支持 SSR
- 📦 **多格式支持** - 提供 ESM、CJS 和 IIFE (CDN) 格式

## 在线演示

通过 StackBlitz 在线体验：

| 演示 | 链接 |
|------|------|
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2) |

## 安装

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

### Vue 2 支持

对于 Vue 2.0-2.6，需要安装 `@vue/composition-api`：

```bash
npm install @vue/composition-api
```

Vue 2.7+ 内置了 Composition API 支持，无需额外依赖。

## CDN 使用

你也可以通过 CDN 使用 Directix：

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<!-- Vue 2.7+ -->
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

CDN 构建版本可以无缝支持 Vue 2 和 Vue 3。

## 环境要求

- Vue 2.0+ 或 Vue 3.0+
- Node.js 12.20+ (用于构建工具)
- Vue 2.0-2.6 需要：`@vue/composition-api`

## 快速开始

### 全局注册

```typescript
// Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

const app = createApp(App)
app.use(Directix)

// 或者只注册特定指令
app.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce']
})
```

```typescript
// Vue 2
import Vue from 'vue'
import Directix from 'directix'

Vue.use(Directix)
```

### 按需引入

```typescript
import { vClickOutside, vCopy, vDebounce } from 'directix'

// Vue 3
app.directive('click-outside', vClickOutside)
app.directive('copy', vCopy)

// Vue 2
Vue.directive('click-outside', vClickOutside)
```

## 可用指令

### 事件指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-click-outside` | 检测元素外部点击 | ❌ | ✅ |
| `v-debounce` | 防抖事件处理 | ✅ | ✅ |
| `v-throttle` | 节流事件处理 | ✅ | ✅ |
| `v-long-press` | 检测长按事件 | ❌ | ✅ |

### 表单指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-copy` | 复制文本到剪贴板 | ❌ | ✅ |
| `v-focus` | 自动聚焦元素 | ✅ | ✅ |
| `v-mask` | 输入掩码 | ❌ | ✅ |

### 可见性指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-lazy` | 图片懒加载 | ❌ | ✅ |
| `v-intersect` | 检测元素交叉 | ❌ | ✅ |
| `v-visible` | 控制元素可见性 | ✅ | ✅ |
| `v-loading` | 显示加载遮罩 | ✅ | ✅ |

### 滚动指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-scroll` | 滚动事件处理 | ❌ | ✅ |
| `v-infinite-scroll` | 无限滚动 | ❌ | ✅ |
| `v-sticky` | 粘性定位 | ❌ | ✅ |

### 安全指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-permission` | 基于权限的元素控制 | ✅ | ✅ |
| `v-sanitize` | HTML 内容消毒 | ✅ | ✅ |

### 效果指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-hover` | 悬停状态检测 | ❌ | ✅ |
| `v-ripple` | Material Design 波纹效果 | ❌ | ✅ |

### 观察器指令

| 指令 | 描述 | SSR | 状态 |
|-----------|-------------|-----|--------|
| `v-resize` | 元素尺寸监听 | ❌ | ✅ |
| `v-mutation` | DOM 变化监听 | ❌ | ✅ |

> ✅ = 可用 | ❌ = 不支持 SSR

## 使用示例

### v-click-outside

检测元素外部的点击事件，适用于关闭下拉菜单、弹窗等场景。

```vue
<template>
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">切换</button>
    <div v-if="show">下拉菜单内容</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function closeDropdown() {
  show.value = false
}
</script>
```

### v-copy

一键复制文本到剪贴板。

```vue
<template>
  <!-- 简单用法 -->
  <button v-copy="textToCopy">复制到剪贴板</button>

  <!-- 带回调函数 -->
  <button v-copy="{ value: text, onSuccess: handleSuccess, onError: handleError }">
    带回调复制
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('已复制:', text)
}

function handleError(error) {
  console.error('复制失败:', error)
}
</script>
```

### v-debounce

对事件处理函数进行防抖，限制执行频率。

```vue
<template>
  <!-- 默认: 300ms -->
  <input v-debounce="handleInput" />

  <!-- 使用修饰符自定义等待时间 -->
  <input v-debounce:500ms="handleInput" />

  <!-- 使用配置对象 -->
  <input v-debounce="{ handler: handleInput, wait: 500, leading: true }" />
</template>

<script setup>
function handleInput(event) {
  console.log('防抖输入:', event.target.value)
}
</script>
```

### v-throttle

对事件处理函数进行节流，限制执行频率。

```vue
<template>
  <!-- 默认: 300ms -->
  <button v-throttle="handleClick">节流点击</button>

  <!-- 使用修饰符自定义等待时间 -->
  <button v-throttle:1s="handleClick">1秒节流</button>

  <!-- 使用配置对象 -->
  <button v-throttle="{ handler: handleClick, wait: 1000, leading: true, trailing: false }">
    带配置节流
  </button>
</template>

<script setup>
function handleClick() {
  console.log('节流点击')
}
</script>
```

### v-focus

元素挂载时自动获取焦点。

```vue
<template>
  <!-- 简单用法 -->
  <input v-focus />

  <!-- 带配置 -->
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

### v-permission

基于用户权限控制元素可见性。

```vue
<template>
  <!-- 简单权限检查 -->
  <button v-permission="'admin'">仅管理员</button>

  <!-- 多个权限（OR 逻辑） -->
  <button v-permission="['admin', 'editor']">管理员或编辑者</button>

  <!-- AND 逻辑 -->
  <button v-permission="{ value: ['read', 'write'], mode: 'every' }">
    需要同时拥有两个权限
  </button>

  <!-- 禁用而非移除 -->
  <button v-permission="{ value: 'admin', action: 'disable' }">
    非管理员禁用
  </button>
</template>

<script setup>
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => ['read', 'write'],
  getRoles: () => ['editor'],
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write', 'edit']
  }
})
</script>
```

### v-lazy

图片进入视口时懒加载。

```vue
<template>
  <!-- 简单用法 -->
  <img v-lazy="imageUrl" />

  <!-- 带占位图和错误图 -->
  <img v-lazy="{ src: imageUrl, placeholder: '/placeholder.png', error: '/error.png' }" />
</template>
```

### v-mask

输入掩码，格式化用户输入。

```vue
<template>
  <!-- 电话号码 -->
  <input v-mask="'(###) ###-####'" placeholder="电话号码" />

  <!-- 日期 -->
  <input v-mask="'##/##/####'" placeholder="MM/DD/YYYY" />

  <!-- 社会安全号 -->
  <input v-mask="{ mask: '###-##-####', placeholder: '_' }" placeholder="SSN" />
</template>
```

### v-loading

在元素上显示加载遮罩。

```vue
<template>
  <!-- 简单用法 -->
  <div v-loading="isLoading">内容</div>

  <!-- 带配置 -->
  <div v-loading="{ value: isLoading, text: '加载中...', lock: true }">
    锁定滚动的内容
  </div>
</template>
```

### v-sanitize

净化 HTML 内容，防止 XSS 攻击。

```vue
<template>
  <!-- 简单用法 -->
  <div v-sanitize="userContent"></div>

  <!-- 自定义允许的标签 -->
  <div v-sanitize="{ html: userContent, allowedTags: ['b', 'i', 'u'] }"></div>
</template>
```

## API 参考

### DirectiveInstallOptions

```typescript
interface DirectiveInstallOptions {
  /** 只注册特定指令 */
  directives?: string[]
  /** 注册所有指令 (默认: true) */
  all?: boolean
  /** 指令全局配置 */
  config?: Record<string, any>
}
```

### 指令选项

每个指令接受不同的选项。详细 API 请查看[文档](https://github.com/saqqdy/directix#usage-examples)。

## 浏览器支持

| 浏览器 | 版本 |
|---------|---------|
| Chrome | 最新版 |
| Firefox | 最新版 |
| Safari | 最新版 |
| Edge | 最新版 |

## 贡献

欢迎贡献！请阅读[贡献指南](CONTRIBUTING.md)了解详情。

## 许可证

[MIT](LICENSE) © 2024-present saqqdy
