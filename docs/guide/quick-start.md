# Quick Start

## Global Registration

Register all directives globally in your application.

### Vue 3

```typescript
import { createApp } from 'vue'
import Directix from 'directix'
import App from './App.vue'

const app = createApp(App)

// Register all directives
app.use(Directix)

// Or register specific directives only
app.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce']
})

app.mount('#app')
```

### Vue 2

```typescript
import Vue from 'vue'
import Directix from 'directix'

// Register all directives
Vue.use(Directix)

// Or register specific directives only
Vue.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce']
})
```

## On-Demand Import

Import individual directives for tree-shaking:

```typescript
import { vClickOutside, vCopy, vDebounce } from 'directix'

// Vue 3
app.directive('click-outside', vClickOutside)
app.directive('copy', vCopy)
app.directive('debounce', vDebounce)

// Vue 2
Vue.directive('click-outside', vClickOutside)
Vue.directive('copy', vCopy)
Vue.directive('debounce', vDebounce)
```

## Usage Examples

### v-click-outside

Detect clicks outside an element:

```vue
<template>
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">Toggle</button>
    <div v-if="show">Dropdown content</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function closeDropdown() {
  show.value = false
}
</script>
```

### v-copy

Copy text to clipboard:

```vue
<template>
  <button v-copy="textToCopy">Copy to clipboard</button>
  <button v-copy="{ value: text, onSuccess: handleSuccess }">
    Copy with callback
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
}
</script>
```

### v-debounce

Debounce event handlers:

```vue
<template>
  <input v-debounce="handleInput" />
  <input v-debounce:500ms="handleInput" />
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}
</script>
```

### v-throttle

Throttle event handlers:

```vue
<template>
  <button v-throttle="handleClick">Throttled click</button>
  <button v-throttle:1s="handleClick">1 second throttle</button>
</template>

<script setup>
function handleClick() {
  console.log('Throttled click')
}
</script>
```

### v-focus

Auto focus an element:

```vue
<template>
  <input v-focus />
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

## Next Steps

- [Event Directives](/guide/events) - Learn more about event-related directives
- [Form Directives](/guide/forms) - Learn more about form-related directives
- [API Reference](/api/) - Full API documentation
