# Directix v2.0.0 Migration Guide

This guide helps you upgrade to Directix v2.0.0 and understand the new features.

## Overview

v2.0.0 is a major release that adds **Web Components support** while maintaining **full Vue 2 and Vue 3 compatibility**. This is a **non-breaking upgrade** for existing users - all v1.x code continues to work without modifications.

## Key Features Summary

| Feature | Impact | Action Required |
|---------|---------|-----------------|
| Web Components support | Major new feature | Optional - explore new capabilities |
| Vue 3 conditional optimizations | Performance boost | None - automatic when using Vue 3 |
| Vue 2 compatibility maintained | Stability | None - continues to work |
| Bundle size optimization | Performance | None - automatic |
| Enhanced type definitions | Developer experience | Optional - update imports |

## Pre-Upgrade Checklist

1. **Check Current Version**
   ```bash
   npm list directix
   ```

2. **Review New Features**
   - Web Components support (new)
   - Vue 3 performance optimizations (automatic)
   - Enhanced TypeScript definitions

3. **Optional: Test Web Components**
   ```typescript
   import { defineCustomElementDirective, vLazy } from 'directix'

   defineCustomElementDirective({
     name: 'lazy-img',
     directive: vLazy,
   })
   ```

## Major New Features

### 1. Web Components Support

v2.0.0 introduces comprehensive Web Components support, allowing you to use Directix directives with custom elements.

**Basic Usage:**
```typescript
import { defineCustomElementDirective, vLazy, vClickOutside } from 'directix'

// Define a custom element from a directive
defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
  shadow: true,
  shadowMode: 'open'
})

// Now you can use it in HTML
// <lazy-img src="image.jpg" value="{ threshold: 0.5 }"></lazy-img>
```

**Register Multiple Directives:**
```typescript
import { registerDirectiveElements, vLazy, vClickOutside } from 'directix'

registerDirectiveElements({
  'lazy-image': vLazy,
  'click-outside': vClickOutside,
})
```

**Apply to Existing Custom Elements:**
```typescript
import { applyDirectiveToCustomElement, vLazy } from 'directix'

const myElement = document.querySelector('my-component')
const cleanup = applyDirectiveToCustomElement(myElement, vLazy, { threshold: 0.5 })

// Later, when you need to cleanup
cleanup()
```

### 2. Vue 3 Conditional Optimizations

When using Vue 3, Directix automatically applies performance optimizations:

- **markRaw for DOM elements** - Prevents unnecessary reactivity overhead
- **shallowReactive for state** - Optimizes large object performance
- **Reduced runtime checks** - Simplified adapter for Vue 3

These optimizations are **automatic** and require no code changes.

### 3. Bundle Size Improvements

- **~10-15% smaller** than v1.11.0
- **Better tree-shaking** for unused directives
- **Optimized imports** for Web Components utilities

### 4. Enhanced Type Definitions

Improved TypeScript support with better type inference:

```typescript
// Better type inference for directive options
import { vDebounce } from 'directix'

vDebounce({
  handler: () => console.log('debounced'),
  delay: 300,
  immediate: true // Fully typed
})

// Web Components types
import type { CustomElementDirectiveOptions } from 'directix'

const options: CustomElementDirectiveOptions = {
  name: 'my-element',
  directive: vLazy,
  shadow: true
}
```

## Optional Optimizations

### Vue 3 Performance Features

If you're using Vue 3, you can optionally leverage enhanced features:

```typescript
// Automatic when using Vue 3
import { useLazyOptimized } from 'directix'

// Uses markRaw and shallowReactive internally for better performance
const { state, observe, unobserve } = useLazyOptimized({
  threshold: 0.5,
  rootMargin: '50px'
})
```

### Web Components Integration

For projects using Web Components alongside Vue:

```typescript
import { 
  isCustomElement, 
  createDirectiveElement 
} from 'directix'

// Check if element is custom element
if (isCustomElement(myElement)) {
  // Apply directive-specific logic
}

// Create reusable custom element class
const LazyImage = createDirectiveElement('lazy-img', vLazy)
customElements.define('lazy-img', LazyImage)
```

## Upgrade Guide

### Simple Upgrade (Recommended)

For most users, upgrading is straightforward:

```bash
npm install directix@2.0.0
# or
pnpm add directix@2.0.0
# or
yarn add directix@2.0.0
```

**No code changes required** - your existing v1.x code will continue to work.

### Exploring New Features

After upgrading, you can optionally explore new features:

**1. Try Web Components:**
```typescript
import { defineCustomElementDirective, vLazy } from 'directix'

defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
})
```

**2. Use Vue 3 Optimizations (Automatic):**
```typescript
// No changes needed - optimizations are automatic when using Vue 3
import { vLazy } from 'directix'
```

**3. Check Bundle Size:**
```bash
# Analyze your bundle
npx vite-bundle-visualizer
```

## Performance Improvements

v2.0.0 includes significant performance improvements:

- **Bundle Size**: ~10-15% smaller than v1.11.0
- **Tree-shaking**: Better dead code elimination
- **Runtime**: Optimized directive lifecycle (Vue 3)
- **Memory**: Reduced observer overhead
- **Web Components**: Zero-overhead when not used

## Timeline

| Phase | Date | Status |
|-------|------|--------|
| v1.11.0 | 2026-05-13 | ✅ Released - Migration tools & enterprise features |
| v2.0.0 | 2026-04-26 | ✅ Released - Web Components support |
| v2.1.0 | TBD | 📋 Planned - Enhanced Web Components |

## Getting Help

- **Documentation**: https://directix.dev/docs
- **Web Components Guide**: https://directix.dev/docs/web-components
- **GitHub Issues**: https://github.com/saqqdy/directix/issues
- **Discord**: https://discord.gg/directix

## Upgrade Checklist

- [x] Install directix@2.0.0
- [ ] Verify existing code works (no changes needed)
- [ ] Optional: Explore Web Components support
- [ ] Optional: Test Vue 3 performance optimizations
- [ ] Run tests to ensure compatibility
- [ ] Review bundle size improvements

## What's Next?

### For Vue 2 Users
- Continue using Directix as before
- No migration needed
- Consider exploring Web Components for future projects

### For Vue 3 Users
- Enjoy automatic performance optimizations
- Try Web Components for framework-agnostic directives
- Benefit from smaller bundle sizes

### For All Users
- Web Components enable new use cases
- Better TypeScript support
- Improved documentation and examples
