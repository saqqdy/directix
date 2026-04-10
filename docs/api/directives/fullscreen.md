# v-fullscreen

Toggle fullscreen mode for elements.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-fullscreen>
    Content to show in fullscreen
    <button @click="toggleFullscreen">Toggle</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toggleFullscreen = () => {
  // Access the element's toggle method
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.querySelector('[data-fullscreen]').requestFullscreen()
}
</script>
```

### With Options

```vue
<template>
  <div v-fullscreen="{ fullscreenClass: 'my-fullscreen' }">
    Custom fullscreen class
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `fullscreenClass` | `string` | `'v-fullscreen'` | CSS class when fullscreen |
| `zIndex` | `number` | `9999` | Z-index when fullscreen |
| `onEnter` | `() => void` | - | Callback when entering fullscreen |
| `onExit` | `() => void` | - | Callback when exiting fullscreen |
| `onChange` | `(isFullscreen: boolean) => void` | - | Callback on fullscreen state change |

## Examples

### Video Player

```vue
<template>
  <div v-fullscreen="{ onEnter: onEnterFullscreen, onExit: onExitFullscreen }">
    <video src="video.mp4" controls></video>
    <button @click="toggleFullscreen">Fullscreen</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const onEnterFullscreen = () => {
  console.log('Entered fullscreen')
}

const onExitFullscreen = () => {
  console.log('Exited fullscreen')
}

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
</script>
```

### Image Gallery

```vue
<template>
  <div v-fullscreen class="gallery">
    <img v-for="img in images" :key="img.id" :src="img.url" />
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `useFullscreen` composable:

```typescript
import { useFullscreen } from 'directix'

const { isFullscreen, enter, exit, toggle } = useFullscreen({
  onEnter: () => console.log('Entered fullscreen'),
  onExit: () => console.log('Exited fullscreen')
})

// Enter fullscreen
enter()

// Exit fullscreen
exit()

// Toggle fullscreen
toggle()
```

### UseFullscreenReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isFullscreen` | `Ref<boolean>` | Whether currently in fullscreen |
| `enter` | `() => Promise<void>` | Enter fullscreen mode |
| `exit` | `() => Promise<void>` | Exit fullscreen mode |
| `toggle` | `() => Promise<void>` | Toggle fullscreen mode |
## Code Generator

<DirectiveConfigurator name="fullscreen" description="Toggle fullscreen mode for elements." />
