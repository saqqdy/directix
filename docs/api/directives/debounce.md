# v-debounce

Debounce event handlers to limit execution frequency.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <!-- Default: 300ms -->
  <input v-debounce="handleInput" placeholder="Type something..." />
</template>

<script setup>
function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}
</script>
```

### With Modifier

```vue
<template>
  <!-- 500ms debounce -->
  <input v-debounce:500ms="handleInput" />

  <!-- 1 second debounce -->
  <input v-debounce:1s="handleInput" />
</template>
```

### With Options

```vue
<template>
  <input v-debounce="{
    handler: handleInput,
    wait: 500,
    leading: true,
    trailing: true
  }" />
</template>
```

## API

### Types

```typescript
interface DebounceOptions {
  /** The function to debounce */
  handler: (event: Event) => void
  /** Wait time in milliseconds */
  wait?: number
  /** Invoke on leading edge */
  leading?: boolean
  /** Invoke on trailing edge */
  trailing?: boolean
}

type DebounceBinding = DebounceOptions['handler'] | DebounceOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to debounce |
| `wait` | `number` | `300` | Wait time in milliseconds |
| `leading` | `boolean` | `false` | Invoke on leading edge |
| `trailing` | `boolean` | `true` | Invoke on trailing edge |

## Examples

### Search Input

```vue
<template>
  <div>
    <input
      v-debounce:300ms="search"
      placeholder="Search..."
      type="text"
    />
    <div v-if="loading">Loading...</div>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const results = ref([])

async function search(event) {
  const query = event.target.value
  if (!query) {
    results.value = []
    return
  }

  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  results.value = [
    { id: 1, name: `Result for "${query}"` }
  ]
  loading.value = false
}
</script>
```

### Form Validation

```vue
<template>
  <form>
    <input
      v-debounce="{ handler: validateEmail, wait: 500 }"
      placeholder="Email"
      type="email"
    />
    <span v-if="error" class="error">{{ error }}</span>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const error = ref('')

function validateEmail(event) {
  const email = event.target.value
  if (!email) {
    error.value = ''
    return
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  error.value = isValid ? '' : 'Invalid email format'
}
</script>
```
