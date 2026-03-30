# v-draggable

使元素可在容器或边界内拖拽。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <div v-draggable class="draggable-box">
    拖拽我
  </div>
</template>
```

### 轴向约束

```vue
<template>
  <!-- 仅水平 -->
  <div v-draggable="{ axis: 'x' }">仅 X 轴</div>

  <!-- 仅垂直 -->
  <div v-draggable="{ axis: 'y' }">仅 Y 轴</div>
</template>
```

### 约束在父容器内

```vue
<template>
  <div class="container">
    <div v-draggable="{ constrain: true }" class="box">
      我会保持在容器内
    </div>
  </div>
</template>
```

### 带拖拽手柄

```vue
<template>
  <div v-draggable="{ handle: '.drag-handle' }" class="panel">
    <div class="drag-handle">⋮⋮ 拖拽这里</div>
    <div class="content">内容区域</div>
  </div>
</template>
```

## API

### 类型

```typescript
type DraggableAxis = 'x' | 'y' | 'both'

interface DraggableOptions {
  /** 拖拽轴向 @default 'both' */
  axis?: DraggableAxis
  /** 约束在父元素内 @default false */
  constrain?: boolean
  /** 边界元素选择器或元素 */
  boundary?: string | HTMLElement | (() => HTMLElement | null)
  /** 拖拽手柄选择器 */
  handle?: string
  /** 是否禁用拖拽 @default false */
  disabled?: boolean
  /** 网格对齐 [x, y] */
  grid?: [number, number]
  /** 开始拖拽回调 */
  onStart?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
  /** 拖拽回调 */
  onDrag?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
  /** 结束拖拽回调 */
  onEnd?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
}

type DraggableBinding = boolean | DraggableOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `axis` | `'x' \| 'y' \| 'both'` | `'both'` | 拖拽轴向约束 |
| `constrain` | `boolean` | `false` | 约束在父元素内 |
| `boundary` | `string \| HTMLElement \| Function` | - | 自定义边界元素 |
| `handle` | `string` | - | 拖拽手柄选择器 |
| `disabled` | `boolean` | `false` | 禁用拖拽 |
| `grid` | `[number, number]` | - | 网格对齐 [x, y] |
| `onStart` | `Function` | - | 开始拖拽回调 |
| `onDrag` | `Function` | - | 拖拽中回调 |
| `onEnd` | `Function` | - | 结束拖拽回调 |

## 示例

### 网格对齐

```vue
<template>
  <div v-draggable="{ grid: [40, 40] }" class="grid-item">
    对齐到 40px 网格
  </div>
</template>
```

### 可拖拽模态框

```vue
<template>
  <div class="modal">
    <div v-draggable="{ handle: '.modal-header' }" class="modal-content">
      <div class="modal-header">
        <h3>可拖拽模态框</h3>
      </div>
      <div class="modal-body">
        内容区域
      </div>
    </div>
  </div>
</template>
```
