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
