# v-rotate-gesture

双指旋转手势检测。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-rotate-gesture="handleRotate">双指旋转</div>
</template>

<script setup>
function handleRotate(e) {
  console.log('旋转角度:', e.rotation)
  console.log('当前角度:', e.angle)
}
</script>
```

### 应用旋转变换

```vue
<template>
  <div v-rotate-gesture="{
    onRotate: handleRotate,
    enableTransform: true
  }">
    可旋转的元素
  </div>
</template>
```

## API

### RotateGestureEvent

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `originalEvent` | `TouchEvent` | 原始事件 |
| `angle` | `number` | 当前角度（度） |
| `radians` | `number` | 当前角度（弧度） |
| `rotation` | `number` | 相对于起始的旋转角度 |
| `centerX` | `number` | 中心点 X 坐标 |
| `centerY` | `number` | 中心点 Y 坐标 |
| `isRotating` | `boolean` | 是否正在旋转 |
| `isFirst` | `boolean` | 是否刚开始 |
| `isFinal` | `boolean` | 是否已结束 |

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `onStart` | `(e: RotateGestureEvent) => void` | - | 旋转开始回调 |
| `onRotate` | `(e: RotateGestureEvent) => void` | - | 旋转中回调 |
| `onEnd` | `(e: RotateGestureEvent) => void` | - | 旋转结束回调 |
| `preventDefault` | `boolean` | `true` | 是否阻止默认行为 |
| `stopPropagation` | `boolean` | `false` | 是否阻止事件冒泡 |
| `enableTransform` | `boolean` | `false` | 是否应用旋转变换 |
| `transformOrigin` | `string` | `'center center'` | 变换原点 |

### 绑定值类型

```ts
type RotateGestureBinding = RotateGestureOptions['onRotate'] | RotateGestureOptions
```

## Composable 用法

你也可以使用 `useRotateGesture` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRotateGesture } from 'directix'

const containerRef = ref(null)
const { isRotating, angle, bind } = useRotateGesture({
  onRotate: (e) => console.log('旋转角度:', e.rotation),
  enableTransform: true
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">双指旋转</div>
  <p v-if="isRotating">当前角度: {{ angle.toFixed(0) }}°</p>
</template>
```

### API

```typescript
interface RotateGestureEvent {
  angle: number
  radians: number
  rotation: number
  centerX: number
  centerY: number
  isRotating: boolean
  isFirst: boolean
  isFinal: boolean
}

interface UseRotateGestureOptions {
  /** 旋转开始回调 */
  onStart?: (e: RotateGestureEvent) => void
  /** 旋转中回调 */
  onRotate?: (e: RotateGestureEvent) => void
  /** 旋转结束回调 */
  onEnd?: (e: RotateGestureEvent) => void
  /** 是否应用变换 */
  enableTransform?: boolean
}

interface UseRotateGestureReturn {
  /** 是否正在旋转 */
  isRotating: Ref<boolean>
  /** 当前角度 */
  angle: Ref<number>
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
