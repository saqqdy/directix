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
    <button class="trigger">Toggle</button>
    <div class="ignore">This area is ignored</div>
  </div>
</template>
```

## API

### Types

```typescript
interface ClickOutsideOptions {
  /** Callback when click outside detected */
  handler: (event: MouseEvent) => void
  /** CSS selectors to include in detection */
  include?: string[]
  /** CSS selectors to exclude from detection */
  exclude?: string[]
}

type ClickOutsideBinding = ClickOutsideOptions['handler'] | ClickOutsideOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when click outside detected |
| `include` | `string[]` | `[]` | CSS selectors to include |
| `exclude` | `string[]` | `[]` | CSS selectors to exclude |

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
