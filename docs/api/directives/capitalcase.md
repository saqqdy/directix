# v-capitalcase

Transform input text to capital case (first letter of each word capitalized).

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <input v-capitalcase v-model="name" />
  <!-- Input: "john doe" → Output: "John Doe" -->
</template>
```

### With Options

```vue
<template>
  <input v-capitalcase="{ on: 'blur' }" v-model="title" />
</template>
```

## API

### Types

```typescript
interface CapitalcaseOptions {
  /** When to transform: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Disable transformation @default false */
  disabled?: boolean
}

type CapitalcaseBinding = boolean | CapitalcaseOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply transformation |
| `disabled` | `boolean` | `false` | Disable transformation |

## Examples

### Real-time Transformation

```vue
<template>
  <input v-capitalcase="{ on: 'input' }" v-model="name" />
</template>
```

### Form Field

```vue
<template>
  <form>
    <input v-capitalcase v-model="user.firstName" placeholder="First Name" />
    <input v-capitalcase v-model="user.lastName" placeholder="Last Name" />
  </form>
</template>
```

## Composable API

For programmatic use, you can use the `useCapitalcase` composable:

```typescript
import { useCapitalcase, capitalizeText, capitalizeWord, createCapitalizer } from 'directix'

const { capitalized, original } = useCapitalcase({
  text: inputText,
  every: true, // Capitalize each word
  keepLower: ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by']
})

// Utility functions
const title = capitalizeText('the quick brown fox') // 'The Quick Brown Fox'
const sentence = capitalizeText('the quick brown fox', false) // 'The quick brown fox'
const word = capitalizeWord('hello') // 'Hello'

// Create reusable capitalizer
const titleCase = createCapitalizer({ every: true })
const result = titleCase('the quick brown fox') // 'The Quick Brown Fox'
```

### UseCapitalcaseOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `text` | `string \| Ref<string>` | - | The text to capitalize (required) |
| `every` | `boolean \| Ref<boolean>` | `true` | Capitalize each word |
| `keepLower` | `string[] \| Ref<string[]>` | `['a', 'an', 'the', ...]` | Words to keep lowercase |

### UseCapitalcaseReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `capitalized` | `Ref<string>` | The capitalized text |
| `original` | `Ref<string>` | Original text |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useCapitalcase } from 'directix'

const title = ref('the quick brown fox')
const { capitalized } = useCapitalcase({ text: title, every: true })
// capitalized.value = 'The Quick Brown Fox'
</script>

<template>
  <h1>{{ capitalized }}</h1>
</template>
```
