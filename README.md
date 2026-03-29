# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/master/LICENSE)

**[中文文档](README_CN.md)**

A comprehensive, easy-to-use, and high-performance Vue custom directives library supporting both Vue 2 and Vue 3.

## Features

- 🎯 **Comprehensive** - 21 commonly used directives
- 🔄 **Vue 2/3 Compatible** - Single codebase supports both Vue 2 and Vue 3
- 📦 **Tree-shakable** - Import only what you need
- 🔒 **TypeScript** - Full TypeScript support with type definitions
- 🚀 **SSR Friendly** - 7 directives support SSR out of the box
- 📦 **Multiple Formats** - ESM, CJS, and IIFE (CDN) formats available
- ⚡ **Zero Dependencies** - Lightweight with minimal bundle size

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

## Available Directives

### Event Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-click-outside` | Detect clicks outside an element | ❌ | ✅ |
| `v-debounce` | Debounce event handlers | ✅ | ✅ |
| `v-throttle` | Throttle event handlers | ✅ | ✅ |
| `v-long-press` | Detect long press events | ❌ | ✅ |

### Form Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-copy` | Copy text to clipboard | ❌ | ✅ |
| `v-focus` | Auto focus an element | ✅ | ✅ |
| `v-mask` | Input masking | ❌ | ✅ |

### Visibility Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-lazy` | Lazy load images | ❌ | ✅ |
| `v-intersect` | Detect element intersection | ❌ | ✅ |
| `v-visible` | Control element visibility | ✅ | ✅ |
| `v-loading` | Show loading overlay | ✅ | ✅ |

### Scroll Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-scroll` | Scroll event handling | ❌ | ✅ |
| `v-infinite-scroll` | Infinite scrolling | ❌ | ✅ |
| `v-sticky` | Sticky positioning | ❌ | ✅ |

### Security Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-permission` | Permission-based element control | ✅ | ✅ |
| `v-sanitize` | Sanitize HTML content | ✅ | ✅ |

### Effect Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-hover` | Hover state detection | ❌ | ✅ |
| `v-ripple` | Material design ripple effect | ❌ | ✅ |

### Observer Directives

| Directive | Description | SSR | Status |
|-----------|-------------|-----|--------|
| `v-resize` | Element resize observer | ❌ | ✅ |
| `v-mutation` | DOM mutation observer | ❌ | ✅ |

> ✅ = Available | ❌ = Not SSR compatible

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
