# v-loading

在元素上显示加载遮罩。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-loading="isLoading">内容</div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>
```

### 带选项

```vue
<template>
  <div v-loading="{
    value: isLoading,
    text: '加载中...',
    lock: true
  }">
    内容
  </div>
</template>
```

## Composable 用法

你也可以使用 `useLoading` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useLoading } from 'directix'

const containerRef = ref(null)
const { loading, start, stop, toggle, bind } = useLoading({
  text: '加载中...',
  lock: true
})

onMounted(() => bind(containerRef.value))

async function fetchData() {
  start()
  try {
    await api.getData()
  } finally {
    stop()
  }
}
</script>

<template>
  <div ref="containerRef">
    <button @click="fetchData">获取数据</button>
  </div>
</template>
```

### API

```typescript
interface UseLoadingOptions {
  /** 初始加载状态 */
  initial?: boolean | Ref<boolean>
  /** 加载文本 */
  text?: string | Ref<string>
  /** 加载遮罩 CSS 类 */
  loadingClass?: string
  /** 加载图标 CSS 类 */
  spinnerClass?: string
  /** 加载文本 CSS 类 */
  textClass?: string
  /** 自定义加载图标 HTML */
  spinner?: string
  /** 背景颜色 */
  background?: string
  /** 加载时锁定滚动 */
  lock?: boolean
}

interface UseLoadingReturn {
  /** 当前加载状态 */
  loading: Ref<boolean>
  /** 开始加载 */
  start: () => void
  /** 停止加载 */
  stop: () => void
  /** 切换加载状态 */
  toggle: () => void
  /** 绑定加载到元素 */
  bind: (element: HTMLElement) => () => void
}
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `boolean` | `true` | 加载状态 |
| `text` | `string` | - | 加载文本 |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | 背景颜色 |
| `lock` | `boolean` | `false` | 加载时锁定滚动 |
| `spinner` | `string` | - | 自定义加载器 HTML |
