# v-truncate

Truncate text content with ellipsis and optional expand functionality.

> **Since:** `1.2.0`

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

## Composable API

For programmatic use, you can use the `useEllipsis` composable:

```typescript
import { useEllipsis, truncateText, wouldTextTruncate } from 'directix'

const { truncated, isTruncated, original, calculateForWidth, wouldTruncate } = useEllipsis({
  text: longText,
  lines: 1,
  ellipsis: '...',
  maxWidth: 0 // 0 = no width limit
})

// Utility function
const short = truncateText('Very long text here', 10) // 'Very l...'

// Check if text would truncate
if (wouldTextTruncate('Long text', 100)) {
  console.log('Text would be truncated')
}
```

### UseEllipsisOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `text` | `string \| Ref<string>` | - | The text to potentially truncate (required) |
| `lines` | `number \| Ref<number>` | `1` | Number of lines before truncating |
| `ellipsis` | `string \| Ref<string>` | `'...'` | Custom ellipsis string |
| `maxWidth` | `number \| Ref<number>` | `0` | Maximum width in pixels (0 = no limit) |

### UseEllipsisReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `truncated` | `Ref<string>` | The truncated text |
| `isTruncated` | `Ref<boolean>` | Whether the text is truncated |
| `original` | `Ref<string>` | Original text |
| `calculateForWidth` | `(width: number) => string` | Calculate truncation for given width |
| `wouldTruncate` | `(width: number) => boolean` | Check if text would truncate |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useEllipsis } from 'directix'

const longText = ref('This is a very long text that needs to be truncated')
const { truncated, isTruncated } = useEllipsis({
  text: longText,
  maxWidth: 200
})
</script>

<template>
  <span :title="isTruncated ? longText : ''">
    {{ truncated }}
  </span>
</template>
```
