# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)
[![CI](https://github.com/saqqdy/directix/actions/workflows/ci.yml/badge.svg)](https://github.com/saqqdy/directix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/saqqdy/directix/branch/master/graph/badge.svg)](https://codecov.io/gh/saqqdy/directix)

**[English](README.md) | 中文**

一个功能全面、易于使用且高性能的 Vue 自定义指令库，同时支持 Vue 2 和 Vue 3，并提供 Web Components 支持。

## 特性

- 🎯 **功能全面** - 提供 57 个常用指令和 57 个组合式函数
- 🔄 **Vue 2/3 兼容** - 单一代码库同时支持 Vue 2.6+ 和 Vue 3.0+
- 🧩 **Web Components** - 支持在自定义元素/Web Components 中使用指令
- 📦 **支持 Tree-shaking** - 按需引入，减小打包体积
- 🔒 **TypeScript** - 完整的 TypeScript 类型支持
- 🚀 **SSR 友好** - 多个指令开箱即用支持 SSR
- 📦 **多格式支持** - 提供 ESM、CJS 和 IIFE (CDN) 格式
- ⚡ **零依赖** - 轻量级，打包体积小
- 🎨 **组合式API** - 每个指令都有对应的组合式函数
- 🔧 **工具函数导出** - 导出 `configurePermission`、`getPermissionConfig` 等工具函数供高级使用
- 🌐 **国际化支持** - 内置中文、英文、日文翻译
- 🔌 **插件系统** - 可扩展的插件架构，支持社区贡献

## v2.0.0 新特性（计划中）

> **注意**: v2.0.0 目前正在开发中。以下功能为计划功能，即将发布。

### Web Components 支持

在自定义元素/Web Components 中使用 Directix 指令：

```typescript
import { vLazy, defineCustomElementDirective, registerDirectiveElements } from 'directix'

// 从指令定义单个自定义元素
defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
  shadow: true
})

// 注册多个指令为自定义元素
registerDirectiveElements({
  'lazy-img': vLazy,
  'click-outside': vClickOutside
})
```

### Vue 3 条件优化

使用 Vue 3 时，Directix 自动应用性能优化：

```typescript
import { useLazyOptimized, useSuspenseDirective, teleportContent } from 'directix'

// 使用 shallowRef 优化的懒加载（仅 Vue 3）
const { state, observe } = useLazyOptimized({
  onLoad: (entry) => console.log('可见！')
})

// 支持 Suspense 的异步指令
const { state, load } = useSuspenseDirective({
  loader: () => fetchData()
})

// 传送内容到目标
teleportContent(element, { to: '#modal-container' })
```

### 保持 Vue 2 支持

**v2.0.0 将保持完全的 Vue 2 兼容性** - 所有 v1.x 代码无需修改即可继续使用。我们承诺同时支持 Vue 2 和 Vue 3。

### 移动端优化

增强的触摸手势支持，包含触觉反馈和 PWA 支持。

```typescript
import { useEnhancedTouch, triggerHaptic, usePWA } from 'directix'

// 12+ 种手势类型，支持触觉反馈
const { activeGesture, bind } = useEnhancedTouch({
  feedback: { haptic: true, visual: true },
  onSwipe: (e) => console.log(`滑动方向: ${e.direction}`),
  onPinch: (e) => console.log(`缩放: ${e.scale}`),
})

// PWA 支持
const { isOnline, needsUpdate } = usePWA({ serviceWorker: { enabled: true } })
```

### 无障碍访问 (A11y)

完整的 ARIA 支持、屏幕阅读器公告和键盘导航。

```typescript
import { 
  applyAriaAttributes, 
  announce, 
  useKeyboardNavigation, 
  useFocusTrap 
} from 'directix'

// 应用 ARIA 属性
applyAriaAttributes(element, {
  role: 'button',
  ariaLabel: '提交',
  ariaDisabled: true,
})

// 屏幕阅读器公告
announce('表单提交成功')

// 键盘导航与焦点陷阱
const { bind } = useKeyboardNavigation({ focusTrap: true, rovingTabindex: true })
```

### 安全增强

高级 XSS 防护、CSP 兼容性和安全审计工具。

```typescript
import { sanitizeHtml, SecurityAudit, getCSPNonce } from 'directix'

// 高级 HTML 消毒
const clean = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'p'],
  detectDangerousPatterns: true,
})

// 安全审计
const report = SecurityAudit.generateReport(htmlContent)
console.log(SecurityAudit.formatReport(report, 'json'))

// 检查依赖漏洞
const vulns = await SecurityAudit.checkDependencies()
```

## v1.9.0 新特性

### 国际化 (i18n)

完整的国际化支持，包括指令消息和文档翻译。

```typescript
import { createI18n, setLocale } from 'directix'

// 初始化语言
createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: { 'en-US': enUS, 'zh-CN': zhCN, 'ja-JP': jaJP }
})

// 运行时切换语言
setLocale('en-US')
```

### 统一警告系统

改进的开发者体验，结构化的错误消息。

```typescript
import { warn, directiveWarn, assertType } from 'directix'

// 指令特定警告
directiveWarn('debounce', 'errors.invalid_wait', { wait: 'abc' })

// 类型断言
assertType<number>(value, 'number', 'debounce', 'wait')
```

### 插件系统

可扩展的插件架构，支持社区贡献。

```typescript
import { definePlugin, getPluginManager } from 'directix'

const myPlugin = definePlugin({
  meta: { name: 'my-plugin', version: '1.0.0' },
  install(ctx) {
    ctx.registerDirective('my-directive', vMyDirective)
  }
})

getPluginManager().register(myPlugin)
```

### 社区插件仓库

编程式发现和安装社区插件。

```typescript
import { getPluginRegistry } from 'directix'

const registry = getPluginRegistry()

// 搜索插件
const results = await registry.search('动画')

// 获取所有插件
const plugins = await registry.getAll()

// 安装插件
await registry.install('directix-animate', manager)
```

### 时区与地区工具

地区特定的日期、数字和货币格式化。

```typescript
import { getTimezoneInfo, formatDateLocale, formatCurrencyLocale } from 'directix'

// 获取时区信息
const tz = getTimezoneInfo() // { id: 'Asia/Shanghai', offset: 8, ... }

// 按地区格式化日期
formatDateLocale(new Date()) // 自动检测用户地区

// 格式化货币
formatCurrencyLocale(99.99) // '$99.99' (美国) 或 '99,99€' (德国)
```

### Vue DevTools 调试集成

在 Vue DevTools 中直接调试指令。

```typescript
import { enableDevtools, trackDirective } from 'directix'

// 启用 DevTools 集成
enableDevtools()

// 跟踪指令使用
trackDirective('debounce', { element: 'input' })
```

### 性能监控

测量指令性能，获取详细指标。

```typescript
import { enablePerformance, getPerformanceReport } from 'directix'

// 启用监控
enablePerformance()

// 获取性能报告
const report = getPerformanceReport()
// [{ name: 'debounce', mount: { p50: 0.5ms, p95: 1.2ms }, ... }]
```

### 场景示例

10+ 个真实场景示例，展示指令组合使用：

- **表单验证** - v-debounce, v-mask, v-trim, v-focus
- **权限管理** - v-permission, v-click-outside
- **图片画廊** - v-lazy, v-image-preview, v-swipe
- **无限滚动** - v-infinite-scroll, v-virtual-list, v-loading
- **富文本编辑** - v-sanitize, v-highlight, v-emoji
- **手势交互** - v-touch, v-swipe, v-pan, v-pinch
- **数据可视化** - v-progress, v-counter, v-countdown
- **拖拽排序** - v-draggable, v-intersect
- **打印导出** - v-print, v-export
- **全屏媒体** - v-fullscreen, v-lottie

## 在线演示

通过 StackBlitz 或 CodeSandbox 在线体验：

| 演示 | StackBlitz | CodeSandbox |
|------|------------|-------------|
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3) | [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/saqqdy/directix/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2) | [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/saqqdy/directix/tree/master/examples/vue2) |

## Playground

试试交互式 [Playground](https://saqqdy.github.io/directix/playground/) 来配置指令并生成代码：

- **57+ 指令** - 覆盖所有 Directix 指令
- **Vue 2 & Vue 3** - 为任一版本生成代码
- **组合式函数** - 生成 Composable API 代码
- **TypeScript 支持** - 完整类型定义
- **Monaco 编辑器** - 功能完整的代码编辑器，支持语法高亮
- **实时预览** - 实时查看指令效果

每个指令文档页面也包含代码生成器，可快速获取代码片段。

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

### 使用组合式API

每个指令都有对应的组合式函数，可在 Composition API 中使用：

```typescript
import { useClickOutside, useCopy, useDebounce } from 'directix'

// 在 setup() 或 <script setup> 中使用
const { copy, copied } = useCopy({ source: textRef })
const { isHovering, bind } = useHover({ onEnter: handleEnter })
const { run: debouncedSearch } = useDebounce({ handler: search, wait: 500 })
```

请参阅下方的[组合式API](#组合式api)章节了解所有可用的组合式函数。

## Nuxt 集成

Directix 提供了 Nuxt 模块，可以与 Nuxt 3 应用无缝集成。

### 安装配置

Nuxt 模块已包含在主包中，只需在 `nuxt.config.ts` 中添加：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  
  directix: {
    // 启用/禁用模块（默认: true）
    enabled: true,
    
    // 仅包含特定指令（可选）
    include: ['v-click-outside', 'v-copy', 'v-debounce'],
    
    // 或排除特定指令（可选）
    exclude: ['v-ripple'],
    
    // 指令默认选项（可选）
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => ['read', 'write']
        }
      }
    },
    
    // 自动导入 composables（默认: true）
    autoImportComposables: true
  }
})
```

### 在 Nuxt 中使用

指令会自动注册，composables 会自动导入：

```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">复制</button>
  </div>
