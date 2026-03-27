# v-throttle

对事件处理函数进行节流，限制执行频率。

> **起始版本：** `1.0.0`

## 用法

### 基本用法

```vue
<template>
  <!-- 默认: 300ms -->
  <button v-throttle="handleClick">点击我</button>
</template>

<script setup>
function handleClick() {
  console.log('节流点击')
}
</script>
```

### 使用修饰符

```vue
<template>
  <!-- 500ms 节流 -->
  <button v-throttle:500ms="handleClick">点击我</button>

  <!-- 1秒 节流 -->
  <button v-throttle:1s="handleClick">点击我</button>
</template>
```

### 带配置选项

```vue
<template>
  <button v-throttle="{
    handler: handleClick,
    wait: 1000,
    leading: true,
    trailing: false
  }">
    点击我
  </button>
</template>
```

## API

### 类型定义

```typescript
interface ThrottleOptions {
  /** 需要节流的函数 */
  handler: (event: Event) => void
  /** 等待时间（毫秒） */
  wait?: number
  /** 是否在开始边界触发 */
  leading?: boolean
  /** 是否在结束边界触发 */
  trailing?: boolean
}

type ThrottleBinding = ThrottleOptions['handler'] | ThrottleOptions
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 需要节流的函数 |
| `wait` | `number` | `300` | 等待时间（毫秒） |
| `leading` | `boolean` | `true` | 是否在开始边界触发 |
| `trailing` | `boolean` | `true` | 是否在结束边界触发 |

## 示例

### 按钮点击

```vue
<template>
  <button v-throttle:1s="saveData">
    保存（每秒最多点击一次）
  </button>
</template>

<script setup>
async function saveData() {
  console.log('保存中...')
  // 此处进行 API 调用
}
</script>
```

### 滚动处理

```vue
<template>
  <div v-throttle:100ms="handleScroll" class="scroll-container">
    <!-- 内容 -->
  </div>
</template>

<script setup>
function handleScroll(event) {
  const scrollTop = event.target.scrollTop
  console.log('滚动位置:', scrollTop)
}
</script>
```

### 窗口大小调整

```vue
<template>
  <div v-throttle:200ms="handleResize">
    窗口宽度: {{ width }}px
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)

function handleResize() {
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

### 鼠标移动追踪

```vue
<template>
  <div
    v-throttle:50ms="handleMouseMove"
    class="tracking-area"
    @mousemove="handleMouseMove"
  >
    鼠标位置: {{ x }}, {{ y }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const x = ref(0)
const y = ref(0)

function handleMouseMove(event) {
  x.value = event.clientX
  y.value = event.clientY
}
</script>
```
