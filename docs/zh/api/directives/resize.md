# v-resize

使用 ResizeObserver 观察元素大小变化。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-resize="handleResize">调整我的大小</div>
</template>

<script setup>
function handleResize(entry) {
  console.log('新尺寸:', entry.contentRect.width, entry.contentRect.height)
}
</script>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 大小变化事件处理程序（必填） |
| `box` | `'content-box' \| 'border-box'` | `'content-box'` | 观察的盒模型 |
| `debounce` | `number` | `0` | 防抖时间（毫秒） |
