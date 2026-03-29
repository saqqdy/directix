# Scroll Directives

Scroll directives help you manage scroll behavior and infinite loading.

## v-scroll

Track scroll position and direction.

### Basic Usage

```vue
<template>
  <div v-scroll="handleScroll" class="scroll-container">
    Scroll content here
  </div>
</template>

<script setup>
function handleScroll(event, info) {
  console.log('Scroll position:', info.scrollTop)
  console.log('Progress:', info.progressY)
  console.log('Direction:', info.directionY)
}
</script>
```

### Scroll Info Object

The handler receives detailed scroll information:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `scrollTop` | `number` | Current scroll top position |
| `scrollLeft` | `number` | Current scroll left position |
| `progressY` | `number` | Vertical scroll progress (0-1) |
| `progressX` | `number` | Horizontal scroll progress (0-1) |
| `directionY` | `-1 \| 0 \| 1` | Vertical direction (-1: up, 1: down) |
| `directionX` | `-1 \| 0 \| 1` | Horizontal direction (-1: left, 1: right) |

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Scroll event handler (required) |
| `throttle` | `number` | `0` | Throttle time in milliseconds |
| `passive` | `boolean` | `true` | Use passive event listener |
| `container` | `string \| Element` | - | Custom scroll container |

## v-infinite-scroll

Infinite scroll loading for lists and feeds.

### Basic Usage

```vue
<template>
  <div v-infinite-scroll="loadMore" class="scroll-container">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([...])

async function loadMore() {
  const newItems = await fetchMoreItems()
  items.value.push(...newItems)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Handler when scrolling to bottom |
| `distance` | `number` | `0` | Distance from bottom to trigger |
| `disabled` | `boolean` | `false` | Disable infinite scroll |
| `loading` | `boolean` | `false` | Loading state |
| `throttle` | `number` | `200` | Throttle time in milliseconds |

## v-sticky

Make elements sticky when scrolling.

### Basic Usage

```vue
<template>
  <div v-sticky>Sticky header</div>
  <div v-sticky="50">Sticky with 50px top offset</div>
  <div v-sticky="{ top: 60, zIndex: 1000 }">Custom sticky</div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `top` | `number \| string` | `0` | Top offset when sticky |
| `zIndex` | `number` | `100` | Z-index when sticky |
| `stickyClass` | `string` | `'v-sticky--fixed'` | CSS class when sticky |
| `onChange` | `Function` | - | Callback when sticky state changes |
