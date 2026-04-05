# v-progress

进度条动画。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-progress="50">进度 50%</div>
</template>
```

### 带选项

```vue
<template>
  <div v-progress="{
    value: progressValue,
    color: '#42b883',
    height: 8,
    showText: true
  }">
    内容
  </div>
</template>
```

### 不确定进度

```vue
<template>
  <div v-progress="{ indeterminate: true }">
    加载中...
  </div>
</template>
```

### 条纹进度条

```vue
<template>
  <div v-progress="{
    value: 70,
    striped: true,
    animated: true
  }">
    条纹动画进度条
  </div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `number` | - | 当前进度值（0-100） |
| `max` | `number` | `100` | 最大值 |
| `min` | `number` | `0` | 最小值 |
| `height` | `number` | `4` | 进度条高度（像素） |
| `color` | `string` | `'#42b883'` | 进度条颜色 |
| `backgroundColor` | `string` | `'rgba(0, 0, 0, 0.1)'` | 背景颜色 |
| `duration` | `number` | `300` | 过渡时长（毫秒） |
| `showText` | `boolean` | `false` | 是否显示百分比文本 |
| `animate` | `boolean` | `true` | 是否开启动画 |
| `indeterminate` | `boolean` | `false` | 是否为不确定进度 |
| `striped` | `boolean` | `false` | 是否显示条纹 |
| `animated` | `boolean` | `false` | 条纹是否动画 |
| `position` | `'top' \| 'bottom'` | `'top'` | 进度条位置 |
| `class` | `string` | - | 自定义类名 |
| `onChange` | `(value: number, percent: number) => void` | - | 进度变化回调 |
| `onComplete` | `() => void` | - | 进度完成回调 |

### 绑定值类型

```ts
type ProgressBinding = number | ProgressOptions
```

## Composable 用法

你也可以使用 `useProgress` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useProgress } from 'directix'

const containerRef = ref(null)
const { value, percent, setValue, increment, decrement, reset, bind } = useProgress({ 
  value: 50,
  color: '#42b883',
  showText: true
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef"></div>
  <button @click="increment(10)">+10%</button>
  <button @click="decrement(10)">-10%</button>
  <button @click="reset">重置</button>
</template>
```

### API

```typescript
interface UseProgressOptions {
  /** 当前进度值 */
  value?: number | Ref<number>
  /** 最大值 */
  max?: number
  /** 最小值 */
  min?: number
  /** 进度条高度 */
  height?: number
  /** 进度条颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 过渡时长 */
  duration?: number
  /** 是否显示百分比文本 */
  showText?: boolean
  /** 是否为不确定进度 */
  indeterminate?: boolean | Ref<boolean>
  /** 是否显示条纹 */
  striped?: boolean
  /** 条纹是否动画 */
  animated?: boolean
  /** 进度变化回调 */
  onChange?: (value: number, percent: number) => void
  /** 进度完成回调 */
  onComplete?: () => void
}

interface UseProgressReturn {
  /** 当前值 */
  value: Ref<number>
  /** 当前百分比 */
  percent: Ref<number>
  /** 设置进度值 */
  setValue: (value: number) => void
  /** 增加进度 */
  increment: (amount?: number) => void
  /** 减少进度 */
  decrement: (amount?: number) => void
  /** 重置到最小值 */
  reset: () => void
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
