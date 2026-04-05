# v-ellipsis

使用 CSS 实现多行文本省略。在指定行数后截断文本。

> **起始版本：** `1.3.0`

## 用法

### 基本

```vue
<template>
  <!-- 单行省略 -->
  <p v-ellipsis>这是一段很长的文本，将被省略号截断...</p>

  <!-- 多行省略 -->
  <p v-ellipsis="3">
    这是一段很长的文本，将在3行后被截断并显示省略号。
    文本会在这里继续，当超过指定行数时会被截断。
  </p>
</template>
```

### 带选项

```vue
<template>
  <p v-ellipsis="{ lines: 2, expandable: true }">
    点击展开这段将在2行后被截断的长文本。
    expandable 选项允许用户点击查看完整内容。
  </p>
</template>
```

## API

### 类型

```typescript
interface EllipsisOptions {
  lines?: number // 默认: 1
  expandable?: boolean // 默认: false
  ellipsis?: string // 默认: '...'
}
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `lines` | `number` | `1` | 截断前的行数 |
| `expandable` | `boolean` | `false` | 允许点击展开/收起 |
| `ellipsis` | `string` | `'...'` | 自定义省略号字符串 |

## Composable 用法

你也可以使用 `useEllipsis` composable 实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useEllipsis } from 'directix'

const longText = ref('这是一段需要被截断的长文本')

const { truncated, isTruncated } = useEllipsis({
  text: longText,
  maxWidth: 200,
  lines: 1
})
</script>

<template>
  <span :title="isTruncated ? longText : ''">
    {{ truncated }}
  </span>
</template>
```

### API

```typescript
interface UseEllipsisOptions {
  /** 要截断的文本 */
  text: string | Ref<string>
  /** 截断前显示的行数 @default 1 */
  lines?: number | Ref<number>
  /** 自定义省略号字符串 @default '...' */
  ellipsis?: string | Ref<string>
  /** 最大宽度（像素，0 表示无限制） @default 0 */
  maxWidth?: number | Ref<number>
}

interface UseEllipsisReturn {
  /** 截断后的文本 */
  truncated: Ref<string>
  /** 文本是否被截断 */
  isTruncated: Ref<boolean>
  /** 原始文本 */
  original: Ref<string>
  /** 计算指定宽度的截断 */
  calculateForWidth: (width: number) => string
  /** 检查文本在指定宽度下是否会被截断 */
  wouldTruncate: (width: number) => boolean
}
```

## 示例

### 卡片描述

```vue
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p v-ellipsis="2" class="description">{{ description }}</p>
  </div>
</template>

<style scoped>
.description {
  line-height: 1.5;
}
</style>
```

### 可展开内容

```vue
<template>
  <p v-ellipsis="{ lines: 3, expandable: true }">
    长文本可展开内容...
  </p>
</template>
```
