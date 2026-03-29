# v-money

Format input values as currency with customizable options.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <input v-money v-model="price" />
  <!-- Input: "1234.5" → Output: "1,234.50" -->
</template>
```

### With Currency Symbol

```vue
<template>
  <input v-money="{ prefix: '$', decimals: 2 }" v-model="amount" />
  <!-- Output: "$1,234.50" -->
</template>
```

## API

### Types

```typescript
interface MoneyOptions {
  /** Currency prefix @default '' */
  prefix?: string
  /** Currency suffix @default '' */
  suffix?: string
  /** Decimal places @default 2 */
  decimals?: number
  /** Thousands separator @default ',' */
  thousands?: string
  /** Decimal separator @default '.' */
  decimal?: string
  /** Disable formatting @default false */
  disabled?: boolean
}

type MoneyBinding = boolean | MoneyOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `prefix` | `string` | `''` | Currency prefix (e.g., '$') |
| `suffix` | `string` | `''` | Currency suffix (e.g., '€') |
| `decimals` | `number` | `2` | Decimal places |
| `thousands` | `string` | `','` | Thousands separator |
| `decimal` | `string` | `'.'` | Decimal separator |
| `disabled` | `boolean` | `false` | Disable formatting |

## Examples

### USD Currency

```vue
<template>
  <input v-money="{ prefix: '$', decimals: 2 }" v-model="price" />
</template>
```

### European Format

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
  <!-- Output: "1.234,50 €" -->
</template>
```

### No Decimals

```vue
<template>
  <input v-money="{ prefix: '$', decimals: 0 }" v-model="total" />
  <!-- Output: "$1,234" -->
</template>
```
