# v-skeleton

Skeleton loading placeholder.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <div v-skeleton="isLoading">Content here</div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>
```

### With Options

```vue
<template>
  <div v-skeleton="{
    loading: isLoading,
    animation: 'pulse',
    width: 200,
    height: 20
  }">
    Content here
  </div>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `loading` | `boolean` | `true` | Whether to show skeleton |
| `animation` | `'wave' \| 'pulse' \| 'none'` | `'wave'` | Animation type |
| `width` | `number \| string` | `'100%'` | Skeleton width |
| `height` | `number \| string` | `'auto'` | Skeleton height |
| `color` | `string` | `'#e8e8e8'` | Skeleton color |
| `radius` | `number \| string` | `'4px'` | Border radius |
| `rows` | `number` | `1` | Number of skeleton rows |
| `rowGap` | `number \| string` | `'12px'` | Gap between rows |

### Binding Types

```ts
type SkeletonBinding = boolean | SkeletonOptions
```

## Examples

### Card Skeleton

```vue
<template>
  <div class="card" v-skeleton="isLoading">
    <h3>Title</h3>
    <p>Description text here...</p>
    <button>Action</button>
  </div>
</template>

<style>
.card {
  padding: 16px;
  border-radius: 8px;
  background: white;
}
</style>
```

### Multiple Rows

```vue
<template>
  <div v-skeleton="{
    loading: isLoading,
    rows: 3,
    rowGap: '8px',
    animation: 'pulse'
  }">
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
  </div>
</template>
```

### List Skeleton

```vue
<template>
  <div v-for="item in items" :key="item.id" v-skeleton="isLoading">
    {{ item.name }}
  </div>
</template>
```

## Composable API

For programmatic use, you can use the `useSkeleton` composable:

```typescript
import { useSkeleton } from 'directix'

const { show, hide, update, isLoading } = useSkeleton({
  animation: 'wave',
  color: '#e8e8e8'
})

// Show skeleton
show()

// Hide skeleton
hide()

// Update options
update({ animation: 'pulse' })
```

### UseSkeletonReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `show` | `() => void` | Show skeleton |
| `hide` | `() => void` | Hide skeleton |
| `update` | `(options: Partial<SkeletonOptions>) => void` | Update options |
| `isLoading` | `Ref<boolean>` | Current loading state |
## Code Generator

<DirectiveConfigurator name="skeleton" description="Skeleton loading placeholder." />
