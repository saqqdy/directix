# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)
[![CI](https://github.com/saqqdy/directix/actions/workflows/ci.yml/badge.svg)](https://github.com/saqqdy/directix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/saqqdy/directix/branch/master/graph/badge.svg)](https://codecov.io/gh/saqqdy/directix)

**English** | **[中文文档](README_CN.md)**

A comprehensive, easy-to-use, and high-performance Vue custom directives library supporting both Vue 2 and Vue 3, with Web Components support.

## Features

- 🎯 **Comprehensive** — 57 commonly used directives + 57 composable functions
- 🔄 **Vue 2/3 Compatible** — Single codebase supporting Vue 2.6+ and Vue 3.0+
- 🧩 **Web Components** — Shadow DOM, SSR safety, and lifecycle hooks support
- 📦 **Tree-shakable** — Import only what you need
- 🔒 **TypeScript** — Full type support with type definitions
- 🚀 **SSR Friendly** — Multiple directives support SSR out of the box
- ⚡ **Zero Dependencies** — Lightweight with minimal bundle size (full bundle ≤ 20KB)
- 🌐 **i18n Support** — Built-in 8 languages (EN/ZH/JA/KO/FR/DE/ES/RU)
- 🔌 **Plugin System** — Extensible plugin architecture for community contributions

## Installation

```bash
# pnpm
pnpm add directix

# npm
npm install directix

# yarn
yarn add directix
```

> **Vue 2.0–2.6** requires `@vue/composition-api`; Vue 2.7+ has built-in support with no extra dependencies.

## CDN

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<!-- Vue 2.7+ -->
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

## Quick Start

### Global Registration

```typescript
// Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

const app = createApp(App)
app.use(Directix)

// Register specific directives only
app.use(Directix, { directives: ['click-outside', 'copy', 'debounce'] })
```

```typescript
// Vue 2
import Vue from 'vue'
import Directix from 'directix'

Vue.use(Directix)
```

### On-Demand Import

```typescript
import { vClickOutside, vCopy, vDebounce } from 'directix'

// Vue 3
app.directive('click-outside', vClickOutside)

// Vue 2
Vue.directive('click-outside', vClickOutside)
```

### Composables

Every directive has a corresponding composable for use with the Composition API:

```typescript
import { useCopy, useHover, useDebounce } from 'directix'

const { copy, copied } = useCopy({ source: textRef })
const { isHovering } = useHover({ onEnter: handleEnter })
const { run: debouncedSearch } = useDebounce({ handler: search, wait: 500 })
```

## Nuxt Integration

Directix provides a Nuxt module with automatic directive registration and composable auto-import:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  directix: {
    include: ['v-click-outside', 'v-copy', 'v-debounce'],  // optional: include specific directives
    exclude: ['v-ripple'],                                   // optional: exclude specific directives
    autoImportComposables: true                              // auto-import composables
  }
})
```

SSR-incompatible directives are automatically skipped on the server — no manual handling needed.

## Available Directives

### Events

| Directive | Description |
|-----------|-------------|
| `v-click-outside` | Detect clicks outside an element |
| `v-click-delay` | Delay click execution to prevent double clicks |
| `v-debounce` | Debounce event handlers |
| `v-throttle` | Throttle event handlers |
| `v-long-press` | Detect long press events |
| `v-hover` | Hover state detection |
| `v-hotkey` | Keyboard shortcut binding |
| `v-touch` | Touch gesture detection (swipe/pinch/rotate) |
| `v-swipe` | Swipe gesture detection with mouse support |

### Form

| Directive | Description |
|-----------|-------------|
| `v-copy` | Copy text to clipboard |
| `v-focus` | Auto focus an element |
| `v-mask` | Input masking |
| `v-trim` | Trim input whitespace |
| `v-money` | Currency format input |
| `v-number` | Number format input |
| `v-ellipsis` | Text ellipsis overflow |

### Format

| Directive | Description |
|-----------|-------------|
| `v-uppercase` | Convert text to uppercase |
| `v-lowercase` | Convert text to lowercase |
| `v-capitalcase` | Capitalize first letter |
| `v-truncate` | Truncate text with ellipsis |

### Visibility & Scroll

| Directive | Description |
|-----------|-------------|
| `v-lazy` | Lazy load images |
| `v-intersect` | Detect element intersection |
| `v-visible` | Control element visibility |
| `v-loading` | Show loading overlay |
| `v-scroll` | Scroll event handling |
| `v-infinite-scroll` | Infinite scrolling |
| `v-sticky` | Sticky positioning |
| `v-pull-refresh` | Pull to refresh |
| `v-virtual-list` | Virtual list for large datasets |

### Security & UI

| Directive | Description |
|-----------|-------------|
| `v-permission` | Permission-based element control |
| `v-sanitize` | Sanitize HTML content (XSS prevention) |
| `v-tooltip` | Tooltip component |
| `v-image-preview` | Image preview with zoom/gesture support |
| `v-countdown` | Countdown timer display |
| `v-print` | Print element content |
| `v-watermark` | Watermark overlay |
| `v-skeleton` | Skeleton loading placeholder |
| `v-progress` | Progress bar animation |
| `v-counter` | Animated number counter |

### Effects & Gestures

| Directive | Description |
|-----------|-------------|
| `v-ripple` | Material Design ripple effect |
| `v-draggable` | Make elements draggable |
| `v-pan` | Pan/drag gesture |
| `v-pinch` | Pinch/zoom gesture |
| `v-rotate-gesture` | Rotation gesture |
| `v-blur` | Background blur overlay |
| `v-fade` | Fade in/out transition |
| `v-parallax` | Parallax scrolling effect |
| `v-lottie` | Lottie animation player |
| `v-typewriter` | Typewriter animation |
| `v-click-wave` | Click wave effect |

### Observer & Data

| Directive | Description |
|-----------|-------------|
| `v-resize` | Element resize observer |
| `v-mutation` | DOM mutation observer |
| `v-export` | Export data (CSV/JSON/HTML) |
| `v-highlight` | Keyword highlighting |
| `v-emoji` | Emoji input filter |
| `v-context-menu` | Right-click context menu |
| `v-fullscreen` | Fullscreen toggle |

> 📖 For detailed API, options, and SSR compatibility of each directive, see the [full documentation](https://saqqdy.github.io/directix/).

## Composables

Every directive has a corresponding `use*` composable function, such as `useClickOutside`, `useCopy`, `useDebounce`, etc. See the [documentation](https://saqqdy.github.io/directix/) for the complete list.

## Advanced Features

### Permission Management

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => ['read', 'write'],
  getRoles: () => ['editor'],
  roleMap: { admin: ['*'], editor: ['read', 'write', 'edit'] }
})
```

