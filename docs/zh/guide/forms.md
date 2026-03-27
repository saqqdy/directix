# 表单指令

表单指令帮助你增强表单交互体验。

## v-copy

一键复制文本到剪贴板。

### 基本用法

```vue
<template>
  <!-- 简单用法 -->
  <button v-copy="textToCopy">复制到剪贴板</button>

  <!-- 带回调函数 -->
  <button v-copy="{ value: text, onSuccess: handleSuccess, onError: handleError }">
    带回调复制
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('已复制:', text)
}

function handleError(error) {
  console.error('复制失败:', error)
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `string` | - | 要复制的文本 |
| `onSuccess` | `Function` | - | 复制成功回调 |
| `onError` | `Function` | - | 复制失败回调 |

## v-focus

元素挂载时自动获取焦点。

### 基本用法

```vue
<template>
  <!-- 简单用法 -->
  <input v-focus />

  <!-- 带配置 -->
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

### 带配置选项

```vue
<template>
  <!-- 组件挂载时聚焦 -->
  <input v-focus="{ focus: true }" />

  <!-- 元素显示时重新聚焦 -->
  <input v-if="show" v-focus="{ focus: true, refocus: true }" />
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `focus` | `boolean` | `true` | 挂载时聚焦元素 |
| `refocus` | `boolean` | `false` | 元素再次显示时重新聚焦 |

## 即将推出

更多表单指令正在开发中：

| 指令 | 描述 | 状态 |
| ---- | ---- | ---- |
| `v-mask` | 输入掩码，格式化输入 | ⏳ |

> ✅ = 可用 | ⏳ = 即将推出
