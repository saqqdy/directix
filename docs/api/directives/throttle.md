# v-throttle

Throttle event handlers to limit execution frequency.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <!-- Default: 300ms -->
  <button v-throttle="handleClick">Click me</button>
</template>

<script setup>
function handleClick() {
  console.log('Throttled click')
}
</script>
```

### With Modifier

```vue
<template>
  <!-- 500ms throttle -->
  <button v-throttle:500ms="handleClick">Click me</button>

  <!-- 1 second throttle -->
  <button v-throttle:1s="handleClick">Click me</button>
</template>
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
    Click me
  </button>
</template>
```

## API

### Types

```typescript
interface ThrottleOptions {
  /** The function to throttle */
  handler: (event: Event) => void
  /** Wait time in milliseconds */
  wait?: number
  /** Invoke on leading edge */
  leading?: boolean
  /** Invoke on trailing edge */
  trailing?: boolean
}

type ThrottleBinding = ThrottleOptions['handler'] | ThrottleOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to throttle |
| `wait` | `number` | `300` | Wait time in milliseconds |
| `leading` | `boolean` | `true` | Invoke on leading edge |
| `trailing` | `boolean` | `true` | Invoke on trailing edge |

## Examples

### Button Click

```vue
<template>
  <button v-throttle:1s="saveData">
    Save (click once per second max)
  </button>
</template>

<script setup>
async function saveData() {
  console.log('Saving...')
  // API call here
}
</script>
```

### Scroll Handler

```vue
<template>
  <div v-throttle:100ms="handleScroll" class="scroll-container">
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

### Resize Handler

```vue
<template>
  <div v-throttle:200ms="handleResize">
    Window width: {{ width }}px
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)

function handleResize() {
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

### Mouse Move

```vue
<template>
  <div
    v-throttle:50ms="handleMouseMove"
    class="tracking-area"
    @mousemove="handleMouseMove"
  >
    Mouse position: {{ x }}, {{ y }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const x = ref(0)
const y = ref(0)

function handleMouseMove(event) {
  x.value = event.clientX
  y.value = event.clientY
}
</script>
```
