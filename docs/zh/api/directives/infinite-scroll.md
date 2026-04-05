# v-infinite-scroll

列表和信息流的无限滚动加载。

> **起始版本：** `1.1.0`

## 用法

### 基本

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

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 滚动到底部时的处理程序（必填） |
| `distance` | `number` | `0` | 触发加载的距离（像素） |
| `disabled` | `boolean` | `false` | 禁用无限滚动 |
| `loading` | `boolean` | `false` | 加载状态 |
| `throttle` | `number` | `200` | 节流时间（毫秒） |

## Composable 用法

你也可以使用 `useInfiniteScroll` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from 'directix'

const containerRef = ref(null)
const items = ref([])
const page = ref(1)

const { loading, finished, bind, load } = useInfiniteScroll({
  onLoad: async () => {
    const newItems = await fetchItems(page.value++)
    items.value.push(...newItems)
  },
  distance: 100
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef" class="scroll-container">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
    <div v-if="loading">加载中...</div>
    <div v-if="finished">已加载全部</div>
  </div>
</template>
```

### API

```typescript
interface UseInfiniteScrollOptions {
  /** 加载更多的回调 */
  onLoad: () => void | Promise<void>
  /** 是否正在加载 */
  loading?: boolean | Ref<boolean>
  /** 是否已加载完毕 */
  finished?: boolean | Ref<boolean>
  /** 距底部的触发距离（像素） @default 0 */
  distance?: number | Ref<number>
  /** 是否在挂载时立即检查 @default true */
  immediate?: boolean
  /** 是否禁用 @default false */
  disabled?: boolean | Ref<boolean>
}

interface UseInfiniteScrollReturn {
  /** 是否正在加载 */
  loading: Readonly<Ref<boolean>>
  /** 是否已加载完毕 */
  finished: Readonly<Ref<boolean>>
  /** 手动触发加载 */
  load: () => Promise<void>
  /** 绑定无限滚动到元素 */
  bind: (element: HTMLElement) => () => void
  /** 停止观察 */
  stop: () => void
}
```
