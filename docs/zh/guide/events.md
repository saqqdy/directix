# 事件指令

事件指令帮助您更高效地管理 DOM 事件。

## v-click-outside

检测元素外部点击。非常适合关闭下拉菜单、模态框和弹出框。

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

### 带选项

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    exclude: ['.ignore'],
    events: ['click', 'touchstart']
  }">
    <!-- 内容 -->
  </div>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 点击外部时的回调 |
| `exclude` | `Array` | `[]` | 排除检测的元素 |
| `capture` | `boolean` | `true` | 使用捕获模式 |
| `events` | `string[]` | `['click']` | 监听的事件类型 |
| `disabled` | `boolean` | `false` | 禁用指令 |

## v-debounce

防抖事件处理程序，限制执行频率。

### 基本用法

```vue
<template>
  <!-- 默认: 300ms -->
  <input v-debounce="handleInput" />

  <!-- 使用修饰符自定义等待时间 -->
  <input v-debounce:500ms="handleInput" />

  <!-- 使用选项对象 -->
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('防抖输入:', event.target.value)
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 要防抖的函数 |
| `wait` | `number` | `300` | 等待时间（毫秒） |
| `leading` | `boolean` | `false` | 在开始边缘调用 |
| `trailing` | `boolean` | `true` | 在结束边缘调用 |

## v-throttle

节流事件处理程序，限制执行频率。

### 基本用法

```vue
<template>
  <!-- 默认: 300ms -->
  <button v-throttle="handleClick">节流点击</button>

  <!-- 使用修饰符自定义等待时间 -->
  <button v-throttle:1s="handleClick">1秒节流</button>
</template>

<script setup>
function handleClick() {
  console.log('节流点击')
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 要节流的函数 |
| `wait` | `number` | `300` | 等待时间（毫秒） |
| `leading` | `boolean` | `true` | 在开始边缘调用 |
| `trailing` | `boolean` | `true` | 在结束边缘调用 |

## v-long-press

检测元素上的长按手势。

### 基本用法

```vue
<template>
  <button v-long-press="handleLongPress">长按我</button>
  <button v-long-press="{ handler: handleLongPress, duration: 1000 }">
    1秒长按
  </button>
</template>

<script setup>
function handleLongPress(event) {
  console.log('长按触发！')
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 长按触发时的回调 |
| `duration` | `number` | `500` | 持续时间（毫秒） |
| `distance` | `number` | `10` | 取消前的最大移动距离 |
| `onStart` | `Function` | - | 按下开始时的回调 |
| `onCancel` | `Function` | - | 按下取消时的回调 |

## v-hover

跟踪悬停状态并提供回调和 CSS 类。

### 基本用法

```vue
<template>
  <div v-hover="handleHover">悬停我</div>
  <div v-hover="{ onEnter: handleEnter, onLeave: handleLeave, class: 'is-hovering' }">
    悬停我
  </div>
</template>

<script setup>
function handleHover(isHovering, event) {
  console.log('悬停中:', isHovering)
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 悬停状态改变时的回调 |
| `onEnter` | `Function` | - | 鼠标进入时的回调 |
| `onLeave` | `Function` | - | 鼠标离开时的回调 |
| `class` | `string` | `'v-hover'` | 悬停时添加的 CSS 类 |
| `enterDelay` | `number` | `0` | 进入延迟（毫秒） |
| `leaveDelay` | `number` | `0` | 离开延迟（毫秒） |

## v-ripple

为元素添加 Material Design 波纹效果。

### 基本用法

```vue
<template>
  <button v-ripple>点击我</button>
  <button v-ripple="'rgba(255, 255, 255, 0.3)'">自定义颜色</button>
  <button v-ripple="{ color: 'red', duration: 800 }">自定义选项</button>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `color` | `string` | `'currentColor'` | 波纹颜色 |
| `duration` | `number` | `600` | 动画持续时间（毫秒） |
| `disabled` | `boolean` | `false` | 禁用波纹效果 |
