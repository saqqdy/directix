# 事件指令

事件指令帮助你更高效地管理 DOM 事件。

## v-click-outside

检测元素外部的点击事件。非常适合关闭下拉菜单、弹窗和弹出框。

### 基本用法

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

### 带配置选项

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    include: ['.trigger'],
    exclude: ['.ignore']
  }">
    <!-- 内容 -->
  </div>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 点击外部时的回调函数 |
| `include` | `string[]` | `[]` | 包含的 CSS 选择器 |
| `exclude` | `string[]` | `[]` | 排除的 CSS 选择器 |

## v-debounce

对事件处理函数进行防抖，限制执行频率。

### 基本用法

```vue
<template>
  <!-- 默认: 300ms -->
  <input v-debounce="handleInput" />

  <!-- 使用修饰符自定义等待时间 -->
  <input v-debounce:500ms="handleInput" />

  <!-- 使用配置对象 -->
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('防抖输入:', event.target.value)
}
</script>
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

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 需要防抖的函数 |
| `wait` | `number` | `300` | 等待时间（毫秒） |
| `leading` | `boolean` | `false` | 是否在开始边界触发 |
| `trailing` | `boolean` | `true` | 是否在结束边界触发 |

## v-throttle

对事件处理函数进行节流，限制执行频率。

### 基本用法

```vue
<template>
  <!-- 默认: 300ms -->
  <button v-throttle="handleClick">节流点击</button>

  <!-- 使用修饰符自定义等待时间 -->
  <button v-throttle:1s="handleClick">1秒节流</button>

  <!-- 使用配置对象 -->
  <button v-throttle="{ handler: handleClick, wait: 1000 }">
    带配置节流
  </button>
</template>

<script setup>
function handleClick() {
  console.log('节流点击')
}
</script>
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
    带配置节流
  </button>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 需要节流的函数 |
| `wait` | `number` | `300` | 等待时间（毫秒） |
| `leading` | `boolean` | `true` | 是否在开始边界触发 |
| `trailing` | `boolean` | `true` | 是否在结束边界触发 |
