# v-countdown

显示到目标时间的倒计时。支持多种格式和完成回调。

> **起始版本：** `1.3.0`

## 用法

### 基本

```vue
<template>
  <span v-countdown="targetDate"></span>
</template>

<script setup>
const targetDate = new Date('2026-12-31T00:00:00')
</script>
```

### 使用时间戳

```vue
<template>
  <span v-countdown="Date.now() + 60000"></span>
</template>
```

### 带选项

```vue
<template>
  <span v-countdown="{
    target: targetDate,
    format: 'dd:hh:mm:ss',
    onComplete: handleComplete
  }"></span>
</template>
```

## API

### 类型

```typescript
interface CountdownOptions {
  target: Date | number | string
  format?: string | ((time: CountdownTime) => string)
  interval?: number // 默认: 1000
  onComplete?: () => void
  onTick?: (time: CountdownTime) => void
  autoStart?: boolean // 默认: true
}

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  total: number
}
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `target` | `Date \| number \| string` | - | 目标时间（必填） |
| `format` | `string \| Function` | `'hh:mm:ss'` | 显示格式或自定义函数 |
| `interval` | `number` | `1000` | 更新间隔（毫秒） |
| `onComplete` | `() => void` | - | 倒计时结束时的回调 |
| `onTick` | `(time: CountdownTime) => void` | - | 每次更新的回调 |
| `autoStart` | `boolean` | `true` | 是否自动开始倒计时 |

### 格式占位符

| 占位符 | 描述 |
| ------ | ---- |
| `dd` | 天数（2位数） |
| `hh` | 小时（2位数） |
| `mm` | 分钟（2位数） |
| `ss` | 秒数（2位数） |
| `SSS` | 毫秒（3位数） |

## Composable 用法

你也可以使用 `useCountdown` composable：

```vue
<script setup>
import { useCountdown } from 'directix'

const targetDate = new Date(Date.now() + 60 * 60 * 1000) // 1小时后

const { time, formatted, running, completed, pause, resume, reset } = useCountdown({
  target: targetDate,
  format: 'hh:mm:ss',
  onComplete: () => console.log('完成！')
})
</script>

<template>
  <div>
    <p>{{ formatted }}</p>
    <p>剩余: {{ time.days }}天 {{ time.hours }}时 {{ time.minutes }}分 {{ time.seconds }}秒</p>
    <button @click="pause" v-if="running">暂停</button>
    <button @click="resume" v-if="!running && !completed">继续</button>
    <button @click="reset">重置</button>
  </div>
</template>
```

### API

```typescript
interface UseCountdownOptions {
  /** 目标时间（Date 对象、时间戳或 ISO 字符串） */
  target: Date | number | string | Ref<Date | number | string>
  /** 格式字符串或自定义格式函数 */
  format?: string | CountdownFormatFunction | Ref<string | CountdownFormatFunction>
  /** 倒计时完成时的回调 */
  onComplete?: () => void
  /** 每次更新的回调 */
  onTick?: (time: CountdownTime) => void
  /** 更新间隔（毫秒） */
  interval?: number | Ref<number>
  /** 是否自动开始 */
  autoStart?: boolean | Ref<boolean>
}

interface UseCountdownReturn {
  /** 当前倒计时时间 */
  time: Ref<CountdownTime>
  /** 格式化后的时间字符串 */
  formatted: Ref<string>
  /** 倒计时是否运行中 */
  running: Ref<boolean>
  /** 倒计时是否暂停 */
  paused: Ref<boolean>
  /** 倒计时是否已完成 */
  completed: Ref<boolean>
  /** 开始倒计时 */
  start: () => void
  /** 暂停倒计时 */
  pause: () => void
  /** 继续倒计时 */
  resume: () => void
  /** 重置倒计时 */
  reset: () => void
}
```

## 示例

### 促销倒计时

```vue
<template>
  <div class="sale-banner">
    促销结束倒计时: <span v-countdown="{ target: saleEnd, format: 'dd:hh:mm:ss' }"></span>
  </div>
</template>
```

### 自定义格式

```vue
<template>
  <span v-countdown="{
    target: targetDate,
    format: (time) => `${time.days}天 ${time.hours}时 ${time.minutes}分`
  }"></span>
</template>
```

### 带完成回调

```vue
<template>
  <span
    v-countdown="{
      target: Date.now() + 5000,
      format: 'ss',
      onComplete: () => completed = true
    }"
  ></span>
  <span v-if="completed">已完成！</span>
</template>
```