</template>

<script setup>
// Composables 自动导入，无需手动导入
const { copy, copied } = useCopy({ source: text })
const { isHovering } = useHover({ onEnter: handleEnter })
</script>
```

### SSR 兼容性

不支持 SSR 的指令只会在客户端运行，Nuxt 模块会自动处理。

## 可用指令

### 事件指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-click-outside` | 检测元素外部点击 | ❌ |
| `v-click-delay` | 延迟点击执行，防止双击 | ✅ |
| `v-debounce` | 防抖事件处理 | ✅ |
| `v-throttle` | 节流事件处理 | ✅ |
| `v-long-press` | 检测长按事件 | ❌ |
| `v-hover` | 悬停状态检测 | ❌ |
| `v-hotkey` | 键盘快捷键绑定 | ✅ |
| `v-touch` | 触摸手势检测（滑动、缩放、旋转） | ❌ |
| `v-swipe` | 滑动手势检测（支持鼠标） | ❌ |

### 表单指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-copy` | 复制文本到剪贴板 | ❌ |
| `v-focus` | 自动聚焦元素 | ✅ |
| `v-mask` | 输入掩码 | ❌ |
| `v-trim` | 去除输入空白 | ✅ |
| `v-money` | 货币格式输入 | ❌ |
| `v-number` | 数字格式输入 | ❌ |
| `v-ellipsis` | 文本溢出省略 | ✅ |

