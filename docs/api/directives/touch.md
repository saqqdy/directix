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

## Composable API

For programmatic use, you can use the `useTouch` composable:

```typescript
import { useTouch } from 'directix'

const { gesture, bind } = useTouch({
  onSwipe: (event) => console.log('Swiped:', event.direction),
  onSwipeLeft: () => nextSlide(),
  onSwipeRight: () => prevSlide(),
  onPinch: (event) => console.log('Pinch scale:', event.scale),
  onRotate: (event) => console.log('Rotation:', event.rotation),
  onTap: (event) => console.log('Tapped!'),
  onLongPress: (event) => console.log('Long pressed!'),
  swipeThreshold: 30,
  longPressDuration: 500
})
```

### UseTouchOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onSwipe` | `(event: TouchGestureEvent) => void` | - | Callback for any swipe |
| `onSwipeLeft` | `(event: TouchGestureEvent) => void` | - | Callback for swipe left |
| `onSwipeRight` | `(event: TouchGestureEvent) => void` | - | Callback for swipe right |
| `onSwipeUp` | `(event: TouchGestureEvent) => void` | - | Callback for swipe up |
| `onSwipeDown` | `(event: TouchGestureEvent) => void` | - | Callback for swipe down |
| `onPinch` | `(event: TouchGestureEvent) => void` | - | Callback for pinch gesture |
| `onRotate` | `(event: TouchGestureEvent) => void` | - | Callback for rotate gesture |
| `onTap` | `(event: TouchGestureEvent) => void` | - | Callback for tap gesture |
| `onLongPress` | `(event: TouchGestureEvent) => void` | - | Callback for long press |
| `swipeThreshold` | `number` | `30` | Minimum swipe distance (px) |
| `longPressDuration` | `number` | `500` | Long press timeout (ms) |
| `tapDuration` | `number` | `250` | Maximum tap duration (ms) |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable touch detection |

### TouchGestureEvent

| Property | Type | Description |
| -------- | ---- | ----------- |
| `type` | `TouchGesture` | Gesture type: 'swipe', 'pinch', 'rotate', 'tap', 'longPress' |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | Swipe direction (for swipe gestures) |
| `distance` | `number` | Swipe distance in pixels |
| `angle` | `number` | Angle in degrees |
| `scale` | `number` | Pinch scale factor |
| `rotation` | `number` | Rotation angle in degrees |
| `center` | `{ x: number, y: number }` | Gesture center point |
| `event` | `TouchEvent` | Original touch event |

### UseTouchReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `gesture` | `Readonly<Ref<TouchGesture \| null>>` | Current gesture being performed |
| `bind` | `(element: HTMLElement) => () => void` | Bind touch events to an element |

### Example

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useTouch } from 'directix'

const containerRef = ref(null)

const { gesture, bind } = useTouch({
  onSwipeLeft: () => nextSlide(),
  onSwipeRight: () => prevSlide()
})

onMounted(() => {
  if (containerRef.value) {
    bind(containerRef.value)
  }
})

function nextSlide() {
  console.log('Next slide')
}

function prevSlide() {
  console.log('Previous slide')
}
</script>

<template>
  <div ref="containerRef" class="swipe-container">
    Swipe me!
    <p>Current gesture: {{ gesture }}</p>
  </div>
</template>
```
