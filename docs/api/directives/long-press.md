# v-long-press

Detect long press gestures on elements.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <button v-long-press="handleLongPress">Long Press Me</button>
</template>

<script setup>
function handleLongPress(event) {
  console.log('Long press triggered!')
}
</script>
```

### With Options

```vue
<template>
  <button v-long-press="{
    handler: handleLongPress,
    duration: 1000,
    onStart: handleStart,
    onCancel: handleCancel
  }">
    1 Second Press
  </button>
</template>

<script setup>
function handleLongPress(event) {
  console.log('Long press triggered!')
}

function handleStart(event) {
  console.log('Press started')
}

function handleCancel(event) {
  console.log('Press canceled')
}
</script>
```

## API

### Types

```typescript
type LongPressHandler = (event: MouseEvent | TouchEvent) => void

interface LongPressOptions {
  /** Callback when long press is triggered */
  handler: LongPressHandler
  /** Duration in milliseconds */
  duration?: number
  /** Disable the directive */
  disabled?: boolean
  /** Maximum movement before canceling */
  distance?: number
  /** Callback when press starts */
  onStart?: (event: MouseEvent | TouchEvent) => void
  /** Callback when press is canceled */
  onCancel?: (event: MouseEvent | TouchEvent) => void
  /** Callback during press (for progress) */
  onTick?: (remaining: number) => void
  /** Interval for onTick callback */
  tickInterval?: number
  /** Prevent default behavior */
  prevent?: boolean
  /** Stop event propagation */
  stop?: boolean
}

type LongPressBinding = LongPressHandler | LongPressOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when long press triggers (required) |
| `duration` | `number` | `500` | Duration in milliseconds |
| `distance` | `number` | `10` | Max movement before canceling |
| `disabled` | `boolean` | `false` | Disable the directive |
| `prevent` | `boolean` | `true` | Prevent default behavior |
| `stop` | `boolean` | `false` | Stop event propagation |
| `onStart` | `Function` | - | Callback when press starts |
| `onCancel` | `Function` | - | Callback when press is canceled |
| `onTick` | `Function` | - | Callback during press |
| `tickInterval` | `number` | `100` | Interval for onTick callback |

## Examples

### Context Menu

```vue
<template>
  <div
    v-long-press="showContextMenu"
    class="item"
  >
    Long press for options
  </div>
</template>

<script setup>
function showContextMenu(event) {
  // Show context menu at event position
  console.log('Show menu at:', event.clientX, event.clientY)
}
</script>
```

### Progress Indicator

```vue
<template>
  <button v-long-press="{
    handler: deleteItem,
    duration: 2000,
    onTick: updateProgress
  }">
    Hold to delete ({{ progress }}%)
  </button>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(0)

function updateProgress(remaining) {
  progress.value = Math.round((2000 - remaining) / 2000 * 100)
}

function deleteItem() {
  progress.value = 0
  console.log('Item deleted!')
}
</script>
```
