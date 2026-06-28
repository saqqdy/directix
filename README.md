# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)
[![CI](https://github.com/saqqdy/directix/actions/workflows/ci.yml/badge.svg)](https://github.com/saqqdy/directix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/saqqdy/directix/branch/master/graph/badge.svg)](https://codecov.io/gh/saqqdy/directix)

**English** | **[中文文档](README_CN.md)**

A comprehensive, easy-to-use, and high-performance Vue custom directives library supporting both Vue 2 and Vue 3, with Web Components support.

## Features

- 🎯 **Comprehensive** - 57 commonly used directives and 57 composables
- 🔄 **Vue 2/3 Compatible** - Single codebase supporting both Vue 2.6+ and Vue 3.0+
- 🧩 **Web Components** - Use directives with Custom Elements / Web Components
- 📦 **Tree-shakable** - Import only what you need
- 🔒 **TypeScript** - Full TypeScript support with type definitions
- 🚀 **SSR Friendly** - Multiple directives support SSR out of the box
- 📦 **Multiple Formats** - ESM, CJS, and IIFE (CDN) formats available
- ⚡ **Zero Dependencies** - Lightweight with minimal bundle size
- 🎨 **Composables** - Every directive has a corresponding composable for Composition API
- 🔧 **Utility Exports** - Export `configurePermission`, `getPermissionConfig` and other utilities for advanced usage
- 🌐 **i18n Support** - Built-in internationalization with 8 language translations (Chinese, English, Japanese, Korean, French, German, Spanish, Russian)
- 🔌 **Plugin System** - Extensible plugin architecture for community contributions

## What's New in v2.5.0

### Browser Extension Enhancement Release

This release transforms the browser extension from skeleton to full-featured DevTools panel, enhances VS Code diagnostics, and improves documentation.

**Browser Extension (DevTools Panel):**
- 🎯 **Full-featured UI** — 4-tab interface (Directives, Performance, Issues, Export)
- 🔄 **Real-time Monitoring** — MutationObserver auto-detects DOM changes
- 📊 **Performance Charts** — Visual bar charts for mount/update/unmount timing
- 🔍 **Enhanced State Inspector** — Unified types, directive parser, search/filter
- 📤 **Export Reports** — JSON, CSV, HTML formats with timestamps

**VS Code Extension:**
- ⚠️ **Bottleneck Detection** — Slow mount (>50ms), slow update (>16ms), excessive updates, memory leaks
- 🩺 **4 New Diagnostics** — Modifier combos, memory leaks, SSR hydration, accessibility
- 🎯 **New Commands** — `inspectState`, `showBottlenecks`, `openDirectiveDocs`, `searchDocs`, `insertDirective`

**Documentation:**
- 🔍 **MiniSearch Optimization** — Boosted titles, fuzzy matching (EN/ZH locales)
- ▶️ **One-Click Run** — Playground "Run" button opens generated code

---

## v2.4.0 (Previous Release)

## What's New in v2.3.0

### Internationalization Expansion

This release significantly expands i18n support with 5 new languages and utility tools:

- 🇰🇷 **Korean (ko-KR)** - Full translation support
- 🇫🇷 **French (fr-FR)** - Full translation support
- 🇩🇪 **German (de-DE)** - Full translation support
- 🇪🇸 **Spanish (es-ES)** - Full translation support
- 🇷🇺 **Russian (ru-RU)** - Full translation support

**New Utilities:**
- `LocaleDetector` - Auto-detect user's preferred language
- `LocaleLoader` - Dynamic loading and caching of locale messages

```typescript
import { LocaleDetector, LocaleLoader, koKR, frFR } from 'directix'

// Auto-detect user language
const locale = LocaleDetector.detect() // 'ko-KR', 'fr-FR', etc.

// Dynamically load locale
const messages = await LocaleLoader.load('ko-KR')
```

---

## What's New in v2.2.0

### Performance Optimization Release

v2.2.0 focuses on extreme performance optimization: smaller bundles, faster runtime, and better memory efficiency.

#### Event Delegation Manager

Reduce DOM event listeners with global event delegation:

```typescript
import { registerDelegatedHandler, unregisterDelegatedHandler } from 'directix'

// Delegate click events for all .btn elements
const id = registerDelegatedHandler('.btn', 'click', (event, target) => {
  console.log('Button clicked:', target)
})

// Clean up when done
unregisterDelegatedHandler(id)
```

#### Batch Processor & DOM Batch Updater

Avoid layout thrashing with read/write separation:

```typescript
import { domRead, domWrite } from 'directix'

// Batch DOM reads and writes
domRead(() => {
  const height = element.offsetHeight
  domWrite(() => {
    element.style.transform = `translateY(${height}px)`
  })
})
```

#### Virtual List Optimizer

Optimize virtual scrolling with dynamic height caching and VNode recycling:

```typescript
import { VirtualListOptimizer } from 'directix'

const optimizer = new VirtualListOptimizer({ bufferSize: 5, dynamicHeight: true })
optimizer.init(1000, 600)
optimizer.cacheItemHeight(0, 48)
const range = optimizer.calculateVisibleRange(scrollTop)
```

#### Memory Leak Detector

Automatically detect and report memory leaks:

```typescript
import { trackResource, cleanupResource, startLeakDetection } from 'directix'

startLeakDetection()
const id = trackResource('event-listener', 'scroll handler', () => {
  window.removeEventListener('scroll', handler)
})
// On unmount: cleanupResource(id)
```

### Enhanced APIs

| API | Change |
|-----|--------|
| `ObjectPool` | Added `autoExpand`, `preWarm()`, enhanced `getStats()` |
| `WeakCache` | Added LRU eviction, `getStats()` with hit rate |

### Performance Targets

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Single directive | 1.2KB | ≤1KB | 17% |
| Full bundle | 25KB | ≤20KB | 20% |
| Mount time | 2ms | ≤1ms | 50% |

---

## What's New in v2.1.0

### Enhanced Web Components Support

v2.1.0 significantly enhances Web Components support with Shadow DOM, SSR safety, lifecycle hooks, and more:

```typescript
import { 
  vLazy, 
  defineCustomElementDirective, 
  createSSRSafeCustomElement,
  hydrateCustomElements 
} from 'directix'

// Define with lifecycle hooks and styles
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
const LazyImage = createSSRSafeCustomElement('lazy-img', vLazy, {
  shadow: true,
  styles: ':host { display: block; }',
})

// SSR render
const html = LazyImage.ssrRender({ src: 'image.jpg' })

// Client hydration
hydrateCustomElements(document.body)
```

### New Web Components APIs

| API | Description |
|-----|-------------|
| `CustomElementLifecycleHooks` | Lifecycle hooks interface (onConnect, onDisconnect, onAdopt, onAttributeChange) |
| `SSRSafeCustomElement` | SSR-safe custom element type |
| `isCustomElementDefined(name)` | Check if a custom element is already defined |
| `whenCustomElementDefined(name)` | Async wait for custom element definition |
| `getRegisteredCustomElements()` | Get all registered custom element names |
| `hydrateCustomElements(root)` | Hydrate custom elements on client (SSR support) |
| `createSSRSafeCustomElement()` | Create SSR-safe custom elements with declarative Shadow DOM |

### Vue 3 Conditional Optimizations

When using Vue 3, Directix automatically applies performance optimizations:

```typescript
import { useLazyOptimized, useSuspenseDirective, teleportContent } from 'directix'

// Optimized lazy loading with shallowRef (Vue 3 only)
const { state, observe } = useLazyOptimized({
  onLoad: (entry) => console.log('Visible!')
})

// Suspense-ready async directive
const { state, load } = useSuspenseDirective({
  loader: () => fetchData()
})

// Teleport content to target
teleportContent(element, { to: '#modal-container' })
```

### Vue 2 Support Maintained

**v2.0.0 will maintain full Vue 2 compatibility** - all v1.x code continues to work without modifications. We are committed to supporting both Vue 2 and Vue 3.

### Mobile Optimization

Enhanced touch gestures with haptic feedback and PWA support.

```typescript
import { useEnhancedTouch, triggerHaptic, usePWA } from 'directix'

// 12+ gesture types with haptic feedback
const { activeGesture, bind } = useEnhancedTouch({
  feedback: { haptic: true, visual: true },
  onSwipe: (e) => console.log(`Swiped ${e.direction}`),
  onPinch: (e) => console.log(`Scale: ${e.scale}`),
})

// PWA support
const { isOnline, needsUpdate } = usePWA({ serviceWorker: { enabled: true } })
```

### Accessibility (A11y)

Comprehensive ARIA support, screen reader announcements, and keyboard navigation.

```typescript
import { 
  applyAriaAttributes, 
  announce, 
  useKeyboardNavigation, 
  useFocusTrap 
} from 'directix'

// Apply ARIA attributes
applyAriaAttributes(element, {
  role: 'button',
  ariaLabel: 'Submit',
  ariaDisabled: true,
})

// Screen reader announcements
announce('Form submitted successfully')

// Keyboard navigation with focus trap
const { bind } = useKeyboardNavigation({ focusTrap: true, rovingTabindex: true })
```

### Security Enhancement

Advanced XSS protection, CSP compatibility, and security audit tools.

```typescript
import { sanitizeHtml, SecurityAudit, getCSPNonce } from 'directix'

// Advanced HTML sanitization
const clean = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'p'],
  detectDangerousPatterns: true,
})

// Security audit
const report = SecurityAudit.generateReport(htmlContent)
console.log(SecurityAudit.formatReport(report, 'json'))

// Check dependencies for vulnerabilities
const vulns = await SecurityAudit.checkDependencies()
```

## What's New in v1.9.0

### Internationalization (i18n)

Full i18n support for directive messages and documentation.

```typescript
import { createI18n, setLocale } from 'directix'

// Initialize with locale
createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: { 'en-US': enUS, 'zh-CN': zhCN, 'ja-JP': jaJP }
})

// Switch locale at runtime
setLocale('zh-CN')
```

### Unified Warning System

Improved developer experience with structured error messages.

```typescript
import { warn, directiveWarn, assertType } from 'directix'

// Directive-specific warnings
directiveWarn('debounce', 'errors.invalid_wait', { wait: 'abc' })

// Type assertions
assertType<number>(value, 'number', 'debounce', 'wait')
```

### Plugin System

Extensible plugin architecture for community contributions.

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

### Community Plugin Registry

Discover and install community plugins programmatically.

```typescript
import { getPluginRegistry } from 'directix'

const registry = getPluginRegistry()

// Search plugins
const results = await registry.search('animation')

// Get all plugins
const plugins = await registry.getAll()

// Install a plugin
await registry.install('directix-animate', manager)
```

### Timezone & Locale Utilities

Region-specific formatting for dates, numbers, and currencies.

```typescript
import { getTimezoneInfo, formatDateLocale, formatCurrencyLocale } from 'directix'

// Get timezone info
const tz = getTimezoneInfo() // { id: 'Asia/Shanghai', offset: 8, ... }

// Format date by locale
formatDateLocale(new Date()) // Auto-detects user locale

// Format currency
formatCurrencyLocale(99.99) // '$99.99' (US) or '99,99€' (DE)
```

### Vue DevTools Integration

Debug directives directly in Vue DevTools.

```typescript
import { enableDevtools, trackDirective } from 'directix'

// Enable DevTools integration
enableDevtools()

// Track directive usage
trackDirective('debounce', { element: 'input' })
```

### Performance Monitoring

Measure directive performance with detailed metrics.

```typescript
import { enablePerformance, getPerformanceReport } from 'directix'

// Enable monitoring
enablePerformance()

// Get performance report
const report = getPerformanceReport()
// [{ name: 'debounce', mount: { p50: 0.5ms, p95: 1.2ms }, ... }]
```

### Scenario Examples

10+ real-world examples demonstrating directive combinations:

- **Form Validation** - v-debounce, v-mask, v-trim, v-focus
- **Permission Management** - v-permission, v-click-outside
- **Image Gallery** - v-lazy, v-image-preview, v-swipe
- **Infinite Scroll** - v-infinite-scroll, v-virtual-list, v-loading
- **Rich Text Editor** - v-sanitize, v-highlight, v-emoji
- **Gesture Interaction** - v-touch, v-swipe, v-pan, v-pinch
- **Data Visualization** - v-progress, v-counter, v-countdown
- **Drag & Sort** - v-draggable, v-intersect
- **Print & Export** - v-print, v-export
- **Fullscreen Media** - v-fullscreen, v-lottie

## Online Demo

Try it online with StackBlitz or CodeSandbox:

| Demo | StackBlitz | CodeSandbox |
|------|------------|-------------|
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3) | [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/saqqdy/directix/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2) | [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/saqqdy/directix/tree/master/examples/vue2) |

## Playground

Try the interactive [Playground](https://saqqdy.github.io/directix/playground/) to configure directives and generate code:

- **57+ Directives** - Full coverage of all Directix directives
- **Vue 2 & Vue 3** - Generate code for either version
- **Composables** - Generate composable API code
- **TypeScript Ready** - Full type definitions included
- **Monaco Editor** - Full-featured code editor with syntax highlighting
- **Live Preview** - See directive effects in real-time

Each directive documentation page also includes a code generator for quick code snippets.

## Installation

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

### Vue 2 Support

For Vue 2.0-2.6, you need to install `@vue/composition-api`:

```bash
npm install @vue/composition-api
```

Vue 2.7+ has built-in Composition API support, so no additional dependencies are needed.

## CDN

You can also use Directix via CDN:

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<!-- Vue 2.7+ -->
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

The CDN build works seamlessly with both Vue 2 and Vue 3.

## Requirements

- Vue 2.0+ or Vue 3.0+
- Node.js 12.20+ (for build tools)
- For Vue 2.0-2.6: `@vue/composition-api` is required

## Quick Start

### Global Registration

```typescript
// Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

const app = createApp(App)
app.use(Directix)

// Or register specific directives only
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

### On-Demand Import

```typescript
import { vClickOutside, vCopy, vDebounce } from 'directix'

// Vue 3
app.directive('click-outside', vClickOutside)
app.directive('copy', vCopy)

// Vue 2
Vue.directive('click-outside', vClickOutside)
```

### Using Composables

Every directive has a corresponding composable for use with the Composition API:

```typescript
import { useClickOutside, useCopy, useDebounce } from 'directix'

// In setup() or <script setup>
const { copy, copied } = useCopy({ source: textRef })
const { isHovering, bind } = useHover({ onEnter: handleEnter })
const { run: debouncedSearch } = useDebounce({ handler: search, wait: 500 })
```

See the [Composables](#composables) section below for all available composables.

## Nuxt Integration

Directix provides a Nuxt module for seamless integration with Nuxt 3 applications.

### Installation

The Nuxt module is included in the main package. Simply add it to your `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  
  directix: {
    // Enable/disable the module (default: true)
    enabled: true,
    
    // Only include specific directives (optional)
    include: ['v-click-outside', 'v-copy', 'v-debounce'],
    
    // Or exclude specific directives (optional)
    exclude: ['v-ripple'],
    
    // Default options for directives (optional)
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => ['read', 'write']
        }
      }
    },
    
    // Auto-import composables (default: true)
    autoImportComposables: true
  }
})
```

### Usage in Nuxt

Directives are automatically registered and composables are auto-imported:

```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">Copy</button>
  </div>
