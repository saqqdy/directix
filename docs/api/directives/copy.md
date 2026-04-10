# v-copy

Copy text to clipboard with a simple directive.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <button v-copy="textToCopy">Copy to clipboard</button>
</template>

<script setup>
const textToCopy = 'Hello, World!'
</script>
```

### With Callbacks

```vue
<template>
  <button v-copy="{
    value: textToCopy,
    onSuccess: handleSuccess,
    onError: handleError
  }">
    Copy with callback
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
  alert('Copied successfully!')
}

function handleError(error) {
  console.error('Copy failed:', error)
  alert('Copy failed!')
}
</script>
```

## API

### Types

```typescript
type CopySuccessCallback = (text: string) => void
type CopyErrorCallback = (error: Error) => void

interface CopyOptions {
  /** Text to copy (required) */
  value: string
  /** Callback on successful copy */
  onSuccess?: CopySuccessCallback
  /** Callback on copy failure */
  onError?: CopyErrorCallback
  /** Tooltip text for the copy button */
  title?: string
  /** Disable copy functionality */
  disabled?: boolean
}

type CopyBinding = string | CopyOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `string` | - | Text to copy (required) |
| `onSuccess` | `(text: string) => void` | - | Callback on successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy failure |
| `title` | `string` | - | Tooltip text for the button |
| `disabled` | `boolean` | `false` | Disable copy functionality |

## Events

The directive dispatches custom events:

| Event | Detail | Description |
| ----- | ------ | ----------- |
| `copy:success` | `{ text: string }` | Fired on successful copy |
| `copy:error` | `{ error: Error }` | Fired on copy failure |

## Examples

### Copy Input Value

```vue
<template>
  <div>
    <input v-model="text" type="text" />
    <button v-copy="text">Copy Input</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Edit me!')
</script>
```

### Copy with Feedback

```vue
<template>
  <button v-copy="{
    value: code,
    onSuccess: () => copied = true
  }">
    {{ copied ? 'Copied!' : 'Copy Code' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const code = 'const hello = "world"'
const copied = ref(false)
</script>
```

### Copy Multiple Texts

```vue
<template>
  <div v-for="item in items" :key="item.id">
    <span>{{ item.text }}</span>
    <button v-copy="item.text">Copy</button>
  </div>
</template>

<script setup>
const items = [
  { id: 1, text: 'First text' },
  { id: 2, text: 'Second text' },
  { id: 3, text: 'Third text' },
]
</script>
```

### Listen to Events

```vue
<template>
  <button
    v-copy="textToCopy"
    @copy:success="onCopySuccess"
    @copy:error="onCopyError"
  >
    Copy
  </button>
</template>

<script setup>
function onCopySuccess(event) {
  console.log('Copied:', event.detail.text)
}

function onCopyError(event) {
  console.error('Error:', event.detail.error)
}
</script>
```

## Composable API

For programmatic use, you can use the `useCopy` composable:

```typescript
import { useCopy } from 'directix'

const { copy, copied, error, isSupported } = useCopy({
  source: textToCopy,
  onSuccess: (text) => console.log('Copied:', text),
  onError: (err) => console.error('Error:', err),
  copiedTimeout: 1500
})

// Copy text
await copy('Custom text')

// Or use the reactive source
await copy()
```

### UseCopyOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `source` | `string \| Ref<string>` | - | Source text to copy (can be reactive) |
| `onSuccess` | `(text: string) => void` | - | Callback on copy success |
| `onError` | `(error: Error) => void` | - | Callback on copy error |
| `copiedTimeout` | `number` | `1500` | Time in ms to reset copied state |

### UseCopyReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `copy` | `(text?: string) => Promise<boolean>` | Copy function |
| `copied` | `Readonly<Ref<boolean>>` | Whether the last copy was successful |
| `error` | `Readonly<Ref<Error \| null>>` | Error from the last copy attempt |
| `isSupported` | `boolean` | Whether clipboard API is supported |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useCopy } from 'directix'

const text = ref('Hello World')
const { copy, copied, isSupported } = useCopy({ source: text })
</script>

<template>
  <button @click="copy()" :disabled="!isSupported">
    {{ copied ? 'Copied!' : 'Copy' }}
  </button>
</template>
```

## Code Generator

<DirectiveConfigurator name="copy" description="Copy text to clipboard with a simple directive" />
