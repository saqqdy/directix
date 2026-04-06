# v-pinch

Two-finger pinch/zoom gesture.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-pinch="handlePinch">Pinch to zoom</div>
</template>

<script setup>
function handlePinch(e) {
  console.log('Scale:', e.scale)
  console.log('Center:', e.centerX, e.centerY)
}
</script>
```

### With Options

```vue
<template>
  <div v-pinch="{
    onPinch: handlePinch,
    enableTransform: true,
    minScale: 0.5,
    maxScale: 3
  }">
    Pinch to scale
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onPinch` | `(event: PinchEvent) => void` | - | Pinch event callback |
| `enableTransform` | `boolean` | `false` | Auto-apply CSS transform |
| `minScale` | `number` | `0.5` | Minimum scale factor |
| `maxScale` | `number` | `3` | Maximum scale factor |
| `disabled` | `boolean` | `false` | Disable pinch detection |

### Pinch Event

```ts
interface PinchEvent {
  /** Current scale factor */
  scale: number
  /** Center point X */
  centerX: number
  /** Center point Y */
  centerY: number
  /** Delta scale from last event */
  deltaScale: number
  /** Whether pinch is in progress */
  isPinching: boolean
  /** Original event */
  event: TouchEvent
}
```

## Examples

### Image Zoom

```vue
<template>
  <div v-pinch="{
    onPinch: handlePinch,
    enableTransform: true,
    minScale: 1,
    maxScale: 4
  }" class="image-container">
    <img src="image.jpg" />
  </div>
</template>

<style>
.image-container {
  overflow: hidden;
  touch-action: none;
}
</style>
```

### Map Zoom

```vue
<template>
  <div v-pinch="{ onPinch: handlePinch }" class="map">
    <div :style="{ transform: `scale(${scale})` }">
      <!-- Map content -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scale = ref(1)

function handlePinch(e) {
  scale.value = Math.max(0.5, Math.min(3, e.scale))
}
</script>
```

## Composable API

For programmatic use, you can use the `usePinch` composable:

```typescript
import { usePinch } from 'directix'

const { scale, isPinching, bind } = usePinch({
  minScale: 0.5,
  maxScale: 3,
  onPinch: handlePinch
})

// Bind to element
onMounted(() => bind(elementRef.value))
```

### UsePinchReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `scale` | `Ref<number>` | Current scale factor |
| `isPinching` | `Ref<boolean>` | Whether pinch is in progress |
| `bind` | `(element: HTMLElement) => () => void` | Bind to element |