</template>

<script setup>
// Composables are auto-imported, no need to import manually
const { copy, copied } = useCopy({ source: text })
const { isHovering } = useHover({ onEnter: handleEnter })
</script>
```

### SSR Compatibility

Directives that are not SSR-compatible will only run on the client side. The Nuxt module handles this automatically.

## Available Directives

### Event Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-click-outside` | Detect clicks outside an element | ❌ |
| `v-click-delay` | Delay click execution to prevent double clicks | ✅ |
| `v-debounce` | Debounce event handlers | ✅ |
| `v-throttle` | Throttle event handlers | ✅ |
| `v-long-press` | Detect long press events | ❌ |
| `v-hover` | Hover state detection | ❌ |
| `v-hotkey` | Keyboard shortcut binding | ✅ |
| `v-touch` | Touch gesture detection (swipe, pinch, rotate) | ❌ |
| `v-swipe` | Swipe gesture detection with mouse support | ❌ |

### Form Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-copy` | Copy text to clipboard | ❌ |
| `v-focus` | Auto focus an element | ✅ |
| `v-mask` | Input masking | ❌ |
| `v-trim` | Trim input whitespace | ✅ |
| `v-money` | Currency format input | ❌ |
| `v-number` | Number format input | ❌ |
| `v-ellipsis` | Text ellipsis overflow | ✅ |

