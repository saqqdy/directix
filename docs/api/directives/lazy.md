# v-lazy

Lazy load images when they enter the viewport.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <img v-lazy="imageUrl" />
  <img v-lazy="{ src: imageUrl, placeholder: 'placeholder.jpg' }" />
  <div v-lazy="backgroundImageUrl"></div>
</template>
```

### With Options

```vue
<template>
  <img v-lazy="{
    src: imageUrl,
    placeholder: 'placeholder.jpg',
    error: 'error.jpg',
    preload: 100,
    attempt: 3
  }" />
</template>
```

## API

### Types

```typescript
type LazyState = 'pending' | 'loading' | 'loaded' | 'error'

interface LazyOptions {
  /** Image source URL */
  src?: string
  /** Placeholder image URL */
  placeholder?: string
  /** Error image URL */
  error?: string
  /** Preload distance in pixels */
  preload?: number
  /** Callback on successful load */
  onLoad?: (el: HTMLElement) => void
  /** Callback on load error */
  onError?: (el: HTMLElement, error: Error) => void
  /** Number of retry attempts */
  attempt?: number
  /** Filter function to skip loading */
  filter?: (src: string) => boolean
  /** Custom IntersectionObserver */
  observer?: IntersectionObserver
  /** Disable lazy loading */
  disabled?: boolean
}

type LazyBinding = string | LazyOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `src` | `string` | - | Image source URL |
| `placeholder` | `string` | - | Placeholder image URL |
| `error` | `string` | - | Error image URL |
| `preload` | `number` | `0` | Preload distance in pixels |
| `attempt` | `number` | `1` | Number of retry attempts |
| `onLoad` | `Function` | - | Callback on successful load |
| `onError` | `Function` | - | Callback on load error |
| `filter` | `Function` | - | Filter function to skip loading |
| `observer` | `IntersectionObserver` | - | Custom IntersectionObserver |
| `disabled` | `boolean` | `false` | Disable lazy loading |

## Examples

### Image Gallery

```vue
<template>
  <div class="gallery">
    <img
      v-for="image in images"
      :key="image.id"
      v-lazy="{
        src: image.url,
        placeholder: '/placeholder.jpg'
      }"
    />
  </div>
</template>

<script setup>
const images = [
  { id: 1, url: '/images/photo1.jpg' },
  { id: 2, url: '/images/photo2.jpg' },
  // ...
]
</script>
```

### Background Images

```vue
<template>
  <div
    v-lazy="backgroundUrl"
    class="hero-bg"
  >
    Content over background
  </div>
</template>

<script setup>
const backgroundUrl = '/images/hero-bg.jpg'
</script>
```

### With Retry

```vue
<template>
  <img v-lazy="{
    src: unreliableImageUrl,
    attempt: 3,
    error: '/error.jpg'
  }" />
</template>
```
