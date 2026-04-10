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

## Composable API

For programmatic use, you can use the `useScroll` composable:

```typescript
import { useScroll } from 'directix'

const {
  scrollLeft,
  scrollTop,
  progressX,
  progressY,
  directionX,
  directionY,
  isScrolling,
  info,
  bind,
  stop,
  scrollTo
} = useScroll({
  throttle: 100,
  passive: true
})

// Bind to element
onMounted(() => bind(containerRef.value))

// Scroll to position
scrollTo({ top: 0, behavior: 'smooth' })
```

### UseScrollOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `throttle` | `number \| Ref<number>` | `0` | Throttle time in milliseconds |
| `passive` | `boolean` | `true` | Use passive event listener |

### UseScrollReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `scrollLeft` | `Readonly<Ref<number>>` | Current scroll left position |
| `scrollTop` | `Readonly<Ref<number>>` | Current scroll top position |
| `progressX` | `Readonly<Ref<number>>` | Horizontal scroll progress (0-1) |
| `progressY` | `Readonly<Ref<number>>` | Vertical scroll progress (0-1) |
| `directionX` | `Readonly<Ref<ScrollDirection>>` | Horizontal scroll direction |
| `directionY` | `Readonly<Ref<ScrollDirection>>` | Vertical scroll direction |
| `isScrolling` | `Readonly<Ref<boolean>>` | Whether the user is scrolling |
| `info` | `Readonly<Ref<ScrollInfo>>` | Scroll info object |
| `bind` | `(element?: HTMLElement \| Window) => () => void` | Bind scroll listener |
| `stop` | `() => void` | Stop listening |
| `scrollTo` | `(options: { top?: number, left?: number, behavior?: 'auto' \| 'smooth' }) => void` | Scroll to position |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useScroll } from 'directix'

const container = ref(null)
const { scrollTop, progressY, directionY, bind } = useScroll()

onMounted(() => bind(container.value))
</script>

<template>
  <div ref="container" class="scroll-container">
    <div class="progress" :style="{ width: `${progressY * 100}%` }" />
  </div>
</template>
```
## Code Generator

<DirectiveConfigurator name="scroll" description="Track scroll position and direction." />
