# v-long-press

检测元素上的长按手势。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <button v-long-press="handleLongPress">长按我</button>
</template>

<script setup>
function handleLongPress(event) {
  console.log('长按触发！')
}
</script>
```

### 带选项

```vue
<template>
  <button v-long-press="{
    handler: handleLongPress,
    duration: 1000,
    onStart: handleStart,
    onCancel: handleCancel
  }">
    1秒长按
  </button>
</template>
```

## Composable 用法

你也可以使用 `useLongPress` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useLongPress } from 'directix'

const buttonRef = ref(null)
const { isPressing, bind } = useLongPress({
  onTrigger: (event) => {
    console.log('长按触发！')
  },
  duration: 800,
  onStart: (event) => console.log('开始按压'),
  onCancel: (event) => console.log('取消按压')
})

onMounted(() => {
  const unbind = bind(buttonRef.value)
  onUnmounted(unbind)
})
</script>

<template>
  <button ref="buttonRef">长按我</button>
</template>
```

### API

```typescript
interface UseLongPressOptions {
  /** 触发长按的持续时间（毫秒） */
  duration?: number | Ref<number>
  /** 取消前的最大移动距离 */
  distance?: number | Ref<number>
  /** 按下开始时的回调 */
  onStart?: (event: MouseEvent | TouchEvent) => void
  /** 长按触发时的回调 */
  onTrigger?: (event: MouseEvent | TouchEvent) => void
  /** 取消按压时的回调 */
  onCancel?: (event: MouseEvent | TouchEvent) => void
  /** 长按过程中每个 tick 的回调 */
  onTick?: (remaining: number) => void
  /** tick 间隔（毫秒） */
  tickInterval?: number
  /** 是否阻止默认行为 */
  prevent?: boolean
}

interface UseLongPressReturn {
  /** 是否正在按压 */
  isPressing: Readonly<Ref<boolean>>
  /** 开始长按检测 */
  start: (event: MouseEvent | TouchEvent) => void
  /** 停止长按检测 */
  stop: (event: MouseEvent | TouchEvent) => void
  /** 绑定事件到元素 */
  bind: (element: HTMLElement) => () => void
}
```
