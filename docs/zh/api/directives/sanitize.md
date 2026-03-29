# v-sanitize

清理 HTML 内容以防止 XSS 攻击。

> **起始版本：** `1.0.0`

## 用法

### 基本

```vue
<template>
  <div v-sanitize v-html="userContent"></div>
</template>
```

### 指定允许的标签

```vue
<template>
  <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `allowedTags` | `string[]` | 安全子集 | 允许的 HTML 标签 |
| `allowedAttributes` | `string[]` | 安全子集 | 允许的 HTML 属性 |
| `allowDataUrls` | `boolean` | `false` | 允许 data: URL |
| `allowStyles` | `boolean` | `false` | 允许 style 属性 |
| `allowClass` | `boolean` | `false` | 允许 class 属性 |
| `handler` | `Function` | - | 自定义清理函数 |
