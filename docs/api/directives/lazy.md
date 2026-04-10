# v-lazy

Lazy load images when they enter the viewport.

> **Since:** `1.1.0`

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

## Composable API

For programmatic use, you can use the `useLazy` composable:

```typescript
import { useLazy } from 'directix'

const { state, isLoading, isLoaded, hasError, bind, load, reset } = useLazy({
  src: 'https://example.com/image.jpg',
  placeholder: '/placeholder.jpg',
  error: '/error.jpg',
  preload: 0,
  attempt: 1,
  onLoad: (el) => console.log('Loaded'),
  onError: (el, err) => console.error('Error:', err)
})

// Bind to element
onMounted(() => bind(imageRef.value))

// Manually trigger load
load()

// Reset state
reset()
```

### UseLazyOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `src` | `string \| Ref<string>` | - | Image source URL |
| `placeholder` | `string` | - | Placeholder image URL |
| `error` | `string` | - | Error image URL |
| `preload` | `number` | `0` | Preload distance in pixels |
| `attempt` | `number` | `1` | Number of retry attempts |
| `onLoad` | `(el: HTMLElement) => void` | - | Callback on successful load |
| `onError` | `(el: HTMLElement, error: Error) => void` | - | Callback on load error |

### UseLazyReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `state` | `Readonly<Ref<LazyState>>` | Current loading state |
| `isLoading` | `Readonly<Ref<boolean>>` | Whether image is loading |
| `isLoaded` | `Readonly<Ref<boolean>>` | Whether image loaded successfully |
| `hasError` | `Readonly<Ref<boolean>>` | Whether image failed to load |
| `bind` | `(element: HTMLElement) => () => void` | Bind lazy loading to an element |
| `load` | `() => void` | Manually trigger load |
| `reset` | `() => void` | Reset state |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useLazy } from 'directix'

const imageRef = ref(null)
const { state, isLoading, bind } = useLazy({
  src: 'https://example.com/image.jpg',
  placeholder: '/placeholder.jpg'
})

onMounted(() => bind(imageRef.value))
</script>

<template>
  <img ref="imageRef" />
  <div v-if="isLoading">Loading...</div>
</template>
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
## Code Generator

<DirectiveConfigurator name="lazy" description="Lazy load images when they enter the viewport." />