### 格式化指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-uppercase` | 转换为大写 | ✅ |
| `v-lowercase` | 转换为小写 | ✅ |
| `v-capitalcase` | 首字母大写 | ✅ |
| `v-truncate` | 文本截断 | ✅ |

### 可见性指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-lazy` | 图片懒加载 | ❌ |
| `v-intersect` | 检测元素交叉 | ❌ |
| `v-visible` | 控制元素可见性 | ✅ |
| `v-loading` | 显示加载遮罩 | ✅ |

### 滚动指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-scroll` | 滚动事件处理 | ❌ |
| `v-infinite-scroll` | 无限滚动 | ❌ |
| `v-sticky` | 粘性定位 | ❌ |
| `v-pull-refresh` | 下拉刷新 | ❌ |
| `v-virtual-list` | 虚拟列表（大数据集） | ❌ |

### 安全指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-permission` | 基于权限的元素控制 | ✅ |
| `v-sanitize` | HTML 内容消毒 | ✅ |

### 效果指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-ripple` | Material Design 波纹效果 | ❌ |
| `v-draggable` | 元素拖拽 | ❌ |

### 观察器指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-resize` | 元素尺寸监听 | ❌ |
| `v-mutation` | DOM 变化监听 | ❌ |

### UI 指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-tooltip` | 工具提示 | ❌ |
| `v-image-preview` | 图片预览（支持缩放） | ❌ |
| `v-countdown` | 倒计时显示 | ✅ |
| `v-print` | 打印元素内容 | ❌ |
| `v-watermark` | 水印遮罩 | ✅ |
| `v-skeleton` | 骨架屏加载占位 | ✅ |
| `v-progress` | 进度条动画 | ❌ |
| `v-counter` | 数字滚动动画 | ✅ |

