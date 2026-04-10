# v-money

Format input values as currency with customizable options.

> **Since:** `1.2.0`

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

## Composable API

For programmatic use, you can use the `useMoney` composable:

```typescript
import { useMoney } from 'directix'

const { formatted, value, parse } = useMoney({
  value: 1234.56,
  symbol: '$',
  symbolPosition: 'before',
  precision: 2,
  separator: ',',
  decimal: '.'
})
// formatted.value = '$1,234.56'
```

### UseMoneyOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `number \| Ref<number>` | - | The numeric value (required) |
| `symbol` | `string \| Ref<string>` | `'$'` | Currency symbol |
| `symbolPosition` | `'before' \| 'after'` | `'before'` | Symbol position |
| `precision` | `number \| Ref<number>` | `2` | Decimal places |
| `separator` | `string \| Ref<string>` | `','` | Thousands separator |
| `decimal` | `string \| Ref<string>` | `'.'` | Decimal separator |

### UseMoneyReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `formatted` | `Ref<string>` | The formatted money string |
| `value` | `Ref<number>` | The numeric value |
| `parse` | `(formatted: string) => number` | Parse formatted string to number |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useMoney } from 'directix'

const price = ref(1234.56)

const { formatted } = useMoney({
  value: price,
  symbol: '€',
  symbolPosition: 'after'
})
</script>

<template>
  <span>Price: {{ formatted }}</span>
  <!-- Output: Price: 1,234.56€ -->
</template>
```

### Utility Functions

```typescript
import { formatMoney, parseMoney, createMoneyFormatter } from 'directix'

// Format directly
formatMoney(1234.56) // '$1,234.56'
formatMoney(1234.56, { symbol: '€', symbolPosition: 'after' }) // '1,234.56€'

// Parse formatted string
parseMoney('$1,234.56') // 1234.56

// Create reusable formatter
const formatEuro = createMoneyFormatter({ symbol: '€', symbolPosition: 'after' })
formatEuro(1234.56) // '1,234.56€'
```
## Code Generator

<DirectiveConfigurator name="money" description="Format input values as currency with customizable options." />
