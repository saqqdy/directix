# v-draggable

Make elements draggable within a container or boundary.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <div v-draggable class="draggable-box">
    Drag me anywhere
  </div>
</template>
```

### Axis Constraint

```vue
<template>
  <!-- Horizontal only -->
  <div v-draggable="{ axis: 'x' }">X axis only</div>

  <!-- Vertical only -->
  <div v-draggable="{ axis: 'y' }">Y axis only</div>
</template>
```

### Constrained to Parent

```vue
<template>
  <div class="container">
    <div v-draggable="{ constrain: true }" class="box">
      I stay within the container
    </div>
  </div>
</template>
```

### With Handle

```vue
<template>
  <div v-draggable="{ handle: '.drag-handle' }" class="panel">
    <div class="drag-handle">⋮⋮ Drag here</div>
    <div class="content">Content (not directly draggable)</div>
  </div>
</template>
```

### With Callbacks

```vue
<template>
  <div
    v-draggable="{
      onStart: handleStart,
      onDrag: handleDrag,
      onEnd: handleEnd
    }"
  >
    Position: {{ position.x }}, {{ position.y }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const position = ref({ x: 0, y: 0 })

function handleStart(pos) {
  console.log('Drag started:', pos)
}

function handleDrag(pos) {
  position.value = pos
}

function handleEnd(pos) {
  console.log('Drag ended:', pos)
}
</script>
```

## API

### Types

```typescript
type DraggableAxis = 'x' | 'y' | 'both'

interface DraggableOptions {
  /** Drag axis @default 'both' */
  axis?: DraggableAxis
  /** Constrain to parent element @default false */
  constrain?: boolean
  /** Boundary element selector or element */
  boundary?: string | HTMLElement | (() => HTMLElement | null)
  /** Handle element selector */
  handle?: string
  /** Whether dragging is disabled @default false */
  disabled?: boolean
  /** Grid snapping [x, y] */
  grid?: [number, number]
  /** Start drag callback */
  onStart?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
  /** Drag callback */
  onDrag?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
  /** End drag callback */
  onEnd?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
}

type DraggableBinding = boolean | DraggableOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `axis` | `'x' \| 'y' \| 'both'` | `'both'` | Drag axis constraint |
| `constrain` | `boolean` | `false` | Constrain to parent element |
| `boundary` | `string \| HTMLElement \| Function` | - | Custom boundary element |
| `handle` | `string` | - | Selector for drag handle |
| `disabled` | `boolean` | `false` | Disable dragging |
| `grid` | `[number, number]` | - | Snap to grid [x, y] |
| `onStart` | `Function` | - | Callback on drag start |
| `onDrag` | `Function` | - | Callback during drag |
| `onEnd` | `Function` | - | Callback on drag end |

## Examples

### Grid Snapping

```vue
<template>
  <div v-draggable="{ grid: [40, 40] }" class="grid-item">
    Snaps to 40px grid
  </div>
</template>
```

### Modal Dialog

```vue
<template>
  <div class="modal">
    <div v-draggable="{ handle: '.modal-header' }" class="modal-content">
      <div class="modal-header">
        <h3>Draggable Modal</h3>
      </div>
      <div class="modal-body">
        Content here
      </div>
    </div>
  </div>
</template>
```

### Custom Boundary

```vue
<template>
  <div ref="container" class="canvas">
    <div
      v-draggable="{
        boundary: () => container,
        onDrag: updatePosition
      }"
      class="marker"
    >
      Drag me
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const container = ref(null)

function updatePosition(pos) {
  console.log('Position:', pos)
}
</script>
```

### Toggle Dragging

```vue
<template>
  <div v-draggable="{ disabled: !canDrag }">
    {{ canDrag ? 'Draggable' : 'Locked' }}
  </div>
  <button @click="canDrag = !canDrag">
    {{ canDrag ? 'Lock' : 'Unlock' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const canDrag = ref(true)
</script>
```
