---
title: Playground
description: Interactive playground for configuring and generating Directix directive code
---

# Directix Playground

Configure directives interactively and generate code for Vue 2, Vue 3, composables, and Nuxt.

<Playground />

## Quick Start

1. **Select a Directive** - Choose from the dropdown menu
2. **Choose Vue Version** - Toggle between Vue 2 and Vue 3
3. **Select Output Format** - Template syntax or Composable
4. **Copy Code** - Click copy and paste into your project

## Features

- **57+ Directives** - Full coverage of all Directix directives
- **Vue 2 & Vue 3** - Generate code for either version
- **Composables** - Generate composable API code
- **TypeScript Ready** - Full type definitions included

## Categories

| Category | Description | Directives |
| -------- | ----------- | ---------- |
| Event | Event handling directives | `v-click-outside`, `v-debounce`, `v-throttle`, `v-long-press`, `v-hover`, `v-hotkey`, `v-click-delay` |
| Form | Form input directives | `v-copy`, `v-focus`, `v-mask`, `v-trim` |
| Format | Text formatting directives | `v-uppercase`, `v-lowercase`, `v-capitalcase`, `v-number`, `v-money`, `v-truncate`, `v-ellipsis` |
| Visibility | Visibility control | `v-lazy`, `v-intersect`, `v-visible`, `v-loading` |
| Scroll | Scroll behavior | `v-scroll`, `v-infinite-scroll`, `v-sticky` |
| Security | Security features | `v-permission`, `v-sanitize` |
| UI | UI enhancements | `v-ripple`, `v-click-wave`, `v-tooltip`, `v-draggable`, `v-context-menu`, `v-fullscreen`, `v-skeleton`, `v-blur`, `v-fade` |
| Data | Data visualization | `v-counter`, `v-progress`, `v-countdown` |
| Utility | Utility directives | `v-watermark`, `v-print`, `v-export`, `v-highlight` |

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

## Resources

- [Documentation](/guide/) - Full documentation
- [API Reference](/api/) - Complete API reference
- [Examples](/examples/) - Real-world examples