# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)
[![CI](https://github.com/saqqdy/directix/actions/workflows/ci.yml/badge.svg)](https://github.com/saqqdy/directix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/saqqdy/directix/branch/master/graph/badge.svg)](https://codecov.io/gh/saqqdy/directix)

**[English](README.md) | 中文**

一个功能全面、易于使用且高性能的 Vue 自定义指令库，同时支持 Vue 2 和 Vue 3，并提供 Web Components 支持。

## 特性

- 🎯 **功能全面** — 57 个常用指令 + 57 个组合式函数
- 🔄 **Vue 2/3 兼容** — 单一代码库同时支持 Vue 2.6+ 和 Vue 3.0+
- 🧩 **Web Components** — 支持 Shadow DOM、SSR 安全、生命周期钩子
- 📦 **Tree-shakable** — 按需引入，减小打包体积
- 🔒 **TypeScript** — 完整类型支持
- 🚀 **SSR 友好** — 多个指令开箱即用支持 SSR
- ⚡ **零依赖** — 轻量级，打包体积小（全量 ≤ 20KB）
- 🌐 **i18n 支持** — 内置 中/英/日/韩/法/德/西/俄 8 种语言
- 🔌 **插件系统** — 可扩展的插件架构，支持社区贡献

## 安装

```bash
# pnpm
pnpm add directix

# npm
npm install directix

# yarn
yarn add directix
```

> **Vue 2.0–2.6** 需额外安装 `@vue/composition-api`；Vue 2.7+ 内置支持，无需额外依赖。

## CDN

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<!-- Vue 2.7+ -->
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

## 快速开始

### 全局注册

```typescript
// Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

const app = createApp(App)
app.use(Directix)

// 仅注册指定指令
app.use(Directix, { directives: ['click-outside', 'copy', 'debounce'] })
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

// Vue 2
Vue.directive('click-outside', vClickOutside)
```

### 组合式函数

每个指令都有对应的组合式函数，可在 Composition API 中使用：

```typescript
import { useCopy, useHover, useDebounce } from 'directix'

const { copy, copied } = useCopy({ source: textRef })
const { isHovering } = useHover({ onEnter: handleEnter })
const { run: debouncedSearch } = useDebounce({ handler: search, wait: 500 })
```

## Nuxt 集成

Directix 提供了 Nuxt 模块，指令自动注册，composables 自动导入：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  directix: {
    include: ['v-click-outside', 'v-copy', 'v-debounce'],  // 可选：仅包含指定指令
    exclude: ['v-ripple'],                                   // 可选：排除指定指令
    autoImportComposables: true                              // 自动导入 composables
  }
})
```

SSR 不兼容的指令会自动跳过服务端渲染，无需手动处理。

## 可用指令

### 事件

| 指令 | 说明 |
|------|------|
| `v-click-outside` | 检测元素外部点击 |
| `v-click-delay` | 延迟点击，防止双击 |
| `v-debounce` | 防抖事件处理 |
| `v-throttle` | 节流事件处理 |
| `v-long-press` | 长按事件检测 |
| `v-hover` | 悬停状态检测 |
| `v-hotkey` | 键盘快捷键绑定 |
| `v-touch` | 触摸手势检测（滑动/缩放/旋转） |
| `v-swipe` | 滑动手势检测（支持鼠标） |

### 表单

| 指令 | 说明 |
|------|------|
| `v-copy` | 复制文本到剪贴板 |
| `v-focus` | 自动聚焦元素 |
| `v-mask` | 输入掩码格式化 |
| `v-trim` | 去除输入空白 |
| `v-money` | 货币格式输入 |
| `v-number` | 数字格式输入 |
| `v-ellipsis` | 文本溢出省略 |

### 格式化

| 指令 | 说明 |
|------|------|
| `v-uppercase` | 转换为大写 |
| `v-lowercase` | 转换为小写 |
| `v-capitalcase` | 首字母大写 |
| `v-truncate` | 文本截断 |

### 可见性 & 滚动

| 指令 | 说明 |
|------|------|
| `v-lazy` | 图片懒加载 |
| `v-intersect` | 元素交叉检测 |
| `v-visible` | 控制元素可见性 |
| `v-loading` | 加载遮罩 |
| `v-scroll` | 滚动事件处理 |
| `v-infinite-scroll` | 无限滚动 |
| `v-sticky` | 粘性定位 |
| `v-pull-refresh` | 下拉刷新 |
| `v-virtual-list` | 虚拟列表（大数据集） |

### 安全 & UI

| 指令 | 说明 |
|------|------|
| `v-permission` | 基于权限的元素控制 |
| `v-sanitize` | HTML 内容消毒（防 XSS） |
| `v-tooltip` | 工具提示 |
| `v-image-preview` | 图片预览（支持缩放/手势） |
| `v-countdown` | 倒计时显示 |
| `v-print` | 打印元素内容 |
| `v-watermark` | 水印遮罩 |
| `v-skeleton` | 骨架屏加载占位 |
| `v-progress` | 进度条动画 |
| `v-counter` | 数字滚动动画 |

### 效果 & 手势

| 指令 | 说明 |
|------|------|
| `v-ripple` | Material Design 波纹效果 |
| `v-draggable` | 元素拖拽 |
| `v-pan` | 平移/拖拽手势 |
| `v-pinch` | 缩放手势 |
| `v-rotate-gesture` | 旋转手势 |
| `v-blur` | 背景模糊遮罩 |
| `v-fade` | 淡入淡出过渡 |
| `v-parallax` | 视差滚动效果 |
| `v-lottie` | Lottie 动画播放 |
| `v-typewriter` | 打字机动画 |
| `v-click-wave` | 点击波纹效果 |

### 观察器 & 数据

| 指令 | 说明 |
|------|------|
| `v-resize` | 元素尺寸监听 |
| `v-mutation` | DOM 变化监听 |
| `v-export` | 导出数据（CSV/JSON/HTML） |
| `v-highlight` | 关键词高亮 |
| `v-emoji` | Emoji 输入过滤 |
| `v-context-menu` | 右键菜单 |
| `v-fullscreen` | 全屏切换 |

> 📖 每个指令的详细 API、选项和 SSR 兼容性请查看[完整文档](https://saqqdy.github.io/directix/)。

## 组合式函数

所有指令都有对应的 `use*` 组合式函数，如 `useClickOutside`、`useCopy`、`useDebounce` 等。完整列表请查看[文档](https://saqqdy.github.io/directix/)。

## 高级功能

### 权限管理

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => ['read', 'write'],
  getRoles: () => ['editor'],
  roleMap: { admin: ['*'], editor: ['read', 'write', 'edit'] }
})
```

