# v-click-delay

在指定时间内防止重复点击。非常适合防止重复提交和恶意点击。

> **起始版本：** `1.3.0`

## 用法

### 基本

```vue
<template>
  <button v-click-delay="handleClick">点击我</button>
</template>

<script setup>
import { ref } from 'vue'

function handleClick(event) {
  console.log('按钮被点击！')
}
</script>
```

### 指定延迟时间

```vue
<template>
  <!-- 使用参数语法指定延迟时间 -->
  <button v-click-delay:500="handleClick">500ms 延迟</button>
  <button v-click-delay:1s="handleClick">1s 延迟</button>
</template>
```

### 带选项

```vue
<template>
  <button v-click-delay="{
    handler: handleClick,
    delay: 1000,
    feedback: true
  }">
    提交
  </button>
</template>
```

## API

### 类型

```typescript
type ClickDelayHandler = (event: MouseEvent | TouchEvent) => void

interface ClickDelayOptions {
  handler: ClickDelayHandler
  delay?: number // 默认: 300
  disabled?: boolean // 默认: false
  pendingClass?: string // 默认: 'v-click-delay--pending'
  feedback?: boolean // 默认: true
}

type ClickDelayBinding = ClickDelayHandler | ClickDelayOptions
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `(event: MouseEvent \| TouchEvent) => void` | - | 点击处理程序（必填） |
| `delay` | `number` | `300` | 延迟时间（毫秒） |
| `disabled` | `boolean` | `false` | 是否禁用延迟行为 |
| `pendingClass` | `string` | `'v-click-delay--pending'` | 延迟期间添加的 CSS 类名 |
| `feedback` | `boolean` | `true` | 是否添加视觉反馈 |

### CSS 类名

- `v-click-delay--pending` - 在延迟期间添加到元素上（可通过 `pendingClass` 自定义）

## Composable 用法

你也可以使用 `useClickDelay` composable 实现相同功能：

```vue
<script setup>
import { useClickDelay } from 'directix'

const { click, isPending } = useClickDelay({
  handler: async (event) => {
    await submitForm()
  },
  delay: 500
})
</script>

<template>
  <button @click="click" :disabled="isPending">
    {{ isPending ? '处理中...' : '提交' }}
  </button>
</template>
```

### API

```typescript
type ClickDelayHandler = (event: MouseEvent | TouchEvent) => void

interface UseClickDelayOptions {
  /** 点击处理程序（必填） */
  handler: ClickDelayHandler
  /** 延迟时间（毫秒） @default 300 */
  delay?: number | Ref<number>
  /** 是否禁用 @default false */
  disabled?: boolean | Ref<boolean>
}

interface UseClickDelayReturn {
  /** 是否正在等待 */
  isPending: Ref<boolean>
  /** 触发点击处理程序（带延迟保护） */
  click: (event: MouseEvent | TouchEvent) => void
  /** 手动重置等待状态 */
  reset: () => void
  /** 取消任何等待中的超时 */
  cancel: () => void
}
```

## 示例

### 表单提交

```vue
<template>
  <form @submit.prevent="submit">
    <button type="submit" v-click-delay="{ handler: submit, delay: 2000 }">
      {{ submitting ? '提交中...' : '提交' }}
    </button>
  </form>
</template>
```
