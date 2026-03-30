# v-hotkey

Bind keyboard shortcuts to elements. Supports modifier keys and multiple hotkey formats.

> **Since:** `1.3.0`

## Usage

### Using Argument Syntax

```vue
<template>
  <!-- Ctrl+S to save -->
  <input v-hotkey:ctrl.s="save" placeholder="Press Ctrl+S to save" />

  <!-- Escape to cancel -->
  <div v-hotkey:escape="cancel">Press Escape to cancel</div>

  <!-- Multiple modifiers -->
  <div v-hotkey:ctrl.shift.s="saveAs">Ctrl+Shift+S</div>
</template>
```

### Using Object Syntax

```vue
<template>
  <div
    v-hotkey="{
      'ctrl+s': save,
      'escape': cancel,
      'ctrl+z': undo
    }"
    tabindex="0"
  >
    Press Ctrl+S to save, Escape to cancel
  </div>
</template>
```

### Using Array Syntax

```vue
<template>
  <div v-hotkey="[
    { key: 's', modifiers: ['ctrl'], handler: save },
    { key: 'escape', handler: cancel }
  ]">
    Multiple hotkeys
  </div>
</template>
```

## API

### Types

```typescript
type HotkeyHandler = (event: KeyboardEvent) => void

type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'

interface HotkeyDefinition {
  key: string
  modifiers?: ModifierKey[]
  handler: HotkeyHandler
  prevent?: boolean // default: true
  stop?: boolean // default: true
  disabled?: boolean // default: false
}

type HotkeyBinding =
  | HotkeyHandler
  | HotkeyDefinition
  | HotkeyDefinition[]
  | Record<string, HotkeyHandler | HotkeyDefinition>
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `key` | `string` | - | Key to listen for (e.g., 's', 'enter', 'escape') |
| `modifiers` | `ModifierKey[]` | `[]` | Required modifier keys |
| `handler` | `(event: KeyboardEvent) => void` | - | Handler function (required) |
| `prevent` | `boolean` | `true` | Prevent default behavior |
| `stop` | `boolean` | `true` | Stop event propagation |
| `disabled` | `boolean` | `false` | Disable this hotkey |

### Key Aliases

| Alias | Key |
| ----- | --- |
| `esc` | `escape` |
| `space` | ` ` (space) |
| `up` | `arrowup` |
| `down` | `arrowdown` |
| `left` | `arrowleft` |
| `right` | `arrowright` |
| `enter` | `enter` |
| `tab` | `tab` |
| `delete` | `delete` |
| `backspace` | `backspace` |
| `f1`-`f12` | Function keys |

## Examples

### Editor Shortcuts

```vue
<template>
  <div
    v-hotkey="{
      'ctrl+s': save,
      'ctrl+z': undo,
      'ctrl+y': redo,
      'ctrl+b': bold,
      'ctrl+i': italic
    }"
    class="editor"
    tabindex="0"
  >
    <textarea v-model="content"></textarea>
  </div>
</template>
```

### Dynamic Hotkeys

```vue
<template>
  <div v-hotkey="hotkeys" tabindex="0">
    Hotkeys: {{ enabled ? 'enabled' : 'disabled' }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const enabled = ref(true)

const hotkeys = computed(() => ({
  'ctrl+e': () => enabled.value = !enabled.value,
  'ctrl+d': enabled.value ? debug : null
}))
</script>
```
