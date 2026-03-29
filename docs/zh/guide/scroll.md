# 滚动指令

滚动指令帮助您管理滚动行为和无限加载。

## v-scroll

跟踪滚动位置和方向。

### 基本用法

```vue
<template>
  <div v-scroll="handleScroll" class="scroll-container">
    滚动内容
  </div>
</template>

<script setup>
function handleScroll(event, info) {
  console.log('滚动位置:', info.scrollTop)
  console.log('进度:', info.progressY)
  console.log('方向:', info.directionY)
}
</script>
```

### 滚动信息对象

处理程序接收详细的滚动信息：

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `scrollTop` | `number` | 当前垂直滚动位置 |
| `scrollLeft` | `number` | 当前水平滚动位置 |
| `progressY` | `number` | 垂直滚动进度 (0-1) |
| `progressX` | `number` | 水平滚动进度 (0-1) |
| `directionY` | `-1 \| 0 \| 1` | 垂直方向 (-1: 上, 1: 下) |
| `directionX` | `-1 \| 0 \| 1` | 水平方向 (-1: 左, 1: 右) |

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 滚动事件处理程序（必填） |
| `throttle` | `number` | `0` | 节流时间（毫秒） |
| `passive` | `boolean` | `true` | 使用被动事件监听 |
| `container` | `string \| Element` | - | 自定义滚动容器 |

## v-infinite-scroll

列表和信息流的无限滚动加载。

### 基本用法

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

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 滚动到底部时的处理程序 |
| `distance` | `number` | `0` | 触发加载的距离（像素） |
| `disabled` | `boolean` | `false` | 禁用无限滚动 |
| `loading` | `boolean` | `false` | 加载状态 |
| `throttle` | `number` | `200` | 节流时间（毫秒） |

## v-sticky

滚动时使元素保持粘性。

### 基本用法

```vue
<template>
  <div v-sticky>粘性头部</div>
  <div v-sticky="50">距顶部 50px 的粘性</div>
  <div v-sticky="{ top: 60, zIndex: 1000 }">自定义粘性</div>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `top` | `number \| string` | `0` | 粘性时的顶部偏移 |
| `zIndex` | `number` | `100` | 粘性时的 z-index |
| `stickyClass` | `string` | `'v-sticky--fixed'` | 粘性时的 CSS 类 |
| `onChange` | `Function` | - | 粘性状态改变时的回调 |
