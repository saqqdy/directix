# v-watermark

为元素添加水印遮罩层。支持文字和图片水印。

> **起始版本：** `1.3.0`

## 用法

### 基本文字水印

```vue
<template>
  <div v-watermark="'机密文件'" class="content">
    这是受水印保护的内容。
  </div>
</template>
```

### 带选项

```vue
<template>
  <div v-watermark="{
    content: '机密文件',
    font: '16px Arial',
    color: 'rgba(0, 0, 0, 0.1)',
    rotate: -20,
    gap: [100, 100]
  }" class="document">
    受保护的内容。
  </div>
</template>
```

## API

### 类型

```typescript
interface WatermarkOptions {
  content: string | string[]
  width?: number
  height?: number
  rotate?: number // 默认: -22
  color?: string // 默认: 'rgba(0, 0, 0, 0.15)'
  fontSize?: number // 默认: 14
  fontFamily?: string // 默认: 'sans-serif'
  fontWeight?: string // 默认: 'normal'
  font?: string // 字体属性简写
  gap?: [number, number] // 默认: [100, 100]
  offset?: [number, number]
  image?: string
  imageWidth?: number
  imageHeight?: number
  zIndex?: number
  movable?: boolean
  deleteable?: boolean
}
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `content` | `string \| string[]` | - | 水印文本（必填） |
| `width` | `number` | `300` | 水印宽度 |
| `height` | `number` | `200` | 水印高度 |
| `rotate` | `number` | `-22` | 旋转角度（度） |
| `color` | `string` | `'rgba(0, 0, 0, 0.15)'` | 文字颜色 |
| `fontSize` | `number` | `14` | 字体大小 |
| `fontFamily` | `string` | `'sans-serif'` | 字体名称 |
| `gap` | `[number, number]` | `[100, 100]` | 水印间距 |
| `image` | `string` | - | 图片水印 URL |
| `zIndex` | `number` | `9999` | 水印层 z-index |
| `movable` | `boolean` | `false` | 水印是否随滚动移动 |

## Composable 用法

你也可以使用 `useWatermark` composable：

```vue
<script setup>
import { useWatermark } from 'directix'

const { dataUrl, style, disable, enable } = useWatermark({
  content: '机密文件',
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
  /** 水印文本内容 */
  content: string | string[] | Ref<string | string[]>
  /** 水印画布宽度 */
  width?: number | Ref<number>
  /** 水印画布高度 */
  height?: number | Ref<number>
  /** 旋转角度（度） */
  rotate?: number | Ref<number>
  /** 字体大小（像素） */
  fontSize?: number | Ref<number>
  /** 字体名称 */
  fontFamily?: string | Ref<string>
  /** 字体粗细 */
  fontWeight?: string | number | Ref<string | number>
  /** 字体颜色 */
  color?: string | Ref<string>
  /** 水印间距 */
  gap?: [number, number] | number | Ref<[number, number] | number>
  /** 水印层 z-index */
  zIndex?: number | Ref<number>
  /** 是否禁用水印 */
  disabled?: boolean | Ref<boolean>
}

interface UseWatermarkReturn {
  /** 水印画布元素 */
  canvas: Ref<HTMLCanvasElement | null>
  /** 水印 data URL */
  dataUrl: Ref<string>
  /** 水印 CSS 样式对象 */
  style: Ref<Record<string, any>>
  /** 是否禁用水印 */
  disabled: Ref<boolean>
  /** 更新水印选项 */
  update: (options: Partial<UseWatermarkOptions>) => void
  /** 启用水印 */
  enable: () => void
  /** 禁用水印 */
  disable: () => void
}
```

## 示例

### 多行水印

```vue
<template>
  <div v-watermark="['公司名称', '员工：张三']" class="document">
    多行水印内容。
  </div>
</template>
```

### 图片水印

```vue
<template>
  <div v-watermark="{ image: '/logo.png', imageWidth: 100 }" class="content">
    图片水印遮罩。
  </div>
</template>
```
