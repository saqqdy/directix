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

## Composable API

For programmatic use, you can use the `useDraggable` composable:

```typescript
import { useDraggable } from 'directix'

const { position, isDragging, reset, bind } = useDraggable({
  axis: 'both',
  constrain: false,
  boundary: undefined,
  handle: undefined,
  grid: undefined,
  disabled: false,
  onStart: (pos, event) => console.log('Started:', pos),
  onDrag: (pos, event) => console.log('Dragging:', pos),
  onEnd: (pos, event) => console.log('Ended:', pos)
})

// Reset position
reset()

// Bind to element
onMounted(() => bind(target.value))
```

### UseDraggableOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `axis` | `'x' \| 'y' \| 'both' \| Ref` | `'both'` | Drag axis |
| `constrain` | `boolean \| Ref<boolean>` | `false` | Constrain to parent |
| `boundary` | `string \| HTMLElement \| Function` | - | Boundary element |
| `handle` | `string` | - | Handle element selector |
| `grid` | `[number, number] \| Ref` | - | Grid snapping [x, y] |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable dragging |
| `onStart` | `(position, event) => void` | - | Start drag callback |
| `onDrag` | `(position, event) => void` | - | Drag callback |
| `onEnd` | `(position, event) => void` | - | End drag callback |

### UseDraggableReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `position` | `Readonly<Ref<Position>>` | Current position |
| `isDragging` | `Readonly<Ref<boolean>>` | Whether element is being dragged |
| `reset` | `() => void` | Reset position to origin |
| `bind` | `(element: HTMLElement) => () => void` | Bind draggable behavior to an element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useDraggable } from 'directix'

const target = ref(null)
const { position, isDragging, bind } = useDraggable({
  constrain: true,
  onEnd: (pos) => console.log('Dropped at:', pos)
})

onMounted(() => bind(target.value))
</script>

<template>
  <div ref="target" :class="{ dragging: isDragging }">
    Drag me!
  </div>
</template>
```
