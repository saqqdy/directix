# v-virtual-list

Render large lists efficiently using virtual scrolling. Only visible items are rendered for optimal performance.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <div v-virtual-list="{
    items: largeList,
    itemHeight: 50,
    height: 400
  }">
    <template #default="{ item, index }">
      <div class="list-item">{{ index }}: {{ item.name }}</div>
    </template>
  </div>
</template>
```

## API

### Types

```typescript
interface VirtualListOptions<T = any> {
  items: T[]
  itemHeight: number | ((index: number) => number)
  height: number
  buffer?: number // default: 5
  keyField?: string // default: 'id'
  direction?: 'vertical' | 'horizontal' // default: 'vertical'
  onScroll?: (event: Event) => void
  onResize?: (size: { width: number; height: number }) => void
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `items` | `T[]` | - | Array of items to render (required) |
| `itemHeight` | `number \| (index) => number` | - | Height of each item (required) |
| `height` | `number` | - | Height of the container (required) |
| `buffer` | `number` | `5` | Number of extra items to render |
| `keyField` | `string` | `'id'` | Field to use as unique key |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Scroll direction |
| `onScroll` | `(event) => void` | - | Scroll event handler |
| `onResize` | `(size) => void` | - | Resize event handler |

## Examples

### Large Data List

```vue
<template>
  <div
    v-virtual-list="{
      items: items,
      itemHeight: 40,
      height: 500,
      buffer: 10
    }"
    class="virtual-list"
  >
    <template #default="{ item }">
      <div class="item">
        <img :src="item.avatar" />
        <span>{{ item.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  avatar: `https://i.pravatar.cc/40?img=${i % 70}`
}))
</script>
```

### Dynamic Item Height

```vue
<template>
  <div v-virtual-list="{
    items: messages,
    itemHeight: (index) => estimateHeight(messages[index]),
    height: 600
  }">
    <template #default="{ item }">
      <div class="message">{{ item.text }}</div>
    </template>
  </div>
</template>
```

### Horizontal Scroll

```vue
<template>
  <div v-virtual-list="{
    items: images,
    itemHeight: 200,
    height: 200,
    direction: 'horizontal'
  }">
    <template #default="{ item }">
      <img :src="item.url" />
    </template>
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `useVirtualList` composable:

```typescript
import { useVirtualList } from 'directix'

const {
  visibleItems,
  totalHeight,
  scrollTop,
  startIndex,
  endIndex,
  scrollToIndex,
  scrollTo,
  containerRef,
  listStyle
} = useVirtualList({
  items: largeList,
  itemSize: 50,
  height: 400,
  overscan: 3,
  keyField: 'id'
})

// Scroll to index
scrollToIndex(100)

// Scroll to position
scrollTo(5000)
```

### UseVirtualListOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `items` | `Ref<T[]> \| T[]` | - | Array of items to render (required) |
| `itemSize` | `number \| Function \| Ref` | `50` | Height of each item or function |
| `height` | `number \| Ref<number>` | `400` | Height of the container |
| `overscan` | `number \| Ref<number>` | `3` | Number of extra items to render |
| `keyField` | `string` | `'id'` | Field to use as unique key |

### UseVirtualListReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `visibleItems` | `Ref<VirtualListItem<T>[]>` | Currently visible items |
| `totalHeight` | `Ref<number>` | Total height of the list |
| `scrollTop` | `Ref<number>` | Current scroll position |
| `startIndex` | `Ref<number>` | Start index of visible items |
| `endIndex` | `Ref<number>` | End index of visible items |
| `scrollToIndex` | `(index: number) => void` | Scroll to a specific index |
| `scrollTo` | `(scrollTop: number) => void` | Scroll to a position |
| `containerRef` | `Ref<HTMLElement \| null>` | Container ref to bind |
| `listStyle` | `Ref<object>` | Style for the wrapper element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useVirtualList } from 'directix'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })))

const {
  visibleItems,
  totalHeight,
  containerRef,
  listStyle,
  scrollToIndex
} = useVirtualList({
  items,
  itemSize: 50,
  height: 600
})
</script>

<template>
  <div ref="containerRef" :style="listStyle">
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div
        v-for="{ item, index, style } in visibleItems"
        :key="item.id"
        :style="style"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
```
