# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)

**[中文文档](README_CN.md)**

A comprehensive, easy-to-use, and high-performance Vue custom directives library supporting both Vue 2 and Vue 3.

## Features

- 🎯 **Comprehensive** - 40 commonly used directives and 40 composables
- 🔄 **Vue 2/3 Compatible** - Single codebase supports both Vue 2 and Vue 3
- 📦 **Tree-shakable** - Import only what you need
- 🔒 **TypeScript** - Full TypeScript support with type definitions
- 🚀 **SSR Friendly** - Multiple directives support SSR out of the box
- 📦 **Multiple Formats** - ESM, CJS, and IIFE (CDN) formats available
- ⚡ **Zero Dependencies** - Lightweight with minimal bundle size
- 🎨 **Composables** - Every directive has a corresponding composable for Composition API
- 🔧 **Utility Exports** - Export `configurePermission`, `getPermissionConfig` and other utilities for advanced usage

## Online Demo

Try it online with StackBlitz:

| Demo | Link |
|------|------|
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2) |

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

const show = ref(false)

function closeDropdown() {
  show.value = false
}
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
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
}

function handleError(error) {
  console.error('Copy failed:', error)
}
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
function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}
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
function handleClick() {
  console.log('Throttled click')
}
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

Lazy load images when they enter the viewport.

```vue
<template>
  <!-- Simple usage -->
  <img v-lazy="imageUrl" />

  <!-- With placeholder and error image -->
  <img v-lazy="{ src: imageUrl, placeholder: '/placeholder.png', error: '/error.png' }" />
</template>
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
```

### v-uppercase / v-lowercase / v-capitalcase

Transform text case.

```vue
<template>
  <input v-uppercase placeholder="Auto uppercase" />
  <input v-lowercase placeholder="Auto lowercase" />
  <input v-capitalcase placeholder="Capitalize first letter" />
</template>
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
function handleSwipe(direction) {
  console.log('Swiped:', direction) // 'left', 'right', 'up', 'down'
}

function handlePinch(scale) {
  console.log('Pinched:', scale)
}
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
```

### v-money

Currency format input.

```vue
<template>
  <input v-money="{ prefix: '$', precision: 2 }" placeholder="Enter amount" />
</template>
```

### v-number

Number format input.

```vue
<template>
  <input v-number="{ precision: 2, min: 0, max: 100 }" placeholder="Enter number" />
</template>
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
function handleClick() {
  console.log('Clicked (delayed)')
}
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
function handleTick(remaining) {
  console.log('Remaining:', remaining)
}

function handleComplete() {
  console.log('Countdown complete!')
}
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
function handleSave() {
  console.log('Saving...')
}

function handleCopy() {
  console.log('Copying...')
}
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
async function handleRefresh() {
  // Fetch new data
  await fetchData()
}
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
function handleSwipe(direction) {
  console.log('Swiped:', direction) // 'left', 'right', 'up', 'down'
}
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
