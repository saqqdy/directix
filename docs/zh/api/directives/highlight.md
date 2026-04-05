# v-highlight

高亮文本中的关键词。

> **起始版本：** `1.5.0`

## 用法

### 单个关键词

```vue
<template>
  <p v-highlight="'important'">这是一条重要的消息。</p>
</template>
```

### 多个关键词

```vue
<template>
  <p v-highlight="['Vue', 'React']">Vue 和 React 是流行的框架。</p>
</template>
```

### 带选项

```vue
<template>
  <p v-highlight="{
    keywords: 'highlight',
    className: 'my-highlight',
    style: 'background: yellow; color: black;',
    caseSensitive: true
  }">
    这将高亮关键词。
  </p>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `keywords` | `string \| string[]` | - | 要高亮的关键词 |
| `className` | `string` | `'v-highlight'` | 高亮元素的类名 |
| `style` | `string` | - | 高亮元素的内联样式 |
| `caseSensitive` | `boolean` | `false` | 是否区分大小写 |
| `wholeWord` | `boolean` | `false` | 是否匹配整个单词 |
| `tag` | `string` | `'mark'` | 高亮元素的标签名 |
| `onHighlight` | `(count: number) => void` | - | 高亮完成时的回调 |

### 绑定值类型

```ts
type HighlightBinding = string | string[] | HighlightOptions
```

## Composable 用法

你也可以使用 `useHighlight` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useHighlight } from 'directix'

const containerRef = ref(null)
const { count, bind } = useHighlight({
  keywords: ['Vue', 'React'],
  className: 'my-highlight',
  style: 'background: yellow; color: black;'
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <p ref="containerRef">Vue 和 React 是流行的框架。</p>
  <p v-if="count > 0">找到 {{ count }} 个匹配</p>
</template>
```

### API

```typescript
interface UseHighlightOptions {
  /** 要高亮的关键词 */
  keywords: string | string[] | Ref<string | string[]>
  /** 高亮元素的类名 */
  className?: string
  /** 高亮元素的内联样式 */
  style?: string
  /** 是否区分大小写 */
  caseSensitive?: boolean
  /** 是否匹配整个单词 */
  wholeWord?: boolean
  /** 高亮元素的标签名 */
  tag?: string
}

interface UseHighlightReturn {
  /** 高亮数量 */
  count: Ref<number>
  /** 更新关键词 */
  updateKeywords: (keywords: string | string[]) => void
  /** 绑定高亮到元素 */
  bind: (element: HTMLElement) => () => void
}
```
