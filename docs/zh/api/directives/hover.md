# v-hover

跟踪悬停状态并提供回调和 CSS 类。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-hover="handleHover">悬停我</div>
</template>

<script setup>
function handleHover(isHovering, event) {
  console.log('悬停中:', isHovering)
}
</script>
```

### 带选项

```vue
<template>
  <div v-hover="{
    onEnter: handleEnter,
    onLeave: handleLeave,
    class: 'is-hovering'
  }">
    悬停我
  </div>
</template>
```

## Composable 用法

你也可以使用 `useHover` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useHover } from 'directix'

const buttonRef = ref(null)
const { isHovering, bind } = useHover({
  onEnter: () => console.log('鼠标进入'),
  onLeave: () => console.log('鼠标离开'),
  enterDelay: 100
})

onMounted(() => {
  const unbind = bind(buttonRef.value)
  onUnmounted(unbind)
})
</script>

<template>
  <button ref="buttonRef" :class="{ 'is-hovering': isHovering }">
    悬停我
  </button>
</template>
```

### API

```typescript
interface UseHoverOptions {
  /** 鼠标进入时的回调 */
  onEnter?: (event: MouseEvent) => void
  /** 鼠标离开时的回调 */
  onLeave?: (event: MouseEvent) => void
  /** 悬停时添加的 CSS 类 */
  class?: string
  /** 进入延迟（毫秒） */
  enterDelay?: number | Ref<number>
  /** 离开延迟（毫秒） */
  leaveDelay?: number | Ref<number>
}

interface UseHoverReturn {
  /** 是否正在悬停 */
  isHovering: Readonly<Ref<boolean>>
  /** 绑定事件到元素 */
  bind: (element: HTMLElement) => () => void
}
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 悬停状态改变时的回调 |
| `onEnter` | `Function` | - | 鼠标进入时的回调 |
| `onLeave` | `Function` | - | 鼠标离开时的回调 |
| `class` | `string` | `'v-hover'` | 悬停时添加的 CSS 类 |
| `enterDelay` | `number` | `0` | 进入延迟（毫秒） |
| `leaveDelay` | `number` | `0` | 离开延迟（毫秒） |
