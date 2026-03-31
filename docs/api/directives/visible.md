# v-visible

Toggle element visibility with animation support.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-visible="showElement">Show/Hide</div>
</template>

<script setup>
import { ref } from 'vue'

const showElement = ref(true)
</script>
```

### With Options

```vue
<template>
  <div v-visible="{
    handler: onVisibleChange,
    useHidden: true,
    initial: true
  }">
    Uses visibility: hidden
  </div>
</template>

<script setup>
function onVisibleChange(isVisible) {
  console.log('Visible:', isVisible)
}
</script>
```

## API

### Types

```typescript
type VisibleHandler = (isVisible: boolean) => void

interface VisibleOptions {
  /** Callback when visibility changes */
  handler?: VisibleHandler
  /** Disable the directive */
  disabled?: boolean
  /** Use visibility: hidden instead of display: none */
  useHidden?: boolean
  /** Initial visibility */
  initial?: boolean
}

type VisibleBinding = boolean | VisibleOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when visibility changes |
| `disabled` | `boolean` | `false` | Disable the directive |
| `useHidden` | `boolean` | `false` | Use `visibility: hidden` instead of `display: none` |
| `initial` | `boolean` | `true` | Initial visibility state |

## Examples

### Toggle with Animation

```vue
<template>
  <button @click="show = !show">Toggle</button>
  <div v-visible="show" class="fade">
    This fades in and out
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<style>
.fade {
  transition: opacity 0.3s ease;
}
.fade.v-visible {
  opacity: 1;
}
.fade.v-hidden {
  opacity: 0;
}
</style>
```

### Preserve Layout

```vue
<template>
  <div v-visible="{ useHidden: true, initial: false }">
    This element is hidden but still takes up space
  </div>
</template>
```

### Track Visibility State

```vue
<template>
  <div v-visible="{
    handler: trackVisibility,
    initial: showElement
  }">
    Content
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showElement = ref(true)

function trackVisibility(isVisible) {
  console.log('Element is now:', isVisible ? 'visible' : 'hidden')
}
</script>
```

## Composable API

For programmatic use, you can use the `useVisible` composable:

```typescript
import { useVisible } from 'directix'

const { visible, show, hide, toggle, bind } = useVisible({
  initial: true,
  useHidden: false,
  onChange: (isVisible) => console.log('Visible:', isVisible)
})

// Control visibility
show()
hide()
toggle()

// Bind to element
onMounted(() => bind(modalRef.value))
```

### UseVisibleOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `initial` | `boolean \| Ref<boolean>` | `true` | Initial visibility |
| `useHidden` | `boolean` | `false` | Use `visibility: hidden` instead of `display: none` |
| `onChange` | `(isVisible: boolean) => void` | - | Callback when visibility changes |

### UseVisibleReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `visible` | `Ref<boolean>` | Current visibility state |
| `show` | `() => void` | Show the element |
| `hide` | `() => void` | Hide the element |
| `toggle` | `() => void` | Toggle visibility |
| `bind` | `(element: HTMLElement) => () => void` | Bind visibility control to an element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useVisible } from 'directix'

const modal = ref(null)
const { visible, show, hide, toggle, bind } = useVisible({
  initial: false,
  onChange: (v) => console.log('Visible:', v)
})

onMounted(() => bind(modal.value))
</script>

<template>
  <button @click="toggle">Toggle Modal</button>
  <div ref="modal" v-show="visible">Modal Content</div>
</template>
```
