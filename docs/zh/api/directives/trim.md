# v-trim

去除输入值的首尾空白字符。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <input v-trim v-model="text" />
</template>
```

### 失焦时去除（默认）

```vue
<template>
  <input v-trim="'blur'" v-model="text" />
</template>
```

### 输入时去除

```vue
<template>
  <input v-trim="'input'" v-model="text" />
</template>
```

## API

### 类型

```typescript
type TrimPosition = 'start' | 'end' | 'both'

interface TrimOptions {
  /** 何时去除：'input' 或 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** 去除哪一侧 @default 'both' */
  position?: TrimPosition
  /** 禁用去除 @default false */
  disabled?: boolean
}

type TrimBinding = 'input' | 'blur' | TrimOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `on` | `string` | `'blur'` | 何时应用去除 |
| `position` | `string` | `'both'` | 去除哪一侧 |
| `disabled` | `boolean` | `false` | 禁用去除 |

## Composable 用法

你也可以使用 `useTrim` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useTrim } from 'directix'

const text = ref('  hello world  ')
const { trimmed, wasTrimmed } = useTrim({ text })
// trimmed.value = 'hello world'
// wasTrimmed.value = true
</script>

<template>
  <p>{{ trimmed }}</p>
</template>
```

### API

```typescript
type TrimPosition = 'start' | 'end' | 'both'

interface UseTrimOptions {
  /** 要去除的文本 */
  text: string | Ref<string>
  /** 去除位置 @default 'both' */
  position?: TrimPosition | Ref<TrimPosition>
  /** 自定义要去除的字符（除空白外） */
  chars?: string | Ref<string>
}

interface UseTrimReturn {
  /** 去除后的文本 */
  trimmed: Ref<string>
  /** 原始文本 */
  original: Ref<string>
  /** 文本是否被去除 */
  wasTrimmed: Ref<boolean>
}
```

## 示例

### 仅去除开头

```vue
<template>
  <input v-trim="{ position: 'start' }" v-model="text" />
</template>
```

### 仅去除结尾

```vue
<template>
  <textarea v-trim="{ position: 'end' }" v-model="content" />
</template>
```

### 实时去除

```vue
<template>
  <input v-trim="{ on: 'input' }" v-model="searchQuery" />
</template>
```
