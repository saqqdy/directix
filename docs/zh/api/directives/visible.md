# v-visible

切换元素可见性，支持动画。

> **起始版本：** `1.0.0`

## 用法

### 基本

```vue
<template>
  <div v-visible="showElement">显示/隐藏</div>
</template>

<script setup>
import { ref } from 'vue'

const showElement = ref(true)
</script>
```

### 带选项

```vue
<template>
  <div v-visible="{
    handler: onVisibleChange,
    useHidden: true,
    initial: true
  }">
    使用 visibility: hidden
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 可见性改变时的回调 |
| `useHidden` | `boolean` | `false` | 使用 `visibility: hidden` |
| `initial` | `boolean` | `true` | 初始可见性状态 |
