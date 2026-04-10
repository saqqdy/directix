# v-pan

Pan/drag gesture detection.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-pan="handlePan">Swipe me</div>
</template>

<script setup>
function handlePan(e) {
  console.log('Direction:', e.direction)
  console.log('Distance:', e.distance)
}
</script>
```

### With Options

```vue
<template>
  <div v-pan="{
    onPan: handlePan,
    direction: 'horizontal',
    threshold: 20
  }">
    Horizontal only
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onPan` | `(event: PanEvent) => void` | - | Pan event callback |
| `direction` | `'horizontal' \| 'vertical' \| 'all'` | `'all'` | Allowed directions |
| `threshold` | `number` | `10` | Minimum distance to trigger |
| `disabled` | `boolean` | `false` | Disable pan detection |

### Pan Event

```ts
interface PanEvent {
  /** Direction: 'left' | 'right' | 'up' | 'down' */
  direction: string
  /** Distance from start point */
  distance: number
  /** Delta X from last position */
  deltaX: number
  /** Delta Y from last position */
  deltaY: number
  /** Total X offset */
  offsetX: number
  /** Total Y offset */
  offsetY: number
  /** Whether pan is in progress */
  isPanning: boolean
  /** Original event */
  event: MouseEvent | TouchEvent
}
```

## Examples

### Horizontal Slider

```vue
<template>
  <div v-pan="{ onPan: handlePan, direction: 'horizontal' }" class="slider">
    <div :style="{ transform: `translateX(${offsetX}px)` }">
      Slider content
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const offsetX = ref(0)

function handlePan(e) {
  offsetX.value += e.deltaX
}
</script>
```

### Pull to Reveal

```vue
<template>
  <div v-pan="{ onPan: handlePan, direction: 'vertical' }">
    Pull down to reveal
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `usePan` composable:

```typescript
import { usePan } from 'directix'

const { isPanning, deltaX, deltaY, direction, bind } = usePan({
  direction: 'horizontal',
  onPan: handlePan
})

// Bind to element
onMounted(() => bind(elementRef.value))
```

### UsePanReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isPanning` | `Ref<boolean>` | Whether pan is in progress |
| `deltaX` | `Ref<number>` | Current delta X |
| `deltaY` | `Ref<number>` | Current delta Y |
| `direction` | `Ref<string>` | Current direction |
| `bind` | `(element: HTMLElement) => () => void` | Bind to element |
## Code Generator

<DirectiveConfigurator name="pan" description="Pan/drag gesture detection." />
