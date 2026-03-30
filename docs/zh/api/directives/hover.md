# v-hover

跟踪悬停状态并提供回调和 CSS 类。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-hover="handleHover">悬停我</div>
</template>

<script setup>
function handleHover(isHovering, event) {
  console.log('悬停中:', isHovering)
}
</script>
```

### 带选项

```vue
<template>
  <div v-hover="{
    onEnter: handleEnter,
    onLeave: handleLeave,
    class: 'is-hovering'
  }">
    悬停我
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 悬停状态改变时的回调 |
| `onEnter` | `Function` | - | 鼠标进入时的回调 |
| `onLeave` | `Function` | - | 鼠标离开时的回调 |
| `class` | `string` | `'v-hover'` | 悬停时添加的 CSS 类 |
| `enterDelay` | `number` | `0` | 进入延迟（毫秒） |
| `leaveDelay` | `number` | `0` | 离开延迟（毫秒） |
