# v-resize

Observe element resize using ResizeObserver.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <div v-resize="handleResize">Resize me</div>
</template>

<script setup>
function handleResize(entry) {
  console.log('New size:', entry.contentRect.width, entry.contentRect.height)
}
</script>
```

### With Options

```vue
<template>
  <div v-resize="{
    handler: handleResize,
    debounce: 200,
    box: 'border-box'
  }">
    Debounced resize
  </div>
</template>
```

## API

### Types

```typescript
interface ResizeInfo {
  /** New width */
  width: number
  /** New height */
  height: number
  /** Content rect */
  contentRect: DOMRectReadOnly
  /** Border box size */
  borderBoxSize: ReadonlyArray<ResizeObserverSize>
  /** Content box size */
  contentBoxSize: ReadonlyArray<ResizeObserverSize>
  /** Device pixel content box size */
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
}

type ResizeHandler = (entry: ResizeObserverEntry) => void

interface ResizeOptions {
  /** Resize event handler */
  handler: ResizeHandler
  /** Disable the directive */
  disabled?: boolean
  /** Box model to observe */
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
  /** Debounce time in milliseconds */
  debounce?: number
  /** Callback for browsers without ResizeObserver */
  onFallback?: (info: ResizeInfo) => void
}

type ResizeBinding = ResizeHandler | ResizeOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Resize event handler (required) |
| `disabled` | `boolean` | `false` | Disable the directive |
| `box` | `'content-box' \| 'border-box' \| 'device-pixel-content-box'` | `'content-box'` | Box model to observe |
| `debounce` | `number` | `0` | Debounce time in milliseconds |
| `onFallback` | `Function` | - | Callback for browsers without ResizeObserver |

## Examples

### Responsive Layout

```vue
<template>
  <div v-resize="handleResize" class="container">
    <div :class="{ 'compact': isCompact }">
      Content adapts to container size
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isCompact = ref(false)

function handleResize(entry) {
  isCompact.value = entry.contentRect.width < 600
}
</script>
```

### Chart Resize

```vue
<template>
  <div v-resize="{ handler: resizeChart, debounce: 100 }" class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const chartCanvas = ref(null)
let chart = null

onMounted(() => {
  chart = createChart(chartCanvas.value)
})

function resizeChart(entry) {
  if (chart) {
    chart.resize(entry.contentRect.width, entry.contentRect.height)
  }
}
</script>
```

### Text Truncation

```vue
<template>
  <div v-resize="checkTruncation" class="text-container">
    <p :title="needsTooltip ? text : ''">{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = 'Long text that might need truncation...'
const needsTooltip = ref(false)

function checkTruncation(entry) {
  const el = entry.target.querySelector('p')
  if (el) {
    needsTooltip.value = el.scrollWidth > el.clientWidth
  }
}
</script>
```
