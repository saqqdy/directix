# v-pull-refresh

Implement pull-to-refresh functionality for mobile apps. Triggers refresh action when user pulls down.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <div v-pull-refresh="refresh" class="content">
    <div v-if="refreshing" class="loading">Refreshing...</div>
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

### With Options

```vue
<template>
  <div v-pull-refresh="{
    handler: refresh,
    threshold: 80,
    loadingText: 'Loading...'
  }">
    Pull down to refresh
  </div>
</template>
```

## API

### Types

```typescript
interface PullRefreshOptions {
  handler: (done: () => void) => void | Promise<void>
  threshold?: number // default: 60
  disabled?: boolean // default: false
  pullDistance?: number // default: 60
  loadingText?: string
  pullingText?: string
  loosingText?: string
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `(done) => void \| Promise<void>` | - | Refresh handler (required) |
| `threshold` | `number` | `60` | Distance to trigger refresh |
| `disabled` | `boolean` | `false` | Disable pull-to-refresh |
| `pullDistance` | `number` | `60` | Max pull distance |
| `loadingText` | `string` | `'Loading...'` | Text while loading |
| `pullingText` | `string` | `'Pull to refresh'` | Text while pulling |
| `loosingText` | `string` | `'Release to refresh'` | Text when threshold reached |

## Composable Usage

You can also use the `usePullRefresh` composable for the same functionality:

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

## Examples

### List Refresh

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

### Custom Indicator

```vue
<template>
  <div v-pull-refresh="{
    handler: refresh,
    pullingText: '下拉刷新',
    loosingText: '释放刷新',
    loadingText: '刷新中...'
  }">
    Custom Chinese text
  </div>
</template>
```
