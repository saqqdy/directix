# v-fade

淡入淡出动画效果。

> **起始版本：** `1.5.0`

## 用法

### 切换可见性

```vue
<template>
  <div v-fade="isVisible">淡入淡出内容</div>
  <button @click="isVisible = !isVisible">切换</button>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>
```

### 仅淡入

```vue
<template>
  <div v-fade="'in'">淡入效果</div>
</template>
```

### 仅淡出

```vue
<template>
  <div v-fade="'out'">淡出效果</div>
</template>
```

### 带选项

```vue
<template>
  <div v-fade="{
    visible: isVisible,
    duration: 500,
    easing: 'ease-in-out',
    onComplete: () => console.log('动画完成')
  }">
    内容
  </div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `direction` | `'in' \| 'out' \| 'toggle'` | `'toggle'` | 动画方向 |
| `visible` | `boolean` | `true` | 元素是否可见 |
| `duration` | `number` | `300` | 动画时长（毫秒） |
| `delay` | `number` | `0` | 动画延迟（毫秒） |
| `easing` | `string` | `'ease'` | CSS 缓动函数 |
| `minOpacity` | `number` | `0` | 淡出时的最小透明度 |
| `maxOpacity` | `number` | `1` | 淡入时的最大透明度 |
| `onStart` | `(direction: 'in' \| 'out') => void` | - | 动画开始回调 |
| `onComplete` | `(direction: 'in' \| 'out') => void` | - | 动画完成回调 |

### 绑定值类型

```ts
type FadeBinding = boolean | FadeDirection | FadeOptions
```

## Composable 用法

你也可以使用 `useFade` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFade } from 'directix'

const containerRef = ref(null)
const { isVisible, fadeIn, fadeOut, toggle, bind } = useFade({ 
  duration: 500,
  onComplete: (direction) => console.log('动画完成:', direction)
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">
    <button @click="toggle">切换淡入淡出</button>
  </div>
</template>
```

### API

```typescript
interface UseFadeOptions {
  /** 元素是否可见 */
  visible?: boolean | Ref<boolean>
  /** 动画时长 */
  duration?: number
  /** 动画延迟 */
  delay?: number
  /** 缓动函数 */
  easing?: string
  /** 最小透明度 */
  minOpacity?: number
  /** 最大透明度 */
  maxOpacity?: number
  /** 动画开始回调 */
  onStart?: (direction: 'in' | 'out') => void
  /** 动画完成回调 */
  onComplete?: (direction: 'in' | 'out') => void
}

interface UseFadeReturn {
  /** 元素是否可见 */
  isVisible: Ref<boolean>
  /** 淡入 */
  fadeIn: () => void
  /** 淡出 */
  fadeOut: () => void
  /** 切换 */
  toggle: () => void
  /** 绑定淡入淡出到元素 */
  bind: (element: HTMLElement) => () => void
}
```
