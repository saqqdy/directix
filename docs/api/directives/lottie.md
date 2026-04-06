# v-lottie

Lottie animation player.

> **Since:** `1.5.0`

## Usage

### With URL

```vue
<template>
  <div v-lottie="'https://assets.example.com/animation.json'"></div>
</template>
```

### With Animation Data

```vue
<template>
  <div v-lottie="animationData"></div>
</template>

<script setup>
import animationData from './animation.json'
</script>
```

### With Options

```vue
<template>
  <div v-lottie="{
    animationData: animationData,
    autoplay: true,
    loop: true,
    speed: 1.5,
    onComplete: () => console.log('Done')
  }"></div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `animationData` | `object` | - | Lottie animation data object |
| `path` | `string` | - | URL to animation JSON |
| `autoplay` | `boolean` | `true` | Auto play on load |
| `loop` | `boolean \| number` | `true` | Loop animation |
| `speed` | `number` | `1` | Playback speed |
| `direction` | `1 \| -1` | `1` | Playback direction |
| `onComplete` | `() => void` | - | Callback when animation completes |
| `onLoopComplete` | `() => void` | - | Callback when loop completes |
| `onEnterFrame` | `(frame: number) => void` | - | Callback on each frame |

## Examples

### Controlled Animation

```vue
<template>
  <div v-lottie="{
    animationData: animationData,
    autoplay: false,
    loop: false
  }" ref="lottieRef">
  </div>
  <button @click="play">Play</button>
  <button @click="pause">Pause</button>
  <button @click="stop">Stop</button>
</template>
```

### Interactive Speed Control

```vue
<template>
  <div v-lottie="{ animationData: data, speed: speed }"></div>
  <input v-model.number="speed" type="range" min="0.5" max="3" step="0.1" />
</template>
```

## Composable API

For programmatic use, you can use the `useLottie` composable:

```typescript
import { useLottie } from 'directix'

const { play, pause, stop, setSpeed, setDirection, goToAndStop, goToAndPlay } = useLottie({
  animationData,
  autoplay: true,
  loop: true
})

// Control playback
play()
pause()
stop()

// Set speed (0.5x to 3x)
setSpeed(1.5)

// Set direction (1 = forward, -1 = backward)
setDirection(-1)

// Go to specific frame
goToAndStop(50)
goToAndPlay(50, true)
```

### UseLottieReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `play` | `() => void` | Play animation |
| `pause` | `() => void` | Pause animation |
| `stop` | `() => void` | Stop and reset animation |
| `setSpeed` | `(speed: number) => void` | Set playback speed |
| `setDirection` | `(direction: 1 \| -1) => void` | Set playback direction |
| `goToAndStop` | `(frame: number, isFrame?: boolean) => void` | Go to frame and stop |
| `goToAndPlay` | `(frame: number, isFrame?: boolean) => void` | Go to frame and play |
