# v-debounce

对事件处理函数进行防抖，限制执行频率。

> **起始版本：** `1.0.0`

## 用法

### 基本用法

```vue
<template>
  <!-- 默认: 300ms -->
  <input v-debounce="handleInput" placeholder="输入内容..." />
</template>

<script setup>
function handleInput(event) {
  console.log('防抖输入:', event.target.value)
}
</script>
```

### 使用修饰符

```vue
<template>
  <!-- 500ms 防抖 -->
  <input v-debounce:500ms="handleInput" />

  <!-- 1秒 防抖 -->
  <input v-debounce:1s="handleInput" />
</template>
```

### 带配置选项

```vue
<template>
  <input v-debounce="{
    handler: handleInput,
    wait: 500,
    leading: true,
    trailing: true
  }" />
</template>
```

## API

### 类型定义

```typescript
interface DebounceOptions {
  /** 需要防抖的函数 */
  handler: (event: Event) => void
  /** 等待时间（毫秒） */
  wait?: number
  /** 是否在开始边界触发 */
  leading?: boolean
  /** 是否在结束边界触发 */
  trailing?: boolean
}

type DebounceBinding = DebounceOptions['handler'] | DebounceOptions
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 需要防抖的函数 |
| `wait` | `number` | `300` | 等待时间（毫秒） |
| `leading` | `boolean` | `false` | 是否在开始边界触发 |
| `trailing` | `boolean` | `true` | 是否在结束边界触发 |

## Composable 用法

你也可以使用 `useDebounce` composable 来实现相同功能：

```vue
<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from 'directix'

const searchQuery = ref('')

const { run: debouncedSearch, cancel, flush } = useDebounce({
  handler: (query: string) => {
    console.log('搜索:', query)
    // 执行搜索 API 调用
  },
  wait: 500,
  leading: false,
  trailing: true
})

// 监听并防抖
watch(searchQuery, (query) => {
  debouncedSearch(query)
})
</script>

<template>
  <input v-model="searchQuery" placeholder="搜索..." />
</template>
```

### API

```typescript
interface UseDebounceOptions<T extends (...args: any[]) => any> {
  /** 需要防抖的函数 */
  handler: T
  /** 等待时间（毫秒） */
  wait?: number | Ref<number>
  /** 是否在开始边界触发 */
  leading?: boolean | Ref<boolean>
  /** 是否在结束边界触发 */
  trailing?: boolean | Ref<boolean>
}

interface UseDebounceReturn<T> {
  /** 执行防抖函数 */
  run: (...args: Parameters<T>) => void
  /** 取消待执行的函数 */
  cancel: () => void
  /** 立即执行待执行的函数 */
  flush: () => void
  /** 是否有待执行的函数 */
  pending: () => boolean
}
```

## 示例

### 搜索输入

```vue
<template>
  <div>
    <input
      v-debounce:300ms="search"
      placeholder="搜索..."
      type="text"
    />
    <div v-if="loading">加载中...</div>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const results = ref([])

async function search(event) {
  const query = event.target.value
  if (!query) {
    results.value = []
    return
  }

  loading.value = true
  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 500))
  results.value = [
    { id: 1, name: `"${query}" 的结果` }
  ]
  loading.value = false
}
</script>
```

### 表单验证

```vue
<template>
  <form>
    <input
      v-debounce="{ handler: validateEmail, wait: 500 }"
      placeholder="邮箱"
      type="email"
    />
    <span v-if="error" class="error">{{ error }}</span>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const error = ref('')

function validateEmail(event) {
  const email = event.target.value
  if (!email) {
    error.value = ''
    return
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  error.value = isValid ? '' : '邮箱格式无效'
}
</script>
```
