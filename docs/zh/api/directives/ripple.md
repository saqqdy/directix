# v-ripple

为元素添加 Material Design 波纹效果。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <button v-ripple>点击我</button>
</template>
```

### 带颜色

```vue
<template>
  <button v-ripple="'rgba(255, 255, 255, 0.3)'">自定义颜色</button>
</template>
```

### 带选项

```vue
<template>
  <button v-ripple="{ color: 'red', duration: 800 }">自定义选项</button>
</template>
```

## Composable 用法

你也可以使用 `useRipple` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRipple } from 'directix'

const buttonRef = ref(null)
const { bind, trigger } = useRipple({
  color: 'rgba(255, 255, 255, 0.3)',
  duration: 600
})

onMounted(() => bind(buttonRef.value))

// 编程式触发波纹
function handleCustomTrigger() {
  trigger({ x: 50, y: 25 }) // 相对于元素的位置
}
</script>

<template>
  <button ref="buttonRef">点击我</button>
</template>
```

### API

```typescript
interface UseRippleOptions {
  /** 波纹颜色 */
  color?: string | Ref<string>
  /** 动画持续时间（毫秒） */
  duration?: number | Ref<number>
  /** 是否禁用波纹 */
  disabled?: boolean | Ref<boolean>
  /** 初始缩放 */
  initialScale?: number
  /** 最终缩放 */
  finalScale?: number
}

interface UseRippleReturn {
  /** 绑定波纹效果到元素 */
  bind: (element: HTMLElement) => () => void
  /** 手动触发波纹效果 */
  trigger: (event?: { x?: number, y?: number }) => void
}
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `color` | `string` | `'currentColor'` | 波纹颜色 |
| `duration` | `number` | `600` | 动画持续时间（毫秒） |
| `disabled` | `boolean` | `false` | 禁用波纹效果 |
