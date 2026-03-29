# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-29

### Added

#### New Directives (11 new directives, total 33)

##### Format Directives

###### v-truncate
- Truncate text to specified length
- Support `position: 'start' | 'middle' | 'end'` options
- Support `useCss` option for CSS-based truncation
- Support `showTitle` option to show full text on hover
- SSR compatible

###### v-uppercase
- Transform text to uppercase
- Support `first: true` option to only capitalize first character
- Support input elements with real-time transformation
- SSR compatible

###### v-lowercase
- Transform text to lowercase
- Support `first: true` option to only lowercase first character
- Support input elements with real-time transformation
- SSR compatible

###### v-capitalcase
- Transform text to title case (capitalize each word)
- Support `every: false` option to only capitalize first word
- Support `keepLower` option for words to keep lowercase (articles, prepositions)
- Support input elements with real-time transformation
- SSR compatible

##### Form Directives

###### v-number
- Format numbers with thousands separator
- Support `precision` option for decimal places
- Support `prefix` and `suffix` options
- Support `min` and `max` value constraints
- Support input elements with real-time formatting
- SSR compatible

###### v-money
- Format currency values
- Support custom `symbol` and `symbolPosition` options
- Support all v-number options (precision, separator, etc.)
- Support `showSymbolOnFocus` option for editing
- SSR compatible

###### v-trim
- Trim whitespace from text
- Support `position: 'start' | 'end' | 'both'` options
- Support `onInput` and `onBlur` trigger options
- Support custom characters to trim
- SSR compatible

##### UI Directives

###### v-tooltip
- Tooltip directive with positioning
- Support `placement: 'top' | 'bottom' | 'left' | 'right'` options
- Support `trigger: 'hover' | 'click' | 'focus' | 'manual'` options
- Support `delay` and `hideDelay` options
- Support `arrow` option for tooltip arrow
- Support `onShow` and `onHide` callbacks
- Auto-positioning to stay within viewport

###### v-image-preview
- Image preview modal with zoom support
- Support click to preview images
- Support `previewSrc` for higher resolution image
- Support pinch zoom on mobile
- Support double tap to zoom
- Support swipe up to close
- Support `closeOnClickOutside` and `closeOnEsc` options
- Support `showCloseButton` and `showZoomIndicator` options
- Support `onOpen` and `onClose` callbacks

##### Effect Directives

###### v-draggable
- Make elements draggable
- Support `axis: 'x' | 'y' | 'both'` constraint
- Support `constrain` option to limit within parent
- Support `boundary` option for custom boundary
- Support `handle` option for drag handle
- Support `grid` option for snap-to-grid
- Support `onStart`, `onDrag`, `onEnd` callbacks

##### Event Directives

###### v-touch
- Touch gesture detection
- Support swipe detection (`onSwipe`, `onSwipeLeft`, `onSwipeRight`, `onSwipeUp`, `onSwipeDown`)
- Support pinch detection (`onPinch`)
- Support rotate detection (`onRotate`)
- Support tap detection (`onTap`)
- Support long press detection (`onLongPress`)
- Configurable thresholds for all gestures

### Changed

- Improved TypeScript type definitions for all directives
- Better SSR compatibility across all directives
- Optimized bundle size with better tree-shaking
- Updated README with all 33 directives documentation
- Added comprehensive usage examples for new directives

### Fixed

- Fixed type errors in image-preview directive (CSSStyleDeclaration)
- Fixed type errors in tooltip directive (docHide handler)
- Fixed event listener cleanup in complex directives

---

## [1.1.0] - 2026-03-29

### Added

#### New Directives

##### v-lazy
- Lazy load images with IntersectionObserver
- Support `src`, `placeholder`, `error` options
- Support `preload` option for early loading
- Support `onLoad` and `onError` callbacks
- Support custom IntersectionObserver

##### v-permission
- Permission-based element control
- Support single/multiple permission checks
- Support `mode: 'some' | 'every'` for OR/AND logic
- Support role-based permission mapping
- Support wildcard `'*'` for full access
- Support `action: 'remove' | 'disable' | 'hide'` when permission denied
- Support custom `check` function
- SSR compatible

##### v-long-press
- Detect long press events on elements
- Support custom duration via `duration` option
- Support `onStart`, `onEnd`, `onCancel` callbacks
- Support mobile touch events

##### v-hover
- Detect hover state on elements
- Support `onEnter`, `onLeave` callbacks
- Support `delay` option for delayed trigger

##### v-ripple
- Material Design ripple effect
- Support custom color via `color` option
- Support `duration` option for animation duration
- Support `disabled` option to toggle effect

##### v-scroll
- Scroll event handling with debounce support
- Support custom scroll container detection
- Support `onScroll` callback with scroll info
- Support `throttle` option for performance

##### v-resize
- Element resize observer using ResizeObserver
- Support `onResize` callback with size info
- Support `debounce` option for performance
- Support `box` option for border-box/content-box

##### v-intersect
- Element intersection detection using IntersectionObserver
- Support `onEnter`, `onLeave`, `onChange` callbacks
- Support `threshold` and `rootMargin` options
- Support `once` option for single trigger

##### v-infinite-scroll
- Infinite scrolling for lists
- Support custom distance threshold
- Support `disabled` option to toggle
- Support `immediate` option for initial check
- Support custom scroll container

##### v-sticky
- Sticky positioning with fallback
- Support `offsetTop` option
- Support custom scroll container detection
- Support `onStick` callback

##### v-mask
- Input masking for formatted input
- Support tokens: `#` (digit), `A` (letter), `N` (alphanumeric), `X` (any)
- Support `placeholder` option
- Support `onComplete` and `onChange` callbacks
- Support `clearIncomplete` option

##### v-sanitize
- Sanitize HTML content to prevent XSS
- Built-in DOMPurify integration
- Support custom `allowedTags` option
- Support custom `allowedAttributes` option
- SSR compatible

##### v-loading
- Loading overlay for elements
- Support custom loading text
- Support custom spinner HTML
- Support `lock` option to prevent scrolling
- Support `background` option
- SSR compatible

##### v-visible
- Control element visibility with animation support
- Support `useHidden` option for `visibility: hidden`
- Support transition end events
- Support `handler` callback for visibility changes
- SSR compatible

##### v-mutation
- DOM mutation observer using MutationObserver
- Support `onMutate` callback with mutation records
- Support `options` for MutationObserver config
- Support `debounce` option for performance

#### SSR Support

The following directives now support SSR:
- `v-permission` - Permission checks work on server
- `v-sanitize` - HTML sanitization works on server
- `v-focus` - Safely skips focus on server
- `v-visible` - Safely skips visibility on server
- `v-loading` - Safely skips DOM manipulation on server
- `v-debounce` - Safely skips event binding on server
- `v-throttle` - Safely skips event binding on server

#### Examples

- Added comprehensive demo pages for all new directives
- Vue 2 and Vue 3 example projects updated with all directives
- Interactive demos with code snippets

### Changed

- Improved `defineDirective` SSR handling
- Better error messages for directive configuration
- Optimized directive performance

### Fixed

- Fixed v-intersect observer cleanup on unmount
- Fixed v-sticky scroll container detection
- Fixed v-mask cursor position on input
- Fixed v-permission wildcard handling

---

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

### v1.3.0 (Planned)
- `v-skeleton` - Skeleton loading component
- Composable API enhancements
- Performance optimizations
- Nuxt module
- Better documentation site

### v2.0.0 (Future)
- Vue 3 exclusive optimizations
- Web Components support
- Visual configuration tool
- Online playground
