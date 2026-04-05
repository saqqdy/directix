# v-sticky

滚动时使元素保持粘性。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <div v-sticky>粘性头部</div>
</template>
```

### 带偏移

```vue
<template>
  <div v-sticky="50">距顶部 50px 的粘性</div>
</template>
```

### 带选项

```vue
<template>
  <div v-sticky="{
    top: 60,
    zIndex: 1000,
    stickyClass: 'is-sticky'
  }">
    自定义粘性
  </div>
</template>
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `top` | `number \| string` | `0` | 粘性时的顶部偏移 |
| `zIndex` | `number` | `100` | 粘性时的 z-index |
| `stickyClass` | `string` | `'v-sticky--fixed'` | 粘性时的 CSS 类 |
| `onChange` | `Function` | - | 粘性状态改变时的回调 |

## Composable 用法

你也可以使用 `useSticky` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useSticky } from 'directix'

const headerRef = ref(null)
const { isSticky, bind } = useSticky({
  offsetTop: 60,
  onStick: (sticky) => console.log('粘性状态:', sticky)
})

onMounted(() => bind(headerRef.value))
</script>

<template>
  <header ref="headerRef" :class="{ sticky: isSticky }">
    导航栏
  </header>
</template>
```

### API

```typescript
interface UseStickyOptions {
  /** 距顶部的偏移量（像素） @default 0 */
  offsetTop?: number | Ref<number>
  /** 粘性状态改变时的回调 */
  onStick?: (isSticky: boolean) => void
  /** 是否禁用 @default false */
  disabled?: boolean | Ref<boolean>
}

interface UseStickyReturn {
  /** 元素是否处于粘性状态 */
  isSticky: Readonly<Ref<boolean>>
  /** 绑定元素 */
  bind: (element: HTMLElement) => () => void
  /** 停止观察 */
  stop: () => void
}
```
