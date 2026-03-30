# v-image-preview

创建模态图片预览，支持移动端优化的手势操作，包括双指缩放、双击和滑动。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <!-- 使用 data-preview 属性 -->
  <img
    v-image-preview
    src="thumbnail.jpg"
    data-preview="full-size.jpg"
    alt="点击预览"
  />
</template>
```

### 带选项

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
    alt="点击预览"
  />
</template>

<script setup>
function handleOpen() {
  console.log('预览已打开')
}

function handleClose() {
  console.log('预览已关闭')
}
</script>
```

### 非图片元素

```vue
<template>
  <div
    v-image-preview="{ src: 'image.jpg' }"
    class="preview-trigger"
  >
    点击预览图片
  </div>
</template>
```

## API

### 类型

```typescript
interface ImagePreviewOptions {
  /** 图片源 URL */
  src?: string
  /** 预览图片源 URL（高分辨率） */
  previewSrc?: string
  /** 无障碍替代文本 */
  alt?: string
  /** 是否禁用预览 */
  disabled?: boolean
  /** 点击外部关闭 @default true */
  closeOnClickOutside?: boolean
  /** ESC 键关闭 @default true */
  closeOnEsc?: boolean
  /** 显示关闭按钮 @default true */
  showCloseButton?: boolean
  /** 预览层 z-index @default 9999 */
  zIndex?: number
  /** 预览层自定义类名 */
  class?: string
  /** 启用双指缩放 @default true */
  enablePinchZoom?: boolean
  /** 启用双击缩放 @default true */
  enableDoubleTap?: boolean
  /** 启用上滑关闭 @default true */
  enableSwipeClose?: boolean
  /** 显示缩放指示器 @default true */
  showZoomIndicator?: boolean
  /** 最小缩放比例 @default 0.5 */
  minScale?: number
  /** 最大缩放比例 @default 5 */
  maxScale?: number
  /** 预览打开时的回调 */
  onOpen?: () => void
  /** 预览关闭时的回调 */
  onClose?: () => void
}

type ImagePreviewBinding = string | ImagePreviewOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `src` | `string` | - | 图片源 URL |
| `previewSrc` | `string` | - | 高分辨率图片 URL |
| `alt` | `string` | - | 无障碍替代文本 |
| `disabled` | `boolean` | `false` | 禁用指令 |
| `closeOnClickOutside` | `boolean` | `true` | 点击外部关闭 |
| `closeOnEsc` | `boolean` | `true` | ESC 键关闭 |
| `showCloseButton` | `boolean` | `true` | 显示关闭按钮 |
| `zIndex` | `number` | `9999` | 预览层 z-index |
| `class` | `string` | - | 预览层自定义类名 |
| `enablePinchZoom` | `boolean` | `true` | 启用双指缩放 |
| `enableDoubleTap` | `boolean` | `true` | 启用双击缩放 |
| `enableSwipeClose` | `boolean` | `true` | 启用上滑关闭 |
| `showZoomIndicator` | `boolean` | `true` | 显示缩放百分比指示器 |
| `minScale` | `number` | `0.5` | 最小缩放比例 |
| `maxScale` | `number` | `5` | 最大缩放比例 |
| `onOpen` | `Function` | - | 预览打开时的回调 |
| `onClose` | `Function` | - | 预览关闭时的回调 |

## 移动端手势

| 手势 | 操作 |
| ---- | ---- |
| 双指捏合 | 缩放（0.5x - 5x） |
| 双击 | 切换缩放（1x ↔ 2.5x） |
| 上滑 | 关闭预览（未缩放时） |
| 拖拽 | 缩放后平移 |
| 滚轮 | 桌面端缩放 |

## 示例

### 多图画廊

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
  { id: 1, thumbnail: '/thumb1.jpg', full: '/full1.jpg', title: '图片 1' },
  { id: 2, thumbnail: '/thumb2.jpg', full: '/full2.jpg', title: '图片 2' },
]
</script>
```

### 禁用状态切换

```vue
<template>
  <img
    v-image-preview="{ disabled: !previewEnabled }"
    src="image.jpg"
    data-preview="full.jpg"
  />
  <button @click="previewEnabled = !previewEnabled">
    {{ previewEnabled ? '禁用' : '启用' }}预览
  </button>
</template>

<script setup>
import { ref } from 'vue'

const previewEnabled = ref(true)
</script>
```
