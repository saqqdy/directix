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
