# v-long-press

检测元素上的长按手势。

> **起始版本：** `1.0.0`

## 用法

### 基本

```vue
<template>
  <button v-long-press="handleLongPress">长按我</button>
</template>

<script setup>
function handleLongPress(event) {
  console.log('长按触发！')
}
</script>
```

### 带选项

```vue
<template>
  <button v-long-press="{
    handler: handleLongPress,
    duration: 1000,
    onStart: handleStart,
    onCancel: handleCancel
  }">
    1秒长按
  </button>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 长按触发时的回调（必填） |
| `duration` | `number` | `500` | 持续时间（毫秒） |
| `distance` | `number` | `10` | 取消前的最大移动距离 |
| `onStart` | `Function` | - | 按下开始时的回调 |
| `onCancel` | `Function` | - | 按下取消时的回调 |
