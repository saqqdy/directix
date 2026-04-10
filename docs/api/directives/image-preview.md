# v-image-preview

Create a modal image preview with mobile-optimized gestures including pinch zoom, double tap, and swipe.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <!-- Simple usage with data-preview attribute -->
  <img
    v-image-preview
    src="thumbnail.jpg"
    data-preview="full-size.jpg"
    alt="Click to preview"
  />
</template>
```

### With Options

```vue
<template>
  <img
    v-image-preview="{
      previewSrc: 'full-size.jpg',
      enablePinchZoom: true,
      enableDoubleTap: true,
      enableSwipeClose: true,
      onOpen: handleOpen,
      onClose: handleClose
    }"
    src="thumbnail.jpg"
    alt="Click to preview"
  />
</template>

<script setup>
function handleOpen() {
  console.log('Preview opened')
}

function handleClose() {
  console.log('Preview closed')
}
</script>
```

### Non-Image Element

```vue
<template>
  <div
    v-image-preview="{ src: 'image.jpg' }"
    class="preview-trigger"
  >
    Click to preview image
  </div>
</template>
```

## API

### Types

```typescript
interface ImagePreviewOptions {
  /** Image source URL */
  src?: string
  /** Preview image source URL (higher resolution) */
  previewSrc?: string
  /** Alt text for accessibility */
  alt?: string
  /** Whether preview is disabled */
  disabled?: boolean
  /** Close on click outside @default true */
  closeOnClickOutside?: boolean
  /** Close on escape key @default true */
  closeOnEsc?: boolean
  /** Show close button @default true */
  showCloseButton?: boolean
  /** Z-index of the preview overlay @default 9999 */
  zIndex?: number
  /** Custom class for the preview overlay */
  class?: string
  /** Enable pinch zoom on mobile @default true */
  enablePinchZoom?: boolean
  /** Enable double tap to zoom @default true */
  enableDoubleTap?: boolean
  /** Enable swipe up to close @default true */
  enableSwipeClose?: boolean
  /** Show zoom indicator @default true */
  showZoomIndicator?: boolean
  /** Minimum zoom scale @default 0.5 */
  minScale?: number
  /** Maximum zoom scale @default 5 */
  maxScale?: number
  /** Callback when preview opens */
  onOpen?: () => void
  /** Callback when preview closes */
  onClose?: () => void
}

type ImagePreviewBinding = string | ImagePreviewOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `src` | `string` | - | Image source URL |
| `previewSrc` | `string` | - | High resolution image URL |
| `alt` | `string` | - | Alt text for accessibility |
| `disabled` | `boolean` | `false` | Disable the directive |
| `closeOnClickOutside` | `boolean` | `true` | Close on click outside |
| `closeOnEsc` | `boolean` | `true` | Close on escape key |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `zIndex` | `number` | `9999` | Z-index of overlay |
| `class` | `string` | - | Custom class for overlay |
| `enablePinchZoom` | `boolean` | `true` | Enable pinch zoom on mobile |
| `enableDoubleTap` | `boolean` | `true` | Enable double tap to zoom |
| `enableSwipeClose` | `boolean` | `true` | Enable swipe up to close |
| `showZoomIndicator` | `boolean` | `true` | Show zoom percentage indicator |
| `minScale` | `number` | `0.5` | Minimum zoom scale |
| `maxScale` | `number` | `5` | Maximum zoom scale |
| `onOpen` | `Function` | - | Callback when preview opens |
| `onClose` | `Function` | - | Callback when preview closes |

## Mobile Gestures

| Gesture | Action |
| ------- | ------ |
| Pinch | Zoom in/out (0.5x - 5x) |
| Double tap | Toggle zoom (1x ↔ 2.5x) |
| Swipe up | Close preview (when not zoomed) |
| Drag | Pan when zoomed |
| Scroll wheel | Zoom on desktop |

## Examples

### Gallery with Multiple Images

```vue
<template>
  <div class="gallery">
    <img
      v-for="image in images"
      :key="image.id"
      v-image-preview
      :src="image.thumbnail"
      :data-preview="image.full"
      :alt="image.title"
      class="gallery-item"
    />
  </div>
</template>

<script setup>
const images = [
  { id: 1, thumbnail: '/thumb1.jpg', full: '/full1.jpg', title: 'Image 1' },
  { id: 2, thumbnail: '/thumb2.jpg', full: '/full2.jpg', title: 'Image 2' },
]
</script>
```

### Disabled State Toggle

```vue
<template>
  <img
    v-image-preview="{ disabled: !previewEnabled }"
    src="image.jpg"
    data-preview="full.jpg"
  />
  <button @click="previewEnabled = !previewEnabled">
    {{ previewEnabled ? 'Disable' : 'Enable' }} Preview
  </button>
</template>

<script setup>
import { ref } from 'vue'

const previewEnabled = ref(true)
</script>
```

### Custom Configuration

```vue
<template>
  <img
    v-image-preview="{
      previewSrc: 'high-res.jpg',
      enablePinchZoom: true,
      enableDoubleTap: true,
      enableSwipeClose: false,
      minScale: 0.3,
      maxScale: 10,
      showZoomIndicator: true,
      onOpen: () => trackEvent('preview_opened'),
      onClose: () => trackEvent('preview_closed')
    }"
    src="thumbnail.jpg"
  />
</template>
```

## Composable API

For programmatic use, you can use the `useImagePreview` composable:

```typescript
import { useImagePreview } from 'directix'

const { isOpen, currentSrc, open, close, bind } = useImagePreview({
  src: 'default-image.jpg',
  closeOnClickOutside: true,
  closeOnEsc: true,
  showCloseButton: true,
  onOpen: () => console.log('Preview opened'),
  onClose: () => console.log('Preview closed')
})
```

### UseImagePreviewOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `src` | `string \| Ref<string>` | - | Initial image URL to preview |
| `closeOnClickOutside` | `boolean` | `true` | Close on click outside |
| `closeOnEsc` | `boolean` | `true` | Close on escape key |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `onOpen` | `() => void` | - | Callback when preview opens |
| `onClose` | `() => void` | - | Callback when preview closes |

### UseImagePreviewReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isOpen` | `Readonly<Ref<boolean>>` | Whether the preview is open |
| `currentSrc` | `Readonly<Ref<string>>` | Current image URL |
| `open` | `(src?: string) => void` | Open preview with an image |
| `close` | `() => void` | Close preview |
| `bind` | `(element: HTMLImageElement) => () => void` | Bind click-to-preview to an element |

### Example

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useImagePreview } from 'directix'

const imageRef = ref(null)

const { isOpen, open, close, bind } = useImagePreview({
  onOpen: () => console.log('Preview opened')
})

onMounted(() => {
  if (imageRef.value) {
    bind(imageRef.value)
  }
})

function openCustomImage() {
  open('https://example.com/high-res.jpg')
}
</script>

<template>
  <div>
    <img ref="imageRef" src="thumbnail.jpg" alt="Click to preview" />
    <button @click="openCustomImage">Open Custom Image</button>
    <p v-if="isOpen">Preview is open</p>
  </div>
</template>
```
## Code Generator

<DirectiveConfigurator name="image-preview" description="Create a modal image preview with mobile-optimized gestures including pinch zoom, double tap, and swipe." />
