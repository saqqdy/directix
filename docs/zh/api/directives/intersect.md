# v-intersect

使用 IntersectionObserver 观察元素与视口的交叉状态。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-intersect="handleIntersect">观察我</div>
</template>

<script setup>
function handleIntersect(entry, observer) {
  console.log('交叉中:', entry.isIntersecting)
}
</script>
```

### 带选项

```vue
<template>
  <div v-intersect="{
    onEnter: handleEnter,
    onLeave: handleLeave,
    threshold: 0.5
  }">
    跟踪可见性
  </div>
</template>
```

## Composable 用法

你也可以使用 `useIntersect` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useIntersect } from 'directix'

const target = ref(null)
const { isIntersecting, ratio, bind } = useIntersect({
  threshold: 0.5,
  onEnter: () => console.log('进入视口'),
  onLeave: () => console.log('离开视口')
})

onMounted(() => bind(target.value))
</script>

<template>
  <div ref="target" :class="{ visible: isIntersecting }">
    我在视口中！
  </div>
</template>
```

### API

```typescript
interface UseIntersectOptions {
  /** 元素交叉时的回调 */
  handler?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void
  /** 元素进入视口时的回调 */
  onEnter?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void
  /** 元素离开视口时的回调 */
  onLeave?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void
  /** 交叉状态改变时的回调 */
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
  /** 根元素 */
  root?: Element | null | Ref<Element | null>
  /** 根元素边距 */
  rootMargin?: string
  /** 触发阈值 */
  threshold?: number | number[]
  /** 只触发一次 */
  once?: boolean
}

interface UseIntersectReturn {
  /** 是否正在交叉 */
  isIntersecting: Readonly<Ref<boolean>>
  /** 当前交叉比例 */
  ratio: Readonly<Ref<number>>
  /** 绑定交叉观察器到元素 */
  bind: (element: HTMLElement) => () => void
  /** 停止观察 */
  stop: () => void
}
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 元素交叉时的回调 |
| `onEnter` | `Function` | - | 元素进入视口时的回调 |
| `onLeave` | `Function` | - | 元素离开视口时的回调 |
| `threshold` | `number \| number[]` | `0` | 触发阈值 |
| `rootMargin` | `string` | `'0px'` | 根元素边距 |
| `once` | `boolean` | `false` | 只触发一次 |