### 手势指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-pan` | 平移/拖拽手势 | ❌ |
| `v-pinch` | 缩放手势 | ❌ |
| `v-rotate-gesture` | 旋转手势 | ❌ |

### 视觉效果指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-blur` | 背景模糊遮罩 | ❌ |
| `v-fade` | 淡入淡出过渡 | ✅ |
| `v-parallax` | 视差滚动效果 | ❌ |
| `v-lottie` | Lottie 动画播放 | ❌ |
| `v-typewriter` | 打字机动画 | ✅ |
| `v-click-wave` | 点击波纹效果 | ❌ |

### 数据指令

| 指令 | 描述 | SSR |
|-----------|-------------|-----|
| `v-export` | 导出数据（CSV/JSON/HTML） | ❌ |
| `v-highlight` | 关键词高亮 | ✅ |
| `v-emoji` | Emoji 输入过滤 | ❌ |
| `v-context-menu` | 右键菜单 | ❌ |
| `v-fullscreen` | 全屏切换 | ❌ |

> ✅ = 支持 SSR | ❌ = 不支持 SSR

## 组合式API

每个指令都有对应的组合式函数，可在 Composition API 中使用。所有组合式函数都从 `directix` 导出：

### 事件组合式函数

| 组合式函数 | 描述 |
|------------|-------------|
| `useClickOutside` | 检测元素外部点击 |
| `useClickDelay` | 延迟点击执行 |
| `useDebounce` | 函数防抖 |
| `useThrottle` | 函数节流 |
| `useLongPress` | 检测长按手势 |
| `useHover` | 追踪悬停状态 |
| `useHotkey` | 处理键盘快捷键 |
| `useTouch` | 检测触摸手势 |
| `useSwipe` | 检测滑动手势 |

### 表单组合式函数

| 组合式函数 | 描述 |
|------------|-------------|
| `useCopy` | 复制文本到剪贴板 |
| `useFocus` | 管理元素焦点 |
| `useMask` | 输入掩码 |
| `useTrim` | 去除输入空白 |
| `useMoney` | 货币格式化 |
| `useNumber` | 数字格式化 |
| `useEllipsis` | 文本溢出省略 |

### 格式化组合式函数

| 组合式函数 | 描述 |
|------------|-------------|
| `useUppercase` | 转换为大写 |
| `useLowercase` | 转换为小写 |
| `useCapitalcase` | 首字母大写 |
| `useTruncate` | 文本截断 |

### 可见性组合式函数

| 组合式函数 | 描述 |
|------------|-------------|
| `useLazy` | 图片懒加载 |
| `useIntersect` | 检测元素交叉 |
| `useVisible` | 控制元素可见性 |
| `useLoading` | 显示加载遮罩 |

### 滚动组合式函数

