# v-scroll

Track scroll position and direction.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-scroll="handleScroll" class="scroll-container">
    Scroll content here
  </div>
</template>

<script setup>
function handleScroll(event, info) {
  console.log('Scroll position:', info.scrollTop)
  console.log('Progress:', info.progressY)
  console.log('Direction:', info.directionY)
}
</script>
```

### With Options

```vue
<template>
  <div v-scroll="{
    handler: handleScroll,
    throttle: 100
  }">
    Throttled scroll
  </div>
</template>
```

## API

### Types

```typescript
interface ScrollInfo {
  /** Current scroll left position */
  scrollLeft: number
  /** Current scroll top position */
  scrollTop: number
  /** Maximum scroll left */
  scrollLeftMax: number
  /** Maximum scroll top */
  scrollTopMax: number
  /** Horizontal scroll progress (0-1) */
  progressX: number
  /** Vertical scroll progress (0-1) */
  progressY: number
  /** Direction of horizontal scroll (-1: left, 1: right, 0: none) */
  directionX: -1 | 0 | 1
  /** Direction of vertical scroll (-1: up, 1: down, 0: none) */
  directionY: -1 | 0 | 1
  /** Scroll container element or window */
  container: Element | Window
}

type ScrollHandler = (event: Event, info: ScrollInfo) => void

interface ScrollOptions {
  /** Scroll event handler */
  handler: ScrollHandler
  /** Disable the directive */
  disabled?: boolean
  /** Use passive event listener */
  passive?: boolean
  /** Throttle time in milliseconds */
  throttle?: number
  /** Custom scroll container */
  container?: string | Element | Window | null
}

type ScrollBinding = ScrollHandler | ScrollOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Scroll event handler (required) |
| `disabled` | `boolean` | `false` | Disable the directive |
| `passive` | `boolean` | `true` | Use passive event listener |
| `throttle` | `number` | `0` | Throttle time in milliseconds |
| `container` | `string \| Element \| Window` | - | Custom scroll container |

## Examples

### Progress Bar

```vue
<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: `${progress}%` }"></div>
  </div>
  <div v-scroll="handleScroll" class="content">
    Long content here...
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(0)

function handleScroll(event, info) {
  progress.value = Math.round(info.progressY * 100)
}
</script>
```

### Infinite Scroll Indicator

```vue
<template>
  <div v-scroll="{
    handler: checkScroll,
    throttle: 100
  }">
    Content
    <div v-if="nearBottom" class="load-more">Load more...</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nearBottom = ref(false)

function checkScroll(event, info) {
  nearBottom.value = info.progressY > 0.9
}
</script>
```

### Direction Detection

```vue
<template>
  <div v-scroll="handleScroll">
    <div :class="{ 'scrolling-down': isScrollingDown }">
      Header
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isScrollingDown = ref(false)

function handleScroll(event, info) {
  isScrollingDown.value = info.directionY === 1
}
</script>
```
