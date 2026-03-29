# v-truncate

截断文本内容并添加省略号。

> **起始版本：** `1.1.0`

## 用法

### 基础用法

```vue
<template>
  <p v-truncate="100">
    这是一段很长的文本，将在100个字符后被截断...
  </p>
</template>
```

### 带选项

```vue
<template>
  <p v-truncate="{
    length: 50,
    suffix: '...',
    position: 'end'
  }">
    长文本内容
  </p>
</template>
```

## API

### 类型

```typescript
type TruncatePosition = 'start' | 'middle' | 'end'

interface TruncateOptions {
  /** 截断前的最大长度 */
  length?: number
  /** 显示的后缀 @default '...' */
  suffix?: string
  /** 截断位置 @default 'end' */
  position?: TruncatePosition
  /** 截断文本的自定义类名 */
  class?: string
  /** 禁用截断 @default false */
  disabled?: boolean
}

type TruncateBinding = number | TruncateOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `length` | `number` | `100` | 最大字符长度 |
| `suffix` | `string` | `'...'` | 省略号字符串 |
| `position` | `string` | `'end'` | 截断位置 |
| `class` | `string` | - | 自定义 CSS 类 |
| `disabled` | `boolean` | `false` | 禁用截断 |

## 示例

### 中间截断

```vue
<template>
  <!-- 适合文件路径 -->
  <span v-truncate="{ length: 20, position: 'middle' }">
    /非常/长的/文件/路径/file.txt
  </span>
  <!-- 输出: /非常/长的...file.txt -->
</template>
```

### 开头截断

```vue
<template>
  <span v-truncate="{ length: 15, position: 'start' }">
    长文本内容在这里
  </span>
  <!-- 输出: ...内容在这里 -->
</template>
```
