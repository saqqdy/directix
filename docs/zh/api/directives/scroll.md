# v-scroll

跟踪滚动位置和方向。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-scroll="handleScroll" class="scroll-container">
    滚动内容
  </div>
</template>

<script setup>
function handleScroll(event, info) {
  console.log('滚动位置:', info.scrollTop)
  console.log('进度:', info.progressY)
  console.log('方向:', info.directionY)
}
</script>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 滚动事件处理程序（必填） |
| `throttle` | `number` | `0` | 节流时间（毫秒） |
| `passive` | `boolean` | `true` | 使用被动事件监听 |
| `container` | `string \| Element` | - | 自定义滚动容器 |

## 滚动信息

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `scrollTop` | `number` | 当前垂直滚动位置 |
| `progressY` | `number` | 垂直滚动进度 (0-1) |
| `directionY` | `-1 \| 0 \| 1` | 垂直方向 (-1: 上, 1: 下) |
