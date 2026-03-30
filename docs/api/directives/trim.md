# v-trim

Trim whitespace from input values with configurable position.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <input v-trim v-model="text" />
</template>
```

### Trim on Blur (Default)

```vue
<template>
  <input v-trim="'blur'" v-model="text" />
</template>
```

### Trim on Input

```vue
<template>
  <input v-trim="'input'" v-model="text" />
</template>
```

## API

### Types

```typescript
type TrimPosition = 'start' | 'end' | 'both'

interface TrimOptions {
  /** When to trim: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Which side to trim @default 'both' */
  position?: TrimPosition
  /** Disable trimming @default false */
  disabled?: boolean
}

type TrimBinding = 'input' | 'blur' | TrimOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply trim |
| `position` | `string` | `'both'` | Which side to trim |
| `disabled` | `boolean` | `false` | Disable trimming |

## Examples

### Trim Start Only

```vue
<template>
  <input v-trim="{ position: 'start' }" v-model="text" />
</template>
```

### Trim End Only

```vue
<template>
  <textarea v-trim="{ position: 'end' }" v-model="content" />
</template>
```

### Real-time Trimming

```vue
<template>
  <input v-trim="{ on: 'input' }" v-model="searchQuery" />
</template>
```
