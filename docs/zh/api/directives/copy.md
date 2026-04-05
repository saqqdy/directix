# v-copy

一键复制文本到剪贴板。

> **起始版本：** `1.0.0`

## 用法

### 基本用法

```vue
<template>
  <button v-copy="textToCopy">复制到剪贴板</button>
</template>

<script setup>
const textToCopy = 'Hello, World!'
</script>
```

### 带回调函数

```vue
<template>
  <button v-copy="{
    value: textToCopy,
    onSuccess: handleSuccess,
    onError: handleError
  }">
    带回调复制
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('已复制:', text)
  alert('复制成功!')
}

function handleError(error) {
  console.error('复制失败:', error)
  alert('复制失败!')
}
</script>
```

## API

### 类型定义

```typescript
interface CopyOptions {
  /** 要复制的文本 */
  value: string
  /** 复制成功回调 */
  onSuccess?: (text: string) => void
  /** 复制失败回调 */
  onError?: (error: Error) => void
}

type CopyBinding = string | CopyOptions
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `string` | - | 要复制的文本 |
| `onSuccess` | `Function` | - | 复制成功回调 |
| `onError` | `Function` | - | 复制失败回调 |

## Composable 用法

你也可以使用 `useCopy` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useCopy } from 'directix'

const text = ref('Hello, World!')
const { copy, copied, isSupported } = useCopy({
  source: text,
  onSuccess: (text) => console.log('已复制:', text)
})

// 也可以直接传入文本
async function handleCopy() {
  await copy('自定义文本')
}
</script>

<template>
  <button @click="copy()" :disabled="!isSupported">
    {{ copied ? '已复制!' : '复制' }}
  </button>
</template>
```

### API

```typescript
interface UseCopyOptions {
  /** 源文本（可以是响应式） */
  source?: string | Ref<string>
  /** 复制成功回调 */
  onSuccess?: (text: string) => void
  /** 复制失败回调 */
  onError?: (error: Error) => void
  /** 重置已复制状态的时间（毫秒） */
  copiedTimeout?: number
}

interface UseCopyReturn {
  /** 复制函数 */
  copy: (text?: string) => Promise<boolean>
  /** 是否已复制成功 */
  copied: Readonly<Ref<boolean>>
  /** 最后一次复制的错误 */
  error: Readonly<Ref<Error | null>>
  /** 是否支持剪贴板 API */
  isSupported: boolean
}
```

## 示例

### 复制输入框内容

```vue
<template>
  <div>
    <input v-model="text" type="text" />
    <button v-copy="text">复制输入内容</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('编辑我!')
</script>
```

### 复制并显示反馈

```vue
<template>
  <button v-copy="{
    value: code,
    onSuccess: () => copied = true
  }">
    {{ copied ? '已复制!' : '复制代码' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const code = 'const hello = "world"'
const copied = ref(false)
</script>
```

### 批量复制

```vue
<template>
  <div v-for="item in items" :key="item.id">
    <span>{{ item.text }}</span>
    <button v-copy="item.text">复制</button>
  </div>
</template>

<script setup>
const items = [
  { id: 1, text: '第一段文本' },
  { id: 2, text: '第二段文本' },
  { id: 3, text: '第三段文本' },
]
</script>
```
