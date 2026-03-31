# v-loading

Show a loading overlay on elements.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-loading="isLoading">Content</div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>
```

### With Options

```vue
<template>
  <div v-loading="{
    value: isLoading,
    text: 'Loading...',
    lock: true
  }">
    Content
  </div>
</template>
```

## API

### Types

```typescript
interface LoadingOptions {
  /** Loading state */
  value?: boolean
  /** Loading text to display */
  text?: string
  /** CSS class for loading overlay */
  loadingClass?: string
  /** CSS class for loading spinner */
  spinnerClass?: string
  /** CSS class for loading text */
  textClass?: string
  /** Custom spinner HTML */
  spinner?: string
  /** Background color */
  background?: string
  /** Lock scroll while loading */
  lock?: boolean
  /** Disable the directive */
  disabled?: boolean
}

type LoadingBinding = boolean | LoadingOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `boolean` | `true` | Loading state |
| `text` | `string` | - | Loading text to display |
| `loadingClass` | `string` | `'v-loading'` | CSS class for overlay |
| `spinnerClass` | `string` | `'v-loading__spinner'` | CSS class for spinner |
| `textClass` | `string` | `'v-loading__text'` | CSS class for text |
| `spinner` | `string` | - | Custom spinner HTML |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | Background color |
| `lock` | `boolean` | `false` | Lock scroll while loading |
| `disabled` | `boolean` | `false` | Disable the directive |

## Examples

### Async Data Loading

```vue
<template>
  <div v-loading="loading" class="data-container">
    <div v-if="!loading">
      {{ data }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const data = ref(null)

onMounted(async () => {
  data.value = await fetchData()
  loading.value = false
})

async function fetchData() {
  // API call
  return { message: 'Data loaded' }
}
</script>
```

### Custom Spinner

```vue
<template>
  <div v-loading="{
    value: loading,
    spinner: '<div class=my-spinner></div>',
    text: 'Please wait...'
  }">
    Content
  </div>
</template>
```

### Full Screen Loading

```vue
<template>
  <div v-loading="{
    value: loading,
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
    text: 'Processing...'
  }" class="full-screen">
    Content
  </div>
</script>
```

## Composable API

For programmatic use, you can use the `useLoading` composable:

```typescript
import { useLoading } from 'directix'

const { loading, start, stop, toggle, bind } = useLoading({
  initial: false,
  text: 'Loading...',
  loadingClass: 'v-loading',
  spinnerClass: 'v-loading__spinner',
  textClass: 'v-loading__text',
  spinner: '<custom-spinner/>',
  background: 'rgba(255, 255, 255, 0.9)',
  lock: false
})

// Control loading state
start()
stop()
toggle()

// Bind to element
onMounted(() => bind(containerRef.value))
```

### UseLoadingOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `initial` | `boolean \| Ref<boolean>` | `false` | Initial loading state |
| `text` | `string \| Ref<string>` | - | Loading text to display |
| `loadingClass` | `string` | `'v-loading'` | CSS class for overlay |
| `spinnerClass` | `string` | `'v-loading__spinner'` | CSS class for spinner |
| `textClass` | `string` | `'v-loading__text'` | CSS class for text |
| `spinner` | `string` | - | Custom spinner HTML |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | Background color |
| `lock` | `boolean` | `false` | Lock scroll while loading |

### UseLoadingReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `loading` | `Ref<boolean>` | Current loading state |
| `start` | `() => void` | Start loading |
| `stop` | `() => void` | Stop loading |
| `toggle` | `() => void` | Toggle loading state |
| `bind` | `(element: HTMLElement) => () => void` | Bind loading to an element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useLoading } from 'directix'

const containerRef = ref(null)
const { loading, start, stop, bind } = useLoading({
  text: 'Loading...',
  lock: true
})

onMounted(() => bind(containerRef.value))

async function fetchData() {
  start()
  await api.getData()
  stop()
}
</script>

<template>
  <div ref="containerRef">
    <button @click="fetchData">Fetch Data</button>
  </div>
</template>
```
