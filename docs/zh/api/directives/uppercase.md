# v-uppercase

将输入文本转换为大写格式。

> **起始版本：** `1.1.0`

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
