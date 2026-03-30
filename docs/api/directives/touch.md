# v-touch

Touch gesture detection directive supporting swipe, pinch, rotate, tap, and long press.

> **Since:** `1.2.0`

## Usage

### Swipe Detection

```vue
<template>
  <div v-touch="{ onSwipe: handleSwipe }">
    Swipe in any direction
  </div>
</template>

<script setup>
function handleSwipe(direction, event) {
  console.log('Swiped:', direction) // 'left' | 'right' | 'up' | 'down'
}
</script>
```

### Directional Swipes

```vue
<template>
  <div v-touch="{ onSwipeLeft: goNext, onSwipeRight: goPrev }">
    Swipe left or right
  </div>
</template>
```

### Tap and Long Press

```vue
<template>
  <div v-touch="{ onTap: handleTap, onLongPress: handleLongPress }">
    Tap or hold me
  </div>
</template>

<script setup>
function handleTap(event) {
  console.log('Tapped!')
}

function handleLongPress(event) {
  console.log('Long pressed!')
}
</script>
```

### Pinch and Rotate

```vue
<template>
  <div v-touch="{ onPinch: handlePinch, onRotate: handleRotate }">
    Use two fingers to pinch or rotate
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scale = ref(1)
const rotation = ref(0)

function handlePinch(newScale, event) {
  scale.value = newScale
}

function handleRotate(angle, event) {
  rotation.value = angle
}
</script>
```

## API

### Types

```typescript
type SwipeDirection = 'left' | 'right' | 'up' | 'down'

interface TouchOptions {
  /** Minimum swipe distance in pixels @default 30 */
  swipeThreshold?: number
  /** Maximum time for a swipe in milliseconds @default 500 */
  swipeTimeout?: number
  /** Minimum pinch scale change @default 0.1 */
  pinchThreshold?: number
  /** Enable swipe detection @default true */
  enableSwipe?: boolean
  /** Enable pinch detection @default true */
  enablePinch?: boolean
  /** Enable rotate detection @default true */
  enableRotate?: boolean
  /** Enable tap detection @default true */
  enableTap?: boolean
  /** Maximum time for a tap in milliseconds @default 250 */
  tapTimeout?: number
  /** Maximum movement for a tap in pixels @default 10 */
  tapThreshold?: number
  /** Enable long press detection @default true */
  enableLongPress?: boolean
  /** Long press timeout in milliseconds @default 500 */
  longPressTimeout?: number
  /** Enable mouse event simulation for desktop @default true */
  enableMouse?: boolean

  /** Called on any swipe */
  onSwipe?: (direction: SwipeDirection, event: TouchEvent | MouseEvent) => void
  /** Called on swipe left */
  onSwipeLeft?: (event: TouchEvent | MouseEvent) => void
  /** Called on swipe right */
  onSwipeRight?: (event: TouchEvent | MouseEvent) => void
  /** Called on swipe up */
  onSwipeUp?: (event: TouchEvent | MouseEvent) => void
  /** Called on swipe down */
  onSwipeDown?: (event: TouchEvent | MouseEvent) => void
  /** Called on pinch (scale factor) */
  onPinch?: (scale: number, event: TouchEvent) => void
  /** Called on rotate (angle in degrees) */
  onRotate?: (angle: number, event: TouchEvent) => void
  /** Called on tap */
  onTap?: (event: TouchEvent | MouseEvent) => void
  /** Called on long press */
  onLongPress?: (event: TouchEvent | MouseEvent) => void
  /** Called on touch start */
  onTouchStart?: (event: TouchEvent | MouseEvent) => void
  /** Called on touch move */
  onTouchMove?: (event: TouchEvent | MouseEvent) => void
  /** Called on touch end */
  onTouchEnd?: (event: TouchEvent | MouseEvent) => void
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `swipeThreshold` | `number` | `30` | Minimum swipe distance in pixels |
| `swipeTimeout` | `number` | `500` | Maximum time for a swipe (ms) |
| `pinchThreshold` | `number` | `0.1` | Minimum pinch scale change |
| `tapTimeout` | `number` | `250` | Maximum time for a tap (ms) |
| `tapThreshold` | `number` | `10` | Maximum movement for a tap |
| `longPressTimeout` | `number` | `500` | Long press timeout (ms) |
| `enableSwipe` | `boolean` | `true` | Enable swipe detection |
| `enablePinch` | `boolean` | `true` | Enable pinch detection |
| `enableRotate` | `boolean` | `true` | Enable rotate detection |
| `enableTap` | `boolean` | `true` | Enable tap detection |
| `enableLongPress` | `boolean` | `true` | Enable long press detection |
| `enableMouse` | `boolean` | `true` | Enable mouse simulation for desktop |

## Examples

### Image Carousel

```vue
<template>
  <div v-touch="{ onSwipeLeft: nextSlide, onSwipeRight: prevSlide }" class="carousel">
    <img :src="slides[currentSlide]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slides = ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg']
const currentSlide = ref(0)

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}
</script>
```

### Pull to Refresh

```vue
<template>
  <div
    v-touch="{
      onSwipeDown: refresh,
      swipeThreshold: 100
    }"
    :class="{ refreshing: isRefreshing }"
  >
    Pull down to refresh
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isRefreshing = ref(false)

async function refresh() {
  isRefreshing.value = true
  await fetchData()
  isRefreshing.value = false
}
</script>
```

### Zoomable Image

```vue
<template>
  <div
    v-touch="{ onPinch: handlePinch }"
    class="image-container"
  >
    <img :style="{ transform: `scale(${scale})` }" src="image.jpg" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scale = ref(1)

function handlePinch(newScale) {
  scale.value = Math.max(0.5, Math.min(3, newScale))
}
</script>
```
