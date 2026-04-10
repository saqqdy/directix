# v-fade

Add fade in/out transition effect to elements.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-fade="isVisible">Fade content</div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>
```

### Fade In Only

```vue
<template>
  <div v-fade="'in'">Fade in on mount</div>
</template>
```

### With Options

```vue
<template>
  <div v-fade="{
    visible: isVisible,
    duration: 500,
    easing: 'ease-in-out',
    onComplete: () => console.log('Fade complete')
  }">
    Content
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `visible` | `boolean` | `true` | Whether element is visible |
| `duration` | `number` | `300` | Transition duration in milliseconds |
| `easing` | `string` | `'ease'` | CSS transition timing function |
| `minOpacity` | `number` | `0` | Minimum opacity (fade out target) |
| `maxOpacity` | `number` | `1` | Maximum opacity (fade in target) |
| `onComplete` | `() => void` | - | Callback when transition completes |

### Binding Types

```ts
type FadeDirection = 'in' | 'out' | 'toggle'
type FadeBinding = boolean | FadeDirection | FadeOptions
```

## Examples

### Toggle Visibility

```vue
<template>
  <button @click="show = !show">Toggle</button>
  <div v-fade="show">Fade in/out content</div>
</template>
```

### Staggered Fade

```vue
<template>
  <div v-for="(item, i) in items" :key="i" v-fade="{ duration: 300, delay: i * 100 }">
    {{ item }}
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `useFade` composable:

```typescript
import { useFade } from 'directix'

const { fadeIn, fadeOut, toggle, isVisible } = useFade({
  duration: 300,
  easing: 'ease'
})

// Fade in
fadeIn()

// Fade out
fadeOut()

// Toggle
toggle()
```

### UseFadeReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `fadeIn` | `() => void` | Fade element in |
| `fadeOut` | `() => void` | Fade element out |
| `toggle` | `() => void` | Toggle fade state |
| `isVisible` | `Ref<boolean>` | Current visibility state |
## Code Generator

<DirectiveConfigurator name="fade" description="Add fade in/out transition effect to elements." />
