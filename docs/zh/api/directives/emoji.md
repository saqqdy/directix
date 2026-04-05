# v-emoji

过滤或限制 emoji 输入。

> **起始版本：** `1.5.0`

## 用法

### 基本（过滤所有 emoji）

```vue
<template>
  <input v-emoji type="text" placeholder="输入时不允许 emoji" />
</template>
```

### 带替换字符

```vue
<template>
  <input v-emoji="{ strip: true, replacement: '*' }" type="text" placeholder="emoji 会被替换为 *" />
</template>
```

### 允许特定 emoji

```vue
<template>
  <input v-emoji="{ allowList: ['😊', '👍'] }" type="text" placeholder="只允许 😊 和 👍" />
</template>
```

### 阻止特定 emoji

```vue
<template>
  <input v-emoji="{ blockList: ['🚫', '❌'] }" type="text" placeholder="阻止 🚫 和 ❌" />
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `strip` | `boolean` | `true` | 是否移除 emoji |
| `allowList` | `string[]` | - | 允许的 emoji 列表 |
| `blockList` | `string[]` | - | 阻止的 emoji 列表 |
| `pattern` | `string` | - | 自定义 emoji 正则表达式 |
| `replacement` | `string` | `''` | 替换字符 |
| `onEmoji` | `(emoji: string, position: number) => void` | - | 检测到 emoji 时的回调 |
| `onStrip` | `(original: string, cleaned: string) => void` | - | 移除 emoji 时的回调 |

### 绑定值类型

```ts
type EmojiBinding = boolean | EmojiOptions
```

## Composable 用法

你也可以使用 `useEmoji` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useEmoji } from 'directix'

const inputRef = ref(null)
const { bind, stripEmojis, hasEmoji } = useEmoji({ 
  strip: true,
  onEmoji: (emoji, pos) => console.log('检测到 emoji:', emoji)
})

onMounted(() => bind(inputRef.value))
</script>

<template>
  <input ref="inputRef" type="text" placeholder="输入时不允许 emoji" />
</template>
```

### API

```typescript
interface UseEmojiOptions {
  /** 是否移除 emoji */
  strip?: boolean | Ref<boolean>
  /** 允许的 emoji 列表 */
  allowList?: string[]
  /** 阻止的 emoji 列表 */
  blockList?: string[]
  /** 替换字符 */
  replacement?: string
  /** 检测到 emoji 时的回调 */
  onEmoji?: (emoji: string, position: number) => void
}

interface UseEmojiReturn {
  /** 当前输入值 */
  value: Ref<string>
  /** 从文本中移除 emoji */
  stripEmojis: (text: string) => string
  /** 检查文本是否包含 emoji */
  hasEmoji: (text: string) => boolean
  /** 绑定 emoji 过滤到输入元素 */
  bind: (element: HTMLInputElement | HTMLTextAreaElement) => () => void
}
```
