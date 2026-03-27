# API Reference

This section provides detailed API documentation for all available directives in Directix.

## Available Directives

### Event Directives

| Directive | Description |
| --------- | ----------- |
| [v-click-outside](/api/directives/click-outside) | Detect clicks outside an element |
| [v-debounce](/api/directives/debounce) | Debounce event handlers |
| [v-throttle](/api/directives/throttle) | Throttle event handlers |

### Form Directives

| Directive | Description |
| --------- | ----------- |
| [v-copy](/api/directives/copy) | Copy text to clipboard |
| [v-focus](/api/directives/focus) | Auto focus an element |

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
import { vClickOutside, vCopy, vDebounce, vThrottle, vFocus } from 'directix'
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