### Format Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-uppercase` | Convert text to uppercase | ✅ |
| `v-lowercase` | Convert text to lowercase | ✅ |
| `v-capitalcase` | Capitalize first letter | ✅ |
| `v-truncate` | Truncate text with ellipsis | ✅ |

### Visibility Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-lazy` | Lazy load images | ❌ |
| `v-intersect` | Detect element intersection | ❌ |
| `v-visible` | Control element visibility | ✅ |
| `v-loading` | Show loading overlay | ✅ |

### Scroll Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-scroll` | Scroll event handling | ❌ |
| `v-infinite-scroll` | Infinite scrolling | ❌ |
| `v-sticky` | Sticky positioning | ❌ |
| `v-pull-refresh` | Pull to refresh functionality | ❌ |
| `v-virtual-list` | Virtual list for large datasets | ❌ |

### Security Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-permission` | Permission-based element control | ✅ |
| `v-sanitize` | Sanitize HTML content | ✅ |

### Effect Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-ripple` | Material design ripple effect | ❌ |
| `v-draggable` | Make elements draggable | ❌ |

### Observer Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-resize` | Element resize observer | ❌ |
| `v-mutation` | DOM mutation observer | ❌ |

### UI Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-tooltip` | Tooltip component | ❌ |
| `v-image-preview` | Image preview with zoom | ❌ |
| `v-countdown` | Countdown timer display | ✅ |
| `v-print` | Print element content | ❌ |
| `v-watermark` | Watermark overlay | ✅ |
| `v-skeleton` | Skeleton loading placeholder | ✅ |
| `v-progress` | Progress bar animation | ❌ |
| `v-counter` | Animated number counter | ✅ |

### Gesture Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-pan` | Pan/drag gesture | ❌ |
| `v-pinch` | Pinch/zoom gesture | ❌ |
| `v-rotate-gesture` | Rotation gesture | ❌ |

### Visual Effect Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-blur` | Background blur overlay | ❌ |
| `v-fade` | Fade in/out transition | ✅ |
| `v-parallax` | Parallax scrolling effect | ❌ |
| `v-lottie` | Lottie animation player | ❌ |
| `v-typewriter` | Typewriter animation | ✅ |
| `v-click-wave` | Click wave effect | ❌ |

### Data Directives

| Directive | Description | SSR |
|-----------|-------------|-----|
| `v-export` | Export data (CSV/JSON/HTML) | ❌ |
| `v-highlight` | Keyword highlighting | ✅ |
| `v-emoji` | Emoji input filter | ❌ |
| `v-context-menu` | Right-click context menu | ❌ |
| `v-fullscreen` | Fullscreen toggle | ❌ |

