# v-number

格式化和验证数字输入。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <input v-number v-model="quantity" />
</template>
```

### 带约束

```vue
<template>
  <input v-number="{ min: 0, max: 100, step: 5 }" v-model="count" />
</template>
```

## API

### 类型

```typescript
interface NumberOptions {
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步进值 */
  step?: number
  /** 小数位数 @default 0 */
  decimals?: number
  /** 允许负数 @default true */
  negative?: boolean
  /** 千位分隔符 @default ',' */
  thousands?: string
  /** 小数分隔符 @default '.' */
  decimal?: string
  /** 禁用格式化 @default false */
  disabled?: boolean
}

type NumberBinding = boolean | NumberOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `min` | `number` | - | 允许的最小值 |
| `max` | `number` | - | 允许的最大值 |
| `step` | `number` | `1` | 步进值 |
| `decimals` | `number` | `0` | 小数位数 |
| `negative` | `boolean` | `true` | 允许负数 |
| `thousands` | `string` | `','` | 千位分隔符 |
| `decimal` | `string` | `'.'` | 小数分隔符 |
| `disabled` | `boolean` | `false` | 禁用格式化 |

## Composable 用法

你也可以使用 `useNumber` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useNumber } from 'directix'

const count = ref(1234567)
const { formatted, parse } = useNumber({
  value: count,
  precision: 2,
  suffix: ' items'
})
// formatted.value = '1,234,567.00 items'
</script>

<template>
  <span>{{ formatted }}</span>
</template>
```

### API

```typescript
interface UseNumberOptions {
  /** 数值 */
  value: number | Ref<number>
  /** 小数位数 @default 0 */
  precision?: number | Ref<number>
  /** 千位分隔符 @default ',' */
  separator?: string | Ref<string>
  /** 小数分隔符 @default '.' */
  decimal?: string | Ref<string>
  /** 前缀字符串（如 '$'） */
  prefix?: string | Ref<string>
  /** 后缀字符串（如 '%'） */
  suffix?: string | Ref<string>
}

interface UseNumberReturn {
  /** 格式化后的数字字符串 */
  formatted: Ref<string>
  /** 数值 */
  value: Ref<number>
  /** 将格式化字符串解析为数字 */
  parse: (formatted: string) => number
}
```

## 示例

### 百分比输入

```vue
<template>
  <input v-number="{ min: 0, max: 100 }" v-model="percentage" />
</template>
```

### 数量选择器

```vue
<template>
  <input v-number="{ min: 1, max: 99, step: 1 }" v-model="quantity" />
</template>
```

### 小数输入

```vue
<template>
  <input v-number="{ decimals: 2, thousands: '' }" v-model="rate" />
</template>
```

### 仅正数

```vue
<template>
  <input v-number="{ negative: false, min: 0 }" v-model="amount" />
</template>
```
