# v-parallax

Parallax scrolling effect.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-parallax>Parallax content</div>
</template>
```

### With Speed Factor

```vue
<template>
  <div v-parallax="0.3">Slower parallax</div>
</template>
```

### With Options

```vue
<template>
  <div v-parallax="{
    speed: 0.5,
    reverse: true,
    mobileBreakpoint: 768
  }">
    Reverse parallax, disabled on mobile
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `speed` | `number` | `0.5` | Parallax speed factor (0-1) |
| `reverse` | `boolean` | `false` | Reverse parallax direction |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Scroll direction |
| `mobileBreakpoint` | `number` | `768` | Disable below this width (0 = always enabled) |
| `disabled` | `boolean` | `false` | Disable parallax |

### Binding Types

```ts
type ParallaxBinding = number | ParallaxOptions
```

## Examples

### Hero Section

```vue
<template>
  <div class="hero" v-parallax="0.3">
    <h1>Welcome</h1>
    <p>Scroll down to see the effect</p>
  </div>
</template>

<style>
.hero {
  height: 100vh;
  background-image: url('hero-bg.jpg');
  background-size: cover;
}
</style>
```

### Multiple Layers

```vue
<template>
  <div class="parallax-container">
    <div v-parallax="0.1" class="layer layer-1">Background</div>
    <div v-parallax="0.3" class="layer layer-2">Middle</div>
    <div v-parallax="0.5" class="layer layer-3">Foreground</div>
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `useParallax` composable:

```typescript
import { useParallax } from 'directix'

const { offset, progress, enabled, bind } = useParallax({
  speed: 0.5,
  reverse: false
})

// offset - current parallax offset in pixels
// progress - scroll progress (0-1)
// enabled - whether parallax is active
```

### UseParallaxReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `offset` | `Ref<number>` | Current parallax offset |
| `progress` | `Ref<number>` | Scroll progress (0-1) |
| `enabled` | `Ref<boolean>` | Whether parallax is active |
| `bind` | `(element: HTMLElement) => () => void` | Bind to element |
## Code Generator

<DirectiveConfigurator name="parallax" description="Parallax scrolling effect." />
