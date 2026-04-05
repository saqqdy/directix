# v-scroll

跟踪滚动位置和方向。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-scroll="handleScroll" class="scroll-container">
    滚动内容
  </div>
</template>

<script setup>
function handleScroll(event, info) {
  console.log('滚动位置:', info.scrollTop)
  console.log('进度:', info.progressY)
  console.log('方向:', info.directionY)
}
</script>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 滚动事件处理程序（必填） |
| `throttle` | `number` | `0` | 节流时间（毫秒） |
| `passive` | `boolean` | `true` | 使用被动事件监听 |
| `container` | `string \| Element` | - | 自定义滚动容器 |

## Composable 用法

你也可以使用 `useScroll` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useScroll } from 'directix'

const container = ref(null)
const { scrollTop, progressY, directionY, isScrolling, bind, scrollTo } = useScroll({
  throttle: 100
})

onMounted(() => bind(container.value))

// 编程式滚动
function scrollToTop() {
  scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div ref="container" class="scroll-container">
    <div class="progress" :style="{ width: `${progressY * 100}%` }" />
    <p>滚动位置: {{ scrollTop }}</p>
  </div>
</template>
```

### API

```typescript
interface UseScrollOptions {
  /** 节流时间（毫秒） */
  throttle?: number | Ref<number>
  /** 是否使用被动事件监听 */
  passive?: boolean
}

interface UseScrollReturn {
  /** 当前水平滚动位置 */
  scrollLeft: Readonly<Ref<number>>
  /** 当前垂直滚动位置 */
  scrollTop: Readonly<Ref<number>>
  /** 水平滚动进度 (0-1) */
  progressX: Readonly<Ref<number>>
  /** 垂直滚动进度 (0-1) */
  progressY: Readonly<Ref<number>>
  /** 水平滚动方向 */
  directionX: Readonly<Ref<ScrollDirection>>
  /** 垂直滚动方向 */
  directionY: Readonly<Ref<ScrollDirection>>
  /** 是否正在滚动 */
  isScrolling: Readonly<Ref<boolean>>
  /** 绑定滚动监听到元素 */
  bind: (element?: HTMLElement | Window) => () => void
  /** 停止监听 */
  stop: () => void
  /** 滚动到指定位置 */
  scrollTo: (options: { top?: number, left?: number, behavior?: 'auto' | 'smooth' }) => void
}
```

## 滚动信息

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `scrollTop` | `number` | 当前垂直滚动位置 |
| `progressY` | `number` | 垂直滚动进度 (0-1) |
| `directionY` | `-1 \| 0 \| 1` | 垂直方向 (-1: 上, 1: 下) |
