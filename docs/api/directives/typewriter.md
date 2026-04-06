# v-typewriter

Typewriter text animation.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <span v-typewriter="'Hello, World!'"></span>
</template>
```

### With Options

```vue
<template>
  <span v-typewriter="{
    text: 'Typing animation',
    speed: 100,
    cursor: '_',
    onComplete: () => console.log('Done!')
  }"></span>
</template>
```

### Loop Mode

```vue
<template>
  <span v-typewriter="{
    text: 'Loop animation',
    loop: true,
    deleteDelay: 1000
  }"></span>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `text` | `string` | `''` | Text to type |
| `speed` | `number` | `50` | Typing speed in ms per character |
| `cursor` | `string` | `'\|'` | Cursor character |
| `cursorBlink` | `boolean` | `true` | Blink cursor |
| `loop` | `boolean` | `false` | Loop animation |
| `deleteSpeed` | `number` | `30` | Delete speed (defaults to speed/2) |
| `deleteDelay` | `number` | `1500` | Delay before deleting in loop mode |
| `pauseDelay` | `number` | `500` | Delay at end before deleting |
| `onComplete` | `() => void` | - | Callback when typing complete |
| `onChar` | `(char: string, index: number) => void` | - | Callback on each character |

### Binding Types

```ts
type TypewriterBinding = string | TypewriterOptions
```

## Examples

### Multiple Lines

```vue
<template>
  <div>
    <p v-typewriter="{ text: 'First line', speed: 50 }"></p>
    <p v-typewriter="{ text: 'Second line', speed: 50, delay: 2000 }"></p>
  </div>
</template>
```

### Dynamic Text

```vue
<template>
  <span v-typewriter="{ text: message, speed: 80 }"></span>
  <button @click="changeMessage">Change Message</button>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello, World!')

function changeMessage() {
  message.value = 'New message!'
}
</script>
```

### With HTML

```vue
<template>
  <span v-typewriter="{
    text: 'Hello <strong>World</strong>!',
    html: true,
    speed: 50
  }"></span>
</template>
```

## Composable API

For programmatic use, you can use the `useTypewriter` composable:

```typescript
import { useTypewriter } from 'directix'

const { start, stop, pause, resume, isTyping, text } = useTypewriter({
  text: 'Hello World',
  speed: 50,
  loop: false
})

// Start typing
start()

// Stop and clear
stop()

// Pause
pause()

// Resume
resume()
```

### UseTypewriterReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `start` | `() => void` | Start typing |
| `stop` | `() => void` | Stop and clear |
| `pause` | `() => void` | Pause typing |
| `resume` | `() => void` | Resume typing |
| `isTyping` | `Ref<boolean>` | Whether currently typing |
| `text` | `Ref<string>` | Current displayed text |