```vue
<button v-permission="'admin'">仅管理员</button>
<button v-permission="['admin', 'editor']">管理员或编辑者</button>
<button v-permission="{ value: 'admin', action: 'disable' }">非管理员禁用</button>
```

### 国际化

```typescript
import { createI18n, setLocale } from 'directix'

createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: { 'en-US': enUS, 'zh-CN': zhCN, 'ja-JP': jaJP }
})

setLocale('en-US') // 运行时切换
```

### 插件系统

```typescript
import { definePlugin, getPluginManager } from 'directix'

const myPlugin = definePlugin({
  meta: { name: 'my-plugin', version: '1.0.0' },
  install(ctx) { ctx.registerDirective('my-directive', vMyDirective) }
})

getPluginManager().register(myPlugin)
```

### Web Components

```typescript
import { defineCustomElementDirective, createSSRSafeCustomElement } from 'directix'

defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
  shadow: true,
  styles: ':host { display: block; }',
  lifecycle: {
    onConnect: (el) => console.log('已连接', el),
    onDisconnect: (el) => console.log('已断开', el),
  },
})

// SSR 安全的自定义元素
const LazyImage = createSSRSafeCustomElement('lazy-img', vLazy, { shadow: true })
const html = LazyImage.ssrRender({ src: 'image.jpg' })
```

### 性能优化工具

```typescript
// 事件委托 — 减少 DOM 监听器
import { registerDelegatedHandler } from 'directix'
const id = registerDelegatedHandler('.btn', 'click', (e, target) => { /* ... */ })

// DOM 批量读写 — 避免布局抖动
import { domRead, domWrite } from 'directix'
domRead(() => {
  const h = el.offsetHeight
  domWrite(() => { el.style.transform = `translateY(${h}px)` })
})

// 内存泄漏检测
import { startLeakDetection, trackResource, cleanupResource } from 'directix'
startLeakDetection()
const id = trackResource('event-listener', 'scroll', cleanupFn)

// 安全审计
import { sanitizeHtml, SecurityAudit } from 'directix'
const clean = sanitizeHtml(userInput, { allowedTags: ['b', 'i', 'p'] })
const report = SecurityAudit.generateReport(htmlContent)
```

## 在线体验

- 🎮 [交互式 Playground](https://saqqdy.github.io/directix/playground/) — 可视化配置指令，生成代码
- 📦 [StackBlitz (Vue 3)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
- 📦 [StackBlitz (Vue 2)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2)
- 🔌 [浏览器扩展 DevTools 面板](https://github.com/saqqdy/directix/tree/master/extensions/browser) — 实时指令监控与调试

## 浏览器支持

Chrome / Firefox / Safari / Edge 最新版

## 贡献

欢迎贡献！请阅读[贡献指南](CONTRIBUTING.md)了解详情。

## 许可证

[MIT](LICENSE) © 2024-present saqqdy
