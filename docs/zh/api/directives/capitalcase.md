# v-capitalcase

将输入文本转换为首字母大写格式（每个单词的首字母大写）。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <input v-capitalcase v-model="name" />
  <!-- 输入: "zhang san" → 输出: "Zhang San" -->
</template>
```

### 带选项

```vue
<template>
  <input v-capitalcase="{ on: 'blur' }" v-model="title" />
</template>
```

## API

### 类型

```typescript
interface CapitalcaseOptions {
  /** 何时转换：'input' 或 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** 禁用转换 @default false */
  disabled?: boolean
}

type CapitalcaseBinding = boolean | CapitalcaseOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `on` | `string` | `'blur'` | 何时应用转换 |
| `disabled` | `boolean` | `false` | 禁用转换 |

## Composable 用法

你也可以使用 `useCapitalcase` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useCapitalcase } from 'directix'

const title = ref('the quick brown fox')
const { capitalized } = useCapitalcase({
  text: title,
  every: true
})
// capitalized.value = 'The Quick Brown Fox'
</script>

<template>
  <h1>{{ capitalized }}</h1>
</template>
```

### API

```typescript
interface UseCapitalcaseOptions {
  /** 要转换的文本 */
  text: string | Ref<string>
  /** 是否转换每个单词或仅第一个单词 @default true */
  every?: boolean | Ref<boolean>
  /** 保持小写的单词（冠词、介词等） */
  keepLower?: string[] | Ref<string[]>
}

interface UseCapitalcaseReturn {
  /** 转换后的文本 */
  capitalized: Ref<string>
  /** 原始文本 */
  original: Ref<string>
}
```

## 示例

### 实时转换

```vue
<template>
  <input v-capitalcase="{ on: 'input' }" v-model="name" />
</template>
```

### 表单字段

```vue
<template>
  <form>
    <input v-capitalcase v-model="user.firstName" placeholder="名" />
    <input v-capitalcase v-model="user.lastName" placeholder="姓" />
  </form>
</template>
```
