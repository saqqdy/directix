# @directix/shared

[![npm version](https://img.shields.io/npm/v/@directix/shared.svg)](https://www.npmjs.com/package/@directix/shared)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | **[中文文档](README_CN.md)**

Shared utilities for [Directix](https://github.com/saqqdy/directix) — browser detection, DOM operations, event handling, directive state management, and common utility functions. Zero Vue dependency — can be used in any JavaScript project.

## Features

- 🌐 **Browser Detection** — Detect browser vendor, OS, device type, and feature support
- 🖥️ **DOM Operations** — Query, class manipulation, style helpers, viewport detection
- ⚡ **Event Handling** — Add/remove events, event delegation, keyboard matchers, position extraction
- 🎹 **Event Modifiers** — Vue-style event modifiers (`.stop`, `.prevent`, `.capture`, etc.)
- 📦 **Directive State** — Get/set/delete directive state on DOM elements
- 🔧 **Utility Functions** — Type checking, deep clone/merge, debounce/throttle, parse time, generate ID

## Installation

```bash
# pnpm
pnpm add @directix/shared

# npm
npm install @directix/shared

# yarn
yarn add @directix/shared
```

## Usage

### Browser Detection

```typescript
import { detectBrowser, isChrome, isMobile, isWeChat } from '@directix/shared'

const info = detectBrowser()
// { vendor: 'chrome', version: '125', os: 'macos', device: 'desktop', isMobile: false, ... }

if (isMobile()) {
  console.log('Running on mobile device')
}

if (isWeChat()) {
  console.log('Running in WeChat browser')
}
```

### Feature Detection

```typescript
import {
  supportsIntersectionObserver,
  supportsResizeObserver,
  supportsPassiveEvents,
  supportsClipboardAPI,
  supportsCSSGrid,
} from '@directix/shared'

if (supportsIntersectionObserver()) {
  // Use IntersectionObserver
}
```

### DOM Operations

```typescript
import {
  getElement,
  addClass,
  removeClass,
  setStyle,
  setStyles,
  isInViewport,
  getScrollParent,
  ensurePosition,
  ensureOverflowHidden,
} from '@directix/shared'

const el = getElement('#app')
addClass(el!, 'active')
setStyles(el as HTMLElement, { opacity: 0.5, transform: 'scale(1.1)' })
```

### Event Handling

```typescript
import { on, off, delegate, bindEvents } from '@directix/shared'

// Single event
on(el, 'click', handler)

// Event delegation
const cleanup = delegate(container, '.item', 'click', (target, e) => {
  console.log('Item clicked:', target)
})

// Batch binding
const unbind = bindEvents(el, {
  touchstart: handleStart,
  touchmove: handleMove,
  touchend: handleEnd,
})

// Cleanup
unbind()
```

### Event Modifiers

```typescript
import { withModifiers } from '@directix/shared'

// Apply Vue-style event modifiers
const handler = withModifiers((e) => {
  console.log('Clicked!')
}, ['prevent', 'stop'])

on(button, 'click', handler)
```

### Directive State Management

```typescript
import { setState, getState, deleteState, hasState } from '@directix/shared'

// Store directive state on element
setState(el, 'tooltip', { visible: true, content: 'Hello' })

// Read it back
const state = getState<TooltipState>(el, 'tooltip')

// Check existence
if (hasState(el, 'tooltip')) {
  deleteState(el, 'tooltip')
}
```

### Utility Functions

```typescript
import {
  isString,
  isNumber,
  isObject,
  deepClone,
  deepMerge,
  debounce,
  throttle,
  parseTime,
  generateId,
  clamp,
  getDistance,
} from '@directix/shared'

// Debounce
const debouncedSearch = debounce(search, 300)
debouncedSearch('query')

// Throttle
const throttledScroll = throttle(handleScroll, 100)

// Parse time
parseTime('300ms') // 300
parseTime('1s')    // 1000

// Clamp
clamp(150, 0, 100) // 100
```

## API Reference

### Browser Detection

| Function | Description |
|----------|-------------|
| `detectBrowser()` | Get complete browser detection result |
| `isBrowserEnv()` | Check if running in browser |
| `detectBrowserVendor()` | Detect browser vendor |
| `detectOS()` | Detect operating system |
| `detectDeviceType()` | Detect device type |
| `isMobile()` / `isTablet()` / `isDesktop()` | Device type checks |
| `isChrome()` / `isFirefox()` / `isSafari()` / `isEdge()` | Browser checks |
| `isWeChat()` / `isQQBrowser()` / `isUCBrowser()` | Chinese browser checks |
| `supportsPassiveEvents()` / `supportsIntersectionObserver()` | Feature detection |

### DOM Operations

| Function | Description |
|----------|-------------|
| `getElement(target)` | Get element by selector or return element |
| `getAllElements(selector)` | Get all matching elements |
| `addClass` / `removeClass` / `toggleClass` / `hasClass` | Class manipulation |
| `getStyle` / `setStyle` / `setStyles` | Style helpers |
| `getOffset` / `getSize` / `isInViewport` | Position & size |
| `getScrollParent` | Find nearest scrollable parent |
| `matches` / `closest` | Selector matching |
| `isInputElement` | Check if element is input/textarea |
| `ensurePosition` / `ensureOverflowHidden` | CSS safety helpers |

### Event Handling

| Function | Description |
|----------|-------------|
| `on(target, event, handler, options)` | Add event listener |
| `off(target, event, handler, options)` | Remove event listener |
| `emit(target, event, detail)` | Dispatch custom event |
| `delegate(container, selector, event, handler)` | Event delegation |
| `bindEvents(target, events, options)` | Batch event binding |
| `stopPropagation` / `preventDefault` / `stopEvent` | Event modifiers |
| `getEventPosition(e)` | Extract mouse/touch position |
| `createKeyMatcher(key, modifiers)` | Keyboard event matcher |

### Directive State

| Function | Description |
|----------|-------------|
| `setState(el, key, state)` | Store directive state |
| `getState(el, key)` | Read directive state |
| `deleteState(el, key)` | Remove directive state |
| `hasState(el, key)` | Check state existence |

### Utilities

| Function | Description |
|----------|-------------|
| `isString` / `isNumber` / `isBoolean` / `isFunction` / `isObject` / `isArray` / `isPromise` / `isEmpty` | Type checking |
| `deepClone(obj)` | Deep clone an object |
| `deepMerge(target, ...sources)` | Deep merge objects |
| `get(obj, path, default?)` | Get nested property by path |
| `set(obj, path, value)` | Set nested property by path |
| `debounce(func, wait, options?)` | Debounce function |
| `throttle(func, wait, options?)` | Throttle function |
| `parseTime(arg)` | Parse time string (`'300ms'`, `'1s'`) |
| `generateId(prefix?)` | Generate unique ID |
| `getDistance(p1, p2)` | Calculate distance between two points |
| `clamp(value, min?, max?)` | Clamp value within bounds |
| `escapeRegex(str)` | Escape regex special characters |

## Related

- [Directix](https://github.com/saqqdy/directix) — Main Vue directives library
- [@directix/core](https://github.com/saqqdy/directix/tree/master/packages/core) — Core runtime engine

## License

[MIT](https://opensource.org/licenses/MIT)
