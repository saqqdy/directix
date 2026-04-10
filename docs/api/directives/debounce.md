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

### Event Modifiers

Specify the event type using modifiers:

```vue
<template>
  <input v-debounce.input="handleInput" />
  <div v-debounce.scroll="handleScroll">Scroll me</div>
  <button v-debounce.click="handleClick">Click me</button>
</template>
```

Supported events: `click`, `input`, `change`, `submit`, `scroll`, `resize`, `mouseenter`, `mouseleave`, `mousemove`, `mousedown`, `mouseup`, `keydown`, `keyup`, `focus`, `blur`, `touchstart`, `touchmove`, `touchend`

## API

### Types

```typescript
interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

interface DebounceOptions<T extends (...args: any[]) => any = any> {
  /** The function to debounce */
  handler: T
  /** Wait time in milliseconds */
  wait?: number
  /** Invoke on leading edge */
  leading?: boolean
  /** Invoke on trailing edge */
  trailing?: boolean
}

type DebounceBinding<T extends (...args: any[]) => any = any> =
  | T
  | DebounceOptions<T>
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to debounce (required) |
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

### Scroll Handler

```vue
<template>
  <div v-debounce:100ms.scroll="handleScroll" class="scroll-container">
    <!-- content -->
  </div>
</template>

<script setup>
function handleScroll(event) {
  const scrollTop = event.target.scrollTop
  console.log('Scroll position:', scrollTop)
}
</script>
```

## Composable API

For programmatic use, you can use the `useDebounce` composable:

```typescript
import { useDebounce, debounceFn } from 'directix'

// Composable usage
const { run, cancel, flush, pending } = useDebounce({
  handler: (query: string) => {
    console.log('Searching:', query)
  },
  wait: 500,
  leading: false,
  trailing: true
})

// Call the debounced function
run('search query')

// Cancel pending execution
cancel()

// Immediately invoke if pending
flush()

// Check if there's a pending execution
if (pending()) {
  console.log('Execution pending')
}

// Simple function wrapper
const debouncedSave = debounceFn(saveData, 1000)
debouncedSave(data)
debouncedSave.cancel()
```

### UseDebounceOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Function to debounce (required) |
| `wait` | `number \| Ref<number>` | `300` | Delay time in milliseconds |
| `leading` | `boolean \| Ref<boolean>` | `false` | Invoke on leading edge |
| `trailing` | `boolean \| Ref<boolean>` | `true` | Invoke on trailing edge |

### UseDebounceReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `run` | `(...args) => void` | Debounced function |
| `cancel` | `() => void` | Cancel pending execution |
| `flush` | `() => void` | Immediately invoke if pending |
| `pending` | `() => boolean` | Check if execution is pending |

### Example

```vue
<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from 'directix'

const searchQuery = ref('')

const { run: debouncedSearch } = useDebounce({
  handler: (query: string) => {
    console.log('Searching:', query)
  },
  wait: 500
})

watch(searchQuery, (query) => {
  debouncedSearch(query)
})
</script>

<template>
  <input v-model="searchQuery" placeholder="Search..." />
</template>
```

## Code Generator

<DirectiveConfigurator name="debounce" description="Debounce event handlers to limit execution frequency" />
