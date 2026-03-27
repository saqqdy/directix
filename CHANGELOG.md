# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-27

### Added

#### Core Infrastructure
- Core adapter layer for Vue 2/3 compatibility using adapter pattern
- `defineDirective` factory function for unified directive definition
- **vue-demi integration** for seamless Vue 2/3 compatibility
- Shared utilities (DOM, events, utils)
- TypeScript support with full type definitions
- Vite build configuration with `vite-plugin-dts`
- Vitest test configuration with jsdom
- ESLint 9 flat config with `@eslint-sets/eslint-config`

#### Build Outputs
- **ESM format** (`dist/index.mjs`) - For modern bundlers
- **CJS format** (`dist/index.cjs`) - For Node.js environments
- **IIFE format** (`dist/index.iife.js`) - For CDN usage
- **Minified IIFE** (`dist/index.iife.min.js`) - For production CDN usage
- **Type declarations** (`dist/index.d.ts`) - Full TypeScript support
- **Source maps** for all formats

#### Directives

##### v-click-outside
- Detect clicks outside an element
- Support `exclude` option to exclude specific elements
- Support `disabled` option to toggle detection
- Support `events` option to customize event types (click, touchstart, etc.)
- Support `capture`, `stop`, `prevent` options

##### v-copy
- Copy text to clipboard
- Support Clipboard API with fallback to `execCommand`
- Support `onSuccess` and `onError` callbacks
- Support dynamic text binding

##### v-debounce
- Debounce event handlers
- Support custom delay time via arg (`v-debounce:500`)
- Support `leading` and `trailing` options
- Return debounced function with `cancel` and `flush` methods

##### v-throttle
- Throttle event handlers
- Support custom delay time via arg (`v-throttle:1000`)
- Support `leading` and `trailing` options
- Return throttled function with `cancel` method

##### v-focus
- Auto focus an element on mount
- Support `focus` option to conditionally focus
- Support `refocus` option to re-focus on updates

#### Examples
- Vue 3 example project (`examples/vue3/`)
- Vue 2 example project (`examples/vue2/`)
- Interactive demo pages with Vue Router
- Code snippets for each directive

#### Testing
- Unit tests for all implemented directives
- Test coverage setup with v8 provider

#### Documentation
- VitePress documentation site (`docs/`)
- Bilingual support (English & Chinese)
- API reference for each directive
- Usage examples with live demos
- StackBlitz online demo integration
- README with quick start guide

### Breaking Changes

None (initial release)

### Migration Guide

#### For Vue 2.0-2.6 Users

If you're using Vue 2.0-2.6, you need to install `@vue/composition-api` as a peer dependency:

```bash
npm install @vue/composition-api
```

Vue 2.7+ has built-in Composition API support, so no additional dependencies are needed.

#### CDN Users

The CDN build has changed from `dist/index.umd.js` to `dist/index.iife.min.js`:

```html
<!-- Old -->
<script src="https://unpkg.com/directix/dist/index.umd.js"></script>

<!-- New -->
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

The new CDN build includes `vue-demi` bundled internally for seamless Vue 2/3 compatibility.

### Deprecated

None

### Removed

None

### Fixed

None

### Security

None

---

## Roadmap

### v1.1.0 (Planned)
- `v-lazy` - Lazy load images with IntersectionObserver
- `v-permission` - Permission-based element control
- `v-long-press` - Long press events

### v1.2.0 (Planned)
- `v-scroll` - Scroll event handling
- `v-resize` - Element resize observer
- `v-intersect` - Intersection observer
- `v-infinite-scroll` - Infinite scrolling

### v1.3.0 (Planned)
- `v-mask` - Input masking
- `v-tooltip` - Tooltip directive
- `v-draggable` - Drag and drop
- `v-touch` - Touch gestures
