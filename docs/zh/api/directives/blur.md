# v-blur

为元素添加背景模糊遮罩效果。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-blur="isBlurred">背景内容</div>
</template>

<script setup>
import { ref } from 'vue'

const isBlurred = ref(false)
</script>
```

### 指定模糊半径

```vue
<template>
  <div v-blur="15">15px 模糊半径</div>
</template>
```

### 带选项

```vue
<template>
  <div v-blur="{
    visible: isBlurred,
    radius: 20,
    overlayColor: 'rgba(255, 255, 255, 0.3)',
    lockScroll: true
  }">
    内容
  </div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `radius` | `number` | `10` | 模糊半径（像素） |
| `visible` | `boolean` | `true` | 是否显示模糊效果 |
| `duration` | `number` | `300` | 过渡动画时长（毫秒） |
| `overlayColor` | `string` | `'rgba(0, 0, 0, 0.5)'` | 遮罩层颜色 |
| `zIndex` | `number` | `999` | 遮罩层 z-index |
| `lockScroll` | `boolean` | `true` | 激活时是否锁定滚动 |
| `class` | `string` | - | 自定义类名 |
| `onShow` | `() => void` | - | 显示时的回调 |
| `onHide` | `() => void` | - | 隐藏时的回调 |

### 绑定值类型

```ts
type BlurBinding = boolean | number | BlurOptions
```

## Composable

也可以使用 `useBlur` 组合式函数：

```vue
<script setup>
import { ref } from 'vue'
import { useBlur } from 'directix'

const containerRef = ref(null)
const { isVisible, show, hide, toggle, bind } = useBlur({
  radius: 15,
  onShow: () => console.log('显示模糊'),
  onHide: () => console.log('隐藏模糊')
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">
    <button @click="toggle">切换模糊</button>
  </div>
</template>
```

### Composable API

| 属性/方法 | 类型 | 描述 |
| --------- | ---- | ---- |
| `isVisible` | `Ref<boolean>` | 当前是否可见 |
| `show()` | `() => void` | 显示模糊效果 |
| `hide()` | `() => void` | 隐藏模糊效果 |
| `toggle()` | `() => void` | 切换显示状态 |
| `bind(el)` | `(element: HTMLElement) => () => void` | 绑定到元素，返回解绑函数 |
