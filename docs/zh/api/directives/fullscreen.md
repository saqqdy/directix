# v-fullscreen

切换元素全屏模式。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-fullscreen>
    全屏内容
    <button @click="$el.toggleFullscreen()">切换全屏</button>
  </div>
</template>
```

### 初始全屏

```vue
<template>
  <div v-fullscreen="{ initialState: true }">
    初始即为全屏
  </div>
</template>
```

### 带选项

```vue
<template>
  <div v-fullscreen="{
    fullscreenClass: 'my-fullscreen',
    onEnter: () => console.log('进入全屏'),
    onExit: () => console.log('退出全屏')
  }">
    全屏内容
  </div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `initialState` | `boolean` | `false` | 是否初始进入全屏 |
| `fullscreenClass` | `string` | - | 全屏时的自定义类名 |
| `toggleKey` | `string \| false` | `'Escape'` | 退出全屏的快捷键，设为 false 禁用 |
| `onEnter` | `() => void` | - | 进入全屏时的回调 |
| `onExit` | `() => void` | - | 退出全屏时的回调 |
| `onChange` | `(isFullscreen: boolean) => void` | - | 全屏状态变化时的回调 |

### 绑定值类型

```ts
type FullscreenBinding = boolean | FullscreenOptions
```

### 元素方法

应用指令后，元素会获得 `toggleFullscreen()` 方法：

```js
el.toggleFullscreen() // 切换全屏状态
```

## Composable 用法

你也可以使用 `useFullscreen` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFullscreen } from 'directix'

const containerRef = ref(null)
const { isFullscreen, enter, exit, toggle, bind } = useFullscreen({
  fullscreenClass: 'my-fullscreen',
  onEnter: () => console.log('进入全屏'),
  onExit: () => console.log('退出全屏')
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">
    <button @click="toggle">
      {{ isFullscreen ? '退出' : '进入' }}全屏
    </button>
  </div>
</template>
```

### API

```typescript
interface UseFullscreenOptions {
  /** 全屏时的自定义类名 */
  fullscreenClass?: string
  /** 进入全屏时的回调 */
  onEnter?: () => void
  /** 退出全屏时的回调 */
  onExit?: () => void
  /** 全屏状态变化时的回调 */
  onChange?: (isFullscreen: boolean) => void
}

interface UseFullscreenReturn {
  /** 是否处于全屏模式 */
  isFullscreen: Ref<boolean>
  /** 进入全屏 */
  enter: () => Promise<void>
  /** 退出全屏 */
  exit: () => Promise<void>
  /** 切换全屏 */
  toggle: () => Promise<void>
  /** 绑定全屏到元素 */
  bind: (element: HTMLElement) => () => void
}
```
