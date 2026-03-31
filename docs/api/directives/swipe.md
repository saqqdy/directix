# v-swipe

Detect swipe gestures on elements. Supports directional swipes with configurable thresholds.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <div v-swipe="handleSwipe">
    Swipe me in any direction
  </div>
</template>

<script setup>
function handleSwipe(direction) {
  console.log('Swiped:', direction) // 'left' | 'right' | 'up' | 'down'
}
</script>
```

### With Directional Callbacks

```vue
<template>
  <div v-swipe="{
    onLeft: () => prevSlide(),
    onRight: () => nextSlide(),
    onUp: () => console.log('Swiped up'),
    onDown: () => console.log('Swiped down')
  }">
    Swipe left or right to navigate
  </div>
</template>
```

## API

### Types

```typescript
interface SwipeOptions {
  onLeft?: () => void
  onRight?: () => void
  onUp?: () => void
  onDown?: () => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  threshold?: number // default: 50
  preventDefault?: boolean // default: true
  touchOnly?: boolean // default: false
}

type SwipeBinding = SwipeOptions | ((direction: 'left' | 'right' | 'up' | 'down') => void)
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onLeft` | `() => void` | - | Callback for left swipe |
| `onRight` | `() => void` | - | Callback for right swipe |
| `onUp` | `() => void` | - | Callback for up swipe |
| `onDown` | `() => void` | - | Callback for down swipe |
| `onSwipe` | `(direction) => void` | - | Callback with direction parameter |
| `threshold` | `number` | `50` | Minimum distance for swipe detection |
| `preventDefault` | `boolean` | `true` | Prevent default scroll behavior |
| `touchOnly` | `boolean` | `false` | Only detect touch events |

## Examples

### Image Carousel

```vue
<template>
  <div
    v-swipe="{
      onLeft: nextImage,
      onRight: prevImage,
      threshold: 30
    }"
    class="carousel"
  >
    <img :src="images[currentIndex]" />
  </div>
</template>
```

### Tab Navigation

```vue
<template>
  <div v-swipe="handleSwipe" class="tabs-container">
    <div v-for="tab in tabs" :key="tab.id" v-show="tab.id === activeTab">
      {{ tab.content }}
    </div>
  </div>
</template>

<script setup>
function handleSwipe(direction) {
  if (direction === 'left') activeTab.value = nextTab()
  if (direction === 'right') activeTab.value = prevTab()
}
</script>
```

## Composable API

For programmatic use, you can use the `useSwipe` composable:

```typescript
import { useSwipe } from 'directix'

const { direction, lengthX, lengthY, isSwiping, bind } = useSwipe({
  handler: (direction, event) => console.log('Swiped:', direction),
  threshold: 30,
  maxTime: 500,
  directions: ['left', 'right', 'up', 'down'],
  preventScrollOnSwipe: true,
  mouse: true,
  onLeft: () => console.log('Swiped left'),
  onRight: () => console.log('Swiped right'),
  onUp: () => console.log('Swiped up'),
  onDown: () => console.log('Swiped down')
})

// Bind to element
onMounted(() => bind(container.value))
```

### UseSwipeOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `SwipeHandler` | - | Swipe handler callback |
| `threshold` | `number \| Ref<number>` | `30` | Minimum distance to trigger |
| `maxTime` | `number \| Ref<number>` | `500` | Maximum time for swipe |
| `directions` | `SwipeDirection[]` | `['left', 'right', 'up', 'down']` | Allowed directions |
| `preventScrollOnSwipe` | `boolean` | `true` | Prevent scroll on swipe |
| `mouse` | `boolean` | `true` | Enable mouse events |
| `onLeft` | `() => void` | - | Left swipe callback |
| `onRight` | `() => void` | - | Right swipe callback |
| `onUp` | `() => void` | - | Up swipe callback |
| `onDown` | `() => void` | - | Down swipe callback |

### UseSwipeReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `direction` | `Readonly<Ref<SwipeDirection \| null>>` | Current swipe direction |
| `lengthX` | `Readonly<Ref<number>>` | Horizontal swipe length |
| `lengthY` | `Readonly<Ref<number>>` | Vertical swipe length |
| `isSwiping` | `Readonly<Ref<boolean>>` | Whether a swipe is in progress |
| `bind` | `(element: HTMLElement) => () => void` | Bind swipe detection to an element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useSwipe } from 'directix'

const container = ref(null)
const { direction, bind } = useSwipe({
  onLeft: () => nextSlide(),
  onRight: () => prevSlide()
})

onMounted(() => bind(container.value))
</script>

<template>
  <div ref="container">
    Swipe me!
  </div>
</template>
```
