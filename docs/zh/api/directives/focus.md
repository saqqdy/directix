# v-focus

元素挂载时自动获取焦点。

> **起始版本：** `1.0.0`

## 用法

### 基本用法

```vue
<template>
  <input v-focus placeholder="挂载时自动聚焦" />
</template>
```

### 带配置选项

```vue
<template>
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

## API

### 类型定义

```typescript
interface FocusOptions {
  /** 挂载时聚焦元素 */
  focus?: boolean
  /** 元素再次显示时重新聚焦 */
  refocus?: boolean
}

type FocusBinding = boolean | FocusOptions
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `focus` | `boolean` | `true` | 挂载时聚焦元素 |
| `refocus` | `boolean` | `false` | 元素再次显示时重新聚焦。**起始版本：** `1.0.0` |

## Composable 用法

你也可以使用 `useFocus` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFocus } from 'directix'

const inputRef = ref(null)
const { isFocused, focus, blur, bind } = useFocus({
  onBlur: () => validate()
})

onMounted(() => bind(inputRef.value))

// 编程式聚焦
function handleButtonClick() {
  focus()
}
</script>

<template>
  <input ref="inputRef" />
  <button @click="focus">聚焦输入框</button>
</template>
```

### API

```typescript
interface UseFocusOptions {
  /** 聚焦时的回调 */
  onFocus?: (event: FocusEvent) => void
  /** 失焦时的回调 */
  onBlur?: (event: FocusEvent) => void
}

interface UseFocusReturn {
  /** 元素是否聚焦 */
  isFocused: Readonly<Ref<boolean>>
  /** 聚焦元素 */
  focus: () => void
  /** 失焦元素 */
  blur: () => void
  /** 绑定焦点跟踪到元素 */
  bind: (element: HTMLElement) => () => void
}
```

## 示例

### 弹窗输入框

```vue
<template>
  <button @click="showModal = true">打开弹窗</button>

  <div v-if="showModal" class="modal">
    <input v-focus placeholder="弹窗打开时聚焦" />
    <button @click="showModal = false">关闭</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>
```

### 条件聚焦

```vue
<template>
  <div>
    <button @click="editMode = !editMode">
      {{ editMode ? '取消' : '编辑' }}
    </button>

    <input
      v-if="editMode"
      v-focus="{ focus: true, refocus: true }"
      v-model="text"
    />
    <span v-else>{{ text }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editMode = ref(false)
const text = ref('点击编辑进行修改')
</script>
```

### 表单自动聚焦

```vue
<template>
  <form @submit.prevent="submit">
    <input v-focus placeholder="第一个字段（自动聚焦）" />
    <input placeholder="第二个字段" />
    <input placeholder="第三个字段" />
    <button type="submit">提交</button>
  </form>
</template>

<script setup>
function submit() {
  console.log('表单已提交')
}
</script>
```

### 搜索框

```vue
<template>
  <div>
    <button @click="showSearch = !showSearch">
      {{ showSearch ? '关闭' : '搜索' }}
    </button>

    <input
      v-if="showSearch"
      v-focus="{ refocus: true }"
      v-debounce:300ms="search"
      placeholder="搜索..."
      type="search"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSearch = ref(false)

function search(event) {
  console.log('搜索:', event.target.value)
}
</script>
```
