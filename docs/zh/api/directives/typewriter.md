# v-typewriter

打字机动画效果。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <span v-typewriter="'Hello, World!'"></span>
</template>
```

### 带选项

```vue
<template>
  <span v-typewriter="{
    text: '打字机动画效果',
    speed: 100,
    cursor: '_',
    onComplete: () => console.log('完成！')
  }"></span>
</template>
```

### 循环模式

```vue
<template>
  <span v-typewriter="{
    text: '循环动画效果',
    loop: true,
    deleteDelay: 1000
  }"></span>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `text` | `string` | - | 要输入的文本 |
| `speed` | `number` | `50` | 输入速度（毫秒） |
| `delay` | `number` | `0` | 开始延迟（毫秒） |
| `loop` | `boolean` | `false` | 是否循环 |
| `deleteDelay` | `number` | `1500` | 删除前延迟（循环时） |
| `deleteSpeed` | `number` | `30` | 删除速度（毫秒） |
| `cursor` | `string \| false` | `'|'` | 光标字符，false 隐藏 |
| `cursorBlink` | `boolean` | `true` | 光标是否闪烁 |
| `onStart` | `() => void` | - | 开始输入回调 |
| `onType` | `(char: string, index: number) => void` | - | 每个字符输入回调 |
| `onComplete` | `() => void` | - | 输入完成回调 |
| `onDeleteStart` | `() => void` | - | 开始删除回调 |
| `onDeleteComplete` | `() => void` | - | 删除完成回调 |

### 绑定值类型

```ts
type TypewriterBinding = string | TypewriterOptions
```

## Composable 用法

你也可以使用 `useTypewriter` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useTypewriter } from 'directix'

const containerRef = ref(null)
const { displayedText, isTyping, start, stop, reset, bind } = useTypewriter({
  text: 'Hello, World!',
  speed: 100,
  cursor: '|',
  onComplete: () => console.log('完成！')
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <span ref="containerRef"></span>
  <button @click="start">开始</button>
  <button @click="stop">停止</button>
  <button @click="reset">重置</button>
</template>
```

### API

```typescript
interface UseTypewriterOptions {
  /** 要输入的文本 */
  text: string | Ref<string>
  /** 输入速度（毫秒） */
  speed?: number
  /** 开始延迟（毫秒） */
  delay?: number
  /** 是否循环 */
  loop?: boolean
  /** 删除前延迟（循环时） */
  deleteDelay?: number
  /** 删除速度（毫秒） */
  deleteSpeed?: number
  /** 光标字符，false 隐藏 */
  cursor?: string | false
  /** 光标是否闪烁 */
  cursorBlink?: boolean
  /** 开始输入回调 */
  onStart?: () => void
  /** 输入完成回调 */
  onComplete?: () => void
  /** 每个字符输入回调 */
  onType?: (char: string, index: number) => void
}

interface UseTypewriterReturn {
  /** 当前显示的文本 */
  displayedText: Ref<string>
  /** 是否正在输入 */
  isTyping: Ref<boolean>
  /** 是否正在删除 */
  isDeleting: Ref<boolean>
  /** 开始输入 */
  start: () => void
  /** 停止输入 */
  stop: () => void
  /** 重置为空 */
  reset: () => void
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
