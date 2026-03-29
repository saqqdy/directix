# v-money

将输入值格式化为货币格式。

> **起始版本：** `1.1.0`

## 用法

### 基础用法

```vue
<template>
  <input v-money v-model="price" />
  <!-- 输入: "1234.5" → 输出: "1,234.50" -->
</template>
```

### 带货币符号

```vue
<template>
  <input v-money="{ prefix: '¥', decimals: 2 }" v-model="amount" />
  <!-- 输出: "¥1,234.50" -->
</template>
```

## API

### 类型

```typescript
interface MoneyOptions {
  /** 货币前缀 @default '' */
  prefix?: string
  /** 货币后缀 @default '' */
  suffix?: string
  /** 小数位数 @default 2 */
  decimals?: number
  /** 千位分隔符 @default ',' */
  thousands?: string
  /** 小数分隔符 @default '.' */
  decimal?: string
  /** 禁用格式化 @default false */
  disabled?: boolean
}

type MoneyBinding = boolean | MoneyOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `prefix` | `string` | `''` | 货币前缀（如 '¥'） |
| `suffix` | `string` | `''` | 货币后缀（如 '元'） |
| `decimals` | `number` | `2` | 小数位数 |
| `thousands` | `string` | `','` | 千位分隔符 |
| `decimal` | `string` | `'.'` | 小数分隔符 |
| `disabled` | `boolean` | `false` | 禁用格式化 |

## 示例

### 人民币格式

```vue
<template>
  <input v-money="{ prefix: '¥', decimals: 2 }" v-model="price" />
</template>
```

### 欧洲格式

```vue
<template>
  <input
    v-money="{
      suffix: ' €',
      thousands: '.',
      decimal: ',',
      decimals: 2
    }"
    v-model="price"
  />
  <!-- 输出: "1.234,50 €" -->
</template>
```

### 无小数

```vue
<template>
  <input v-money="{ prefix: '¥', decimals: 0 }" v-model="total" />
  <!-- 输出: "¥1,234" -->
</template>
```
