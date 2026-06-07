---
title: Playground
description: Interactive playground for configuring and generating Directix directive code
---

# Directix Playground

Configure directives interactively and generate code for Vue 2, Vue 3, composables, and Nuxt.

<Playground />

## Quick Start

1. **Select a Directive** - Choose from 57+ directives organized by category
2. **Choose Vue Version** - Toggle between Vue 2 and Vue 3
3. **Select Output Format** - Directive syntax or Composable function
4. **Copy Code** - Click copy and paste into your project

## Features

- **57+ Directives** - Full coverage of all Directix directives
- **41+ Composables** - Composable API for every directive
- **Vue 2 & Vue 3** - Generate code for either version
- **TypeScript Ready** - Full type definitions included
- **15 Categories** - Organized by use case

## Categories

| Category | Description | Directives |
| -------- | ----------- | ---------- |
| **Event** | Event handling | `v-click-outside`, `v-debounce`, `v-throttle`, `v-long-press`, `v-hover`, `v-hotkey`, `v-click-delay`, `v-click-wave`, `v-context-menu`, `v-copy` |
| **Visibility** | Visibility control | `v-lazy`, `v-intersect`, `v-visible`, `v-loading`, `v-blur`, `v-skeleton` |
| **Scroll** | Scroll behavior | `v-scroll`, `v-infinite-scroll`, `v-sticky`, `v-parallax`, `v-progress` |
| **Interaction** | User interaction | `v-ripple` |
| **Format** | Text formatting | `v-uppercase`, `v-lowercase`, `v-capitalcase`, `v-number`, `v-money`, `v-truncate`, `v-ellipsis`, `v-trim` |
| **UI** | UI enhancements | `v-tooltip`, `v-draggable`, `v-image-preview`, `v-countdown`, `v-watermark`, `v-print` |
| **Form** | Form handling | `v-focus`, `v-mask` |
| **Security** | Security features | `v-permission`, `v-sanitize` |
| **Observer** | DOM observation | `v-resize`, `v-mutation` |
| **Performance** | Performance optimization | `v-virtual-list` |
| **Mobile** | Touch & gestures | `v-touch`, `v-swipe`, `v-pan`, `v-pinch`, `v-rotate-gesture`, `v-pull-refresh` |
| **Animation** | Animations | `v-fade`, `v-typewriter`, `v-counter`, `v-lottie` |
| **Data** | Data handling | `v-export`, `v-highlight` |
| **Media** | Media controls | `v-fullscreen` |
| **Input** | Input processing | `v-emoji` |

## Usage Example

```vue
<template>
  <!-- Use generated directive code here -->
  <input v-debounce="{ handler: handleSearch, wait: 300 }" />
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')

function handleSearch(event) {
  console.log('Searching:', event.target.value)
}
</script>
```

## v2.1.0 Features

- 🧩 **Enhanced Web Components** - Shadow DOM styles, lifecycle hooks, slot projection
- 🖥️ **SSR Support** - Declarative Shadow DOM, hydrateCustomElements, createSSRSafeCustomElement
- 🔌 **New APIs** - isCustomElementDefined, whenCustomElementDefined, getRegisteredCustomElements
- 🎯 **Extended Options** - styles, observedAttributes, lifecycle hooks for custom elements

## v2.0.0 Features

- 🧩 **Web Components Support** - Use directives with Custom Elements
- ⚡ **Vue 3 Conditional Optimizations** - markRaw, shallowReactive enhancements
- 🔄 **Full Vue 2 Compatibility** - Continued support for Vue 2.x

## Resources

- [Documentation](/guide/) - Full documentation
- [API Reference](/api/) - Complete API reference
- [Examples](/examples/) - Real-world examples
- [GitHub](https://github.com/saqqdy/directix) - Source code
