# v-counter

数字动画计数器效果。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <span v-counter="1000">0</span>
</template>
```

### 带选项

```vue
<template>
  <span v-counter="{
    value: 10000,
    duration: 3000,
    decimals: 2,
    useGrouping: true
  }">0</span>
</template>
```

### 自定义格式化

```vue
<template>
  <span v-counter="{
    value: targetValue,
    formatter: (v) => '$' + v.toFixed(2)
  }">0</span>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `number` | - | 目标数值（必填） |
| `startValue` | `number` | `0` | 起始数值 |
| `duration` | `number` | `2000` | 动画时长（毫秒） |
| `decimals` | `number` | `0` | 小数位数 |
| `useGrouping` | `boolean` | `false` | 是否使用千位分隔符 |
| `locale` | `string` | `'en-US'` | 本地化格式 |
| `formatter` | `(value: number) => string` | - | 自定义格式化函数 |
| `easing` | `'linear' \| 'easeOut' \| 'easeInOut' \| 'easeOutQuart' \| 'easeOutExpo'` | `'easeOutQuart'` | 缓动函数 |
| `customEasing` | `(t: number) => number` | - | 自定义缓动函数 |
| `delay` | `number` | `0` | 动画延迟（毫秒） |
| `onUpdate` | `(value: number, formatted: string) => void` | - | 每帧更新回调 |
| `onComplete` | `(value: number) => void` | - | 动画完成回调 |
| `onStart` | `() => void` | - | 动画开始回调 |

### 绑定值类型

```ts
type CounterBinding = number | CounterOptions
```

## Composable 用法

你也可以使用 `useCounter` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useCounter } from 'directix'

const containerRef = ref(null)
const { currentValue, formattedValue, setValue, bind } = useCounter({
  value: 1000,
  duration: 2000,
  useGrouping: true
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <span ref="containerRef">0</span>
  <button @click="setValue(5000)">设为 5000</button>
</template>
```

### API

```typescript
type CounterEasing = 'linear' | 'easeOut' | 'easeInOut' | 'easeOutQuart' | 'easeOutExpo'

interface UseCounterOptions {
  /** 目标数值 */
  value: number | Ref<number>
  /** 起始数值 */
  startValue?: number
  /** 动画时长 */
  duration?: number
  /** 小数位数 */
  decimals?: number
  /** 是否使用千位分隔符 */
  useGrouping?: boolean
  /** 本地化格式 */
  locale?: string
  /** 自定义格式化函数 */
  formatter?: (value: number) => string
  /** 缓动函数 */
  easing?: CounterEasing
  /** 自定义缓动函数 */
  customEasing?: (t: number) => number
  /** 每帧更新回调 */
  onUpdate?: (value: number, formattedValue: string) => void
  /** 动画完成回调 */
  onComplete?: (value: number) => void
  /** 动画开始回调 */
  onStart?: () => void
}

interface UseCounterReturn {
  /** 当前数值 */
  currentValue: Ref<number>
  /** 格式化后的值 */
  formattedValue: Ref<string>
  /** 是否正在动画 */
  isAnimating: Ref<boolean>
  /** 设置目标值 */
  setValue: (value: number) => void
  /** 开始动画 */
  start: () => void
  /** 停止动画 */
  stop: () => void
  /** 绑定计数器到元素 */
  bind: (element: HTMLElement) => () => void
}
```
