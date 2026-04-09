# Nuxt Module

Directix provides an official Nuxt 3 module for seamless integration with Nuxt applications.

## Features

- **Auto-import composables** - All composables are automatically imported in Nuxt apps
- **Directive auto-registration** - Directives are automatically registered as Vue directives
- **Selective inclusion** - Include or exclude specific directives via configuration
- **SSR compatibility** - Proper handling of client-side only directives

## Installation

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

## Usage

### 1. Add to Nuxt Config

Add `directix/nuxt` to your `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
})
```

### 2. Use in Components

Directives are automatically registered, so you can use them directly:

```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">Copy</button>
  </div>
</template>

<script setup>
// Composables are auto-imported!
const { copy, copied } = useCopy({ source: text })
const { isHovering } = useHover({ onEnter: handleEnter })
</script>
```

## Configuration

You can configure the module in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['directix/nuxt'],

  directix: {
    // Enable/disable the module
    enabled: true,

    // Auto-import composables (default: true)
    autoImportComposables: true,

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
    }
  }
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the module |
| `autoImportComposables` | `boolean` | `true` | Auto-import composables |
| `include` | `string[]` | - | Directives to include (if not specified, all are included) |
| `exclude` | `string[]` | `[]` | Directives to exclude |
| `directiveOptions` | `Record<string, any>` | `{}` | Default options for specific directives |

## SSR Compatibility

Directix handles SSR gracefully. Directives that require DOM APIs will be a no-op on the server side and will work correctly once the component is mounted on the client.

You'll see warnings like this during build (which is expected behavior):

```
WARN [Directix] Directive "click-outside" is not compatible with SSR. It will be a no-op on the server side.
```

## Auto-imported Composables

All composables from Directix are automatically imported when you use the Nuxt module. Here are some commonly used ones:

### Event Composables
- `useClickOutside`
- `useClickDelay`
- `useDebounce`
- `useThrottle`
- `useLongPress`
- `useHover`
- `useHotkey`

### UI Composables
- `useCopy`
- `useFocus`
- `useDraggable`
- `useTooltip`
- `useLoading`

### Scroll Composables
- `useScroll`
- `useInfiniteScroll`
- `useSticky`
- `useVirtualList`

### Observer Composables
- `useIntersect`
- `useResize`
- `useMutation`

### Form Composables
- `useMask`
- `useTrim`
- `useCapitalcase`
- `useLowercase`
- `useUppercase`
- `useMoney`
- `useNumber`

## Example: Permission Directive with Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],

  directix: {
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => {
            // Access your auth store or API
            const { permissions } = useAuthStore()
            return permissions
          }
        }
      }
    }
  }
})
```

```vue
<template>
  <button v-permission="'admin'">Admin Only Button</button>
</template>
```

## TypeScript Support

The Nuxt module provides full TypeScript support with auto-generated type declarations. All composables are properly typed and will work with TypeScript out of the box.