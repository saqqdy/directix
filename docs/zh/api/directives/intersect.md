# v-intersect

使用 IntersectionObserver 观察元素与视口的交叉状态。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-intersect="handleIntersect">观察我</div>
</template>

<script setup>
function handleIntersect(entry, observer) {
  console.log('交叉中:', entry.isIntersecting)
}
</script>
```

### 带选项

```vue
<template>
  <div v-intersect="{
    onEnter: handleEnter,
    onLeave: handleLeave,
    threshold: 0.5
  }">
    跟踪可见性
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 元素交叉时的回调 |
| `onEnter` | `Function` | - | 元素进入视口时的回调 |
| `onLeave` | `Function` | - | 元素离开视口时的回调 |
| `threshold` | `number \| number[]` | `0` | 触发阈值 |
| `rootMargin` | `string` | `'0px'` | 根元素边距 |
| `once` | `boolean` | `false` | 只触发一次 |
