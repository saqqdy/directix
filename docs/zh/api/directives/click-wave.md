# v-click-wave

为元素添加简化的点击波纹效果。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <button v-click-wave>点击我</button>
</template>
```

### 自定义颜色

```vue
<template>
  <button v-click-wave="'rgba(255, 255, 255, 0.3)'">自定义颜色</button>
</template>
```

### 带选项

```vue
<template>
  <button v-click-wave="{ color: 'red', duration: 400, sizeRatio: 2 }">
    自定义选项
  </button>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `color` | `string` | `'currentColor'` | 波纹颜色 |
| `duration` | `number` | `500` | 动画时长（毫秒） |
| `disabled` | `boolean` | `false` | 是否禁用波纹效果 |
| `sizeRatio` | `number` | `1.5` | 波纹大小比例（相对于元素较小边） |

### 绑定值类型

```ts
type ClickWaveBinding = boolean | string | ClickWaveOptions
```

## Composable

也可以使用 `useClickWave` 组合式函数：

```vue
<script setup>
import { ref } from 'vue'
import { useClickWave } from 'directix'

const buttonRef = ref(null)
const { bind, trigger } = useClickWave({
  color: 'rgba(255, 255, 255, 0.3)',
  duration: 400
})

onMounted(() => bind(buttonRef.value))
</script>

<template>
  <button ref="buttonRef">点击查看波纹</button>
</template>
```

### Composable API

| 属性/方法 | 类型 | 描述 |
| --------- | ---- | ---- |
| `bind(el)` | `(element: HTMLElement) => () => void` | 绑定到元素，返回解绑函数 |
| `trigger(opts?)` | `({ x?: number, y?: number }) => void` | 手动触发波纹效果 |
