# v-lazy

图片进入视口时懒加载。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <img v-lazy="imageUrl" />
  <img v-lazy="{ src: imageUrl, placeholder: 'placeholder.jpg' }" />
  <div v-lazy="backgroundImageUrl"></div>
</template>
```

### 带选项

```vue
<template>
  <img v-lazy="{
    src: imageUrl,
    placeholder: 'placeholder.jpg',
    error: 'error.jpg',
    preload: 100,
    attempt: 3
  }" />
</template>
```

## Composable 用法

你也可以使用 `useLazy` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useLazy } from 'directix'

const imageRef = ref(null)
const { state, isLoading, isLoaded, bind } = useLazy({
  src: 'https://example.com/image.jpg',
  placeholder: '/placeholder.jpg',
  error: '/error.jpg',
  preload: 100
})

onMounted(() => bind(imageRef.value))
</script>

<template>
  <img ref="imageRef" />
  <p v-if="isLoading">加载中...</p>
</template>
```

### API

```typescript
type LazyState = 'pending' | 'loading' | 'loaded' | 'error'

interface UseLazyOptions {
  /** 图片源 URL */
  src?: string | Ref<string>
  /** 占位图 URL */
  placeholder?: string
  /** 错误图 URL */
  error?: string
  /** 预加载距离（像素） */
  preload?: number
  /** 加载成功回调 */
  onLoad?: (el: HTMLElement) => void
  /** 加载失败回调 */
  onError?: (el: HTMLElement, error: Error) => void
  /** 重试次数 */
  attempt?: number
}

interface UseLazyReturn {
  /** 当前加载状态 */
  state: Readonly<Ref<LazyState>>
  /** 是否正在加载 */
  isLoading: Readonly<Ref<boolean>>
  /** 是否已加载成功 */
  isLoaded: Readonly<Ref<boolean>>
  /** 是否加载失败 */
  hasError: Readonly<Ref<boolean>>
  /** 绑定懒加载到元素 */
  bind: (element: HTMLElement) => () => void
  /** 手动触发加载 */
  load: () => void
  /** 重置状态 */
  reset: () => void
}
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `src` | `string` | - | 图片源 URL |
| `placeholder` | `string` | - | 占位图 URL |
| `error` | `string` | - | 错误图 URL |
| `preload` | `number` | `0` | 预加载距离（像素） |
| `attempt` | `number` | `1` | 重试次数 |
| `onLoad` | `Function` | - | 加载成功回调 |
| `onError` | `Function` | - | 加载失败回调 |
