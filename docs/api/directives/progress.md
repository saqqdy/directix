# v-progress

Progress bar animation.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-progress="50">Progress at 50%</div>
</template>
```

### With Options

```vue
<template>
  <div v-progress="{
    value: progressValue,
    color: '#42b883',
    height: 8,
    showText: true
  }">
    Content
  </div>
</template>
```

### Indeterminate

```vue
<template>
  <div v-progress="{ indeterminate: true }">
    Loading...
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `number` | `0` | Progress value (0-100) |
| `color` | `string` | `'#42b883'` | Progress bar color |
| `height` | `number` | `4` | Progress bar height in pixels |
| `indeterminate` | `boolean` | `false` | Indeterminate mode |
| `showText` | `boolean` | `false` | Show percentage text |
| `striped` | `boolean` | `false` | Striped pattern |
| `animated` | `boolean` | `false` | Animate stripes |
| `position` | `'top' \| 'bottom'` | `'top'` | Progress bar position |

### Binding Types

```ts
type ProgressBinding = number | ProgressOptions
```

## Examples

### Upload Progress

```vue
<template>
  <div v-progress="{
    value: uploadProgress,
    color: progressColor,
    showText: true,
    height: 6
  }">
    Uploading...
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const uploadProgress = ref(0)

const progressColor = computed(() => {
  if (uploadProgress.value < 30) return '#ff6b6b'
  if (uploadProgress.value < 70) return '#ffd93d'
  return '#6bcb77'
})
</script>
```

### Striped Animated

```vue
<template>
  <div v-progress="{
    value: 75,
    striped: true,
    animated: true,
    height: 20,
    showText: true
  }">
    Processing...
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `useProgress` composable:

```typescript
import { useProgress } from 'directix'

const { setProgress, start, finish, fail, value } = useProgress({
  color: '#42b883',
  height: 4
})

// Set progress
setProgress(50)

// Start (set to 0)
start()

// Finish (set to 100)
finish()

// Fail (change color to red)
fail()
```

### UseProgressReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `setProgress` | `(value: number) => void` | Set progress value |
| `start` | `() => void` | Reset to 0 |
| `finish` | `() => void` | Set to 100 |
| `fail` | `() => void` | Mark as failed |
| `value` | `Ref<number>` | Current progress value |
