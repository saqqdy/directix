# v-rotate-gesture

Two-finger rotation gesture.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-rotate-gesture="handleRotate">Rotate with two fingers</div>
</template>

<script setup>
function handleRotate(e) {
  console.log('Rotation:', e.rotation)
  console.log('Angle:', e.angle)
}
</script>
```

### With Transform

```vue
<template>
  <div v-rotate-gesture="{
    onRotate: handleRotate,
    enableTransform: true
  }">
    Rotate with transform
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onRotate` | `(event: RotateGestureEvent) => void` | - | Rotation event callback |
| `enableTransform` | `boolean` | `false` | Auto-apply CSS transform |
| `disabled` | `boolean` | `false` | Disable rotation detection |

### Rotate Gesture Event

```ts
interface RotateGestureEvent {
  /** Current rotation in degrees */
  rotation: number
  /** Absolute angle from start */
  angle: number
  /** Delta rotation from last event */
  deltaRotation: number
  /** Center point X */
  centerX: number
  /** Center point Y */
  centerY: number
  /** Whether rotation is in progress */
  isRotating: boolean
  /** Original event */
  event: TouchEvent
}
```

## Examples

### Image Rotation

```vue
<template>
  <div v-rotate-gesture="{
    onRotate: handleRotate,
    enableTransform: true
  }" class="image-container">
    <img src="image.jpg" :style="{ transform: `rotate(${angle}deg)` }" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const angle = ref(0)

function handleRotate(e) {
  angle.value += e.deltaRotation
}
</script>
```

### Combined with Pinch

```vue
<template>
  <div
    v-pinch="{ onPinch: handlePinch, enableTransform: true }"
    v-rotate-gesture="{ onRotate: handleRotate, enableTransform: true }"
    class="transform-container"
  >
    <img src="image.jpg" :style="transformStyle" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const scale = ref(1)
const rotation = ref(0)

function handlePinch(e) {
  scale.value = e.scale
}

function handleRotate(e) {
  rotation.value = e.angle
}

const transformStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotation.value}deg)`
}))
</script>
```

## Composable API

For programmatic use, you can use the `useRotateGesture` composable:

```typescript
import { useRotateGesture } from 'directix'

const { angle, isRotating, bind } = useRotateGesture({
  onRotate: handleRotate,
  enableTransform: true
})

// Bind to element
onMounted(() => bind(elementRef.value))
```

### UseRotateGestureReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `angle` | `Ref<number>` | Current rotation angle |
| `isRotating` | `Ref<boolean>` | Whether rotation is in progress |
| `bind` | `(element: HTMLElement) => () => void` | Bind to element |
## Code Generator

<DirectiveConfigurator name="rotate-gesture" description="Two-finger rotation gesture." />
