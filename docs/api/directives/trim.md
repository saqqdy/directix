# v-trim

Trim whitespace from input values with configurable position.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <input v-trim v-model="text" />
</template>
```

### Trim on Blur (Default)

```vue
<template>
  <input v-trim="'blur'" v-model="text" />
</template>
```

### Trim on Input

```vue
<template>
  <input v-trim="'input'" v-model="text" />
</template>
```

## API

### Types

```typescript
type TrimPosition = 'start' | 'end' | 'both'

interface TrimOptions {
  /** When to trim: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Which side to trim @default 'both' */
  position?: TrimPosition
  /** Disable trimming @default false */
  disabled?: boolean
}

type TrimBinding = 'input' | 'blur' | TrimOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply trim |
| `position` | `string` | `'both'` | Which side to trim |
| `disabled` | `boolean` | `false` | Disable trimming |

## Examples

### Trim Start Only

```vue
<template>
  <input v-trim="{ position: 'start' }" v-model="text" />
</template>
```

### Trim End Only

```vue
<template>
  <textarea v-trim="{ position: 'end' }" v-model="content" />
</template>
```

### Real-time Trimming

```vue
<template>
  <input v-trim="{ on: 'input' }" v-model="searchQuery" />
</template>
```

## Composable API

For programmatic use, you can use the `useTrim` composable:

```typescript
import { useTrim, trimText, createTrimmer } from 'directix'

const { trimmed, original, wasTrimmed } = useTrim({
  text: inputText,
  position: 'both', // 'start' | 'end' | 'both'
  chars: undefined // Custom characters to trim
})

// Utility function
const result = trimText('  hello world  ') // 'hello world'
const startOnly = trimText('  hello world  ', 'start') // 'hello world  '
const custom = trimText('**hello**', 'both', '*') // 'hello'

// Create reusable trimmer
const trimStart = createTrimmer('start')
const trimmed = trimStart('  hello  ') // 'hello  '
```

### UseTrimOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `text` | `string \| Ref<string>` | - | The text to trim (required) |
| `position` | `'start' \| 'end' \| 'both' \| Ref` | `'both'` | Trim position |
| `chars` | `string \| Ref<string>` | - | Custom characters to trim |

### UseTrimReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `trimmed` | `Ref<string>` | The trimmed text |
| `original` | `Ref<string>` | Original text |
| `wasTrimmed` | `Ref<boolean>` | Whether the text was trimmed |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useTrim } from 'directix'

const text = ref('  hello world  ')
const { trimmed, wasTrimmed } = useTrim({ text })
// trimmed.value = 'hello world'
// wasTrimmed.value = true
</script>

<template>
  <p>{{ trimmed }}</p>
</template>
```
## Code Generator

<DirectiveConfigurator name="trim" description="Trim whitespace from input values with configurable position." />
