# v-loading

Show a loading overlay on elements.

> **Since:** `1.0.0`

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
