# API Reference

This section provides detailed API documentation for all available directives in Directix.

## Available Directives

Directix provides **32 production-ready directives** organized into the following categories:

### Event Directives

| Directive | Description |
| --------- | ----------- |
| [v-click-outside](/api/directives/click-outside) | Detect clicks outside an element |
| [v-debounce](/api/directives/debounce) | Debounce event handlers |
| [v-throttle](/api/directives/throttle) | Throttle event handlers |
| [v-long-press](/api/directives/long-press) | Detect long press gestures |
| [v-hover](/api/directives/hover) | Track hover state with callbacks |
| [v-ripple](/api/directives/ripple) | Material design ripple effect |
| [v-touch](/api/directives/touch) | Touch gesture detection (swipe, pinch, rotate, tap) |

### Visibility Directives

| Directive | Description |
| --------- | ----------- |
| [v-lazy](/api/directives/lazy) | Lazy load images |
| [v-intersect](/api/directives/intersect) | Observe element intersection |
| [v-visible](/api/directives/visible) | Toggle element visibility |
| [v-loading](/api/directives/loading) | Show loading overlay |
| [v-image-preview](/api/directives/image-preview) | Modal image preview with gestures |

### Scroll Directives

| Directive | Description |
| --------- | ----------- |
| [v-scroll](/api/directives/scroll) | Track scroll position |
| [v-infinite-scroll](/api/directives/infinite-scroll) | Infinite scroll loading |
| [v-sticky](/api/directives/sticky) | Sticky positioning |

### Form Directives

| Directive | Description |
| --------- | ----------- |
| [v-copy](/api/directives/copy) | Copy text to clipboard |
| [v-focus](/api/directives/focus) | Auto focus an element |
| [v-mask](/api/directives/mask) | Input mask formatting |
| [v-trim](/api/directives/trim) | Trim whitespace from input |
| [v-capitalcase](/api/directives/capitalcase) | Transform to capital case |
| [v-lowercase](/api/directives/lowercase) | Transform to lowercase |
| [v-uppercase](/api/directives/uppercase) | Transform to uppercase |
| [v-money](/api/directives/money) | Format as currency |
| [v-number](/api/directives/number) | Format and validate numbers |

### UI Directives

| Directive | Description |
| --------- | ----------- |
| [v-tooltip](/api/directives/tooltip) | Display tooltips |
| [v-draggable](/api/directives/draggable) | Make elements draggable |
| [v-truncate](/api/directives/truncate) | Truncate text with ellipsis |

### Security Directives

| Directive | Description |
| --------- | ----------- |
| [v-permission](/api/directives/permission) | Permission-based element control |
| [v-sanitize](/api/directives/sanitize) | Sanitize HTML content |

### Observer Directives

| Directive | Description |
| --------- | ----------- |
| [v-resize](/api/directives/resize) | Observe element resize |
| [v-mutation](/api/directives/mutation) | Observe DOM mutations |

## Installation Options

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

## Import Methods

### Named Import

```typescript
import {
  vClickOutside,
  vCopy,
  vDebounce,
  vThrottle,
  vFocus,
  vLazy,
  vIntersect,
  vVisible,
  vLoading,
  vScroll,
  vInfiniteScroll,
  vSticky,
  vLongPress,
  vHover,
  vRipple,
  vMask,
  vPermission,
  vSanitize,
  vResize,
  vMutation,
  // New in v1.1.0
  vTouch,
  vImagePreview,
  vDraggable,
  vTooltip,
  vTruncate,
  vTrim,
  vCapitalcase,
  vLowercase,
  vUppercase,
  vMoney,
  vNumber,
} from 'directix'
```

### Global Registration

```typescript
import Directix from 'directix'

app.use(Directix)
```

### Selective Registration

```typescript
app.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce', 'throttle', 'focus']
})
```

## Utility Exports

Directix also exports utility functions:

```typescript
import {
  // Type guards
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isEmpty,
  isPromise,

  // Object utilities
  deepClone,
  deepMerge,
  get,
  set,

  // Time utilities
  parseTime,
  generateId,

  // Function utilities (aliased to avoid conflict with directives)
  debounceFn,
  throttleFn
} from 'directix'
```

## Core Exports

For advanced usage, Directix exports core utilities:

```typescript
import {
  // Vue version detection
  getVueVersion,
  setVueVersion,
  isVue2,
  isVue3,

  // Environment detection
  isBrowser,
  isSSR,

  // Feature support
  supportsPassive,
  supportsIntersectionObserver,
  supportsResizeObserver,
  supportsClipboard,
  supportsMutationObserver,

  // Directive definition
  defineDirective,
  defineDirectiveGroup
} from 'directix'
```
