# v-watermark

Add watermark overlay to elements. Supports text and image watermarks.

> **Since:** `1.3.0`

## Usage

### Basic Text Watermark

```vue
<template>
  <div v-watermark="'Confidential'" class="content">
    This content is watermarked.
  </div>
</template>
```

### With Options

```vue
<template>
  <div v-watermark="{
    content: 'Confidential',
    font: '16px Arial',
    color: 'rgba(0, 0, 0, 0.1)',
    rotate: -20,
    gap: [100, 100]
  }" class="document">
    Protected content here.
  </div>
</template>
```

## API

### Types

```typescript
interface WatermarkOptions {
  content: string | string[]
  width?: number
  height?: number
  rotate?: number // default: -22
  color?: string // default: 'rgba(0, 0, 0, 0.15)'
  fontSize?: number // default: 14
  fontFamily?: string // default: 'sans-serif'
  fontWeight?: string // default: 'normal'
  font?: string // shorthand for font properties
  gap?: [number, number] // default: [100, 100]
  offset?: [number, number]
  image?: string
  imageWidth?: number
  imageHeight?: number
  zIndex?: number
  movable?: boolean
  deleteable?: boolean
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `content` | `string \| string[]` | - | Watermark text (required) |
| `width` | `number` | `300` | Watermark width |
| `height` | `number` | `200` | Watermark height |
| `rotate` | `number` | `-22` | Rotation angle in degrees |
| `color` | `string` | `'rgba(0, 0, 0, 0.15)'` | Text color |
| `fontSize` | `number` | `14` | Font size |
| `fontFamily` | `string` | `'sans-serif'` | Font family |
| `gap` | `[number, number]` | `[100, 100]` | Gap between watermarks |
| `image` | `string` | - | Image URL for image watermark |
| `zIndex` | `number` | `9999` | Z-index of watermark layer |
| `movable` | `boolean` | `false` | Make watermark move with scroll |

## Composable Usage

You can also use the `useWatermark` composable:

```vue
<script setup>
import { useWatermark } from 'directix'

const { dataUrl, style, disable, enable } = useWatermark({
  content: 'Confidential',
  fontSize: 20,
  color: 'rgba(255, 0, 0, 0.2)'
})
</script>

<template>
  <div class="container">
    <div :style="style"></div>
    <slot></slot>
  </div>
</template>
```

### API

```typescript
interface UseWatermarkOptions {
  /** Watermark text content */
  content: string | string[] | Ref<string | string[]>
  /** Width of watermark canvas */
  width?: number | Ref<number>
  /** Height of watermark canvas */
  height?: number | Ref<number>
  /** Rotation angle in degrees */
  rotate?: number | Ref<number>
  /** Font size in pixels */
  fontSize?: number | Ref<number>
  /** Font family */
  fontFamily?: string | Ref<string>
  /** Font weight */
  fontWeight?: string | number | Ref<string | number>
  /** Font color */
  color?: string | Ref<string>
  /** Gap between watermarks */
  gap?: [number, number] | number | Ref<[number, number] | number>
  /** Z-index of watermark layer */
  zIndex?: number | Ref<number>
  /** Whether to disable watermark */
  disabled?: boolean | Ref<boolean>
}

interface UseWatermarkReturn {
  /** Watermark canvas element */
  canvas: Ref<HTMLCanvasElement | null>
  /** Watermark data URL */
  dataUrl: Ref<string>
  /** Watermark CSS style object */
  style: Ref<Record<string, any>>
  /** Whether watermark is disabled */
  disabled: Ref<boolean>
  /** Update watermark options */
  update: (options: Partial<UseWatermarkOptions>) => void
  /** Enable watermark */
  enable: () => void
  /** Disable watermark */
  disable: () => void
}
```

## Examples

### Multi-line Watermark

```vue
<template>
  <div v-watermark="['Company Name', 'Employee: John']" class="document">
    Multi-line watermark content.
  </div>
</template>
```

### Image Watermark

```vue
<template>
  <div v-watermark="{ image: '/logo.png', imageWidth: 100 }" class="content">
    Image watermark overlay.
  </div>
</template>
```
