# v-lazy

图片进入视口时懒加载。

> **起始版本：** `1.0.0`

## 用法

### 基本

```vue
<template>
  <img v-lazy="imageUrl" />
  <img v-lazy="{ src: imageUrl, placeholder: 'placeholder.jpg' }" />
  <div v-lazy="backgroundImageUrl"></div>
</template>
```

### 带选项

```vue
<template>
  <img v-lazy="{
    src: imageUrl,
    placeholder: 'placeholder.jpg',
    error: 'error.jpg',
    preload: 100,
    attempt: 3
  }" />
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `src` | `string` | - | 图片源 URL |
| `placeholder` | `string` | - | 占位图 URL |
| `error` | `string` | - | 错误图 URL |
| `preload` | `number` | `0` | 预加载距离（像素） |
| `attempt` | `number` | `1` | 重试次数 |
| `onLoad` | `Function` | - | 加载成功回调 |
| `onError` | `Function` | - | 加载失败回调 |
