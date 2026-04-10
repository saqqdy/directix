# v-number

Format and validate numeric input with customizable options.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <input v-number v-model="quantity" />
</template>
```

### With Constraints

```vue
<template>
  <input v-number="{ min: 0, max: 100, step: 5 }" v-model="count" />
</template>
```

## API

### Types

```typescript
interface NumberOptions {
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Decimal places @default 0 */
  decimals?: number
  /** Allow negative numbers @default true */
  negative?: boolean
  /** Thousands separator @default ',' */
  thousands?: string
  /** Decimal separator @default '.' */
  decimal?: string
  /** Disable formatting @default false */
  disabled?: boolean
}

type NumberBinding = boolean | NumberOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `min` | `number` | - | Minimum allowed value |
| `max` | `number` | - | Maximum allowed value |
| `step` | `number` | `1` | Step increment |
| `decimals` | `number` | `0` | Decimal places |
| `negative` | `boolean` | `true` | Allow negative numbers |
| `thousands` | `string` | `','` | Thousands separator |
| `decimal` | `string` | `'.'` | Decimal separator |
| `disabled` | `boolean` | `false` | Disable formatting |

## Examples

### Percentage Input

```vue
<template>
  <input v-number="{ min: 0, max: 100 }" v-model="percentage" />
</template>
```

### Quantity Selector

```vue
<template>
  <input v-number="{ min: 1, max: 99, step: 1 }" v-model="quantity" />
</template>
```

### Decimal Input

```vue
<template>
  <input v-number="{ decimals: 2, thousands: '' }" v-model="rate" />
</template>
```

### Positive Only

```vue
<template>
  <input v-number="{ negative: false, min: 0 }" v-model="amount" />
</template>
```

## Composable API

For programmatic use, you can use the `useNumber` composable:

```typescript
import { useNumber } from 'directix'

const { formatted, value, parse } = useNumber({
  value: 1234567,
  precision: 2,
  separator: ',',
  decimal: '.',
  prefix: '$',
  suffix: ' items'
})
// formatted.value = '$1,234,567.00 items'
```

### UseNumberOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `number \| Ref<number>` | - | The numeric value (required) |
| `precision` | `number \| Ref<number>` | `0` | Decimal places |
| `separator` | `string \| Ref<string>` | `','` | Thousands separator |
| `decimal` | `string \| Ref<string>` | `'.'` | Decimal separator |
| `prefix` | `string \| Ref<string>` | `''` | Prefix string |
| `suffix` | `string \| Ref<string>` | `''` | Suffix string |

### UseNumberReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `formatted` | `Ref<string>` | The formatted number string |
| `value` | `Ref<number>` | The numeric value |
| `parse` | `(formatted: string) => number` | Parse formatted string to number |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useNumber } from 'directix'

const count = ref(1234567)

const { formatted } = useNumber({
  value: count,
  precision: 2,
  suffix: ' items'
})
</script>

<template>
  <span>Total: {{ formatted }}</span>
  <!-- Output: Total: 1,234,567.00 items -->
</template>
```

### Utility Functions

```typescript
import { formatNumber, parseNumber, createNumberFormatter } from 'directix'

// Format directly
formatNumber(1234567) // '1,234,567'
formatNumber(1234.56, { precision: 2, suffix: '%' }) // '1,234.56%'

// Parse formatted string
parseNumber('1,234,567') // 1234567

// Create reusable formatter
const formatPercent = createNumberFormatter({ suffix: '%', precision: 1 })
formatPercent(85.5) // '85.5%'
```
## Code Generator

<DirectiveConfigurator name="number" description="Format and validate numeric input with customizable options." />
