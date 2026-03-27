# 快速上手

## 全局注册

在应用中全局注册所有指令。

### Vue 3

```typescript
import { createApp } from 'vue'
import Directix from 'directix'
import App from './App.vue'

const app = createApp(App)

// 注册所有指令
app.use(Directix)

// 或者只注册特定指令
app.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce']
})

app.mount('#app')
```

### Vue 2

```typescript
import Vue from 'vue'
import Directix from 'directix'

// 注册所有指令
Vue.use(Directix)

// 或者只注册特定指令
Vue.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce']
})
```

## 按需引入

单独引入指令以实现 tree-shaking：

```typescript
import { vClickOutside, vCopy, vDebounce } from 'directix'

// Vue 3
app.directive('click-outside', vClickOutside)
app.directive('copy', vCopy)
app.directive('debounce', vDebounce)

// Vue 2
Vue.directive('click-outside', vClickOutside)
Vue.directive('copy', vCopy)
Vue.directive('debounce', vDebounce)
```

## 使用示例

### v-click-outside

检测元素外部的点击事件：

```vue
<template>
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">切换</button>
    <div v-if="show">下拉菜单内容</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function closeDropdown() {
  show.value = false
}
</script>
```

### v-copy

复制文本到剪贴板：

```vue
<template>
  <button v-copy="textToCopy">复制到剪贴板</button>
  <button v-copy="{ value: text, onSuccess: handleSuccess }">
    带回调复制
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('已复制:', text)
}
</script>
```

### v-debounce

对事件处理函数进行防抖：

```vue
<template>
  <input v-debounce="handleInput" />
  <input v-debounce:500ms="handleInput" />
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('防抖输入:', event.target.value)
}
</script>
```

### v-throttle

对事件处理函数进行节流：

```vue
<template>
  <button v-throttle="handleClick">节流点击</button>
  <button v-throttle:1s="handleClick">1秒节流</button>
</template>

<script setup>
function handleClick() {
  console.log('节流点击')
}
</script>
```

### v-focus

自动聚焦元素：

```vue
<template>
  <input v-focus />
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

## 下一步

- [事件指令](/zh/guide/events) - 了解更多事件相关指令
- [表单指令](/zh/guide/forms) - 了解更多表单相关指令
- [API 参考](/zh/api/) - 完整 API 文档