> ✅ = SSR compatible | ❌ = Not SSR compatible

## Composables

Every directive has a corresponding composable function for use with the Composition API. All composables are exported from `directix`:

### Event Composables

| Composable | Description |
|------------|-------------|
| `useClickOutside` | Detect clicks outside an element |
| `useClickDelay` | Delay click execution |
| `useDebounce` | Debounce function calls |
| `useThrottle` | Throttle function calls |
| `useLongPress` | Detect long press gestures |
| `useHover` | Track hover state |
| `useHotkey` | Handle keyboard shortcuts |
| `useTouch` | Detect touch gestures |
| `useSwipe` | Detect swipe gestures |

### Form Composables

| Composable | Description |
|------------|-------------|
| `useCopy` | Copy text to clipboard |
| `useFocus` | Manage element focus |
| `useMask` | Input masking |
| `useTrim` | Trim input whitespace |
| `useMoney` | Currency formatting |
| `useNumber` | Number formatting |
| `useEllipsis` | Text ellipsis overflow |

### Format Composables

| Composable | Description |
|------------|-------------|
| `useUppercase` | Transform to uppercase |
| `useLowercase` | Transform to lowercase |
| `useCapitalcase` | Capitalize text |
| `useTruncate` | Truncate text |

### Visibility Composables

| Composable | Description |
|------------|-------------|
| `useLazy` | Lazy load images |
| `useIntersect` | Detect element intersection |
| `useVisible` | Control element visibility |
| `useLoading` | Show loading overlay |

### Scroll Composables

| Composable | Description |
|------------|-------------|
| `useScroll` | Track scroll position |
| `useInfiniteScroll` | Infinite scrolling |
| `useSticky` | Sticky positioning |
| `usePullRefresh` | Pull to refresh |
| `useVirtualList` | Virtual list for large datasets |

### Other Composables

| Composable | Description |
|------------|-------------|
| `usePermission` | Permission checking |
| `useSanitize` | Sanitize HTML content |
| `useRipple` | Material design ripple effect |
| `useDraggable` | Make elements draggable |
| `useResize` | Element resize observer |
| `useMutation` | DOM mutation observer |
| `useTooltip` | Tooltip control |
| `useImagePreview` | Image preview with zoom |
| `useCountdown` | Countdown timer |
| `usePrint` | Print content |
| `useWatermark` | Watermark overlay |
| `useSkeleton` | Skeleton loading state |
| `useProgress` | Progress bar control |
| `useCounter` | Animated number counter |
| `usePan` | Pan gesture detection |
| `usePinch` | Pinch gesture detection |
| `useRotateGesture` | Rotation gesture detection |
| `useBlur` | Blur overlay control |
| `useFade` | Fade transition control |
| `useParallax` | Parallax scrolling |
| `useLottie` | Lottie animation control |
| `useTypewriter` | Typewriter effect |
| `useExport` | Data export utilities |
| `useHighlight` | Keyword highlighting |
| `useEmoji` | Emoji filtering |
| `useContextMenu` | Context menu control |
| `useFullscreen` | Fullscreen mode control |
| `useClickWave` | Click wave effect |

### Composable Usage Example

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
  onEnter: () => console.log('Entered'),
  onLeave: () => console.log('Left')
})

// useDebounce
const { run: debouncedSearch } = useDebounce({
  handler: (query) => fetchResults(query),
  wait: 500
})
</script>

<template>
  <button @click="copy()">
    {{ copied ? 'Copied!' : 'Copy' }}
  </button>

  <button ref="buttonRef" :class="{ active: isHovering }">
    Hover me
  </button>
</template>
```

## Usage Examples

### v-click-outside

Detect clicks outside an element, useful for closing dropdowns, modals, etc.

```vue
<template>
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">Toggle</button>
    <div v-if="show">Dropdown content</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useClickOutside } from 'directix'

const show = ref(false)

function closeDropdown() {
  show.value = false
}

// Composable usage
const containerRef = ref()
useClickOutside(containerRef, () => {
  show.value = false
})
</script>
```

### v-copy

Copy text to clipboard with a simple directive.

```vue
<template>
  <!-- Simple usage -->
  <button v-copy="textToCopy">Copy to clipboard</button>

  <!-- With callbacks -->
  <button v-copy="{ value: text, onSuccess: handleSuccess, onError: handleError }">
    Copy with callback
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useCopy } from 'directix'

const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
}

function handleError(error) {
  console.error('Copy failed:', error)
}

// Composable usage
const sourceText = ref('Hello World')
const { copy, copied } = useCopy({ source: sourceText })
</script>
```

### v-debounce

Debounce event handlers to limit execution frequency.

```vue
<template>
  <!-- Default: 300ms -->
  <input v-debounce="handleInput" />

  <!-- Custom wait time with modifier -->
  <input v-debounce:500ms="handleInput" />

  <!-- With options object -->
  <input v-debounce="{ handler: handleInput, wait: 500, leading: true }" />
</template>

<script setup>
import { useDebounce } from 'directix'

function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}

// Composable usage
const { run: debouncedSearch, cancel } = useDebounce({
  handler: (query) => fetchResults(query),
  wait: 500
})
</script>
```

### v-throttle

Throttle event handlers to limit execution frequency.

```vue
<template>
  <!-- Default: 300ms -->
  <button v-throttle="handleClick">Throttled click</button>

  <!-- Custom wait time with modifier -->
  <button v-throttle:1s="handleClick">1 second throttle</button>

  <!-- With options object -->
  <button v-throttle="{ handler: handleClick, wait: 1000, leading: true, trailing: false }">
    Throttle with options
  </button>
</template>

<script setup>
import { useThrottle } from 'directix'

function handleClick() {
  console.log('Throttled click')
}

// Composable usage
const { run: throttledScroll, cancel } = useThrottle({
  handler: (position) => updatePosition(position),
  wait: 100
})
</script>
```

### v-focus

Auto focus an element when mounted.

```vue
<template>
  <!-- Simple usage -->
  <input v-focus />

  <!-- With options -->
  <input v-focus="{ focus: true, refocus: true }" />
</template>

<script setup>
import { useFocus } from 'directix'

