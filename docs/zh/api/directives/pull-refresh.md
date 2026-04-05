# v-pull-refresh

为移动应用实现下拉刷新功能。当用户下拉时触发刷新操作。

> **起始版本：** `1.3.0`

## 用法

### 基本

```vue
<template>
  <div v-pull-refresh="refresh" class="content">
    <div v-if="refreshing" class="loading">刷新中...</div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script setup>
const refreshing = ref(false)

async function refresh(done) {
  refreshing.value = true
  await fetchData()
  refreshing.value = false
  done()
}
</script>
```

### 带选项

```vue
<template>
  <div v-pull-refresh="{
    handler: refresh,
    threshold: 80,
    loadingText: '加载中...'
  }">
    下拉刷新
  </div>
</template>
```

## API

### 类型

```typescript
interface PullRefreshOptions {
  handler: (done: () => void) => void | Promise<void>
  threshold?: number // 默认: 60
  disabled?: boolean // 默认: false
  pullDistance?: number // 默认: 60
  loadingText?: string
  pullingText?: string
  loosingText?: string
}
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `(done) => void \| Promise<void>` | - | 刷新处理程序（必填） |
| `threshold` | `number` | `60` | 触发刷新的距离阈值 |
| `disabled` | `boolean` | `false` | 是否禁用下拉刷新 |
| `pullDistance` | `number` | `60` | 最大拉动距离 |
| `loadingText` | `string` | `'加载中...'` | 加载时的文本 |
| `pullingText` | `string` | `'下拉刷新'` | 下拉时的文本 |
| `loosingText` | `string` | `'释放刷新'` | 达到阈值时的文本 |

## Composable 用法

你也可以使用 `usePullRefresh` composable 实现相同功能：

```vue
<script setup>
import { usePullRefresh } from 'directix'

const { state, distance, events, containerRef, refresh } = usePullRefresh({
  handler: async () => {
    await fetchData()
  },
  distance: 80
})
</script>

<template>
  <div
    ref="containerRef"
    @touchstart="events.touchstart"
    @touchmove="events.touchmove"
    @touchend="events.touchend"
  >
    <div class="indicator" :style="{ transform: `translateY(${distance}px)` }">
      {{ state }}
    </div>
    <slot></slot>
  </div>
</template>
```

### API

```typescript
type PullRefreshHandler = () => Promise<void> | void
type PullRefreshState = 'idle' | 'pulling' | 'ready' | 'loading' | 'success' | 'error'

interface UsePullRefreshOptions {
  /** 刷新处理程序（必填） */
  handler: PullRefreshHandler
  /** 触发刷新的距离阈值 @default 60 */
  distance?: number | Ref<number>
  /** 最大拉动距离 @default 100 */
  maxDistance?: number | Ref<number>
  /** 是否禁用下拉刷新 @default false */
  disabled?: boolean | Ref<boolean>
  /** 成功指示器显示时长 @default 500 */
  successDuration?: number | Ref<number>
  /** 错误指示器显示时长 @default 1000 */
  errorDuration?: number | Ref<number>
}

interface UsePullRefreshReturn {
  /** 当前下拉刷新状态 */
  state: Ref<PullRefreshState>
  /** 当前拉动距离 */
  distance: Ref<number>
  /** 是否正在拉动 */
  isPulling: Ref<boolean>
  /** 绑定到容器元素的事件处理器 */
  events: {
    touchstart: (e: TouchEvent) => void
    touchmove: (e: TouchEvent) => void
    touchend: () => void
  }
  /** 容器 ref */
  containerRef: Ref<HTMLElement | null>
  /** 手动触发刷新 */
  refresh: () => Promise<void>
}
```

## 示例

### 列表刷新

```vue
<template>
  <div
    v-pull-refresh="{ handler: refresh, threshold: 80 }"
    class="scroll-container"
  >
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
const items = ref([])

async function refresh(done) {
  const newItems = await fetch('/api/items')
  items.value = newItems
  done()
}
</script>
```

### 自定义指示器

```vue
<template>
  <div v-pull-refresh="{
    handler: refresh,
    pullingText: '下拉刷新',
    loosingText: '释放刷新',
    loadingText: '刷新中...'
  }">
    自定义中文文本
  </div>
</template>
```
