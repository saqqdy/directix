# Directix

[![npm version](https://img.shields.io/npm/v/directix.svg)](https://www.npmjs.com/package/directix)
[![npm downloads](https://img.shields.io/npm/dm/directix.svg)](https://www.npmjs.com/package/directix)
[![GitHub license](https://img.shields.io/github/license/saqqdy/directix)](https://github.com/saqqdy/directix/blob/main/LICENSE)

A comprehensive, easy-to-use, and high-performance Vue custom directives library supporting both Vue 2 and Vue 3.

## Features

- 🎯 **Comprehensive** - 30+ commonly used directives
- 🔄 **Vue 2/3 Compatible** - Single codebase supports both versions
- 📦 **Tree-shakable** - Import only what you need
- 🔒 **TypeScript** - Full TypeScript support
- 🚀 **SSR Friendly** - Works with server-side rendering
- 🎨 **Zero Dependencies** - No external dependencies

## Installation

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

## Quick Start

### Global Registration

```typescript
// Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

const app = createApp(App)
app.use(Directix)

// Or register specific directives
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
import { vClickOutside, vCopy } from 'directix'

app.directive('click-outside', vClickOutside)
app.directive('copy', vCopy)
```

## Available Directives

### Event Directives

| Directive | Description | Status |
|-----------|-------------|--------|
| `v-click-outside` | Detect clicks outside an element | ✅ |
| `v-debounce` | Debounce event handlers | ✅ |
| `v-throttle` | Throttle event handlers | ✅ |
| `v-long-press` | Detect long press events | ⏳ |

### Form Directives

| Directive | Description | Status |
|-----------|-------------|--------|
| `v-copy` | Copy text to clipboard | ✅ |
| `v-focus` | Auto focus an element | ✅ |
| `v-mask` | Input masking | ⏳ |

### Visibility Directives

| Directive | Description | Status |
|-----------|-------------|--------|
| `v-lazy` | Lazy load images | ⏳ |
| `v-intersect` | Detect element intersection | ⏳ |
| `v-visible` | Control element visibility | ⏳ |

### Security Directives

| Directive | Description | Status |
|-----------|-------------|--------|
| `v-permission` | Permission-based element control | ⏳ |
| `v-sanitize` | Sanitize HTML content | ⏳ |

> ✅ = Available | ⏳ = Coming soon

## Usage Examples

### v-click-outside

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

```vue
<template>
  <button v-copy="textToCopy">Copy to clipboard</button>
  <button v-copy="{ value: text, onSuccess: handleSuccess }">Copy with callback</button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
}
</script>
```

### v-debounce

```vue
<template>
  <input v-debounce="handleInput" />
  <input v-debounce:500ms="handleInput" />
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}
</script>
```

### v-throttle

```vue
<template>
  <button v-throttle="handleClick">Throttled click</button>
  <button v-throttle:1s="handleClick">1 second throttle</button>
</template>

<script setup>
function handleClick() {
  console.log('Throttled click')
}
</script>
```

### v-focus

```vue
<template>
  <input v-focus />
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

## API

### DirectiveInstallOptions

```typescript
interface DirectiveInstallOptions {
  /** Register specific directives */
  directives?: string[]
  /** Register all directives */
  all?: boolean
  /** Global configuration */
  config?: Record<string, any>
}
```

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
