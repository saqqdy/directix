# v-ripple

Add Material Design ripple effect to elements.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <button v-ripple>Click me</button>
</template>
```

### With Color

```vue
<template>
  <button v-ripple="'rgba(255, 255, 255, 0.3)'">Custom color</button>
</template>
```

### With Options

```vue
<template>
  <button v-ripple="{ color: 'red', duration: 800 }">Custom options</button>
</template>
```

## API

### Types

```typescript
interface RippleOptions {
  /** Ripple color */
  color?: string
  /** Ripple duration in milliseconds */
  duration?: number
  /** Disable ripple */
  disabled?: boolean
  /** Initial scale of ripple */
  initialScale?: number
  /** Final scale of ripple */
  finalScale?: number
}

type RippleBinding = boolean | string | RippleOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `color` | `string` | `'currentColor'` | Ripple color |
| `duration` | `number` | `600` | Animation duration in ms |
| `disabled` | `boolean` | `false` | Disable ripple effect |
| `initialScale` | `number` | `0` | Initial scale of ripple |
| `finalScale` | `number` | `2` | Final scale of ripple |

## Examples

### Buttons

```vue
<template>
  <button v-ripple class="btn-primary">Primary Button</button>
  <button v-ripple="'rgba(0,0,0,0.1)'" class="btn-secondary">Secondary</button>
  <button v-ripple="{ color: 'white', duration: 400 }" class="btn-custom">
    Custom Ripple
  </button>
</template>
```

### Icon Buttons

```vue
<template>
  <button v-ripple class="icon-btn">
    <svg><!-- icon --></svg>
  </button>
</template>

<style>
.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

### Card

```vue
<template>
  <div v-ripple class="card" @click="handleClick">
    <h3>Card Title</h3>
    <p>Click anywhere for ripple effect</p>
  </div>
</template>

<style>
.card {
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
}
</style>
```

### Disable Conditionally

```vue
<template>
  <button v-ripple="{ disabled: isLoading }">
    {{ isLoading ? 'Loading...' : 'Click me' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
</script>
```

## Composable API

For programmatic use, you can use the `useRipple` composable:

```typescript
import { useRipple } from 'directix'

const { bind, trigger } = useRipple({
  color: 'currentColor',
  duration: 600,
  disabled: false,
  initialScale: 0,
  finalScale: 2
})

// Bind to element
onMounted(() => bind(buttonRef.value))

// Manually trigger ripple
trigger({ x: 50, y: 50 })
```

### UseRippleOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `color` | `string \| Ref<string>` | `'currentColor'` | Ripple color |
| `duration` | `number \| Ref<number>` | `600` | Ripple duration in milliseconds |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Whether to disable ripple |
| `initialScale` | `number` | `0` | Initial scale of ripple |
| `finalScale` | `number` | `2` | Final scale of ripple |

### UseRippleReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `bind` | `(element: HTMLElement) => () => void` | Bind ripple effect to an element |
| `trigger` | `(event?: { x?: number, y?: number }) => void` | Trigger ripple effect manually |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useRipple } from 'directix'

const buttonRef = ref(null)
const { bind, trigger } = useRipple({
  color: 'rgba(255, 255, 255, 0.3)',
  duration: 600
})

onMounted(() => bind(buttonRef.value))
</script>

<template>
  <button ref="buttonRef">Click for ripple</button>
</template>
```
