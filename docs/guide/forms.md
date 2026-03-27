# Form Directives

Form directives help you enhance form interactions.

## v-copy

Copy text to clipboard with a simple directive.

### Basic Usage

```vue
<template>
  <!-- Simple usage -->
  <button v-copy="textToCopy">Copy to clipboard</button>

  <!-- With callbacks -->
  <button v-copy="{ value: text, onSuccess: handleSuccess, onError: handleError }">
    Copy with callback
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
}

function handleError(error) {
  console.error('Copy failed:', error)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `string` | - | Text to copy |
| `onSuccess` | `Function` | - | Callback on successful copy |
| `onError` | `Function` | - | Callback on copy failure |

## v-focus

Auto focus an element when mounted.

### Basic Usage

```vue
<template>
  <!-- Simple usage -->
  <input v-focus />

  <!-- With options -->
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

### With Options

```vue
<template>
  <!-- Focus when component mounts -->
  <input v-focus="{ focus: true }" />

  <!-- Refocus when element is shown -->
  <input v-if="show" v-focus="{ focus: true, refocus: true }" />
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `focus` | `boolean` | `true` | Focus element on mount |
| `refocus` | `boolean` | `false` | Refocus when element is shown again |

## Coming Soon

More form directives are planned:

| Directive | Description | Status |
| --------- | ----------- | ------ |
| `v-mask` | Input masking for formatted input | ⏳ |

> ✅ = Available | ⏳ = Coming soon
