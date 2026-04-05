# v-mutation

使用 MutationObserver 观察 DOM 变化。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-mutation="handleMutation">
    观察我的变化
  </div>
</template>

<script setup>
function handleMutation(mutations, observer) {
  mutations.forEach(mutation => {
    console.log('类型:', mutation.type)
    console.log('目标:', mutation.target)
  })
}
</script>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 变化时的回调（必填） |
| `attributes` | `boolean` | `false` | 观察属性变化 |
| `attributeFilter` | `string[]` | - | 指定观察的属性 |
| `childList` | `boolean` | `true` | 观察子节点变化 |
| `subtree` | `boolean` | `false` | 观察所有后代 |
| `characterData` | `boolean` | `false` | 观察文本内容变化 |

## Composable 用法

你也可以使用 `useMutation` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useMutation } from 'directix'

const containerRef = ref(null)
const { bind } = useMutation({
  handler: (mutations) => {
    mutations.forEach(mutation => {
      console.log('类型:', mutation.type)
      console.log('目标:', mutation.target)
    })
  },
  childList: true,
  subtree: true
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">
    观察我的变化
  </div>
</template>
```

### API

```typescript
type MutationHandler = (mutations: MutationRecord[], observer: MutationObserver) => void

interface UseMutationOptions {
  /** 变化时的回调（必填） */
  handler: MutationHandler
  /** 是否观察属性变化 @default false */
  attributes?: boolean
  /** 指定观察的属性 */
  attributeFilter?: string[]
  /** 是否观察子节点变化 @default true */
  childList?: boolean
  /** 是否观察所有后代 @default false */
  subtree?: boolean
  /** 是否观察文本内容变化 @default false */
  characterData?: boolean
  /** 是否记录旧属性值 @default false */
  attributeOldValue?: boolean
  /** 是否记录旧字符数据 @default false */
  characterDataOldValue?: boolean
  /** 是否禁用 @default false */
  disabled?: boolean | Ref<boolean>
}

interface UseMutationReturn {
  /** 绑定变化观察器到元素 */
  bind: (element: HTMLElement) => () => void
  /** 停止观察 */
  stop: () => void
  /** 开始观察 */
  start: () => void
}
```
