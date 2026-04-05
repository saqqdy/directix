# v-parallax

视差滚动效果。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-parallax>视差内容</div>
</template>
```

### 指定速度

```vue
<template>
  <div v-parallax="0.3">较慢的视差效果</div>
</template>
```

### 带选项

```vue
<template>
  <div v-parallax="{
    speed: 0.5,
    reverse: true,
    mobileBreakpoint: 768
  }">
    反向视差，移动端禁用
  </div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `speed` | `number` | `0.5` | 视差速度因子（0-1） |
| `enabled` | `boolean` | `true` | 是否启用视差 |
| `minScroll` | `number` | - | 最小滚动位置 |
| `maxScroll` | `number` | - | 最大滚动位置 |
| `reverse` | `boolean` | `false` | 是否反向 |
| `horizontal` | `boolean` | `false` | 是否水平视差 |
| `transform` | `(offset: number, el: HTMLElement) => string` | - | 自定义变换函数 |
| `useTransform` | `boolean` | `true` | 是否使用 CSS transform |
| `mobileBreakpoint` | `number` | - | 移动端断点（低于此宽度禁用） |

### 绑定值类型

```ts
type ParallaxBinding = boolean | number | ParallaxOptions
```

## Composable 用法

你也可以使用 `useParallax` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useParallax } from 'directix'

const containerRef = ref(null)
const { offset, isActive, bind } = useParallax({ 
  speed: 0.5,
  reverse: false
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">视差内容</div>
  <p>偏移: {{ offset }}px, 激活: {{ isActive }}</p>
</template>
```

### API

```typescript
interface UseParallaxOptions {
  /** 视差速度因子 */
  speed?: number | Ref<number>
  /** 是否启用 */
  enabled?: boolean | Ref<boolean>
  /** 是否反向 */
  reverse?: boolean
  /** 是否水平视差 */
  horizontal?: boolean
  /** 自定义变换函数 */
  transform?: (offset: number, el: HTMLElement) => string
  /** 移动端断点 */
  mobileBreakpoint?: number
}

interface UseParallaxReturn {
  /** 当前偏移 */
  offset: Ref<number>
  /** 视差是否激活 */
  isActive: Ref<boolean>
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
