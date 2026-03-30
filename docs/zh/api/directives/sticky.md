# v-sticky

滚动时使元素保持粘性。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-sticky>粘性头部</div>
</template>
```

### 带偏移

```vue
<template>
  <div v-sticky="50">距顶部 50px 的粘性</div>
</template>
```

### 带选项

```vue
<template>
  <div v-sticky="{
    top: 60,
    zIndex: 1000,
    stickyClass: 'is-sticky'
  }">
    自定义粘性
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `top` | `number \| string` | `0` | 粘性时的顶部偏移 |
| `zIndex` | `number` | `100` | 粘性时的 z-index |
| `stickyClass` | `string` | `'v-sticky--fixed'` | 粘性时的 CSS 类 |
| `onChange` | `Function` | - | 粘性状态改变时的回调 |
