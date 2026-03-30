# v-capitalcase

Transform input text to capital case (first letter of each word capitalized).

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <input v-capitalcase v-model="name" />
  <!-- Input: "john doe" → Output: "John Doe" -->
</template>
```

### With Options

```vue
<template>
  <input v-capitalcase="{ on: 'blur' }" v-model="title" />
</template>
```

## API

### Types

```typescript
interface CapitalcaseOptions {
  /** When to transform: 'input' or 'blur' @default 'blur' */
  on?: 'input' | 'blur'
  /** Disable transformation @default false */
  disabled?: boolean
}

type CapitalcaseBinding = boolean | CapitalcaseOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `on` | `string` | `'blur'` | When to apply transformation |
| `disabled` | `boolean` | `false` | Disable transformation |

## Examples

### Real-time Transformation

```vue
<template>
  <input v-capitalcase="{ on: 'input' }" v-model="name" />
</template>
```

### Form Field

```vue
<template>
  <form>
    <input v-capitalcase v-model="user.firstName" placeholder="First Name" />
    <input v-capitalcase v-model="user.lastName" placeholder="Last Name" />
  </form>
</template>
```
