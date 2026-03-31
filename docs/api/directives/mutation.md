# v-mutation

Observe DOM mutations using MutationObserver.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-mutation="handleMutation">
    Observe my changes
  </div>
</template>

<script setup>
function handleMutation(mutations, observer) {
  mutations.forEach(mutation => {
    console.log('Type:', mutation.type)
    console.log('Target:', mutation.target)
  })
}
</script>
```

### With Options

```vue
<template>
  <div v-mutation="{
    handler: handleMutation,
    attributes: true,
    subtree: true
  }">
    Observe attributes and subtree
  </div>
</template>
```

## API

### Types

```typescript
type MutationHandler = (mutations: MutationRecord[], observer: MutationObserver) => void

interface MutationOptions {
  /** Callback when mutations occur */
  handler: MutationHandler
  /** Observe attribute changes */
  attributes?: boolean
  /** Specific attributes to observe */
  attributeFilter?: string[]
  /** Observe child node additions/removals */
  childList?: boolean
  /** Observe all descendants */
  subtree?: boolean
  /** Observe character data changes */
  characterData?: boolean
  /** Record old attribute values */
  attributeOldValue?: boolean
  /** Record old character data */
  characterDataOldValue?: boolean
  /** Disable the directive */
  disabled?: boolean
}

type MutationBinding = MutationHandler | MutationOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when mutations occur (required) |
| `attributes` | `boolean` | `false` | Observe attribute changes |
| `attributeFilter` | `string[]` | - | Specific attributes to observe |
| `childList` | `boolean` | `true` | Observe child node changes |
| `subtree` | `boolean` | `false` | Observe all descendants |
| `characterData` | `boolean` | `false` | Observe character data changes |
| `attributeOldValue` | `boolean` | `false` | Record old attribute values |
| `characterDataOldValue` | `boolean` | `false` | Record old character data |
| `disabled` | `boolean` | `false` | Disable the directive |

## Examples

### Dynamic Content

```vue
<template>
  <div v-mutation="{
    handler: handleContentChange,
    childList: true,
    subtree: true
  }">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
  </div>
</template>

<script setup>
function handleContentChange(mutations) {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.log('Children changed')
      mutation.addedNodes.forEach(node => {
        console.log('Added:', node)
      })
      mutation.removedNodes.forEach(node => {
        console.log('Removed:', node)
      })
    }
  })
}
</script>
```

### Attribute Changes

```vue
<template>
  <div v-mutation="{
    handler: handleAttributeChange,
    attributes: true,
    attributeFilter: ['class', 'style']
  }" :class="{ active: isActive }">
    Watch class and style changes
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isActive = ref(false)

function handleAttributeChange(mutations) {
  mutations.forEach(mutation => {
    console.log(`${mutation.attributeName} changed`)
    console.log('Old value:', mutation.oldValue)
    console.log('New value:', mutation.target.getAttribute(mutation.attributeName))
  })
}
</script>
```

### Form Validation

```vue
<template>
  <form v-mutation="{
    handler: checkFormValidity,
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  }">
    <input v-model="email" type="email" :class="{ invalid: !validEmail }" />
    <input v-model="password" type="password" :class="{ invalid: !validPassword }" />
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const password = ref('')

const validEmail = computed(() => email.value.includes('@'))
const validPassword = computed(() => password.value.length >= 8)

function checkFormValidity(mutations) {
  // React to validation state changes
  const invalidCount = mutations[0]?.target.querySelectorAll('.invalid').length
  console.log('Invalid fields:', invalidCount)
}
</script>
```

### Content Editor

```vue
<template>
  <div
    v-mutation="{
      handler: handleEdit,
      childList: true,
      characterData: true,
      subtree: true
    }"
    contenteditable="true"
  >
    Edit this content
  </div>
</template>

<script setup>
function handleEdit(mutations) {
  mutations.forEach(mutation => {
    if (mutation.type === 'characterData') {
      console.log('Text changed:', mutation.target.textContent)
    } else if (mutation.type === 'childList') {
      console.log('Content structure changed')
    }
  })
}
</script>
```

## Composable API

For programmatic use, you can use the `useMutation` composable:

```typescript
import { useMutation } from 'directix'

const { bind, stop, start } = useMutation({
  handler: (mutations, observer) => {
    mutations.forEach(mutation => {
      console.log('Type:', mutation.type)
    })
  },
  attributes: false,
  attributeFilter: undefined,
  childList: true,
  subtree: false,
  characterData: false,
  attributeOldValue: false,
  characterDataOldValue: false,
  disabled: false
})

// Bind to element
onMounted(() => bind(containerRef.value))
```

### UseMutationOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `MutationHandler` | - | Callback when mutations occur (required) |
| `attributes` | `boolean` | `false` | Observe attribute changes |
| `attributeFilter` | `string[]` | - | Specific attributes to observe |
| `childList` | `boolean` | `true` | Observe child node changes |
| `subtree` | `boolean` | `false` | Observe all descendants |
| `characterData` | `boolean` | `false` | Observe character data changes |
| `attributeOldValue` | `boolean` | `false` | Record old attribute values |
| `characterDataOldValue` | `boolean` | `false` | Record old character data |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable the observer |

### UseMutationReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `bind` | `(element: HTMLElement) => () => void` | Bind mutation observer to an element |
| `stop` | `() => void` | Stop observing |
| `start` | `() => void` | Start observing |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useMutation } from 'directix'

const containerRef = ref(null)
const { bind } = useMutation({
  handler: (mutations) => {
    mutations.forEach(mutation => {
      console.log('Type:', mutation.type)
    })
  },
  childList: true,
  subtree: true
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">
    Content to observe
  </div>
</template>
```
