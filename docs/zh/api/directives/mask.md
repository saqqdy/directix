# v-mask

输入掩码格式化，用于结构化输入。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <!-- 电话号码 -->
  <input v-mask="'(###) ###-####'" placeholder="电话" />

  <!-- SSN -->
  <input v-mask="'###-##-####'" placeholder="SSN" />

  <!-- 日期 -->
  <input v-mask="'##/##/####'" placeholder="日期" />
</template>
```

## 掩码标记

| 标记 | 模式 | 描述 |
| ---- | ---- | ---- |
| `#` | `[0-9]` | 数字 (0-9) |
| `A` | `[A-Za-z]` | 字母 (a-z, A-Z) |
| `N` | `[A-Za-z0-9]` | 字母数字 (a-z, A-Z, 0-9) |
| `X` | `.` | 任意字符 |

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `mask` | `string` | - | 掩码模式（必填） |
| `placeholder` | `string` | `'_'` | 占位符字符 |
| `showPlaceholder` | `boolean` | `true` | 聚焦时显示占位符 |
| `clearIncomplete` | `boolean` | `false` | 失焦时清除不完整的值 |
| `onChange` | `Function` | - | 值改变时的回调 |
| `onComplete` | `Function` | - | 掩码完成时的回调 |
