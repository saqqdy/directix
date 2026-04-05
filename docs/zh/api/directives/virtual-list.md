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

## Composable Usage

You can also use the `useVirtualList` composable for the same functionality:

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

### API

```typescript
type ItemSizeFunction = (index: number) => number

interface UseVirtualListOptions<T = any> {
  /** 要渲染的数组（必填） */
  items: Ref<T[]> | T[]
  /** 每项的高度（像素），可以是固定值或函数 @default 50 */
  itemSize?: number | ItemSizeFunction | Ref<number | ItemSizeFunction>
  /** 容器高度（像素） @default 400 */
  height?: number | Ref<number>
  /** 可见区域外额外渲染的项目数 @default 3 */
  overscan?: number | Ref<number>
  /** 项目键字段名 @default 'id' */
  keyField?: string
}

interface VirtualListItem<T = any> {
  /** 项目数据 */
  item: T
  /** 原始列表中的索引 */
  index: number
  /** 定位样式 */
  style: {
    position: string
    top: string
    height: string
    width: string
  }
}

interface UseVirtualListReturn<T = any> {
  /** 当前可见的项目 */
  visibleItems: Ref<VirtualListItem<T>[]>
  /** 列表总高度 */
  totalHeight: Ref<number>
  /** 当前滚动位置 */
  scrollTop: Ref<number>
  /** 可见项目起始索引 */
  startIndex: Ref<number>
  /** 可见项目结束索引 */
  endIndex: Ref<number>
  /** 滚动到指定索引 */
  scrollToIndex: (index: number) => void
  /** 滚动到指定位置 */
  scrollTo: (scrollTop: number) => void
  /** 容器 ref */
  containerRef: Ref<HTMLElement | null>
  /** 列表样式 */
  listStyle: Ref<{ height: string, overflow: string, position: string }>
}
```

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
