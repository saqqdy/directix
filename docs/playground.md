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

## v2.5.0 Features

- 🖥️ **Browser Extension DevTools Panel** - Full-featured DevTools UI with Directives, Performance, Issues, and Export tabs
- 🔍 **Real-time Directive Monitoring** - MutationObserver auto-detects DOM changes
- 📊 **Performance Charts** - Visual bar charts showing mount/update/unmount timing
- 📤 **Diagnostic Report Export** - JSON, CSV, HTML export formats
- ⚡ **VS Code Bottleneck Detection** - Performance bottleneck warnings with optimization suggestions
- 🔎 **MiniSearch Optimization** - Enhanced local search with boosted titles, fuzzy matching
- ▶️ **One-Click Run Button** - Playground now has "Run" button to open generated code

## v2.4.0 Features

- 🛠️ **VS Code Extension Enhancements** - DirectiveCompletionProvider, hover tooltips, config editor, code snippets
- 🐛 **Debugging Tools** - DiagnosticsProvider, PerformanceAnalyzer, StateInspector
- 📚 **Interactive Examples** - Lazy, Permission, Long Press, Context Menu, Watermark demos
- 📖 **Best Practices Guide** - Directive selection, performance, SSR, security guidelines

## v2.3.0 Features

- 🌍 **5 New Languages** - Korean, French, German, Spanish, Russian translations
- 🔧 **Locale Utilities** - LocaleDetector, LocaleLoader for dynamic loading

## v2.2.0 Features

- ⚡ **Performance Optimization** - Event delegation, batch processing, memory leak detection
- 📦 **Bundle Size Optimization** - Single directive ≤ 1KB gzip

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
