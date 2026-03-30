# v-lowercase

将输入文本转换为小写格式。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <input v-lowercase v-model="email" />
  <!-- 输入: "ZHANG@EXAMPLE.COM" → 输出: "zhang@example.com" -->
</template>
```

### 带选项

```vue
<template>
  <input v-lowercase="{ on: 'input' }" v-model="username" />
</template>
```

## API

### 类型

```typescript
interface LowercaseOptions {
  /** 何时转换：'input' 或 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** 禁用转换 @default false */
  disabled?: boolean
}

type LowercaseBinding = boolean | LowercaseOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `on` | `string` | `'blur'` | 何时应用转换 |
| `disabled` | `boolean` | `false` | 禁用转换 |

## 示例

### 邮箱输入

```vue
<template>
  <input v-lowercase type="email" v-model="email" placeholder="邮箱" />
</template>
```

### 用户名字段

```vue
<template>
  <input v-lowercase="{ on: 'input' }" v-model="username" />
</template>
```
