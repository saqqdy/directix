# v-visible

切换元素可见性，支持动画。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-visible="showElement">显示/隐藏</div>
</template>

<script setup>
import { ref } from 'vue'

const showElement = ref(true)
</script>
```

### 带选项

```vue
<template>
  <div v-visible="{
    handler: onVisibleChange,
    useHidden: true,
    initial: true
  }">
    使用 visibility: hidden
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 可见性改变时的回调 |
| `useHidden` | `boolean` | `false` | 使用 `visibility: hidden` |
| `initial` | `boolean` | `true` | 初始可见性状态 |

## Composable 用法

你也可以使用 `useVisible` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useVisible } from 'directix'

const modal = ref(null)
const { visible, show, hide, toggle, bind } = useVisible({
  initial: false,
  useHidden: true,
  onChange: (v) => console.log('可见性:', v)
})

onMounted(() => bind(modal.value))
</script>

<template>
  <button @click="toggle">切换</button>
  <div ref="modal">模态框内容</div>
</template>
```

### API

```typescript
interface UseVisibleOptions {
  /** 初始可见性 @default true */
  initial?: boolean | Ref<boolean>
  /** 是否使用 visibility: hidden 而非 display: none @default false */
  useHidden?: boolean
  /** 可见性改变时的回调 */
  onChange?: (isVisible: boolean) => void
}

interface UseVisibleReturn {
  /** 当前可见性状态 */
  visible: Ref<boolean>
  /** 显示元素 */
  show: () => void
  /** 隐藏元素 */
  hide: () => void
  /** 切换可见性 */
  toggle: () => void
  /** 绑定可见性控制到元素 */
  bind: (element: HTMLElement) => () => void
}
```
