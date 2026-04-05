# v-pan

平移/拖拽手势检测。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-pan="handlePan">滑动我</div>
</template>

<script setup>
function handlePan(e) {
  console.log('方向:', e.direction)
  console.log('距离:', e.distance)
}
</script>
```

### 限制方向

```vue
<template>
  <div v-pan="{
    onPan: handlePan,
    direction: 'horizontal',
    threshold: 20
  }">
    仅水平滑动
  </div>
</template>
```

## API

### PanEvent

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `originalEvent` | `TouchEvent \| MouseEvent` | 原始事件 |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | 滑动方向 |
| `deltaX` | `number` | X 轴偏移量 |
| `deltaY` | `number` | Y 轴偏移量 |
| `distance` | `number` | 滑动距离 |
| `x` | `number` | 当前 X 坐标 |
| `y` | `number` | 当前 Y 坐标 |
| `startX` | `number` | 起始 X 坐标 |
| `startY` | `number` | 起始 Y 坐标 |
| `isPanning` | `boolean` | 是否正在滑动 |
| `isFirst` | `boolean` | 是否刚开始 |
| `isFinal` | `boolean` | 是否已结束 |
| `velocity` | `number` | 滑动速度 |

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `onStart` | `(e: PanEvent) => void` | - | 滑动开始回调 |
| `onPan` | `(e: PanEvent) => void` | - | 滑动中回调 |
| `onEnd` | `(e: PanEvent) => void` | - | 滑动结束回调 |
| `threshold` | `number` | `10` | 触发滑动的最小距离 |
| `direction` | `'horizontal' \| 'vertical' \| 'all'` | `'all'` | 方向限制 |
| `preventDefault` | `boolean` | `true` | 是否阻止默认行为 |
| `stopPropagation` | `boolean` | `false` | 是否阻止事件冒泡 |
| `pointers` | `('touch' \| 'mouse')[]` | `['touch', 'mouse']` | 监听的指针类型 |

### 绑定值类型

```ts
type PanBinding = PanOptions['onPan'] | PanOptions
```

## Composable 用法

你也可以使用 `usePan` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { usePan } from 'directix'

const containerRef = ref(null)
const { isPanning, direction, distance, bind } = usePan({
  onPan: (e) => console.log('滑动:', e.direction, e.distance),
  direction: 'horizontal'
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">滑动我</div>
  <p v-if="isPanning">正在滑动: {{ direction }}, 距离: {{ distance }}</p>
</template>
```

### API

```typescript
interface PanEvent {
  direction: 'left' | 'right' | 'up' | 'down'
  deltaX: number
  deltaY: number
  distance: number
  x: number
  y: number
  startX: number
  startY: number
  isPanning: boolean
  isFirst: boolean
  isFinal: boolean
  velocity: number
}

interface UsePanOptions {
  /** 滑动开始回调 */
  onStart?: (e: PanEvent) => void
  /** 滑动中回调 */
  onPan?: (e: PanEvent) => void
  /** 滑动结束回调 */
  onEnd?: (e: PanEvent) => void
  /** 触发滑动的最小距离 */
  threshold?: number
  /** 方向限制 */
  direction?: 'horizontal' | 'vertical' | 'all'
  /** 是否阻止默认行为 */
  preventDefault?: boolean
  /** 监听的指针类型 */
  pointers?: ('touch' | 'mouse')[]
}

interface UsePanReturn {
  /** 是否正在滑动 */
  isPanning: Ref<boolean>
  /** 当前滑动方向 */
  direction: Ref<'left' | 'right' | 'up' | 'down' | null>
  /** 滑动距离 */
  distance: Ref<number>
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
