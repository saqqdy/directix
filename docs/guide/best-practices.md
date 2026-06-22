# Best Practices

This guide covers best practices for using Directix effectively in production applications.

## Directive Selection

### Choose the Right Directive

| Scenario | Recommended Directive | Why |
|----------|----------------------|-----|
| Input debouncing | `v-debounce` | Built-in wait control, cancel/flush API |
| Scroll event handling | `v-throttle` | Prevents excessive callbacks during scroll |
| Click outside detection | `v-click-outside` | Clean API, supports exclude and capture |
| Image lazy loading | `v-lazy` | IntersectionObserver-based, no layout shift |
| Permission control | `v-permission` | Multiple modes (remove/disable/hide) |
| Form input formatting | `v-mask` | Pattern-based, handles complex formats |
| Long press gestures | `v-long-press` | Cross-platform, configurable duration |
| List performance | `v-virtual-list` | DOM recycling, handles 10K+ items |

### Avoid Over-Nesting

```vue
<!-- ❌ Bad: deeply nested directives -->
<div v-click-outside="handler1">
  <div v-hover="handler2">
    <div v-long-press="handler3">
      <span v-copy="text">Content</span>
    </div>
  </div>
</div>

<!-- ✅ Good: flat structure with clear purpose -->
<div v-click-outside="handleClose" class="dropdown">
  <button v-debounce="{ handler: handleSave, wait: 500 }">Save</button>
</div>
```

## Performance

### Use Throttle for High-Frequency Events

```vue
<!-- ❌ Bad: debounce on scroll causes delayed updates -->
<div v-debounce="{ handler: onScroll, wait: 100 }">

<!-- ✅ Good: throttle provides consistent updates -->
<div v-throttle="{ handler: onScroll, limit: 100 }">
```

### Use `v-intersect.once` for One-Time Detection

```vue
<!-- ❌ Bad: continuous observation when only entry matters -->
<div v-intersect="onVisible">

<!-- ✅ Good: stop observing after first entry -->
<div v-intersect.once="onVisible">
```

### Set `subtree: false` on `v-mutation` by Default

```vue
<!-- ❌ Bad: observing entire subtree is expensive -->
<div v-mutation="{ handler: onMutate, subtree: true }">

<!-- ✅ Good: only observe direct children -->
<div v-mutation="{ handler: onMutate, childList: true }">
```

### Use `v-virtual-list` for Long Lists

```vue
<!-- ❌ Bad: rendering 1000+ DOM nodes -->
<div v-for="item in largeList" :key="item.id">{{ item.name }}</div>

<!-- ✅ Good: only render visible items -->
<div v-virtual-list="{ data: largeList, itemSize: 50, height: 600 }">
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</div>
```

### Prefer `passive` Modifier for Scroll/Touch

```vue
<!-- ✅ Good: passive listener improves scroll performance -->
<div v-scroll.passive="onScroll">
```

## SSR Compatibility

### Check SSR Support Before Using

Directives marked with `SSR: ❌` in the documentation use browser APIs (DOM, Observer, Clipboard) and become no-ops during server-side rendering.

```typescript
import { isSSR } from 'directix'

if (!isSSR()) {
  // Safe to use browser-dependent directives
}
```

### Use `v-loading` and `v-visible` for SSR Pages

```vue
<!-- ✅ Good: SSR-safe directives -->
<div v-loading="isLoading">Content</div>
<div v-visible="isVisible">Content</div>

<!-- ⚠️ Warning: non-SSR directives render nothing on server -->
<div v-click-outside="handleClose">Dropdown</div>
```

### Nuxt Auto-Handling

The Directix Nuxt module automatically handles SSR compatibility:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  directix: {
    enabled: true,
  },
})
```

## Security

### Always Use `v-sanitize` for User Content

```vue
<!-- ❌ Bad: raw v-html with user content -->
<div v-html="userContent"></div>

<!-- ✅ Good: sanitize before rendering -->
<div v-sanitize v-html="userContent"></div>

<!-- ✅ Best: configure allowed tags -->
<div v-sanitize="{ allowedTags: ['b', 'i', 'p', 'a'] }" v-html="userContent"></div>
```

### Configure Permissions Centrally

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => store.getters['user/permissions'],
  getRoles: () => store.getters['user/roles'],
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write', 'publish'],
    viewer: ['read'],
  },
})
```

### Use `v-watermark` for Sensitive Content

```vue
<div v-watermark="{ content: 'CONFIDENTIAL', fontSize: 20, color: 'rgba(0,0,0,0.1)' }">
  Sensitive information
</div>
```

## Composables vs Directives

### When to Use Composables

- **Logic reuse across components** — composables can be used in `setup()` without template binding
- **Conditional logic** — when directive behavior depends on runtime conditions
- **Testing** — composables are easier to unit test than directive-bound behavior

### When to Use Directives

- **Direct DOM interaction** — focus, scroll, intersection, resize
- **Template-level decorators** — visual effects (ripple, blur, fade), loading states
- **One-off element behavior** — click-outside, long-press, copy

### Combining Both

