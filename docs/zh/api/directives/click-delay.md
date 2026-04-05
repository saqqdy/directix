# v-click-delay

Prevent repeated clicks within a specified time period. Perfect for preventing double submissions and spam clicks.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <button v-click-delay="handleClick">Click Me</button>
</template>

<script setup>
import { ref } from 'vue'

function handleClick(event) {
  console.log('Button clicked!')
}
</script>
```

### With Delay Time

```vue
<template>
  <!-- Using argument syntax for delay time -->
  <button v-click-delay:500="handleClick">500ms delay</button>
  <button v-click-delay:1s="handleClick">1s delay</button>
</template>
```

### With Options

```vue
<template>
  <button v-click-delay="{
    handler: handleClick,
    delay: 1000,
    feedback: true
  }">
    Submit
  </button>
</template>
```

## API

### Types

```typescript
type ClickDelayHandler = (event: MouseEvent | TouchEvent) => void

interface ClickDelayOptions {
  handler: ClickDelayHandler
  delay?: number // default: 300
  disabled?: boolean // default: false
  pendingClass?: string // default: 'v-click-delay--pending'
  feedback?: boolean // default: true
}

type ClickDelayBinding = ClickDelayHandler | ClickDelayOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `(event: MouseEvent \| TouchEvent) => void` | - | Click handler (required) |
| `delay` | `number` | `300` | Delay time in milliseconds |
| `disabled` | `boolean` | `false` | Disable the delay behavior |
| `pendingClass` | `string` | `'v-click-delay--pending'` | CSS class added during delay |
| `feedback` | `boolean` | `true` | Whether to add visual feedback |

### CSS Classes

- `v-click-delay--pending` - Added to element during the delay period (customizable via `pendingClass`)

## Composable Usage

You can also use the `useClickDelay` composable for the same functionality:

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
    {{ isPending ? 'Processing...' : 'Submit' }}
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

## Examples

### Form Submission

```vue
<template>
  <form @submit.prevent="submit">
    <button type="submit" v-click-delay="{ handler: submit, delay: 2000 }">
      {{ submitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>
```
