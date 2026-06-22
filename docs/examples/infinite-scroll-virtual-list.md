# Infinite Scroll & Virtual List Example

Handle large datasets with infinite scrolling and virtual list rendering.

## Infinite Scroll

```vue
<template>
  <div
    v-infinite-scroll="{ handler: loadMore, distance: 100 }"
    class="scroll-container"
  >
    <div v-for="item in items" :key="item.id" class="list-item">
      <span class="item-id">#{{ item.id }}</span>
      <span>{{ item.text }}</span>
    </div>
    <div v-if="loading" v-loading="true" class="loading-indicator">Loading more...</div>
    <div v-if="allLoaded" class="end-indicator">All items loaded ✅</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(generateItems(0, 20))
const loading = ref(false)
const allLoaded = ref(false)
let nextId = 20

function generateItems(start, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i + 1,
    text: `Item ${start + i + 1}`,
  }))
}

async function loadMore() {
  if (loading.value || allLoaded.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  items.value.push(...generateItems(nextId, 20))
  nextId += 20
  if (nextId >= 100) allLoaded.value = true
  loading.value = false
}
</script>

<style scoped>
.scroll-container { max-width: 500px; max-height: 400px; overflow-y: auto; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
.list-item { padding: 12px; border-bottom: 1px solid #f0f0f0; display: flex; gap: 12px; }
.item-id { color: #42b883; font-weight: 600; min-width: 50px; }
.loading-indicator, .end-indicator { text-align: center; padding: 16px; color: #888; font-size: 14px; }
</style>
```

## Virtual List for Large Datasets

```vue
<template>
  <div v-virtual-list="{ data: largeList, itemSize: 48, height: 400 }" class="virtual-container">
    <template #default="{ item, index }">
      <div class="virtual-item" :style="{ height: '48px' }">
        <span class="index">{{ index + 1 }}.</span>
        <span>{{ item.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const largeList = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
  })),
)
</script>

<style scoped>
.virtual-container { width: 500px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
.virtual-item { display: flex; align-items: center; gap: 12px; padding: 0 16px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
.virtual-item:hover { background: #f9f9f9; }
.index { color: #999; min-width: 36px; }
</style>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
