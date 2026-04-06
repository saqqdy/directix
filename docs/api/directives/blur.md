# v-blur

Add background blur overlay effect to elements.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-blur="isBlurred">Background content</div>
</template>

<script setup>
import { ref } from 'vue'

const isBlurred = ref(false)
</script>
```

### With Blur Radius

```vue
<template>
  <div v-blur="15">15px blur radius</div>
</template>
```

### With Options

```vue
<template>
  <div v-blur="{
    visible: isBlurred,
    radius: 20,
    overlayColor: 'rgba(255, 255, 255, 0.3)',
    lockScroll: true
  }">
    Content
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `radius` | `number` | `10` | Blur radius in pixels |
| `visible` | `boolean` | `true` | Whether to show blur effect |
| `duration` | `number` | `300` | Transition duration in milliseconds |
| `overlayColor` | `string` | `'rgba(0, 0, 0, 0.5)'` | Overlay color |
| `zIndex` | `number` | `999` | Overlay z-index |
| `lockScroll` | `boolean` | `true` | Whether to lock scroll when active |
| `class` | `string` | - | Custom class name |
| `onShow` | `() => void` | - | Callback when shown |
| `onHide` | `() => void` | - | Callback when hidden |

### Binding Types

```ts
type BlurBinding = boolean | number | BlurOptions
```

## Composable

You can also use the `useBlur` composable:

```vue
<script setup>
import { ref } from 'vue'
import { useBlur } from 'directix'

const containerRef = ref(null)
const { isVisible, show, hide, toggle, bind } = useBlur({
  radius: 15,
  onShow: () => console.log('Blur shown'),
  onHide: () => console.log('Blur hidden')
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">
    <button @click="toggle">Toggle Blur</button>
  </div>
</template>
```

### Composable API

| Property/Method | Type | Description |
| --------------- | ---- | ----------- |
| `isVisible` | `Ref<boolean>` | Current visibility state |
| `show()` | `() => void` | Show blur effect |
| `hide()` | `() => void` | Hide blur effect |
| `toggle()` | `() => void` | Toggle visibility |
| `bind(el)` | `(element: HTMLElement) => () => void` | Bind to element, returns unbind function |
