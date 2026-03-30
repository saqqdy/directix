# v-infinite-scroll

列表和信息流的无限滚动加载。

> **起始版本：** `1.1.0`

## 用法

### 基本

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

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 滚动到底部时的处理程序（必填） |
| `distance` | `number` | `0` | 触发加载的距离（像素） |
| `disabled` | `boolean` | `false` | 禁用无限滚动 |
| `loading` | `boolean` | `false` | 加载状态 |
| `throttle` | `number` | `200` | 节流时间（毫秒） |
