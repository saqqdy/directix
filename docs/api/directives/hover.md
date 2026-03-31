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

## Composable API

For programmatic use, you can use the `useHover` composable:

```typescript
import { useHover } from 'directix'

const { isHovering, bind } = useHover({
  onEnter: (event) => console.log('Mouse entered'),
  onLeave: (event) => console.log('Mouse left'),
  class: 'is-hovering',
  enterDelay: 100,
  leaveDelay: 100
})

// Bind to element
onMounted(() => {
  const unbind = bind(buttonRef.value)
  onUnmounted(unbind)
})
```

### UseHoverOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onEnter` | `(event: MouseEvent) => void` | - | Callback when mouse enters |
| `onLeave` | `(event: MouseEvent) => void` | - | Callback when mouse leaves |
| `class` | `string` | - | CSS class to add when hovering |
| `enterDelay` | `number \| Ref<number>` | `0` | Delay before enter callback |
| `leaveDelay` | `number \| Ref<number>` | `0` | Delay before leave callback |

### UseHoverReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isHovering` | `Readonly<Ref<boolean>>` | Whether the element is being hovered |
| `bind` | `(element: HTMLElement) => () => void` | Bind hover tracking to an element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useHover } from 'directix'

const buttonRef = ref(null)
const { isHovering, bind } = useHover({
  onEnter: () => console.log('Mouse entered'),
  onLeave: () => console.log('Mouse left'),
  enterDelay: 100
})

onMounted(() => bind(buttonRef.value))
</script>

<template>
  <button ref="buttonRef" :class="{ 'is-hovering': isHovering }">
    Hover Me
  </button>
</template>
```