```vue
<template>
  <!-- Directive handles DOM, composable handles state -->
  <button v-copy="text" :class="{ 'is-copied': copied }">
    {{ copied ? 'Copied!' : 'Copy' }}
  </button>
</template>

<script setup>
import { useCopy } from 'directix'

const text = ref('Hello, World!')
const { copied } = useCopy({ source: text })
</script>
```

## VS Code Extension Tips

### Enable Performance Tracking for Development

```jsonc
// settings.json
{
  "directix.enablePerformanceTracking": true,
  "directix.enableDiagnostics": true,
  "directix.diagnostics.debounceMs": 300
}
```

### Use the Config Editor for Complex Configs

Run `Directix: Open Config Editor` from the command palette to visually edit your `directix.config.ts`.

### Check Directive State

Run `Directix: Inspect Directive State` to see all available directives, their SSR compatibility, and parameter details in a searchable panel.

## Common Patterns

### Dropdown with Click Outside

```vue
<template>
  <div v-click-outside="close" class="dropdown">
    <button @click="open = !open">Toggle</button>
    <ul v-if="open">
      <li>Option 1</li>
      <li>Option 2</li>
    </ul>
  </div>
</template>
```

### Search Input with Debounce

```vue
<template>
  <input
    v-debounce="{ handler: handleSearch, wait: 300 }"
    v-focus
    placeholder="Search..."
  />
</template>
```

### Permission-Based UI

```vue
<template>
  <button v-permission="{ value: 'admin', action: 'disable' }">
    Admin Action
  </button>
  <div v-permission="['editor', 'admin']">
    Editor Content
  </div>
</template>
```

### Lazy Image Gallery

```vue
<template>
  <img
    v-lazy="{ src: photo.url, placeholder: '/placeholder.svg' }"
    v-image-preview
    v-for="photo in photos"
    :key="photo.id"
  />
</template>
```

## Avoiding Directive Conflicts

### Conflicting Directive Pairs

Some directives serve overlapping purposes and should not be used together on the same element:

| Conflict | Reason | Recommendation |
|----------|--------|----------------|
| `v-debounce` + `v-throttle` | Both delay event execution with different semantics | Choose one based on use case |
| `v-visible` + `v-if` | Both control element visibility with different lifecycle impact | Use `v-visible` for frequent toggles, `v-if` for conditional rendering |
| `v-visible` + `v-show` | Same purpose, `v-show` is native | Prefer `v-visible` when you need reactive boolean binding |
| `v-loading` + `v-skeleton` | Both indicate loading states | Use `v-loading` for async operations, `v-skeleton` for initial content load |
| `v-ripple` + `v-click-wave` | Nearly identical visual effects | Pick one and use it consistently across the project |

### Duplicate Directive Detection

Using the same directive twice on one element is always a mistake:

```vue
<!-- ❌ Bad: duplicate directives -->
<div v-debounce="handler1" v-debounce="handler2">

<!-- ✅ Good: merge into single options object -->
<div v-debounce="{ handler: combinedHandler, wait: 300 }">
```

The VS Code extension can detect both duplicates and conflicts automatically — enable it in settings:

```jsonc
{
  "directix.diagnostics.checkDuplicates": true,
  "directix.diagnostics.checkConflicts": true
}
```

## TypeScript Best Practices

### Type Your Directive Bindings

```typescript
import type { ClickOutsideOptions, DebounceOptions } from 'directix'

// ✅ Good: typed options
const clickOutsideOpts: ClickOutsideOptions = {
  handler: handleClose,
  exclude: ['.trigger'],
}

const debounceOpts: DebounceOptions = {
  handler: handleInput,
  wait: 300,
  leading: false,
  trailing: true,
}
```

### Use Composable Return Types

```typescript
import { useCopy, useDebounce, usePermission } from 'directix'

// Type-safe composable usage
const { copy, copied, isSupported } = useCopy({ source: textRef })
const { run, cancel, flush } = useDebounce({ handler: handleSearch, wait: 300 })
const { hasPermission } = usePermission({
  getPermissions: () => ['read', 'write'],
})
```

## Vue 2 Migration Tips

### Gradual Adoption

When migrating a Vue 2 project to use Directix:

1. Install with Vue 2 compatibility: `npm install directix`
2. Directix auto-detects Vue 2 via `vue-demi` — no extra config needed
3. Start with safe, SSR-compatible directives (`v-loading`, `v-visible`, `v-permission`)
4. Add browser-dependent directives (`v-click-outside`, `v-lazy`, `v-scroll`) one at a time
5. Replace manual implementations with equivalent directives

### Replacement Map

| Manual Pattern | Directix Replacement |
|----------------|---------------------|
| `document.addEventListener('click', ...)` outside check | `v-click-outside` |
| `setTimeout` + `clearTimeout` debounce | `v-debounce` |
| `setTimeout` + `clearTimeout` throttle | `v-throttle` |
| `el.focus()` in `mounted` | `v-focus` |
| `new IntersectionObserver(...)` lazy load | `v-lazy` |
| `element.removeChild(el)` permission check | `v-permission` |
| `navigator.clipboard.writeText` | `v-copy` |
| `document.execCommand('copy')` fallback | `useCopy` composable |
| `new ResizeObserver(...)` | `v-resize` |
| `el.style.display = 'none'` toggle | `v-visible` |
