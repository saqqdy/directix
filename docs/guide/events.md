# Event Directives

Event directives help you manage DOM events more efficiently.

## v-click-outside

Detect clicks outside an element. Perfect for closing dropdowns, modals, and popovers.

### Basic Usage

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

### With Options

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    include: ['.trigger'],
    exclude: ['.ignore']
  }">
    <!-- content -->
  </div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when click outside detected |
| `include` | `string[]` | `[]` | CSS selectors to include |
| `exclude` | `string[]` | `[]` | CSS selectors to exclude |

## v-debounce

Debounce event handlers to limit execution frequency.

### Basic Usage

```vue
<template>
  <!-- Default: 300ms -->
  <input v-debounce="handleInput" />

  <!-- Custom wait time with modifier -->
  <input v-debounce:500ms="handleInput" />

  <!-- With options object -->
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}
</script>
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

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to debounce |
| `wait` | `number` | `300` | Wait time in milliseconds |
| `leading` | `boolean` | `false` | Invoke on leading edge |
| `trailing` | `boolean` | `true` | Invoke on trailing edge |

## v-throttle

Throttle event handlers to limit execution frequency.

### Basic Usage

```vue
<template>
  <!-- Default: 300ms -->
  <button v-throttle="handleClick">Throttled click</button>

  <!-- Custom wait time with modifier -->
  <button v-throttle:1s="handleClick">1 second throttle</button>

  <!-- With options object -->
  <button v-throttle="{ handler: handleClick, wait: 1000 }">
    Throttle with options
  </button>
</template>

<script setup>
function handleClick() {
  console.log('Throttled click')
}
</script>
```

### With Options

```vue
<template>
  <button v-throttle="{
    handler: handleClick,
    wait: 1000,
    leading: true,
    trailing: false
  }">
    Throttle with options
  </button>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to throttle |
| `wait` | `number` | `300` | Wait time in milliseconds |
| `leading` | `boolean` | `true` | Invoke on leading edge |
| `trailing` | `boolean` | `true` | Invoke on trailing edge |
