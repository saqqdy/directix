# v-uppercase

Transform input text to uppercase.

> **Since:** `1.2.0`

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

## Composable API

For programmatic use, you can use the `useUppercase` composable:

```typescript
import { useUppercase, uppercaseText, createUppercaser } from 'directix'

const { transformed, original } = useUppercase({
  text: inputText,
  first: false // Transform only first character
})

// Utility function
const upper = uppercaseText('hello world') // 'HELLO WORLD'
const firstUpper = uppercaseText('hello world', true) // 'Hello world'

// Create reusable transformer
const toUpper = createUppercaser()
const result = toUpper('hello') // 'HELLO'
```

### UseUppercaseOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `text` | `string \| Ref<string>` | - | The text to transform (required) |
| `first` | `boolean \| Ref<boolean>` | `false` | Transform only the first character |

### UseUppercaseReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `transformed` | `Ref<string>` | The transformed text |
| `original` | `Ref<string>` | Original text |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useUppercase } from 'directix'

const text = ref('hello world')
const { transformed } = useUppercase({ text })
// transformed.value = 'HELLO WORLD'
</script>

<template>
  <p>{{ transformed }}</p>
</template>
```
## Code Generator

<DirectiveConfigurator name="uppercase" description="Transform input text to uppercase." />
