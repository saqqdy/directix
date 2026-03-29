# v-loading

在元素上显示加载遮罩。

> **起始版本：** `1.0.0`

## 用法

### 基本

```vue
<template>
  <div v-loading="isLoading">内容</div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>
```

### 带选项

```vue
<template>
  <div v-loading="{
    value: isLoading,
    text: '加载中...',
    lock: true
  }">
    内容
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `boolean` | `true` | 加载状态 |
| `text` | `string` | - | 加载文本 |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | 背景颜色 |
| `lock` | `boolean` | `false` | 加载时锁定滚动 |
| `spinner` | `string` | - | 自定义加载器 HTML |