// Composable usage
const { focus, blur, hasFocus } = useFocus()
</script>
```

### v-permission

Control element visibility based on user permissions.

```vue
<template>
  <!-- Simple permission check -->
  <button v-permission="'admin'">Admin Only</button>

  <!-- Multiple permissions (OR logic) -->
  <button v-permission="['admin', 'editor']">Admin or Editor</button>

  <!-- AND logic -->
  <button v-permission="{ value: ['read', 'write'], mode: 'every' }">
    Requires both permissions
  </button>

  <!-- Disable instead of remove -->
  <button v-permission="{ value: 'admin', action: 'disable' }">
    Disabled for non-admin
  </button>
</template>

<script setup>
import { configurePermission, usePermission } from 'directix'

configurePermission({
  getPermissions: () => ['read', 'write'],
  getRoles: () => ['editor'],
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write', 'edit']
  }
})

// Composable usage
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()
const canEdit = hasPermission('edit')
</script>
```

### v-lazy

Lazy load images when they enter the viewport.

```vue
<template>
  <!-- Simple usage -->
  <img v-lazy="imageUrl" />

  <!-- With placeholder and error image -->
  <img v-lazy="{ src: imageUrl, placeholder: '/placeholder.png', error: '/error.png' }" />
</template>

<script setup>
import { useLazy } from 'directix'

// Composable usage
const { load, state, loaded } = useLazy({
  src: 'image.jpg',
  preload: 100
})
</script>
```

### v-mask

Input masking for formatted input.

```vue
<template>
  <!-- Phone number -->
  <input v-mask="'(###) ###-####'" placeholder="Phone" />

  <!-- Date -->
  <input v-mask="'##/##/####'" placeholder="MM/DD/YYYY" />

  <!-- SSN -->
  <input v-mask="{ mask: '###-##-####', placeholder: '_' }" placeholder="SSN" />
</template>

<script setup>
import { useMask } from 'directix'

// Composable usage
const { maskedValue, unmaskedValue, update } = useMask({
  mask: '(###) ###-####',
  value: '1234567890'
})
</script>
```

### v-loading

Show loading overlay on elements.

```vue
<template>
  <!-- Simple usage -->
  <div v-loading="isLoading">Content</div>

  <!-- With options -->
  <div v-loading="{ value: isLoading, text: 'Loading...', lock: true }">
    Content with locked scroll
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLoading } from 'directix'

const isLoading = ref(true)

// Composable usage
const { show, hide, setText } = useLoading({
  text: 'Loading...',
  lock: true
})
</script>
```

### v-sanitize

Sanitize HTML content to prevent XSS attacks.

```vue
<template>
  <!-- Simple usage -->
  <div v-sanitize="userContent"></div>

  <!-- With custom allowed tags -->
  <div v-sanitize="{ html: userContent, allowedTags: ['b', 'i', 'u'] }"></div>
</template>

<script setup>
import { useSanitize } from 'directix'

// Composable usage
const { sanitize, setAllowedTags } = useSanitize({
  allowedTags: ['b', 'i', 'u', 'a']
})
const cleanHtml = sanitize(dirtyHtml)
</script>
```

### v-tooltip

Display tooltips on hover or click.

```vue
<template>
  <!-- Simple usage -->
  <button v-tooltip="'Tooltip content'">Hover me</button>

  <!-- With options -->
  <button v-tooltip="{ content: 'Tooltip', placement: 'bottom', trigger: 'click' }">
    Click me
  </button>
</template>

<script setup>
import { useTooltip } from 'directix'

// Composable usage
const { show, hide, updateContent, updatePosition } = useTooltip({
  content: 'Tooltip content',
  placement: 'top'
})
</script>
```

### v-image-preview

Preview images with zoom and gesture support.

```vue
<template>
  <!-- Simple usage -->
  <img v-image-preview src="thumbnail.jpg" data-preview="full.jpg" />

  <!-- With options -->
  <img v-image-preview="{ src: 'thumbnail.jpg', previewSrc: 'full.jpg', enablePinchZoom: true }" />
</template>

<script setup>
import { useImagePreview } from 'directix'

// Composable usage
const { open, close, zoom, rotate } = useImagePreview({
  enablePinchZoom: true
})
</script>
```

### v-draggable

Make elements draggable.

```vue
<template>
  <!-- Simple usage -->
  <div v-draggable>Drag me</div>

  <!-- With constraints -->
  <div v-draggable="{ axis: 'x', bounds: 'parent' }">Horizontal drag only</div>
</template>

<script setup>
import { useDraggable } from 'directix'

// Composable usage
const { position, isDragging, reset } = useDraggable({
  axis: 'x',
  bounds: 'parent'
})
</script>
```

### v-uppercase / v-lowercase / v-capitalcase

Transform text case.

```vue
<template>
  <input v-uppercase placeholder="Auto uppercase" />
  <input v-lowercase placeholder="Auto lowercase" />
  <input v-capitalcase placeholder="Capitalize first letter" />
</template>

<script setup>
import { useUppercase, useLowercase, useCapitalcase } from 'directix'

// Composable usage
const { transform: toUppercase } = useUppercase()
const { transform: toLowercase } = useLowercase()
const { transform: toCapitalcase } = useCapitalcase()
</script>
```

### v-truncate

Truncate text with ellipsis.

```vue
<template>
  <!-- Simple usage -->
  <p v-truncate="50">Long text here...</p>

  <!-- With options -->
  <p v-truncate="{ length: 100, suffix: '...', position: 'end' }">Long text...</p>
</template>

<script setup>
import { useTruncate } from 'directix'

// Composable usage
const { truncate } = useTruncate({ length: 100, suffix: '...' })
const shortText = truncate(longText)
</script>
```

### v-touch

Detect touch gestures.

```vue
<template>
  <div v-touch="{ onSwipe: handleSwipe, onPinch: handlePinch }">
    Swipe or pinch here
  </div>
</template>

<script setup>
import { useTouch } from 'directix'

function handleSwipe(direction) {
  console.log('Swiped:', direction) // 'left', 'right', 'up', 'down'
}

function handlePinch(scale) {
  console.log('Pinched:', scale)
}

// Composable usage
const { onSwipe, onPinch, onRotate } = useTouch({
  onSwipe: handleSwipe
})
</script>
```

### v-trim

Trim input whitespace.

```vue
<template>
  <!-- Trim on blur (default) -->
  <input v-trim />

  <!-- Trim on input -->
  <input v-trim="{ position: 'both', event: 'input' }" />
</template>

<script setup>
import { useTrim } from 'directix'

// Composable usage
const { trim, trimLeft, trimRight } = useTrim({ position: 'both' })
</script>
```

### v-money

Currency format input.

```vue
<template>
  <input v-money="{ prefix: '$', precision: 2 }" placeholder="Enter amount" />
</template>

