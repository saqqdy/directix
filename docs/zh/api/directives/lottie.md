# v-lottie

Lottie 动画播放器。

> **起始版本：** `1.5.0`

## 用法

### 使用 URL

```vue
<template>
  <div v-lottie="'https://assets.example.com/animation.json'"></div>
</template>
```

### 使用动画数据

```vue
<template>
  <div v-lottie="animationData"></div>
</template>

<script setup>
import animationData from './animation.json'
</script>
```

### 带选项

```vue
<template>
  <div v-lottie="{
    animationData: animationData,
    autoplay: true,
    loop: true,
    speed: 1.5,
    onComplete: () => console.log('动画完成')
  }"></div>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `animationData` | `object \| string` | - | 动画数据或 URL |
| `autoplay` | `boolean` | `true` | 是否自动播放 |
| `loop` | `boolean` | `true` | 是否循环播放 |
| `speed` | `number` | `1` | 播放速度（0.1-3） |
| `direction` | `1 \| -1` | `1` | 播放方向（1 正向，-1 反向） |
| `segments` | `[number, number]` | - | 播放片段 [起始帧, 结束帧] |
| `renderer` | `'svg' \| 'canvas' \| 'html'` | `'svg'` | 渲染方式 |
| `preserveAspectRatio` | `boolean` | `true` | 是否保持宽高比 |
| `class` | `string` | - | 容器自定义类名 |
| `onReady` | `(animation: any) => void` | - | 动画就绪回调 |
| `onComplete` | `() => void` | - | 动画完成回调 |
| `onLoopComplete` | `() => void` | - | 循环完成回调 |
| `onEnterFrame` | `(frame: number) => void` | - | 帧更新回调 |

### 绑定值类型

```ts
type LottieBinding = string | object | LottieOptions
```

### 元素方法

应用指令后，元素会获得以下方法：

```js
el.lottiePlay()                           // 播放
el.lottiePause()                          // 暂停
el.lottieStop()                           // 停止
el.lottieSetSpeed(speed)                  // 设置速度
el.lottieSetDirection(direction)          // 设置方向
el.lottieGoToAndPlay(frame, isFrame)      // 跳转到帧并播放
el.lottieGoToAndStop(frame, isFrame)      // 跳转到帧并停止
```

## 依赖

需要安装 `lottie-web`：

```bash
npm install lottie-web
```

## Composable 用法

你也可以使用 `useLottie` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useLottie } from 'directix'
import animationData from './animation.json'

const containerRef = ref(null)
const { play, pause, stop, setSpeed, bind } = useLottie({
  animationData,
  autoplay: true,
  loop: true,
  onReady: () => console.log('动画就绪')
})

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef"></div>
  <button @click="play">播放</button>
  <button @click="pause">暂停</button>
  <button @click="stop">停止</button>
</template>
```

### API

```typescript
type LottieAnimationState = 'playing' | 'paused' | 'stopped'

interface UseLottieOptions {
  /** 动画数据或 URL */
  animationData: object | string | Ref<object | string>
  /** 自动播放 */
  autoplay?: boolean
  /** 循环播放 */
  loop?: boolean
  /** 播放速度 */
  speed?: number | Ref<number>
  /** 播放方向 */
  direction?: 1 | -1
  /** 渲染方式 */
  renderer?: 'svg' | 'canvas' | 'html'
  /** 就绪回调 */
  onReady?: (animation: any) => void
  /** 完成回调 */
  onComplete?: () => void
  /** 循环完成回调 */
  onLoopComplete?: () => void
}

interface UseLottieReturn {
  /** 动画状态 */
  state: Ref<LottieAnimationState>
  /** 动画实例 */
  animation: Ref<any>
  /** 播放 */
  play: () => void
  /** 暂停 */
  pause: () => void
  /** 停止 */
  stop: () => void
  /** 设置速度 */
  setSpeed: (speed: number) => void
  /** 设置方向 */
  setDirection: (direction: 1 | -1) => void
  /** 跳转到帧并播放 */
  goToAndPlay: (frame: number, isFrame?: boolean) => void
  /** 跳转到帧并停止 */
  goToAndStop: (frame: number, isFrame?: boolean) => void
  /** 绑定到元素 */
  bind: (element: HTMLElement) => () => void
}
```
