# v-truncate

Truncate text content with ellipsis and optional expand functionality.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <p v-truncate="100">
    This is a very long text that will be truncated after 100 characters...
  </p>
</template>
```

### With Options

```vue
<template>
  <p v-truncate="{
    length: 50,
    suffix: '...',
    position: 'end'
  }">
    Long text here
  </p>
</template>
```

## API

### Types

```typescript
type TruncatePosition = 'start' | 'middle' | 'end'

interface TruncateOptions {
  /** Maximum length before truncation */
  length?: number
  /** Suffix to show @default '...' */
  suffix?: string
  /** Truncation position @default 'end' */
  position?: TruncatePosition
  /** Custom class for truncated text */
  class?: string
  /** Disable truncation @default false */
  disabled?: boolean
}

type TruncateBinding = number | TruncateOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `length` | `number` | `100` | Maximum character length |
| `suffix` | `string` | `'...'` | Ellipsis string |
| `position` | `string` | `'end'` | Where to truncate |
| `class` | `string` | - | Custom CSS class |
| `disabled` | `boolean` | `false` | Disable truncation |

## Examples

### Middle Truncation

```vue
<template>
  <!-- Good for file paths -->
  <span v-truncate="{ length: 20, position: 'middle' }">
    /very/long/path/to/some/file.txt
  </span>
  <!-- Output: /very/long...file.txt -->
</template>
```

### Start Truncation

```vue
<template>
  <span v-truncate="{ length: 15, position: 'start' }">
    Long text here
  </span>
  <!-- Output: ...ng text here -->
</template>
```

### Custom Suffix

```vue
<template>
  <span v-truncate="{ length: 30, suffix: ' [read more]' }">
    Very long content here
  </span>
</template>
```
