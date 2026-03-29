# v-ripple

为元素添加 Material Design 波纹效果。

> **起始版本：** `1.0.0`

## 用法

### 基本

```vue
<template>
  <button v-ripple>点击我</button>
</template>
```

### 带颜色

```vue
<template>
  <button v-ripple="'rgba(255, 255, 255, 0.3)'">自定义颜色</button>
</template>
```

### 带选项

```vue
<template>
  <button v-ripple="{ color: 'red', duration: 800 }">自定义选项</button>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `color` | `string` | `'currentColor'` | 波纹颜色 |
| `duration` | `number` | `600` | 动画持续时间（毫秒） |
| `disabled` | `boolean` | `false` | 禁用波纹效果 |
