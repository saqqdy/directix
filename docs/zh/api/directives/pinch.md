# v-pinch

双指缩放手势检测。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-pinch="handlePinch">双指缩放</div>
</template>

<script setup>
function handlePinch(e) {
  console.log('缩放比例:', e.scale)
  console.log('中心点:', e.centerX, e.centerY)
}
</script>
```

### 应用缩放变换

```vue
<template>
  <div v-pinch="{
    onPinch: handlePinch,
    enableTransform: true,
    minScale: 0.5,
    maxScale: 3
  }">
    可缩放的元素
  </div>
</template>
```

## API

### PinchEvent

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `originalEvent` | `TouchEvent` | 原始事件 |
| `scale` | `number` | 缩放比例（相对于开始） |
| `distance` | `number` | 当前两指距离 |
| `initialDistance` | `number` | 初始两指距离 |
| `centerX` | `number` | 中心点 X 坐标 |
| `centerY` | `number` | 中心点 Y 坐标 |
| `isPinching` | `boolean` | 是否正在缩放 |
| `isFirst` | `boolean` | 是否刚开始 |
| `isFinal` | `boolean` | 是否已结束 |

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `onStart` | `(e: PinchEvent) => void` | - | 缩放开始回调 |
| `onPinch` | `(e: PinchEvent) => void` | - | 缩放中回调 |
| `onEnd` | `(e: PinchEvent) => void` | - | 缩放结束回调 |
| `minScale` | `number` | - | 最小缩放比例 |
| `maxScale` | `number` | - | 最大缩放比例 |
| `preventDefault` | `boolean` | `true` | 是否阻止默认行为 |
| `stopPropagation` | `boolean` | `false` | 是否阻止事件冒泡 |
| `enableTransform` | `boolean` | `false` | 是否应用缩放变换 |
| `transformOrigin` | `string` | `'center center'` | 变换原点 |

### 绑定值类型

```ts
type PinchBinding = PinchOptions['onPinch'] | PinchOptions
```

## Composable 用法

你也可以使用 `usePinch` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { usePinch } from 'directix'

const containerRef = ref(null)
const { isPinching, scale, bind } = usePinch({
  onPinch: (e) => console.log('缩放:', e.scale),
  minScale: 0.5,
  maxScale: 3
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">双指缩放</div>
  <p v-if="isPinching">正在缩放: {{ scale.toFixed(2) }}x</p>
</template>
```

### API

```typescript
interface PinchEvent {
  scale: number
  distance: number
  initialDistance: number
  centerX: number
  centerY: number
  isPinching: boolean
  isFirst: boolean
  isFinal: boolean
}

interface UsePinchOptions {
  /** 缩放开始回调 */
  onStart?: (e: PinchEvent) => void
  /** 缩放中回调 */
  onPinch?: (e: PinchEvent) => void
  /** 缩放结束回调 */
  onEnd?: (e: PinchEvent) => void
  /** 最小缩放比例 */
  minScale?: number
  /** 最大缩放比例 */
  maxScale?: number
  /** 是否应用变换 */
  enableTransform?: boolean
}

interface UsePinchReturn {
  /** 是否正在缩放 */
  isPinching: Ref<boolean>
  /** 当前缩放比例 */
  scale: Ref<number>
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
