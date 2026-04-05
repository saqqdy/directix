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

## Composable 用法

你也可以使用 `useMask` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useMask } from 'directix'

const inputRef = ref(null)
const { bind, getRawValue, isComplete } = useMask({
  mask: '###-##-####',
  placeholder: '_',
  onComplete: (value) => console.log('完成:', value)
})

onMounted(() => bind(inputRef.value))
</script>

<template>
  <input ref="inputRef" type="text" placeholder="SSN: ###-##-####" />
</template>
```

### API

```typescript
interface UseMaskOptions {
  /** 掩码模式：# 数字，A 字母，N 字母数字，X 任意，其他为字面量 */
  mask: string | Ref<string>
  /** 占位符字符 @default '_' */
  placeholder?: string
  /** 聚焦时显示掩码占位符 @default true */
  showPlaceholder?: boolean
  /** 失焦时显示掩码 @default false */
  showMaskOnBlur?: boolean
  /** 失焦时清除不完整的值 @default false */
  clearIncomplete?: boolean
  /** 是否禁用 @default false */
  disabled?: boolean | Ref<boolean>
  /** 值改变时的回调 */
  onChange?: (value: string, rawValue: string) => void
  /** 掩码完成时的回调 */
  onComplete?: (value: string) => void
}

interface UseMaskReturn {
  /** 获取格式化后的值 */
  getFormattedValue: (value: string) => string
  /** 获取原始值（不含掩码字面量） */
  getRawValue: (value: string) => string
  /** 检查掩码是否完成 */
  isComplete: (value: string) => boolean
  /** 绑定掩码到输入元素 */
  bind: (element: HTMLInputElement | HTMLTextAreaElement) => () => void
}
```
