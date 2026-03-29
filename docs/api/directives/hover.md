# v-hover

Track hover state with callbacks and CSS classes.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-hover="handleHover">Hover me</div>
</template>

<script setup>
function handleHover(isHovering, event) {
  console.log('Hovering:', isHovering)
}
</script>
```

### With Options

```vue
<template>
  <div v-hover="{
    onEnter: handleEnter,
    onLeave: handleLeave,
    class: 'is-hovering'
  }">
    Hover me
  </div>
</template>

<script setup>
function handleEnter(event) {
  console.log('Mouse entered')
}

function handleLeave(event) {
  console.log('Mouse left')
}
</script>
```

## API

### Types

```typescript
type HoverHandler = (isHovering: boolean, event: MouseEvent) => void

interface HoverOptions {
  /** Callback when hover state changes */
  handler?: HoverHandler
  /** Callback when mouse enters */
  onEnter?: (event: MouseEvent) => void
  /** Callback when mouse leaves */
  onLeave?: (event: MouseEvent) => void
  /** CSS class to add when hovering */
  class?: string
  /** Disable the directive */
  disabled?: boolean
  /** Delay before enter callback */
  enterDelay?: number
  /** Delay before leave callback */
  leaveDelay?: number
}

type HoverBinding = HoverHandler | HoverOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when hover state changes |
| `onEnter` | `Function` | - | Callback on mouse enter |
| `onLeave` | `Function` | - | Callback on mouse leave |
| `class` | `string` | `'v-hover'` | CSS class when hovering |
| `disabled` | `boolean` | `false` | Disable the directive |
| `enterDelay` | `number` | `0` | Delay before enter callback |
| `leaveDelay` | `number` | `0` | Delay before leave callback |

## Examples

### Card Hover Effect

```vue
<template>
  <div v-hover="{ class: 'card-hover' }" class="card">
    Card content
  </div>
</template>

<style>
.card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.card-hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
</style>
```

### Tooltip

```vue
<template>
  <div v-hover="{
    onEnter: showTooltip,
    onLeave: hideTooltip,
    enterDelay: 200
  }">
    Hover for tooltip
    <div v-if="tooltipVisible" class="tooltip">
      Tooltip content
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tooltipVisible = ref(false)

function showTooltip() {
  tooltipVisible.value = true
}

function hideTooltip() {
  tooltipVisible.value = false
}
</script>
```

### Menu Item

```vue
<template>
  <div
    v-for="item in menuItems"
    :key="item.id"
    v-hover="{ handler: (hovering) => activeItem = hovering ? item.id : null }"
    :class="{ active: activeItem === item.id }"
  >
    {{ item.label }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeItem = ref(null)
const menuItems = [
  { id: 1, label: 'Home' },
  { id: 2, label: 'About' },
  { id: 3, label: 'Contact' }
]
</script>
```
