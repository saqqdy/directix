# Changelog

All notable changes to this project will be documented in this file.

## [1.7.1] - 2026-04-11

### Fixed

- **Playground** - Fixed Monaco Editor not loading content properly
- **Playground** - Fixed syntax highlighting showing raw HTML tags in code preview
- **Playground** - Fixed Vue version toggle not syncing with code display
- **Playground** - Removed redundant vue-version-toggle in header (duplicated with internal tabs)

### Changed

- **Documentation** - Unified playground page layout with other documentation pages
- **Documentation** - Improved Playground component styling to match site design
- **Playground** - Simplified UI by removing duplicate controls
- **TypeScript** - Fixed unused variable warnings in DirectiveConfigurator.vue

---

## [1.7.0] - 2026-04-15

### Added

#### Visual Configuration Tool

Interactive playground for configuring directives and generating code.

##### Playground Features

- **Online Playground** - Live editing environment with Vue 2/3 support
- **Directive Selector** - Browse and select from 57+ directives
- **Visual Configurator** - Interactive parameter configuration panel
- **Code Generator** - Generate Vue 2/3/Composable/Nuxt code snippets
- **TypeScript Types** - Full type definitions generation
- **Monaco Editor** - CDN-loaded code editor with syntax highlighting (optional)
- **Live Preview** - Real-time directive effect preview
- **Copy/Download** - One-click copy or download generated code

##### Configuration Presets

Pre-built templates for common directive configurations:
- `v-debounce` - Search input, form validation
- `v-throttle` - Scroll handler, click handler
- `v-lazy` - Image lazy loading
- `v-permission` - Role-based access control
- And more...

##### Documentation Integration

- Embedded Playground in each directive documentation page
- Quick code generator (`<DirectiveConfigurator />`) for instant code snippets
- Standalone Playground page for interactive exploration

#### Deployment

- Playground deployment scripts (GitHub Pages, Vercel, Netlify, S3)
- CDN resource optimization for Monaco Editor
- Added `build:playground` and `deploy:playground` npm scripts

### Changed

- Updated README with Playground section
- Updated documentation with interactive code generators
- Optimized Monaco Editor loading via CDN (removed npm dependency)
- Improved development plan with completed v1.7.0 tasks

### Technical Details

- Monaco Editor loaded dynamically from jsdelivr CDN
- Reduced playground bundle size by removing monaco-editor dependency
- Added Monaco loading state indicator
- Improved code preview with syntax highlighting fallback

---

## [1.6.0] - 2026-04-08

### Added

#### Nuxt Module

Official Nuxt 3 module for seamless integration with Nuxt applications.

##### Features

- **Auto-import composables** - All composables are automatically imported in Nuxt apps
- **Directive auto-registration** - Directives are automatically registered as Vue directives
- **Selective inclusion** - Include or exclude specific directives via configuration
- **SSR compatibility** - Proper handling of client-side only directives

##### Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  
  directix: {
    // Enable/disable the module
    enabled: true,
    
    // Only include specific directives
    include: ['v-click-outside', 'v-copy', 'v-debounce'],
    
    // Or exclude specific directives
    exclude: ['v-ripple'],
    
    // Default options for directives
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

##### Usage in Nuxt

```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">Copy</button>
  </div>
</template>

<script setup>
// Composables are auto-imported
const { copy, copied } = useCopy({ source: text })
const { isHovering } = useHover({ onEnter: handleEnter })
</script>
```

#### Package Exports

- Added `./nuxt` export path for Nuxt module
- Full TypeScript support with type definitions

### Changed

- Updated package.json with Nuxt module exports
- Improved module structure for better tree-shaking

---

## [1.5.0] - 2026-04-06

### Added

#### New Directives (17 new directives, total 57)

##### High-Value Directives

###### v-click-wave
- Simplified ripple effect with easier configuration
- Customizable color, duration, and size ratio
- Perfect for buttons and interactive elements

###### v-context-menu
- Right-click context menu with full customization
- Support for icons, dividers, and disabled items
- Automatic viewport boundary detection
- Custom render function support

###### v-fullscreen
- Toggle fullscreen mode for any element
- Cross-browser support with vendor prefixes
- Keyboard shortcut support (Escape to exit)
- Callbacks for enter/exit/change events

##### Utility Directives

###### v-skeleton
- Skeleton loading placeholder with animations
- Multiple animation types: wave, pulse, none
- Preserves original content dimensions
- Toggle loading state dynamically

###### v-export
- Export data to CSV, JSON, HTML, or TXT
- Custom column selection and header mapping
- Before/after export callbacks
- Automatic file download

###### v-highlight
- Highlight keywords in text content
- Support for single or multiple keywords
- Case-sensitive and whole-word options
- Customizable highlight tag and style

##### Mobile Gestures

###### v-emoji
- Filter or restrict emoji input
- Allow list and block list support
- Custom replacement character
- Works with input and textarea elements

###### v-pan
- Pan/drag gesture detection
- Support for touch and mouse events
- Direction constraints (horizontal/vertical/all)
- Threshold and velocity tracking

###### v-pinch
- Two-finger pinch/zoom gesture
- Min/max scale constraints
- Optional transform application
- Center point tracking

###### v-rotate-gesture
- Two-finger rotation gesture
- Optional transform application
- Angle and rotation tracking
- Works alongside pinch gesture

##### Visual Enhancement

###### v-blur
- Background blur overlay effect
- Customizable radius and overlay color
- Scroll lock option
- Show/hide callbacks

###### v-fade
- Fade in/out transition effect
- Customizable duration and easing
- Min/max opacity control
- Direction support (in/out/toggle)

###### v-parallax
- Parallax scrolling effect
- Adjustable speed factor
- Horizontal/vertical support
- Mobile breakpoint support

###### v-lottie
- Lottie animation player
- Play/pause/stop controls
- Speed and direction control
- Loop and autoplay support

###### v-typewriter
- Typewriter text animation
- Loop mode with delete animation
- Customizable speed and cursor
- Character-by-character callbacks

#### New Composables (17 new composables)

All 17 new directives have corresponding composable functions:

| Composable | Directive | Description |
|------------|-----------|-------------|
| `useClickWave` | v-click-wave | Click wave effect |
| `useContextMenu` | v-context-menu | Context menu control |
| `useFullscreen` | v-fullscreen | Fullscreen mode control |
| `useSkeleton` | v-skeleton | Skeleton loading state |
| `useExport` | v-export | Data export utilities |
| `useHighlight` | v-highlight | Keyword highlighting |
| `useEmoji` | v-emoji | Emoji filtering |
| `usePan` | v-pan | Pan gesture detection |
| `usePinch` | v-pinch | Pinch gesture detection |
| `useRotateGesture` | v-rotate-gesture | Rotation gesture detection |
| `useBlur` | v-blur | Blur overlay control |
| `useFade` | v-fade | Fade transition control |
| `useParallax` | v-parallax | Parallax scrolling |
| `useLottie` | v-lottie | Lottie animation control |
| `useTypewriter` | v-typewriter | Typewriter effect |
| `useProgress` | v-progress | Progress bar animation |
| `useCounter` | v-counter | Counter animation |

### Changed

- Extracted shared utilities to `@directix/shared` package for better code organization
- Updated README with all 57 directives and 57 composables
- Improved directive count accuracy
- Vue 2 demos now use consistent pattern with other demo files (`defineComponent` + `setup()`)
- Improved Composable API demo section with interactive trigger buttons

### Fixed

- `useClickWave`: Fixed incorrect API documentation - the composable returns `{ bind, trigger }` instead of `{ enable, disable }`
- Updated Vue 3 click-wave demo to correctly use `bind()` and `trigger()` methods
- Updated Vue 2 click-wave demo to use Composition API with `defineComponent` + `setup()` pattern
- Updated README.md and README_CN.md with correct `useClickWave` usage examples

---

## [1.4.1] - 2026-04-01

### Fixed

- `useInfiniteScroll`: Fix IntersectionObserver root parameter type error - Window is not a valid root, now correctly passes `null` when scroll parent is Window
- `useTrim`: Add null/undefined/empty string handling to prevent runtime errors

### Changed

- Improved composables exports in `src/composables/index.ts` - added explicit exports for `useInfiniteScroll`, `useLazy`, `useLoading`, `useMask`, `useMutation`, `useRipple`, `useSanitize`, `useSticky`, `useTooltip`, `useTruncate`
- Export `configurePermission` and `getPermissionConfig` functions from main entry point

---

## [1.4.0] - 2026-03-31

### Added

#### Composables (Composition API)

All 40 directives now have corresponding composable functions for use with the Composition API.

**Event Composables:**
- `useClickOutside` - Detect clicks outside an element with `exclude`, `capture`, `stop`, `prevent` options
- `useClickDelay` - Delay click execution to prevent repeated clicks
- `useHotkey` - Handle keyboard shortcuts with modifier keys and key aliases support
- `useLongPress` - Detect long press gestures with `duration`, `distance` options
- `useSwipe` - Detect swipe gestures in all four directions with mouse support
- `useTouch` - Detect touch gestures (swipe, pinch, rotate, tap, long press)

**UI Composables:**
- `useDraggable` - Make elements draggable with `axis`, `constrain`, `boundary`, `handle`, `grid` options
- `useFocus` - Manage element focus with `onFocus`, `onBlur` callbacks
- `useHover` - Track hover state with `enterDelay`, `leaveDelay` options
- `useVisible` - Control element visibility with `useHidden` option
- `useLoading` - Show loading overlay with custom spinner
- `useRipple` - Material Design ripple effect
- `useTooltip` - Tooltip control with positioning
- `useWatermark` - Watermark overlay with protection option
- `useEllipsis` - Text ellipsis overflow with multi-line support

**Scroll & Viewport Composables:**
- `useScroll` - Track scroll position with direction and progress detection
- `useIntersect` - Detect element intersection with viewport
- `useResize` - Track element resize with debounce option
- `useInfiniteScroll` - Infinite scrolling for lists
- `useSticky` - Sticky positioning
- `useVirtualList` - Virtual list for large datasets

**Form & Input Composables:**
- `useCopy` - Copy text to clipboard with reactive source binding
- `useDebounce` - Debounce function calls with `leading`, `trailing` options
- `useThrottle` - Throttle function calls with `leading`, `trailing` options
- `useMask` - Input masking with tokens support
- `usePermission` - Permission checking with role-based mapping

**Format Composables:**
- `useCapitalcase` - Transform text to title case
- `useLowercase` - Transform text to lowercase
- `useUppercase` - Transform text to uppercase
- `useTruncate` - Truncate text with position options
- `useTrim` - Trim whitespace from text
- `useNumber` - Format numbers with thousands separator
- `useMoney` - Format currency values

**Media & Content Composables:**
- `useLazy` - Lazy load images with IntersectionObserver
- `useImagePreview` - Image preview modal with zoom support
- `useSanitize` - Sanitize HTML content to prevent XSS
- `useMutation` - DOM mutation observer
- `usePrint` - Print content with custom styles
- `useCountdown` - Countdown timer functionality
- `usePullRefresh` - Pull to refresh for mobile

#### Utility Functions

- `debounceFn` - Standalone debounce function wrapper with `cancel` and `flush` methods
- `throttleFn` - Standalone throttle function wrapper with `cancel` method
- `createPermissionChecker` - Create reusable permission checker with shared configuration

#### Demo Updates

- Added Composable API demo sections to all 40 Vue 3 demo files
- Added Composable API demo sections to all 40 Vue 2 demo files
- Each directive demo now shows both directive usage and composable usage

### Changed

- Updated main entry to export all composables
- Updated README.md and README_CN.md with composables documentation
- Corrected directive count from 42 to 40

### Fixed

- Improved TypeScript type definitions for composables
- Fixed ESLint `no-undef` errors with `EventListener` type assertions

---

## [1.3.0] - 2026-03-30

### Added

#### New Directives (9 new directives, total 42)

##### Event Directives

###### v-click-delay
- Prevent repeated clicks within a specified time period
- Support custom delay time via arg (`v-click-delay:500`)
- Support `pendingClass` option for visual feedback during delay
- Support `disabled` option to toggle functionality
- Support both mouse and touch events
- SSR compatible

###### v-hotkey
- Keyboard shortcut handling for elements
- Support modifier keys (ctrl, alt, shift, meta)
- Support multiple hotkey formats: arg syntax, object syntax, array syntax
- Support key aliases (esc, space, up, down, left, right, enter, etc.)
- Require element focus for hotkey activation
- SSR compatible

##### UI Directives

###### v-countdown
- Display countdown timer to a target time
- Support Date object, timestamp, or ISO string as target
- Support multiple format strings (dd:hh:mm:ss, hh:mm:ss, mm:ss, ss)
- Support custom format function
- Support `onComplete` and `onTick` callbacks
- Support `autoStart` option
- SSR compatible

###### v-ellipsis
- Single and multi-line text truncation with ellipsis
- Support `lines` option for multi-line truncation
- Support `expandable` option to toggle expand on click
- Support `titleBehavior` option ('auto', 'always', 'none')
- Use CSS `-webkit-line-clamp` for multi-line ellipsis
- SSR compatible

###### v-print
- Print element content on click or immediately
- Support `target` option to print specific element
- Support custom `title` and `styles` for printed document
- Support `newWindow` option for printing in new window
- Support `onBeforePrint` and `onAfterPrint` callbacks
- Auto-include existing stylesheets in print output
- SSR compatible

###### v-watermark
- Add watermark overlay to elements
- Support single or multi-line text content
- Support custom font, color, rotation, and gap options
- Support `protect` option to prevent watermark removal
- Use MutationObserver for protection against tampering
- SSR compatible

##### Mobile Directives

###### v-pull-refresh
- Pull-to-refresh functionality for mobile
- Support custom `distance` and `maxDistance` thresholds
- Support custom indicator text for each state
- Support `onStateChange` callback
- Visual feedback during pull and refresh
- Auto-reset after success/error

###### v-swipe
- Swipe gesture detection
- Support all four directions (left, right, up, down)
- Support custom `threshold` and `maxTime` options
- Support direction-specific callbacks (`onLeft`, `onRight`, `onUp`, `onDown`)
- Support mouse events for desktop testing
- Support `preventScrollOnSwipe` option

##### Performance Directives

###### v-virtual-list
- Virtual scrolling for large lists
- Support fixed or variable item sizes
- Support `overscan` option for smooth scrolling
- Support custom render function
- Efficient DOM reuse with calculated visibility
- Auto-update on resize with ResizeObserver

### Changed

- Updated v-hotkey to require element focus (no longer global)
- Improved v-swipe with mouse support for desktop testing
- Refactored v-pull-refresh implementation for better state management
- Updated documentation for all new directives
- Added comprehensive demos for new directives

### Fixed

- Fixed type assertions in directive tests
- Fixed lifecycle hook checks in tests

---

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

### v1.7.1 (2026-04-11) ✅ Released
- Playground bug fixes and UI improvements

### v1.7.0 (2026-04-15) ✅ Released
- Visual configuration tool
- Online Playground with live preview
- Code generator (Vue 2/3/Composable/Nuxt)
- Configuration presets and templates
- Documentation embedded Playground
- Monaco Editor integration via CDN

### v1.8.0 (Planned - 2026-04-22)
- Test coverage improvement (90%+)
- Performance optimization (bundle size, runtime)
- VS Code extension (autocompletion, hover docs, snippets)
- CLI tool (create directive, init project, doctor, migrate)

### v1.9.0 (Planned - 2026-04-29)
- Interactive documentation with live editing
- 10+ real-world scenario examples
- i18n support (EN/ZH-CN/JA)
- Developer experience improvements (error messages, DevTools integration)
- Plugin system for community extensions

### v1.10.0 (Planned - 2026-05-06)
- Vue 3 exclusive optimizations preview (Suspense, Teleport)
- Mobile optimization (touch gestures, PWA support)
- Accessibility (ARIA, keyboard navigation, screen readers)
- Security enhancements (XSS protection, CSP compatibility)

### v1.11.0 (Planned - 2026-05-13)
- Stability and compatibility enhancements
- Performance limit optimization (bundle size, runtime, memory)
- Enterprise features (permissions, audit logs, config center, monitoring)
- v2.0.0 migration preparation (migration tool, breaking changes warnings)

### v2.0.0 (Future)
- Vue 3 exclusive optimizations
- Web Components support
