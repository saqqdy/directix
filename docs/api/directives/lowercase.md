# v-lowercase

Transform input text to lowercase.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <input v-lowercase v-model="email" />
  <!-- Input: "JOHN@EXAMPLE.COM" → Output: "john@example.com" -->
</template>
```

### With Options

```vue
<template>
  <input v-lowercase="{ on: 'input' }" v-model="username" />
</template>
```

## API

### Types

```typescript
interface LowercaseOptions {
  /** When to transform: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Disable transformation @default false */
  disabled?: boolean
}

type LowercaseBinding = boolean | LowercaseOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply transformation |
| `disabled` | `boolean` | `false` | Disable transformation |

## Examples

### Email Input

```vue
<template>
  <input v-lowercase type="email" v-model="email" placeholder="Email" />
</template>
```

### Username Field

```vue
<template>
  <input v-lowercase="{ on: 'input' }" v-model="username" />
</template>
```
