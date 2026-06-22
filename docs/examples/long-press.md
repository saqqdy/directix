# Long Press Example

Detect long press gestures on elements.

## Basic Long Press

```vue
<template>
  <button
    v-long-press="{ handler: handleLongPress, duration: 500 }"
    class="press-btn"
  >
    Press & Hold (500ms)
  </button>
  <p v-if="pressed" class="feedback">🎉 Long press detected!</p>
</template>

<script setup>
import { ref } from 'vue'

const pressed = ref(false)

function handleLongPress(event) {
  pressed.value = true
  setTimeout(() => { pressed.value = false }, 2000)
}
</script>

<style scoped>
.press-btn { padding: 12px 24px; border-radius: 8px; border: 2px solid #42b883; background: white; color: #42b883; font-size: 16px; cursor: pointer; user-select: none; }
.press-btn:active { background: #42b883; color: white; }
.feedback { margin-top: 12px; color: #42b883; font-weight: 600; }
</style>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
