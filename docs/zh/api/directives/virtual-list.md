# v-virtual-list

使用虚拟滚动高效渲染大型列表。仅渲染可见项以获得最佳性能。

> **起始版本：** `1.3.0`

## 用法

### 基本

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

### 类型

```typescript
interface VirtualListOptions<T = any> {
  items: T[]
  itemHeight: number | ((index: number) => number)
  height: number
  buffer?: number // 默认: 5
  keyField?: string // 默认: 'id'
  direction?: 'vertical' | 'horizontal' // 默认: 'vertical'
  onScroll?: (event: Event) => void
  onResize?: (size: { width: number; height: number }) => void
}
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `items` | `T[]` | - | 要渲染的数组（必填） |
| `itemHeight` | `number \| (index) => number` | - | 每项高度（必填） |
| `height` | `number` | - | 容器高度（必填） |
| `buffer` | `number` | `5` | 额外渲染的项目数 |
| `keyField` | `string` | `'id'` | 用作唯一键的字段 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 滚动方向 |
| `onScroll` | `(event) => void` | - | 滚动事件处理程序 |
| `onResize` | `(size) => void` | - | 尺寸变化事件处理程序 |

## Composable 用法

你也可以使用 `useVirtualList` composable 实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useVirtualList } from 'directix'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `项目 ${i}` })))

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

## 示例

### 大数据列表

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
  name: `用户 ${i}`,
  avatar: `https://i.pravatar.cc/40?img=${i % 70}`
}))
</script>
```

### 动态高度项

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

### 水平滚动

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
