# v-infinite-scroll

Infinite scroll loading for lists and feeds.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-infinite-scroll="loadMore" class="scroll-container">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([...])

async function loadMore() {
  const newItems = await fetchMoreItems()
  items.value.push(...newItems)
}
</script>
```

### With Options

```vue
<template>
  <div v-infinite-scroll="{
    handler: loadMore,
    distance: 100,
    disabled: isLoading
  }">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

## API

### Types

```typescript
type InfiniteScrollHandler = () => void | Promise<void>

interface InfiniteScrollOptions {
  /** Handler to call when scrolling to bottom */
  handler: InfiniteScrollHandler
  /** Distance from bottom to trigger load (in pixels) */
  distance?: number
  /** Disable the directive */
  disabled?: boolean
  /** Whether currently loading */
  loading?: boolean
  /** Use IntersectionObserver (more efficient) */
  useIntersection?: boolean
  /** Throttle time in milliseconds */
  throttle?: number
  /** Custom scroll container */
  container?: string | Element | null
  /** Callback when load starts */
  onLoadStart?: () => void
  /** Callback when load completes */
  onLoadEnd?: () => void
  /** Callback on error */
  onError?: (error: Error) => void
}

type InfiniteScrollBinding = InfiniteScrollHandler | InfiniteScrollOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Handler when scrolling to bottom (required) |
| `distance` | `number` | `0` | Distance from bottom to trigger (px) |
| `disabled` | `boolean` | `false` | Disable infinite scroll |
| `loading` | `boolean` | `false` | Loading state |
| `useIntersection` | `boolean` | `true` | Use IntersectionObserver |
| `throttle` | `number` | `200` | Throttle time in milliseconds |
| `container` | `string \| Element` | - | Custom scroll container |
| `onLoadStart` | `Function` | - | Callback when load starts |
| `onLoadEnd` | `Function` | - | Callback when load completes |
| `onError` | `Function` | - | Callback on error |

## Examples

### Paginated List

```vue
<template>
  <div v-infinite-scroll="{
    handler: loadMore,
    distance: 200,
    disabled: noMoreData
  }" class="list-container">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="noMoreData" class="end">No more data</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([])
const page = ref(1)
const loading = ref(false)
const noMoreData = ref(false)

async function loadMore() {
  if (loading.value || noMoreData.value) return

  loading.value = true
  try {
    const newItems = await fetchItems(page.value)
    if (newItems.length === 0) {
      noMoreData.value = true
    } else {
      items.value.push(...newItems)
      page.value++
    }
  } finally {
    loading.value = false
  }
}
</script>
```

### With Error Handling

```vue
<template>
  <div v-infinite-scroll="{
    handler: loadMore,
    onLoadStart: () => loading = true,
    onLoadEnd: () => loading = false,
    onError: handleError
  }">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
    <div v-if="error" class="error">
      {{ error }}
      <button @click="error = null">Retry</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const error = ref(null)
const items = ref([])

async function loadMore() {
  const newItems = await fetchItems()
  items.value.push(...newItems)
}

function handleError(err) {
  error.value = err.message
}
</script>
```

## Composable API

For programmatic use, you can use the `useInfiniteScroll` composable:

```typescript
import { useInfiniteScroll } from 'directix'

const { loading, finished, load, bind, stop } = useInfiniteScroll({
  onLoad: async () => {
    const newItems = await fetchItems(page.value++)
    items.value.push(...newItems)
    if (newItems.length === 0) finished.value = true
  },
  loading: false,
  finished: false,
  distance: 0,
  immediate: true,
  disabled: false
})

// Bind to element
onMounted(() => bind(containerRef.value))
```

### UseInfiniteScrollOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `onLoad` | `() => void \| Promise<void>` | - | Handler to load more items (required) |
| `loading` | `boolean \| Ref<boolean>` | - | Whether loading is in progress |
| `finished` | `boolean \| Ref<boolean>` | - | Whether all items are loaded |
| `distance` | `number \| Ref<number>` | `0` | Distance from bottom to trigger |
| `immediate` | `boolean` | `true` | Check immediately on mount |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable infinite scroll |

### UseInfiniteScrollReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `loading` | `Readonly<Ref<boolean>>` | Whether loading is in progress |
| `finished` | `Readonly<Ref<boolean>>` | Whether all items are loaded |
| `load` | `() => Promise<void>` | Manually trigger load |
| `bind` | `(element: HTMLElement) => () => void` | Bind infinite scroll to an element |
| `stop` | `() => void` | Stop observing |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useInfiniteScroll } from 'directix'

const items = ref([])
const page = ref(1)

const { bind, loading, finished } = useInfiniteScroll({
  onLoad: async () => {
    const newItems = await fetchItems(page.value++)
    items.value.push(...newItems)
    if (newItems.length === 0) finished.value = true
  }
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef" class="scroll-container">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
    <div v-if="loading">Loading...</div>
  </div>
</template>
```
