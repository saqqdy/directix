# v-skeleton

骨架屏加载占位效果。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-skeleton="isLoading">实际内容</div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>
```

### 带选项

```vue
<template>
  <div v-skeleton="{ loading: isLoading, animation: 'pulse', width: 200, height: 20 }">
    内容
  </div>
</template>
```

### 多行骨架屏

```vue
<template>
  <div v-skeleton="{ loading: isLoading, height: '1em' }">第一行</div>
  <div v-skeleton="{ loading: isLoading, height: '1em' }">第二行</div>
  <div v-skeleton="{ loading: isLoading, height: '1em', width: '80%' }">第三行</div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `loading` | `boolean` | `true` | 是否显示骨架屏 |
| `animation` | `'wave' \| 'pulse' \| 'none'` | `'wave'` | 动画类型 |
| `width` | `string \| number` | `'100%'` | 骨架屏宽度 |
| `height` | `string \| number` | `'1em'` | 骨架屏高度 |
| `radius` | `string \| number` | `'4px'` | 圆角大小 |
| `color` | `string` | `'#e8e8e8'` | 骨架屏颜色 |
| `animationColor` | `string` | `'#f0f0f0'` | 动画颜色（wave 效果） |
| `class` | `string` | - | 自定义类名 |
| `preserveDimensions` | `boolean` | `true` | 是否保留原始内容尺寸 |

### 绑定值类型

```ts
type SkeletonBinding = boolean | SkeletonOptions
```

## Composable 用法

你也可以使用 `useSkeleton` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useSkeleton } from 'directix'

const containerRef = ref(null)
const loading = ref(true)
const { isLoading, show, hide, toggle, bind } = useSkeleton({ 
  loading,
  animation: 'wave'
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">实际内容</div>
  <button @click="toggle">切换加载状态</button>
</template>
```

### API

```typescript
type SkeletonAnimation = 'wave' | 'pulse' | 'none'

interface UseSkeletonOptions {
  /** 是否显示骨架屏 */
  loading?: boolean | Ref<boolean>
  /** 动画类型 */
  animation?: SkeletonAnimation
  /** 骨架屏宽度 */
  width?: string | number
  /** 骨架屏高度 */
  height?: string | number
  /** 圆角大小 */
  radius?: string | number
  /** 骨架屏颜色 */
  color?: string
  /** 动画颜色 */
  animationColor?: string
  /** 自定义类名 */
  class?: string
}

interface UseSkeletonReturn {
  /** 是否正在加载 */
  isLoading: Ref<boolean>
  /** 显示骨架屏 */
  show: () => void
  /** 隐藏骨架屏 */
  hide: () => void
  /** 切换骨架屏 */
  toggle: () => void
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
