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
