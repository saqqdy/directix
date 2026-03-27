# v-focus

Auto focus an element when mounted.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <input v-focus placeholder="Auto focused on mount" />
</template>
```

### With Options

```vue
<template>
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

## API

### Types

```typescript
interface FocusOptions {
  /** Focus element on mount */
  focus?: boolean
  /** Refocus when element is shown again */
  refocus?: boolean
}

type FocusBinding = boolean | FocusOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `focus` | `boolean` | `true` | Focus element on mount |
| `refocus` | `boolean` | `false` | Refocus when element is shown again. **Since:** `1.0.0` |

## Examples

### Modal Input

```vue
<template>
  <button @click="showModal = true">Open Modal</button>

  <div v-if="showModal" class="modal">
    <input v-focus placeholder="Focused when modal opens" />
    <button @click="showModal = false">Close</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>
```

### Conditional Focus

```vue
<template>
  <div>
    <button @click="editMode = !editMode">
      {{ editMode ? 'Cancel' : 'Edit' }}
    </button>

    <input
      v-if="editMode"
      v-focus="{ focus: true, refocus: true }"
      v-model="text"
    />
    <span v-else>{{ text }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editMode = ref(false)
const text = ref('Click edit to modify')
</script>
```

### Form with Auto Focus

```vue
<template>
  <form @submit.prevent="submit">
    <input v-focus placeholder="First field (auto focused)" />
    <input placeholder="Second field" />
    <input placeholder="Third field" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
function submit() {
  console.log('Form submitted')
}
</script>
```

### Search Box

```vue
<template>
  <div>
    <button @click="showSearch = !showSearch">
      {{ showSearch ? 'Close' : 'Search' }}
    </button>

    <input
      v-if="showSearch"
      v-focus="{ refocus: true }"
      v-debounce:300ms="search"
      placeholder="Search..."
      type="search"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSearch = ref(false)

function search(event) {
  console.log('Searching:', event.target.value)
}
</script>
```
