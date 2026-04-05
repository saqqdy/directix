# v-resize

使用 ResizeObserver 观察元素大小变化。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-resize="handleResize">调整我的大小</div>
</template>

<script setup>
function handleResize(entry) {
  console.log('新尺寸:', entry.contentRect.width, entry.contentRect.height)
}
</script>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 大小变化事件处理程序（必填） |
| `box` | `'content-box' \| 'border-box'` | `'content-box'` | 观察的盒模型 |
| `debounce` | `number` | `0` | 防抖时间（毫秒） |

## Composable 用法

你也可以使用 `useResize` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useResize } from 'directix'

const target = ref(null)
const { width, height, bind } = useResize({
  debounce: 100,
  onResize: (info) => console.log('大小变化:', info.width, info.height)
})

onMounted(() => bind(target.value))
</script>

<template>
  <div ref="target">
    尺寸: {{ width }} x {{ height }}
  </div>
</template>
```

### API

```typescript
interface ResizeInfo {
  /** 新宽度 */
  width: number
  /** 新高度 */
  height: number
  /** 内容矩形 */
  contentRect: DOMRectReadOnly
}

interface UseResizeOptions {
  /** 防抖时间（毫秒） @default 0 */
  debounce?: number | Ref<number>
  /** 观察的盒模型 @default 'content-box' */
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
  /** 大小变化时的回调 */
  onResize?: (info: ResizeInfo) => void
}

interface UseResizeReturn {
  /** 当前宽度 */
  width: Readonly<Ref<number>>
  /** 当前高度 */
  height: Readonly<Ref<number>>
  /** 绑定元素 */
  bind: (element: HTMLElement) => () => void
  /** 停止观察 */
  stop: () => void
}
```