| 组合式函数 | 描述 |
|------------|-------------|
| `useScroll` | 追踪滚动位置 |
| `useInfiniteScroll` | 无限滚动 |
| `useSticky` | 粘性定位 |
| `usePullRefresh` | 下拉刷新 |
| `useVirtualList` | 虚拟列表（大数据集） |

### 其他组合式函数

| 组合式函数 | 描述 |
|------------|-------------|
| `usePermission` | 权限检查 |
| `useSanitize` | HTML 内容消毒 |
| `useRipple` | Material Design 波纹效果 |
| `useDraggable` | 元素拖拽 |
| `useResize` | 元素尺寸监听 |
| `useMutation` | DOM 变化监听 |
| `useTooltip` | 工具提示控制 |
| `useImagePreview` | 图片预览（支持缩放） |
| `useCountdown` | 倒计时 |
| `usePrint` | 打印内容 |
| `useWatermark` | 水印遮罩 |
| `useSkeleton` | 骨架屏加载状态 |
| `useProgress` | 进度条控制 |
| `useCounter` | 数字滚动动画 |
| `usePan` | 平移手势检测 |
| `usePinch` | 缩放手势检测 |
| `useRotateGesture` | 旋转手势检测 |
| `useBlur` | 模糊遮罩控制 |
| `useFade` | 淡入淡出控制 |
| `useParallax` | 视差滚动效果 |
| `useLottie` | Lottie 动画控制 |
| `useTypewriter` | 打字机效果 |
| `useExport` | 数据导出工具 |
| `useHighlight` | 关键词高亮 |
| `useEmoji` | Emoji 过滤 |
| `useContextMenu` | 右键菜单控制 |
| `useFullscreen` | 全屏模式控制 |
| `useClickWave` | 点击波纹效果 |

### 组合式API使用示例

```vue
<script setup>
import { ref } from 'vue'
import { useCopy, useHover, useDebounce } from 'directix'

// useCopy
const text = ref('Hello World')
const { copy, copied } = useCopy({ source: text })

// useHover
const buttonRef = ref()
const { isHovering, bind } = useHover({
  onEnter: () => console.log('鼠标进入'),
  onLeave: () => console.log('鼠标离开')
})

// useDebounce
const { run: debouncedSearch } = useDebounce({
  handler: (query) => fetchResults(query),
  wait: 500
})
</script>

<template>
  <button @click="copy()">
    {{ copied ? '已复制!' : '复制' }}
  </button>

  <button ref="buttonRef" :class="{ active: isHovering }">
    悬停我
  </button>
</template>
```

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

### v-tooltip

悬停或点击显示工具提示。

```vue
<template>
  <!-- 简单用法 -->
  <button v-tooltip="'提示内容'">悬停我</button>

  <!-- 带配置 -->
  <button v-tooltip="{ content: '提示', placement: 'bottom', trigger: 'click' }">
    点击我
  </button>
</template>
```

### v-image-preview

图片预览，支持缩放和手势操作。

```vue
<template>
  <!-- 简单用法 -->
  <img v-image-preview src="thumbnail.jpg" data-preview="full.jpg" />

  <!-- 带配置 -->
  <img v-image-preview="{ src: 'thumbnail.jpg', previewSrc: 'full.jpg', enablePinchZoom: true }" />
</template>
```

### v-draggable

使元素可拖拽。

```vue
<template>
  <!-- 简单用法 -->
  <div v-draggable>拖拽我</div>

  <!-- 带约束 -->
  <div v-draggable="{ axis: 'x', bounds: 'parent' }">仅水平拖拽</div>
</template>
```

### v-uppercase / v-lowercase / v-capitalcase

文本大小写转换。

```vue
<template>
  <input v-uppercase placeholder="自动大写" />
  <input v-lowercase placeholder="自动小写" />
  <input v-capitalcase placeholder="首字母大写" />
</template>
```

### v-truncate

文本截断显示。