<script setup>
import { useMoney } from 'directix'

// Composable usage
const { format, parse } = useMoney({ prefix: '$', precision: 2 })
const formatted = format(1234.56) // "$1,234.56"
</script>
```

### v-number

Number format input.

```vue
<template>
  <input v-number="{ precision: 2, min: 0, max: 100 }" placeholder="Enter number" />
</template>

<script setup>
import { useNumber } from 'directix'

// Composable usage
const { format, parse } = useNumber({ precision: 2, min: 0, max: 100 })
</script>
```

### v-click-delay

Delay click execution to prevent double clicks.

```vue
<template>
  <!-- Default: 300ms delay -->
  <button v-click-delay="handleClick">Click me</button>

  <!-- Custom delay time -->
  <button v-click-delay="{ handler: handleClick, delay: 500 }">500ms delay</button>
</template>

<script setup>
import { useClickDelay } from 'directix'

function handleClick() {
  console.log('Clicked (delayed)')
}

// Composable usage
const { run: delayedClick, cancel } = useClickDelay({
  handler: handleClick,
  delay: 300
})
</script>
```

### v-countdown

Countdown timer display.

```vue
<template>
  <!-- Simple usage -->
  <span v-countdown="{ time: 60 }"></span>

  <!-- With callbacks -->
  <span v-countdown="{ time: 60, onTick: handleTick, onComplete: handleComplete }"></span>

  <!-- Custom format -->
  <span v-countdown="{ time: 3600, format: 'mm:ss' }"></span>
</template>

<script setup>
import { useCountdown } from 'directix'

function handleTick(remaining) {
  console.log('Remaining:', remaining)
}

function handleComplete() {
  console.log('Countdown complete!')
}

// Composable usage
const { start, pause, reset, remaining } = useCountdown({
  time: 60,
  onTick: handleTick,
  onComplete: handleComplete
})
</script>
```

### v-ellipsis

Text ellipsis overflow with tooltip.

```vue
<template>
  <!-- Simple usage -->
  <div v-ellipsis style="width: 200px;">Long text that will be truncated</div>

  <!-- With custom lines -->
  <div v-ellipsis="{ lines: 2 }">Multi-line text with ellipsis</div>
</template>

<script setup>
import { useEllipsis } from 'directix'

// Composable usage
const { isEllipsisActive, checkEllipsis } = useEllipsis({ lines: 1 })
</script>
```

### v-hotkey

Keyboard shortcut binding.

```vue
<template>
  <!-- Simple usage -->
  <div v-hotkey="{ 'ctrl+s': handleSave, 'ctrl+c': handleCopy }">
    Press Ctrl+S to save
  </div>

  <!-- With modifiers -->
  <input v-hotkey="{ 'enter': submit, 'escape': cancel }" />
</template>

<script setup>
import { useHotkey } from 'directix'

function handleSave() {
  console.log('Saving...')
}

function handleCopy() {
  console.log('Copying...')
}

// Composable usage
const { bind, unbind, unbindAll } = useHotkey({
  'ctrl+s': handleSave
})
</script>
```

### v-print

Print element content.

```vue
<template>
  <!-- Simple usage -->
  <button v-print="printRef">Print</button>
  <div ref="printRef">Content to print</div>

  <!-- Print self -->
  <div v-print="{ self: true }">Click to print this content</div>
</template>

<script setup>
import { ref } from 'vue'
import { usePrint } from 'directix'

const printRef = ref()

// Composable usage
const { print, printElement } = usePrint({
  onBefore: () => console.log('Printing...'),
  onComplete: () => console.log('Printed!')
})
</script>
```

### v-pull-refresh

Pull to refresh functionality.

```vue
<template>
  <div v-pull-refresh="handleRefresh" style="height: 400px; overflow: auto;">
    Pull down to refresh
  </div>

  <!-- With options -->
  <div v-pull-refresh="{ handler: handleRefresh, threshold: 80, disabled: false }">
    Content
  </div>
</template>

<script setup>
import { usePullRefresh } from 'directix'

async function handleRefresh() {
  // Fetch new data
  await fetchData()
}

// Composable usage
const { isLoading, disable, enable } = usePullRefresh({
  handler: handleRefresh
})
</script>
```

### v-swipe

Swipe gesture detection with mouse support.

```vue
<template>
  <div v-swipe="handleSwipe" style="height: 200px;">
    Swipe in any direction
  </div>

  <!-- With options -->
  <div v-swipe="{ onSwipe: handleSwipe, threshold: 50, enableMouse: true }">
    Swipe or drag with mouse
  </div>
</template>

<script setup>
import { useSwipe } from 'directix'

function handleSwipe(direction) {
  console.log('Swiped:', direction) // 'left', 'right', 'up', 'down'
}

// Composable usage
const { direction, lengthX, lengthY } = useSwipe({
  onSwipe: handleSwipe,
  threshold: 50
})
</script>
```

### v-virtual-list

Virtual list for rendering large datasets efficiently.

```vue
<template>
  <div v-virtual-list="{ items: list, itemSize: 50 }" style="height: 500px;">
    <template #default="{ item, index }">
      <div :key="index">{{ item.name }}</div>
    </template>
  </div>
</template>

<script setup>
const list = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))

import { useVirtualList } from 'directix'

// Composable usage
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  largeList,
  { itemHeight: 50 }
)
</script>
```

### v-watermark

Watermark overlay.

```vue
<template>
  <!-- Simple usage -->
  <div v-watermark="'Confidential'" style="width: 100%; height: 400px;">
    Protected content
  </div>

  <!-- With options -->
  <div v-watermark="{ content: 'Draft', fontSize: 16, color: '#ccc', rotate: -20 }">
    Content with watermark
  </div>
</template>

<script setup>
import { useWatermark } from 'directix'

// Composable usage
const { show, hide, update } = useWatermark({
  content: 'Confidential',
  fontSize: 16,
  color: '#ccc'
})
</script>
```

### v-blur

Background blur overlay effect.

```vue
<template>
  <!-- Simple blur -->
  <div v-blur="isBlurred">Content behind blur</div>

  <!-- With radius -->
  <div v-blur="15">Blur with 15px radius</div>

  <!-- With options -->
  <div v-blur="{
    visible: isBlurred,
    radius: 20,
    overlayColor: 'rgba(255, 255, 255, 0.3)',
    lockScroll: true
  }">
    Content
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBlur } from 'directix'

const isBlurred = ref(false)

