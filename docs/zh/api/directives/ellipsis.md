# v-ellipsis

Apply multi-line text ellipsis with CSS. Truncates text after specified number of lines.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <!-- Single line ellipsis -->
  <p v-ellipsis>This is a very long text that will be truncated with ellipsis...</p>

  <!-- Multi-line ellipsis -->
  <p v-ellipsis="3">
    This is a very long text that will be truncated after 3 lines
    with an ellipsis at the end. The text continues here and will
    be cut off when it exceeds the specified number of lines.
  </p>
</template>
```

### With Options

```vue
<template>
  <p v-ellipsis="{ lines: 2, expandable: true }">
    Click to expand this long text that will be truncated after 2 lines.
    The expandable option allows users to click to see the full content.
  </p>
</template>
```

## API

### Types

```typescript
interface EllipsisOptions {
  lines?: number // default: 1
  expandable?: boolean // default: false
  ellipsis?: string // default: '...'
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `lines` | `number` | `1` | Number of lines before truncation |
| `expandable` | `boolean` | `false` | Allow click to expand/collapse |
| `ellipsis` | `string` | `'...'` | Custom ellipsis string |

## Composable Usage

You can also use the `useEllipsis` composable for the same functionality:

```vue
<script setup>
import { ref } from 'vue'
import { useEllipsis } from 'directix'

const longText = ref('This is a very long text that needs to be truncated')

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

## Examples

### Card Description

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

### Expandable Content

```vue
<template>
  <p v-ellipsis="{ lines: 3, expandable: true }">
    Long expandable content here...
  </p>
</template>
```
