# v-swipe

检测元素上的滑动手势。支持方向性滑动，可配置阈值。

> **起始版本：** `1.3.0`

## 用法

### 基本

```vue
<template>
  <div v-swipe="handleSwipe">
    在任意方向滑动
  </div>
</template>

<script setup>
function handleSwipe(direction) {
  console.log('滑动方向:', direction) // 'left' | 'right' | 'up' | 'down'
}
</script>
```

### 带方向回调

```vue
<template>
  <div v-swipe="{
    onLeft: () => prevSlide(),
    onRight: () => nextSlide(),
    onUp: () => console.log('向上滑动'),
    onDown: () => console.log('向下滑动')
  }">
    左右滑动导航
  </div>
</template>
```

## API

### 类型

```typescript
interface SwipeOptions {
  onLeft?: () => void
  onRight?: () => void
  onUp?: () => void
  onDown?: () => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  threshold?: number // 默认: 50
  preventDefault?: boolean // 默认: true
  touchOnly?: boolean // 默认: false
}

type SwipeBinding = SwipeOptions | ((direction: 'left' | 'right' | 'up' | 'down') => void)
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `onLeft` | `() => void` | - | 向左滑动回调 |
| `onRight` | `() => void` | - | 向右滑动回调 |
| `onUp` | `() => void` | - | 向上滑动回调 |
| `onDown` | `() => void` | - | 向下滑动回调 |
| `onSwipe` | `(direction) => void` | - | 带方向参数的回调 |
| `threshold` | `number` | `50` | 触发滑动的最小距离 |
| `preventDefault` | `boolean` | `true` | 是否阻止默认滚动行为 |
| `touchOnly` | `boolean` | `false` | 仅检测触摸事件 |

## Composable 用法

你也可以使用 `useSwipe` composable：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useSwipe } from 'directix'

const container = ref(null)
const { direction, isSwiping, bind } = useSwipe({
  onLeft: () => nextSlide(),
  onRight: () => prevSlide(),
  threshold: 50
})

onMounted(() => bind(container.value))
</script>

<template>
  <div ref="container">
    滑动我！
  </div>
</template>
```

### API

```typescript
interface UseSwipeOptions {
  /** 滑动处理程序 */
  handler?: (direction: SwipeDirection, event: Event) => void
  /** 触发滑动的最小距离 */
  threshold?: number | Ref<number>
  /** 滑动最大时间 */
  maxTime?: number | Ref<number>
  /** 允许的方向 */
  directions?: SwipeDirection[]
  /** 是否在滑动时阻止滚动 */
  preventScrollOnSwipe?: boolean
  /** 是否启用鼠标事件 */
  mouse?: boolean
  /** 向左滑动回调 */
  onLeft?: () => void
  /** 向右滑动回调 */
  onRight?: () => void
  /** 向上滑动回调 */
  onUp?: () => void
  /** 向下滑动回调 */
  onDown?: () => void
}

interface UseSwipeReturn {
  /** 当前滑动方向 */
  direction: Readonly<Ref<SwipeDirection | null>>
  /** 滑动长度（X） */
  lengthX: Readonly<Ref<number>>
  /** 滑动长度（Y） */
  lengthY: Readonly<Ref<number>>
  /** 是否正在滑动 */
  isSwiping: Readonly<Ref<boolean>>
  /** 绑定滑动检测到元素 */
  bind: (element: HTMLElement) => () => void
}
```

## 示例

### 图片轮播

```vue
<template>
  <div
    v-swipe="{
      onLeft: nextImage,
      onRight: prevImage,
      threshold: 30
    }"
    class="carousel"
  >
    <img :src="images[currentIndex]" />
  </div>
</template>
```

### 标签页导航

```vue
<template>
  <div v-swipe="handleSwipe" class="tabs-container">
    <div v-for="tab in tabs" :key="tab.id" v-show="tab.id === activeTab">
      {{ tab.content }}
    </div>
  </div>
</template>

<script setup>
function handleSwipe(direction) {
  if (direction === 'left') activeTab.value = nextTab()
  if (direction === 'right') activeTab.value = prevTab()
}
</script>
```
