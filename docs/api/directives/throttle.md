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

### Event Modifiers

Specify the event type using modifiers:

```vue
<template>
  <button v-throttle.click="handleClick">Click me</button>
  <div v-throttle.scroll="handleScroll">Scroll me</div>
  <input v-throttle.input="handleInput" />
</template>
```

Supported events: `click`, `input`, `change`, `submit`, `scroll`, `resize`, `mouseenter`, `mouseleave`, `mousemove`, `mousedown`, `mouseup`, `keydown`, `keyup`, `focus`, `blur`, `touchstart`, `touchmove`, `touchend`

## API

### Types

```typescript
interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
}

interface ThrottleOptions<T extends (...args: any[]) => any = any> {
  /** The function to throttle */
  handler: T
  /** Wait time in milliseconds */
  wait?: number
  /** Invoke on leading edge */
  leading?: boolean
  /** Invoke on trailing edge */
  trailing?: boolean
}

type ThrottleBinding<T extends (...args: any[]) => any = any> =
  | T
  | ThrottleOptions<T>
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to throttle (required) |
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
  <div v-throttle:100ms.scroll="handleScroll" class="scroll-container">
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

### Mouse Move

```vue
<template>
  <div
    v-throttle:50ms.mousemove="handleMouseMove"
    class="tracking-area"
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

### API Call

```vue
<template>
  <button v-throttle="{
    handler: fetchData,
    wait: 2000,
    leading: true,
    trailing: false
  }">
    Fetch Data
  </button>
</template>

<script setup>
async function fetchData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  console.log('Data:', data)
}
</script>
```

## Composable API

For programmatic use, you can use the `useThrottle` composable:

```typescript
import { useThrottle, throttleFn } from 'directix'

// Composable usage
const { run, cancel } = useThrottle({
  handler: (event) => {
    console.log('Scroll position:', event.target.scrollTop)
  },
  wait: 100,
  leading: true,
  trailing: true
})

// Call the throttled function
run(event)

// Cancel pending execution
cancel()

// Simple function wrapper
const throttledUpdate = throttleFn(updateData, 1000)
throttledUpdate(data)
throttledUpdate.cancel()
```

### UseThrottleOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Function to throttle (required) |
| `wait` | `number \| Ref<number>` | `300` | Delay time in milliseconds |
| `leading` | `boolean \| Ref<boolean>` | `true` | Invoke on leading edge |
| `trailing` | `boolean \| Ref<boolean>` | `true` | Invoke on trailing edge |

### UseThrottleReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `run` | `(...args) => void` | Throttled function |
| `cancel` | `() => void` | Cancel pending execution |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useThrottle } from 'directix'

const { run: throttledScroll } = useThrottle({
  handler: (event) => {
    console.log('Scroll position:', event.target.scrollTop)
  },
  wait: 100
})
</script>

<template>
  <div @scroll="throttledScroll($event)" class="scroll-container">
    <!-- content -->
  </div>
</template>
```

## Code Generator

<DirectiveConfigurator name="throttle" description="Throttle event handlers to limit execution frequency" />