```vue
<template>
  <!-- 简单用法 -->
  <p v-truncate="50">长文本内容...</p>

  <!-- 带配置 -->
  <p v-truncate="{ length: 100, suffix: '...', position: 'end' }">长文本...</p>
</template>
```

### v-touch

触摸手势检测。

```vue
<template>
  <div v-touch="{ onSwipe: handleSwipe, onPinch: handlePinch }">
    在此处滑动或缩放
  </div>
</template>

<script setup>
function handleSwipe(direction) {
  console.log('滑动方向:', direction) // 'left', 'right', 'up', 'down'
}

function handlePinch(scale) {
  console.log('缩放比例:', scale)
}
</script>
```

### v-trim

去除输入空白。

```vue
<template>
  <!-- 失焦时去除（默认） -->
  <input v-trim />

  <!-- 输入时去除 -->
  <input v-trim="{ position: 'both', event: 'input' }" />
</template>
```

### v-money

货币格式输入。

```vue
<template>
  <input v-money="{ prefix: '¥', precision: 2 }" placeholder="输入金额" />
</template>
```

### v-number

数字格式输入。

```vue
<template>
  <input v-number="{ precision: 2, min: 0, max: 100 }" placeholder="输入数字" />
</template>
```

### v-click-delay

延迟点击执行，防止双击。

```vue
<template>
  <!-- 默认: 300ms 延迟 -->
  <button v-click-delay="handleClick">点击我</button>

  <!-- 自定义延迟时间 -->
  <button v-click-delay="{ handler: handleClick, delay: 500 }">500ms 延迟</button>
</template>

<script setup>
function handleClick() {
  console.log('点击了（延迟执行）')
}
</script>
```

### v-countdown

倒计时显示。

```vue
<template>
  <!-- 简单用法 -->
  <span v-countdown="{ time: 60 }"></span>

  <!-- 带回调 -->
  <span v-countdown="{ time: 60, onTick: handleTick, onComplete: handleComplete }"></span>

  <!-- 自定义格式 -->
  <span v-countdown="{ time: 3600, format: 'mm:ss' }"></span>
</template>

<script setup>
function handleTick(remaining) {
  console.log('剩余时间:', remaining)
}

function handleComplete() {
  console.log('倒计时结束!')
}
</script>
```

### v-ellipsis

文本溢出省略显示。

```vue
<template>
  <!-- 简单用法 -->
  <div v-ellipsis style="width: 200px;">超长文本将被截断显示</div>

  <!-- 多行省略 -->
  <div v-ellipsis="{ lines: 2 }">多行文本省略显示</div>
</template>
```

### v-hotkey

键盘快捷键绑定。

```vue
<template>
  <!-- 简单用法 -->
  <div v-hotkey="{ 'ctrl+s': handleSave, 'ctrl+c': handleCopy }">
    按 Ctrl+S 保存
  </div>

  <!-- 带修饰键 -->
  <input v-hotkey="{ 'enter': submit, 'escape': cancel }" />
</template>

<script setup>
function handleSave() {
  console.log('保存中...')
}

function handleCopy() {
  console.log('复制中...')
}
</script>
```

### v-print

打印元素内容。

```vue
<template>
  <!-- 简单用法 -->
  <button v-print="printRef">打印</button>
  <div ref="printRef">要打印的内容</div>

  <!-- 打印自身 -->
  <div v-print="{ self: true }">点击打印此内容</div>
</template>
```

### v-pull-refresh

下拉刷新功能。

```vue
<template>
  <div v-pull-refresh="handleRefresh" style="height: 400px; overflow: auto;">
    下拉刷新
  </div>

  <!-- 带配置 -->
  <div v-pull-refresh="{ handler: handleRefresh, threshold: 80, disabled: false }">
    内容区域
  </div>
</template>

<script setup>
async function handleRefresh() {
  // 获取新数据
  await fetchData()
}
</script>
```

### v-swipe

滑动手势检测（支持鼠标）。

