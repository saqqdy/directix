# v-click-wave

Add click wave effect to elements.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <button v-click-wave>Click me</button>
</template>
```

### With Custom Color

```vue
<template>
  <button v-click-wave="'rgba(255, 255, 255, 0.3)'">Custom color</button>
</template>
```

### With Options

```vue
<template>
  <button v-click-wave="{ color: 'red', duration: 400 }">Custom options</button>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `color` | `string` | `'currentColor'` | Wave color |
| `duration` | `number` | `500` | Animation duration in milliseconds |
| `disabled` | `boolean` | `false` | Disable wave effect |
| `sizeRatio` | `number` | `2` | Size ratio relative to element |

### Binding Types

```ts
type ClickWaveBinding = boolean | string | ClickWaveOptions
```

## Examples

### Buttons

```vue
<template>
  <button v-click-wave class="btn-primary">Primary Button</button>
  <button v-click-wave="'rgba(0,0,0,0.1)'" class="btn-secondary">Secondary</button>
  <button v-click-wave="{ color: 'white', duration: 400 }" class="btn-custom">
    Custom Wave
  </button>
</template>
```

### Disable Conditionally

```vue
<template>
  <button v-click-wave="{ disabled: isLoading }">
    {{ isLoading ? 'Loading...' : 'Click me' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
</script>
```

## Composable API

For programmatic use, you can use the `useClickWave` composable:

```typescript
import { useClickWave } from 'directix'

const { bind, trigger } = useClickWave({
  color: 'currentColor',
  duration: 500,
  disabled: false,
  sizeRatio: 2
})

// Bind to element
onMounted(() => bind(buttonRef.value))

// Manually trigger wave
trigger()
```

### UseClickWaveOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `color` | `string \| Ref<string>` | `'currentColor'` | Wave color |
| `duration` | `number \| Ref<number>` | `500` | Wave duration in milliseconds |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Whether to disable wave |
| `sizeRatio` | `number` | `2` | Size ratio relative to element |

### UseClickWaveReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `bind` | `(element: HTMLElement) => () => void` | Bind wave effect to an element |
| `trigger` | `() => void` | Trigger wave effect manually |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useClickWave } from 'directix'

const buttonRef = ref(null)
const { bind, trigger } = useClickWave({
  color: 'rgba(255, 255, 255, 0.3)',
  duration: 600
})

onMounted(() => bind(buttonRef.value))
</script>

<template>
  <button ref="buttonRef">Click for wave</button>
</template>
```
