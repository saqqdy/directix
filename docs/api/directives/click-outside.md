# v-click-outside

Detect clicks outside an element. Perfect for closing dropdowns, modals, and popovers.

> **Since:** `1.0.0`

## Usage

### Basic

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

function closeDropdown(event) {
  show.value = false
}
</script>
```

### With Options

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    exclude: ['.trigger', ignoreButton],
    events: ['click', 'touchstart']
  }">
    <button class="trigger">Toggle</button>
    <button :ref="ignoreButton">This is ignored</button>
  </div>
</template>
```

## API

### Types

```typescript
type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void

interface ClickOutsideOptions {
  /** Callback when clicking outside (required) */
  handler: ClickOutsideHandler
  /** Excluded element selectors or element references */
  exclude?: (string | HTMLElement | (() => HTMLElement | null))[]
  /** Whether to use capture mode */
  capture?: boolean
  /** Event types to listen for */
  events?: ('click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend')[]
  /** Whether to disable */
  disabled?: boolean
  /** Stop propagation */
  stop?: boolean
  /** Prevent default behavior */
  prevent?: boolean
}

type ClickOutsideBinding = ClickOutsideHandler | ClickOutsideOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when click outside detected (required) |
| `exclude` | `(string \| HTMLElement \| Function)[]` | `[]` | Elements to exclude from detection |
| `capture` | `boolean` | `true` | Use capture mode |
| `events` | `string[]` | `['click']` | Events to listen for |
| `disabled` | `boolean` | `false` | Disable the directive |
| `stop` | `boolean` | `false` | Stop event propagation |
| `prevent` | `boolean` | `false` | Prevent default behavior |

## Examples

### Dropdown Menu

```vue
<template>
  <div v-click-outside="closeMenu" class="dropdown">
    <button @click="isOpen = !isOpen">
      {{ isOpen ? 'Close' : 'Open' }} Menu
    </button>
    <ul v-if="isOpen" class="menu">
      <li @click="selectItem('item1')">Item 1</li>
      <li @click="selectItem('item2')">Item 2</li>
      <li @click="selectItem('item3')">Item 3</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function closeMenu() {
  isOpen.value = false
}

function selectItem(item) {
  console.log('Selected:', item)
  closeMenu()
}
</script>
```

### Modal Dialog

```vue
<template>
  <div v-if="showModal" class="modal-overlay">
    <div v-click-outside="closeModal" class="modal">
      <h2>Modal Title</h2>
      <p>Modal content here...</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)

function closeModal() {
  showModal.value = false
}
</script>
```

### Exclude Elements

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    exclude: ['.toggle-btn', triggerRef]
  }">
    <button class="toggle-btn" @click="toggle">Toggle</button>
    <div v-if="isOpen" class="dropdown-content">
      Content
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const triggerRef = ref(null)

function toggle() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}
</script>
```