// Composable usage
const { show, hide, toggle } = useBlur({
  radius: 10,
  overlayColor: 'rgba(0, 0, 0, 0.5)'
})
</script>
```

### v-fade

Fade in/out transition effect.

```vue
<template>
  <!-- Toggle visibility with fade -->
  <div v-fade="isVisible">Fade content</div>

  <!-- Fade in only -->
  <div v-fade="'in'">Fade in</div>

  <!-- With options -->
  <div v-fade="{
    visible: isVisible,
    duration: 500,
    easing: 'ease-in-out',
    onComplete: () => console.log('Fade complete')
  }">
    Content
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFade } from 'directix'

const isVisible = ref(true)

// Composable usage
const { fadeIn, fadeOut, toggle } = useFade({
  duration: 300,
  easing: 'ease'
})
</script>
```

### v-parallax

Parallax scrolling effect.

```vue
<template>
  <!-- Simple parallax -->
  <div v-parallax>Parallax content</div>

  <!-- With speed factor -->
  <div v-parallax="0.3">Slower parallax</div>

  <!-- With options -->
  <div v-parallax="{
    speed: 0.5,
    reverse: true,
    mobileBreakpoint: 768
  }">
    Reverse parallax, disabled on mobile
  </div>
</template>

<script setup>
import { useParallax } from 'directix'

// Composable usage
const { offset, progress, enabled } = useParallax({
  speed: 0.5,
  reverse: false
})
</script>
```

### v-lottie

Lottie animation player.

```vue
<template>
  <!-- With URL -->
  <div v-lottie="'https://assets.example.com/animation.json'"></div>

  <!-- With animation data -->
  <div v-lottie="animationData"></div>

  <!-- With options -->
  <div v-lottie="{
    animationData: animationData,
    autoplay: true,
    loop: true,
    speed: 1.5,
    onComplete: () => console.log('Done')
  }"></div>
</template>

<script setup>
import animationData from './animation.json'
import { useLottie } from 'directix'

// Composable usage
const { play, pause, stop, setSpeed, setDirection } = useLottie({
  animationData,
  autoplay: true,
  loop: true
})
</script>
```

### v-typewriter

Typewriter animation effect.

```vue
<template>
  <!-- Simple usage -->
  <span v-typewriter="'Hello, World!'"></span>

  <!-- With options -->
  <span v-typewriter="{
    text: 'Typing animation',
    speed: 100,
    cursor: '_',
    onComplete: () => console.log('Done!')
  }"></span>

  <!-- Loop mode -->
  <span v-typewriter="{
    text: 'Loop animation',
    loop: true,
    deleteDelay: 1000
  }"></span>
</template>

<script setup>
import { useTypewriter } from 'directix'

// Composable usage
const { start, stop, pause, resume } = useTypewriter({
  text: 'Hello World',
  speed: 50,
  loop: false
})
</script>
```

### v-export

Export data (CSV/JSON/HTML/TXT).

```vue
<template>
  <button v-export="exportData">Export CSV</button>

  <button v-export="{ data: tableData, format: 'json', filename: 'my-data' }">
    Export JSON
  </button>

  <button v-export="{
    data: tableData,
    format: 'csv',
    columns: ['name', 'email'],
    headers: { name: 'Name', email: 'Email Address' }
  }">
    Export with custom columns
  </button>
</template>

<script setup>
const tableData = [
  { name: 'John', email: 'john@example.com', age: 30 },
  { name: 'Jane', email: 'jane@example.com', age: 25 }
]

import { useExport } from 'directix'

// Composable usage
const { exportCSV, exportJSON, exportHTML } = useExport()
</script>
```

### v-highlight

Keyword highlighting.

```vue
<template>
  <p v-highlight="'important'">This is an important message.</p>

  <p v-highlight="['Vue', 'React']">Vue and React are popular frameworks.</p>

  <p v-highlight="{
    keywords: 'highlight',
    className: 'my-highlight',
    style: 'background: yellow; color: black;',
    caseSensitive: true
  }">
    This will highlight the word.
  </p>
</template>

<script setup>
import { useHighlight } from 'directix'

// Composable usage
const { highlight, clear } = useHighlight({
  keywords: ['important', 'key'],
  className: 'highlight'
})
</script>
```

### v-emoji

Emoji input filter.

```vue
<template>
  <!-- Strip all emojis -->
  <input v-emoji type="text" />

  <!-- Strip emojis with replacement -->
  <input v-emoji="{ strip: true, replacement: '*' }" type="text" />

  <!-- Allow specific emojis -->
  <input v-emoji="{ allowList: ['😊', '👍'] }" type="text" />

  <!-- Block specific emojis -->
  <input v-emoji="{ blockList: ['🚫', '❌'] }" type="text" />
</template>

<script setup>
import { useEmoji } from 'directix'

// Composable usage
const { stripEmojis, containsEmoji } = useEmoji({
  strip: true,
  allowList: ['😊', '👍']
})
</script>
```

### v-context-menu

Right-click context menu.

```vue
<template>
  <div v-context-menu="menuItems">Right click here</div>
  <div v-context-menu="{ items: menuItems, width: 200 }">Custom width</div>
</template>

<script setup>
import { useContextMenu } from 'directix'

const menuItems = [
  { label: 'Copy', handler: () => console.log('Copy') },
  { label: 'Paste', handler: () => console.log('Paste') },
  { divider: true, label: '' },
  { label: 'Delete', handler: () => console.log('Delete') }
]

// Composable usage
const { show, hide, setItems } = useContextMenu({
  items: menuItems
})
</script>
```

### v-fullscreen

Fullscreen toggle.

```vue
<template>
  <div v-fullscreen>
    Content to show in fullscreen
    <button @click="$el.toggleFullscreen()">Toggle</button>
  </div>

  <div v-fullscreen="{ fullscreenClass: 'my-fullscreen' }">
    Custom fullscreen class
  </div>
</template>

<script setup>
import { useFullscreen } from 'directix'

// Composable usage
const { isFullscreen, enter, exit, toggle } = useFullscreen({
  onEnter: () => console.log('Entered fullscreen'),
  onExit: () => console.log('Exited fullscreen')
})
</script>
```

### v-skeleton

Skeleton loading placeholder.

```vue
<template>
  <!-- Basic usage -->
  <div v-skeleton="isLoading">Content here</div>

  <!-- With options -->
  <div v-skeleton="{ loading: isLoading, animation: 'pulse', width: 200, height: 20 }">
    Content here
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSkeleton } from 'directix'

const isLoading = ref(true)

