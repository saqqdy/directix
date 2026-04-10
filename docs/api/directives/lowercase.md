# v-lowercase

Transform input text to lowercase.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <input v-lowercase v-model="email" />
  <!-- Input: "JOHN@EXAMPLE.COM" → Output: "john@example.com" -->
</template>
```

### With Options

```vue
<template>
  <input v-lowercase="{ on: 'input' }" v-model="username" />
</template>
```

## API

### Types

```typescript
interface LowercaseOptions {
  /** When to transform: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Disable transformation @default false */
  disabled?: boolean
}

type LowercaseBinding = boolean | LowercaseOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply transformation |
| `disabled` | `boolean` | `false` | Disable transformation |

## Examples

### Email Input

```vue
<template>
  <input v-lowercase type="email" v-model="email" placeholder="Email" />
</template>
```

### Username Field

```vue
<template>
  <input v-lowercase="{ on: 'input' }" v-model="username" />
</template>
```

## Composable API

For programmatic use, you can use the `useLowercase` composable:

```typescript
import { useLowercase, lowercaseText, createLowercaser } from 'directix'

const { transformed, original } = useLowercase({
  text: inputText,
  first: false // Transform only first character
})

// Utility function
const lower = lowercaseText('HELLO WORLD') // 'hello world'
const firstLower = lowercaseText('HELLO WORLD', true) // 'hELLO WORLD'

// Create reusable transformer
const toLower = createLowercaser()
const result = toLower('HELLO') // 'hello'
```

### UseLowercaseOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `text` | `string \| Ref<string>` | - | The text to transform (required) |
| `first` | `boolean \| Ref<boolean>` | `false` | Transform only the first character |

### UseLowercaseReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `transformed` | `Ref<string>` | The transformed text |
| `original` | `Ref<string>` | Original text |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useLowercase } from 'directix'

const text = ref('HELLO WORLD')
const { transformed } = useLowercase({ text })
// transformed.value = 'hello world'
</script>

<template>
  <p>{{ transformed }}</p>
</template>
```
## Code Generator

<DirectiveConfigurator name="lowercase" description="Transform input text to lowercase." />
