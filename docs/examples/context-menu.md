# Context Menu Example

Custom right-click context menus for Vue applications.

## Basic Context Menu

```vue
<template>
  <div
    v-context-menu="menuItems"
    class="context-area"
  >
    Right-click here to open context menu
  </div>
</template>

<script setup>
const menuItems = [
  { label: 'Copy', handler: () => console.log('Copy') },
  { label: 'Paste', handler: () => console.log('Paste') },
  { type: 'divider' },
  { label: 'Delete', handler: () => console.log('Delete'), danger: true },
]
</script>

<style scoped>
.context-area { padding: 60px; border: 2px dashed #ddd; border-radius: 8px; text-align: center; color: #888; user-select: none; }
.context-area:hover { border-color: #42b883; color: #42b883; }
</style>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