```vue
<template>
  <div v-swipe="handleSwipe" style="height: 200px;">
    向任意方向滑动
  </div>

  <!-- 带配置 -->
  <div v-swipe="{ onSwipe: handleSwipe, threshold: 50, enableMouse: true }">
    滑动或鼠标拖拽
  </div>
</template>

<script setup>
function handleSwipe(direction) {
  console.log('滑动方向:', direction) // 'left', 'right', 'up', 'down'
}
</script>
```

### v-virtual-list

虚拟列表，高效渲染大数据集。

```vue
<template>
  <div v-virtual-list="{ items: list, itemSize: 50 }" style="height: 500px;">
    <template #default="{ item, index }">
      <div :key="index">{{ item.name }}</div>
    </template>
  </div>
</template>

<script setup>
const list = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `项目 ${i}` }))
</script>
```

### v-watermark

水印遮罩。

```vue
<template>
  <!-- 简单用法 -->
  <div v-watermark="'机密'" style="width: 100%; height: 400px;">
    受保护的内容
  </div>

  <!-- 带配置 -->
  <div v-watermark="{ content: '草稿', fontSize: 16, color: '#ccc', rotate: -20 }">
    带水印的内容
  </div>
</template>
```

### v-click-wave

点击波纹效果。

```vue
<template>
  <button v-click-wave>点击我</button>
  <button v-click-wave="'rgba(255, 255, 255, 0.3)'">自定义颜色</button>
  <button v-click-wave="{ color: 'red', duration: 400 }">自定义选项</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClickWave } from 'directix'

// 组合式API用法
const buttonRef = ref(null)
const { bind, trigger } = useClickWave({
  color: 'rgba(255, 255, 255, 0.4)',
  duration: 600
})

// 在挂载时绑定到元素
onMounted(() => bind(buttonRef.value))
</script>
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

## 开发路线图

### v1.7.1 (2026-04-11) - 问题修复与优化 ✅

- **Playground 修复** - Monaco 编辑器加载、语法高亮、Vue 版本同步
- **UI 优化** - 移除冗余控件、统一文档页面布局

### v1.7.0 (2026-04-15) - 可视化配置工具 ✅

- **在线 Playground** - 支持 Vue 2/3 的实时编辑环境
- **可视化配置器** - 交互式参数配置面板
- **代码生成器** - 生成 Vue 2/3/Composable/Nuxt 代码片段
- **配置预设** - 常用场景的快速启动模板
- **Monaco 编辑器** - CDN 加载的代码编辑器，支持语法高亮
- **实时预览** - 实时查看指令效果

### v1.8.0 (2026-04-22) - 质量提升与生态 ✅

- **测试覆盖** - 单元测试覆盖率 90%+，E2E 测试（Playwright）
- **性能优化** - 打包体积优化，Tree-shaking 改进
- **VS Code 插件** - 自动补全、悬浮文档、代码片段
- **CLI 工具** - `directix create`、`directix init`、`directix doctor`、`directix migrate`

### v1.9.0 (计划 - 2026-04-29) - 文档与社区

- **交互式文档** - 在线编辑即时预览
- **实际场景示例** - 10+ 实用案例
- **国际化支持** - 英文、中文、日文文档
- **开发者体验** - 优化错误提示、DevTools 集成
- **插件系统** - 社区扩展支持

### v1.10.0 (计划 - 2026-05-06) - Vue 3 优化与安全

- **Vue 3 优化预览** - Suspense、Teleport 支持
- **移动端优化** - 触摸手势、PWA 支持
- **无障碍访问** - ARIA 属性、键盘导航
- **安全增强** - XSS 防护、CSP 兼容

### v1.11.0 (计划 - 2026-05-13) - 稳定性与企业级

- **稳定性** - 浏览器兼容、边缘场景修复
- **性能极限** - 包体积 ≤ 25KB、内存优化
- **企业级功能** - 权限管理、审计日志、配置中心
- **v2.0 迁移准备** - 迁移工具、Breaking Changes 预警

### v2.0.0 (未来)

- Vue 3 专属优化
- Web Components 支持

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
