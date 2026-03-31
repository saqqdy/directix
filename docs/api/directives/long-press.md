# v-long-press

Detect long press gestures on elements.

> **Since:** `1.1.0`

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

## Composable API

For programmatic use, you can use the `useLongPress` composable:

```typescript
import { useLongPress } from 'directix'

const { isPressing, start, stop, bind } = useLongPress({
  duration: 500,
  distance: 10,
  onStart: (event) => console.log('Press started'),
  onTrigger: (event) => console.log('Long press triggered!'),
  onCancel: (event) => console.log('Press canceled'),
  onTick: (remaining) => console.log('Remaining:', remaining),
  tickInterval: 100,
  prevent: true
})

// Bind to element
onMounted(() => {
  const unbind = bind(buttonRef.value)
  onUnmounted(unbind)
})
```

### UseLongPressOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `duration` | `number \| Ref<number>` | `500` | Duration in milliseconds to trigger |
| `distance` | `number \| Ref<number>` | `10` | Maximum movement before canceling |
| `onStart` | `(event: MouseEvent \| TouchEvent) => void` | - | Callback when press starts |
| `onTrigger` | `(event: MouseEvent \| TouchEvent) => void` | - | Callback when long press triggers |
| `onCancel` | `(event: MouseEvent \| TouchEvent) => void` | - | Callback when press is canceled |
| `onTick` | `(remaining: number) => void` | - | Callback during press |
| `tickInterval` | `number` | `100` | Interval for onTick callback |
| `prevent` | `boolean` | `true` | Prevent default behavior |

### UseLongPressReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isPressing` | `Readonly<Ref<boolean>>` | Whether a long press is in progress |
| `start` | `(event: MouseEvent \| TouchEvent) => void` | Start long press detection |
| `stop` | `(event: MouseEvent \| TouchEvent) => void` | Stop long press detection |
| `bind` | `(element: HTMLElement) => () => void` | Bind long press detection to an element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useLongPress } from 'directix'

const buttonRef = ref(null)
const { isPressing, bind } = useLongPress({
  onTrigger: (event) => {
    console.log('Long press triggered!')
  },
  duration: 800
})

onMounted(() => bind(buttonRef.value))
</script>

<template>
  <button ref="buttonRef" :class="{ pressing: isPressing }">
    Long Press Me
  </button>
</template>
```
