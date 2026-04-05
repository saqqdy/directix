# v-uppercase

将输入文本转换为大写格式。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <input v-uppercase v-model="code" />
  <!-- 输入: "abc123" → 输出: "ABC123" -->
</template>
```

### 带选项

```vue
<template>
  <input v-uppercase="{ on: 'input' }" v-model="productCode" />
</template>
```

## API

### 类型

```typescript
interface UppercaseOptions {
  /** 何时转换：'input' 或 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** 禁用转换 @default false */
  disabled?: boolean
}

type UppercaseBinding = boolean | UppercaseOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `on` | `string` | `'blur'` | 何时应用转换 |
| `disabled` | `boolean` | `false` | 禁用转换 |

## Composable 用法

你也可以使用 `useUppercase` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useUppercase } from 'directix'

const text = ref('hello world')
const { transformed } = useUppercase({ text })
// transformed.value = 'HELLO WORLD'
</script>

<template>
  <p>{{ transformed }}</p>
</template>
```

### API

```typescript
interface UseUppercaseOptions {
  /** 要转换的文本 */
  text: string | Ref<string>
  /** 是否仅转换第一个字符 @default false */
  first?: boolean | Ref<boolean>
}

interface UseUppercaseReturn {
  /** 转换后的文本 */
  transformed: Ref<string>
  /** 原始文本 */
  original: Ref<string>
}
```

## 示例

### 产品编码

```vue
<template>
  <input v-uppercase v-model="productCode" placeholder="产品编码" />
</template>
```

### 优惠码

```vue
<template>
  <input
    v-uppercase="{ on: 'input' }"
    v-model="promoCode"
    placeholder="输入优惠码"
  />
</template>
```
