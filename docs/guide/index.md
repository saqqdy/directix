# Introduction

**Directix** is a comprehensive, easy-to-use, and high-performance Vue custom directives library supporting both Vue 2 and Vue 3.

## Why Directix?

- **🎯 Comprehensive** - 57+ commonly used directives for everyday development
- **🔄 Vue 2/3 Compatible** - Single codebase supports both versions seamlessly
- **📦 Tree-shakable** - Import only what you need, minimal bundle size
- **🔒 TypeScript** - Full TypeScript support with complete type definitions
- **🚀 SSR Friendly** - Works with Nuxt and other SSR frameworks
- **📦 Multiple Formats** - ESM, CJS, and IIFE (CDN) formats available
- **🔷 Nuxt Module** - Official Nuxt 3 module with auto-import support
- **🌐 i18n Support** - Built-in internationalization with multiple languages
- **🔌 Plugin System** - Extensible plugin architecture for community contributions

## Quick Example

```vue
<template>
  <!-- Close dropdown when clicking outside -->
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">Toggle</button>
    <div v-if="show">Dropdown content</div>
  </div>

  <!-- Copy text to clipboard -->
  <button v-copy="textToCopy">Copy to clipboard</button>

  <!-- Debounce input -->
  <input v-debounce:500ms="handleInput" />

  <!-- Auto focus -->
  <input v-focus />
</template>
```

## Browser Support

Directix supports all modern browsers:

| Browser | Support |
| ------- | ------- |
| Chrome  | ✅      |
| Firefox | ✅      |
| Safari  | ✅      |
| Edge    | ✅      |

## License

[MIT License](https://github.com/saqqdy/directix/blob/master/LICENSE)
