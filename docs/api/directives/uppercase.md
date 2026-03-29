# v-uppercase

Transform input text to uppercase.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <input v-uppercase v-model="code" />
  <!-- Input: "abc123" → Output: "ABC123" -->
</template>
```

### With Options

```vue
<template>
  <input v-uppercase="{ on: 'input' }" v-model="productCode" />
</template>
```

## API

### Types

```typescript
interface UppercaseOptions {
  /** When to transform: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Disable transformation @default false */
  disabled?: boolean
}

type UppercaseBinding = boolean | UppercaseOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply transformation |
| `disabled` | `boolean` | `false` | Disable transformation |

## Examples

### Product Code

```vue
<template>
  <input v-uppercase v-model="productCode" placeholder="Product Code" />
</template>
```

### Promo Code

```vue
<template>
  <input
    v-uppercase="{ on: 'input' }"
    v-model="promoCode"
    placeholder="Enter promo code"
  />
</template>
```
