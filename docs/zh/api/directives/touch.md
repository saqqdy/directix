# v-touch

触摸手势检测指令，支持滑动、双指缩放、旋转、点击和长按。

> **起始版本：** `1.2.0`

## 用法

### 滑动检测

```vue
<template>
  <div v-touch="{ onSwipe: handleSwipe }">
    向任意方向滑动
  </div>
</template>

<script setup>
function handleSwipe(direction, event) {
  console.log('滑动方向:', direction) // 'left' | 'right' | 'up' | 'down'
}
</script>
```

### 方向性滑动

```vue
<template>
  <div v-touch="{ onSwipeLeft: goNext, onSwipeRight: goPrev }">
    左右滑动
  </div>
</template>
```

### 点击和长按

```vue
<template>
  <div v-touch="{ onTap: handleTap, onLongPress: handleLongPress }">
    点击或长按
  </div>
</template>

<script setup>
function handleTap(event) {
  console.log('点击!')
}

function handleLongPress(event) {
  console.log('长按!')
}
</script>
```

### 双指缩放和旋转

```vue
<template>
  <div v-touch="{ onPinch: handlePinch, onRotate: handleRotate }">
    使用双指缩放或旋转
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scale = ref(1)
const rotation = ref(0)

function handlePinch(newScale, event) {
  scale.value = newScale
}

function handleRotate(angle, event) {
  rotation.value = angle
}
</script>
```

## API

### 类型

```typescript
type SwipeDirection = 'left' | 'right' | 'up' | 'down'

interface TouchOptions {
  /** 滑动最小距离（像素）@default 30 */
  swipeThreshold?: number
  /** 滑动最大时间（毫秒）@default 500 */
  swipeTimeout?: number
  /** 双指缩放最小变化 @default 0.1 */
  pinchThreshold?: number
  /** 启用滑动检测 @default true */
  enableSwipe?: boolean
  /** 启用双指缩放检测 @default true */
  enablePinch?: boolean
  /** 启用旋转检测 @default true */
  enableRotate?: boolean
  /** 启用点击检测 @default true */
  enableTap?: boolean
  /** 点击最大时间（毫秒）@default 250 */
  tapTimeout?: number
  /** 点击最大移动距离（像素）@default 10 */
  tapThreshold?: number
  /** 启用长按检测 @default true */
  enableLongPress?: boolean
  /** 长按超时时间（毫秒）@default 500 */
  longPressTimeout?: number
  /** 启用桌面端鼠标模拟 @default true */
  enableMouse?: boolean

  /** 滑动回调 */
  onSwipe?: (direction: SwipeDirection, event: TouchEvent | MouseEvent) => void
  /** 向左滑动回调 */
  onSwipeLeft?: (event: TouchEvent | MouseEvent) => void
  /** 向右滑动回调 */
  onSwipeRight?: (event: TouchEvent | MouseEvent) => void
  /** 向上滑动回调 */
  onSwipeUp?: (event: TouchEvent | MouseEvent) => void
  /** 向下滑动回调 */
  onSwipeDown?: (event: TouchEvent | MouseEvent) => void
  /** 双指缩放回调 */
  onPinch?: (scale: number, event: TouchEvent) => void
  /** 旋转回调 */
  onRotate?: (angle: number, event: TouchEvent) => void
  /** 点击回调 */
  onTap?: (event: TouchEvent | MouseEvent) => void
  /** 长按回调 */
  onLongPress?: (event: TouchEvent | MouseEvent) => void
  /** 触摸开始回调 */
  onTouchStart?: (event: TouchEvent | MouseEvent) => void
  /** 触摸移动回调 */
  onTouchMove?: (event: TouchEvent | MouseEvent) => void
  /** 触摸结束回调 */
  onTouchEnd?: (event: TouchEvent | MouseEvent) => void
}
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `swipeThreshold` | `number` | `30` | 滑动最小距离（像素） |
| `swipeTimeout` | `number` | `500` | 滑动最大时间（毫秒） |
| `pinchThreshold` | `number` | `0.1` | 双指缩放最小变化 |
| `tapTimeout` | `number` | `250` | 点击最大时间（毫秒） |
| `tapThreshold` | `number` | `10` | 点击最大移动距离 |
| `longPressTimeout` | `number` | `500` | 长按超时时间（毫秒） |
| `enableSwipe` | `boolean` | `true` | 启用滑动检测 |
| `enablePinch` | `boolean` | `true` | 启用双指缩放检测 |
| `enableRotate` | `boolean` | `true` | 启用旋转检测 |
| `enableTap` | `boolean` | `true` | 启用点击检测 |
| `enableLongPress` | `boolean` | `true` | 启用长按检测 |
| `enableMouse` | `boolean` | `true` | 启用桌面端鼠标模拟 |

## 示例

### 图片轮播

```vue
<template>
  <div v-touch="{ onSwipeLeft: nextSlide, onSwipeRight: prevSlide }" class="carousel">
    <img :src="slides[currentSlide]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slides = ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg']
const currentSlide = ref(0)

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}
</script>
```

### 下拉刷新

```vue
<template>
  <div
    v-touch="{
      onSwipeDown: refresh,
      swipeThreshold: 100
    }"
    :class="{ refreshing: isRefreshing }"
  >
    下拉刷新
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isRefreshing = ref(false)

async function refresh() {
  isRefreshing.value = true
  await fetchData()
  isRefreshing.value = false
}
</script>
```