```vue
<button v-permission="'admin'">Admin Only</button>
<button v-permission="['admin', 'editor']">Admin or Editor</button>
<button v-permission="{ value: 'admin', action: 'disable' }">Disabled for non-admin</button>
```

### Internationalization

```typescript
import { createI18n, setLocale } from 'directix'

createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: { 'en-US': enUS, 'zh-CN': zhCN, 'ja-JP': jaJP }
})

setLocale('zh-CN') // Switch at runtime
```

### Plugin System

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
    onConnect: (el) => console.log('Connected', el),
    onDisconnect: (el) => console.log('Disconnected', el),
  },
})

// SSR-safe custom elements
const LazyImage = createSSRSafeCustomElement('lazy-img', vLazy, { shadow: true })
const html = LazyImage.ssrRender({ src: 'image.jpg' })
```

### Performance Utilities

```typescript
// Event delegation — reduce DOM listeners
import { registerDelegatedHandler } from 'directix'
const id = registerDelegatedHandler('.btn', 'click', (e, target) => { /* ... */ })

// Batch DOM reads/writes — avoid layout thrashing
import { domRead, domWrite } from 'directix'
domRead(() => {
  const h = el.offsetHeight
  domWrite(() => { el.style.transform = `translateY(${h}px)` })
})

// Memory leak detection
import { startLeakDetection, trackResource, cleanupResource } from 'directix'
startLeakDetection()
const id = trackResource('event-listener', 'scroll', cleanupFn)

// Security audit
import { sanitizeHtml, SecurityAudit } from 'directix'
const clean = sanitizeHtml(userInput, { allowedTags: ['b', 'i', 'p'] })
const report = SecurityAudit.generateReport(htmlContent)
```

## Try Online

- 🎮 [Interactive Playground](https://saqqdy.github.io/directix/playground/) — Visual directive configuration and code generation
- 📦 [StackBlitz (Vue 3)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
- 📦 [StackBlitz (Vue 2)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2)
- 🔌 [Browser Extension DevTools Panel](https://github.com/saqqdy/directix/tree/master/extensions/browser) — Real-time directive monitoring and debugging

## Browser Support

Chrome / Firefox / Safari / Edge latest versions

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) © 2024-present saqqdy
