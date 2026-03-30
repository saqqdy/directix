# v-pull-refresh

Implement pull-to-refresh functionality for mobile apps. Triggers refresh action when user pulls down.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <div v-pull-refresh="refresh" class="content">
    <div v-if="refreshing" class="loading">Refreshing...</div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script setup>
const refreshing = ref(false)

async function refresh(done) {
  refreshing.value = true
  await fetchData()
  refreshing.value = false
  done()
}
</script>
```

### With Options

```vue
<template>
  <div v-pull-refresh="{
    handler: refresh,
    threshold: 80,
    loadingText: 'Loading...'
  }">
    Pull down to refresh
  </div>
</template>
```

## API

### Types

```typescript
interface PullRefreshOptions {
  handler: (done: () => void) => void | Promise<void>
  threshold?: number // default: 60
  disabled?: boolean // default: false
  pullDistance?: number // default: 60
  loadingText?: string
  pullingText?: string
  loosingText?: string
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `(done) => void \| Promise<void>` | - | Refresh handler (required) |
| `threshold` | `number` | `60` | Distance to trigger refresh |
| `disabled` | `boolean` | `false` | Disable pull-to-refresh |
| `pullDistance` | `number` | `60` | Max pull distance |
| `loadingText` | `string` | `'Loading...'` | Text while loading |
| `pullingText` | `string` | `'Pull to refresh'` | Text while pulling |
| `loosingText` | `string` | `'Release to refresh'` | Text when threshold reached |

## Examples

### List Refresh

```vue
<template>
  <div
    v-pull-refresh="{ handler: refresh, threshold: 80 }"
    class="scroll-container"
  >
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
const items = ref([])

async function refresh(done) {
  const newItems = await fetch('/api/items')
  items.value = newItems
  done()
}
</script>
```

### Custom Indicator

```vue
<template>
  <div v-pull-refresh="{
    handler: refresh,
    pullingText: '下拉刷新',
    loosingText: '释放刷新',
    loadingText: '刷新中...'
  }">
    Custom Chinese text
  </div>
</template>
```
