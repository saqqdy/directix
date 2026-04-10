# v-context-menu

Add right-click context menu to elements.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-context-menu="menuItems">Right click here</div>
</template>

<script setup>
const menuItems = [
  { label: 'Copy', handler: () => console.log('Copy') },
  { label: 'Paste', handler: () => console.log('Paste') },
  { divider: true, label: '' },
  { label: 'Delete', handler: () => console.log('Delete') }
]
</script>
```

### With Options

```vue
<template>
  <div v-context-menu="{ items: menuItems, width: 200 }">
    Custom width menu
  </div>
</template>
```

## API

### Menu Item

```ts
interface ContextMenuItem {
  /** Menu item label */
  label: string
  /** Click handler */
  handler?: () => void
  /** Whether this is a divider */
  divider?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Custom icon */
  icon?: string
  /** Custom class */
  class?: string
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `items` | `ContextMenuItem[]` | `[]` | Menu items |
| `width` | `number` | `150` | Menu width in pixels |
| `disabled` | `boolean` | `false` | Disable context menu |
| `zIndex` | `number` | `9999` | Menu z-index |
| `class` | `string` | - | Custom menu class |

## Examples

### With Icons

```vue
<template>
  <div v-context-menu="menuItems">Right click for menu</div>
</template>

<script setup>
const menuItems = [
  { label: 'Copy', icon: '📋', handler: () => copy() },
  { label: 'Paste', icon: '📝', handler: () => paste() },
  { divider: true, label: '' },
  { label: 'Delete', icon: '🗑️', handler: () => deleteItem(), disabled: true }
]
</script>
```

### Dynamic Menu

```vue
<template>
  <div v-context-menu="{ items: computedItems }">
    Right click for dynamic menu
  </div>
</template>

<script setup>
import { computed } from 'vue'

const isAdmin = ref(false)

const computedItems = computed(() => [
  { label: 'View', handler: () => view() },
  isAdmin.value ? { label: 'Edit', handler: () => edit() } : null,
  { label: 'Delete', handler: () => remove(), disabled: !isAdmin.value }
].filter(Boolean))
</script>
```

## Composable API

For programmatic use, you can use the `useContextMenu` composable:

```typescript
import { useContextMenu } from 'directix'

const { show, hide, setItems } = useContextMenu({
  items: menuItems,
  width: 200
})

// Show menu at position
show({ x: 100, y: 100 })

// Hide menu
hide()

// Update menu items
setItems(newItems)
```

### UseContextMenuReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `show` | `(position: { x: number, y: number }) => void` | Show menu at position |
| `hide` | `() => void` | Hide menu |
| `setItems` | `(items: ContextMenuItem[]) => void` | Update menu items |
## Code Generator

<DirectiveConfigurator name="context-menu" description="Add right-click context menu to elements." />
