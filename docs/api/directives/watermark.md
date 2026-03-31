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

## Composable API

For programmatic use, you can use the `useWatermark` composable:

```typescript
import { useWatermark, createWatermarkUrl } from 'directix'

const { canvas, dataUrl, style, disabled, update, enable, disable } = useWatermark({
  content: 'Confidential',
  width: 300,
  height: 200,
  rotate: -22,
  fontSize: 16,
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
  color: 'rgba(128, 128, 128, 0.15)',
  gap: [100, 100],
  zIndex: 9999,
  disabled: false
})

// Control watermark
enable()
disable()
update({ content: 'New Text' })

// Create watermark URL
const url = createWatermarkUrl('Draft', { fontSize: 20, color: 'rgba(255, 0, 0, 0.2)' })
```

### UseWatermarkOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `content` | `string \| string[] \| Ref` | - | Watermark text (required) |
| `width` | `number \| Ref<number>` | `300` | Watermark canvas width |
| `height` | `number \| Ref<number>` | `200` | Watermark canvas height |
| `rotate` | `number \| Ref<number>` | `-22` | Rotation angle in degrees |
| `fontSize` | `number \| Ref<number>` | `16` | Font size |
| `fontFamily` | `string \| Ref<string>` | `'sans-serif'` | Font family |
| `fontWeight` | `string \| number \| Ref` | `'normal'` | Font weight |
| `color` | `string \| Ref<string>` | `'rgba(128, 128, 128, 0.15)'` | Text color |
| `gap` | `[number, number] \| number \| Ref` | `[100, 100]` | Gap between watermarks |
| `zIndex` | `number \| Ref<number>` | `9999` | Z-index |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable watermark |

### UseWatermarkReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `canvas` | `Ref<HTMLCanvasElement \| null>` | Watermark canvas element |
| `dataUrl` | `Ref<string>` | Watermark data URL |
| `style` | `Ref<object>` | CSS style object for overlay |
| `disabled` | `Ref<boolean>` | Whether watermark is disabled |
| `update` | `(options: Partial<UseWatermarkOptions>) => void` | Update options |
| `enable` | `() => void` | Enable watermark |
| `disable` | `() => void` | Disable watermark |

### Example

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