// Composable usage
const { show, hide, update } = useSkeleton({
  animation: 'wave',
  color: '#e8e8e8'
})
</script>
```

### v-progress

Progress bar animation.

```vue
<template>
  <div v-progress="50">Progress at 50%</div>

  <div v-progress="{
    value: progressValue,
    color: '#42b883',
    height: 8,
    showText: true
  }">
    Content
  </div>

  <div v-progress="{ indeterminate: true }">
    Loading...
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProgress } from 'directix'

const progressValue = ref(50)

// Composable usage
const { setProgress, start, finish, fail } = useProgress({
  color: '#42b883',
  height: 4
})
</script>
```

### v-counter

Animated number counter.

```vue
<template>
  <span v-counter="1000">0</span>

  <span v-counter="{
    value: 10000,
    duration: 3000,
    decimals: 2,
    useGrouping: true
  }">0</span>

  <span v-counter="{
    value: targetValue,
    formatter: (v) => '$' + v.toFixed(2)
  }">0</span>
</template>

<script setup>
import { ref } from 'vue'
import { useCounter } from 'directix'

const targetValue = ref(1000)

// Composable usage
const { start, pause, reset, update } = useCounter({
  startValue: 0,
  endValue: 1000,
  duration: 2000,
  formatter: (v) => `$${v.toFixed(2)}`
})
</script>
```

### v-click-wave

Click wave effect.

```vue
<template>
  <button v-click-wave>Click me</button>
  <button v-click-wave="'rgba(255, 255, 255, 0.3)'">Custom color</button>
  <button v-click-wave="{ color: 'red', duration: 400 }">Custom options</button>
</template>

<script setup>
import { ref } from 'vue'
import { useClickWave } from 'directix'

// Composable usage
const buttonRef = ref(null)
const { bind, trigger } = useClickWave({
  color: 'currentColor',
  duration: 500
})

// Bind to element on mount
onMounted(() => bind(buttonRef.value))
</script>
```

### v-pan

Pan/drag gesture.

```vue
<template>
  <div v-pan="handlePan">Swipe me</div>

  <div v-pan="{
    onPan: handlePan,
    direction: 'horizontal',
    threshold: 20
  }">
    Horizontal only
  </div>
</template>

<script setup>
import { usePan } from 'directix'

function handlePan(e) {
  console.log('Direction:', e.direction)
  console.log('Distance:', e.distance)
}

// Composable usage
const { isPanning, deltaX, deltaY } = usePan({
  onPan: handlePan,
  direction: 'horizontal'
})
</script>
```

### v-pinch

Pinch/zoom gesture.

```vue
<template>
  <div v-pinch="handlePinch">Pinch to zoom</div>

  <div v-pinch="{
    onPinch: handlePinch,
    enableTransform: true,
    minScale: 0.5,
    maxScale: 3
  }">
    Pinch to scale
  </div>
</template>

<script setup>
import { usePinch } from 'directix'

function handlePinch(e) {
  console.log('Scale:', e.scale)
  console.log('Center:', e.centerX, e.centerY)
}

// Composable usage
const { scale, isPinching } = usePinch({
  onPinch: handlePinch,
  minScale: 0.5,
  maxScale: 3
})
</script>
```

### v-rotate-gesture

Rotation gesture.

```vue
<template>
  <div v-rotate-gesture="handleRotate">Rotate with two fingers</div>

  <div v-rotate-gesture="{
    onRotate: handleRotate,
    enableTransform: true
  }">
    Rotate with transform
  </div>
</template>

<script setup>
import { useRotateGesture } from 'directix'

function handleRotate(e) {
  console.log('Rotation:', e.rotation)
  console.log('Angle:', e.angle)
}

// Composable usage
const { angle, isRotating } = useRotateGesture({
  onRotate: handleRotate,
  enableTransform: true
})
</script>
```

## API Reference

### DirectiveInstallOptions

```typescript
interface DirectiveInstallOptions {
  /** Register specific directives only */
  directives?: string[]
  /** Register all directives (default: true) */
  all?: boolean
  /** Global configuration for directives */
  config?: Record<string, any>
}
```

### Directive Options

Each directive accepts different options. See the [documentation](https://github.com/saqqdy/directix#usage-examples) for detailed API.

## Roadmap

### v1.7.1 (2026-04-11) - Bug Fixes & Improvements ✅

- **Playground Fixes** - Monaco Editor loading, syntax highlighting, Vue version sync
- **UI Improvements** - Removed redundant controls, unified documentation layout

### v1.7.0 (2026-04-15) - Visual Configuration Tool ✅

- **Online Playground** - Live editing environment with Vue 2/3 support
- **Visual Configurator** - Interactive parameter configuration panel
- **Code Generator** - Generate Vue 2/3/Composable/Nuxt code snippets
- **Configuration Presets** - Quick-start templates for common use cases
- **Monaco Editor** - CDN-loaded code editor with syntax highlighting
- **Live Preview** - Real-time directive effect preview

### v1.8.0 (2026-04-22) - Quality & Ecosystem ✅

- **Test Coverage** - 90%+ unit test coverage, E2E testing with Playwright
- **Performance Optimization** - Bundle size optimization, tree-shaking improvements
- **VS Code Extension** - Autocompletion, hover documentation, code snippets
- **CLI Tool** - `directix create`, `directix init`, `directix doctor`, `directix migrate`

### v1.9.0 (Planned - 2026-04-29) - Documentation & Community

- **Interactive Documentation** - Live editing with instant preview
- **Real-world Examples** - 10+ practical scenario examples
- **i18n Support** - English, Chinese, Japanese documentation
- **Developer Experience** - Improved error messages, DevTools integration
- **Plugin System** - Community extension support

### v1.10.0 (Planned - 2026-05-06) - Vue 3 Optimization & Security

- **Vue 3 Optimization Preview** - Suspense, Teleport support
- **Mobile Optimization** - Touch gestures, PWA support
- **Accessibility (A11y)** - ARIA attributes, keyboard navigation
- **Security Enhancements** - XSS protection, CSP compatibility

### v1.11.0 (Planned - 2026-05-13) - Stability & Enterprise

- **Stability** - Browser compatibility, edge case fixes
- **Performance Limits** - Bundle ≤ 25KB, memory optimization
- **Enterprise Features** - Permissions, audit logs, config center
- **v2.0 Migration Prep** - Migration tool, breaking changes warnings

### v2.0.0 (Future)

- Vue 3 exclusive optimizations
- Web Components support

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) © 2024-present saqqdy
