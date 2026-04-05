# v-tooltip

在悬停、聚焦或点击时显示工具提示，支持自定义位置和样式。

> **起始版本：** `1.2.0`

## 用法

### 基础用法

```vue
<template>
  <button v-tooltip="'提示文本'">悬停我</button>
</template>
```

### 带选项

```vue
<template>
  <button v-tooltip="{
    content: '提示内容',
    placement: 'top',
    trigger: 'hover'
  }">
    悬停显示提示
  </button>
</template>
```

## API

### 类型

```typescript
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'

interface TooltipOptions {
  /** 提示内容（文本或 HTML） */
  content?: string
  /** 提示位置 @default 'top' */
  placement?: TooltipPlacement
  /** 触发方式 @default 'hover' */
  trigger?: TooltipTrigger
  /** 显示延迟（毫秒）@default 0 */
  delay?: number
  /** 隐藏延迟（毫秒）@default 0 */
  hideDelay?: number
  /** 自定义类名 */
  class?: string
  /** 禁用提示 @default false */
  disabled?: boolean
  /** 与元素的偏移距离（像素）@default 8 */
  offset?: number
  /** z-index @default 9999 */
  zIndex?: number
  /** 最大宽度 */
  maxWidth?: string
  /** 允许 HTML 内容 @default true */
  html?: boolean
  /** 显示箭头 @default true */
  arrow?: boolean
  /** 主题：'dark' 或 'light' @default 'dark' */
  theme?: 'dark' | 'light'
}

type TooltipBinding = string | TooltipOptions
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `content` | `string` | - | 提示内容 |
| `placement` | `string` | `'top'` | 提示位置 |
| `trigger` | `string` | `'hover'` | 触发方式 |
| `delay` | `number` | `0` | 显示延迟（毫秒） |
| `hideDelay` | `number` | `0` | 隐藏延迟（毫秒） |
| `class` | `string` | - | 自定义 CSS 类 |
| `disabled` | `boolean` | `false` | 禁用提示 |
| `offset` | `number` | `8` | 与元素的距离 |
| `zIndex` | `number` | `9999` | z-index |
| `maxWidth` | `string` | - | 最大宽度 |
| `html` | `boolean` | `true` | 允许 HTML 内容 |
| `arrow` | `boolean` | `true` | 显示箭头 |
| `theme` | `string` | `'dark'` | 颜色主题 |

## Composable 用法

你也可以使用 `useTooltip` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useTooltip } from 'directix'

const buttonRef = ref(null)
const { isVisible, show, hide, bind } = useTooltip({
  content: '提示文本',
  placement: 'top',
  trigger: 'hover'
})

onMounted(() => bind(buttonRef.value))

// 编程式控制
function manualShow() {
  show()
}
</script>

<template>
  <button ref="buttonRef">悬停我</button>
</template>
```

### API

```typescript
interface UseTooltipOptions {
  /** 提示内容 */
  content?: string | Ref<string>
  /** 提示位置 */
  placement?: TooltipPlacement
  /** 触发方式 */
  trigger?: TooltipTrigger
  /** 显示延迟（毫秒） */
  delay?: number
  /** 隐藏延迟（毫秒） */
  hideDelay?: number
  /** 是否显示箭头 */
  arrow?: boolean
  /** 自定义 CSS 类 */
  class?: string
  /** 显示时的回调 */
  onShow?: () => void
  /** 隐藏时的回调 */
  onHide?: () => void
  /** 是否禁用 */
  disabled?: boolean | Ref<boolean>
}

interface UseTooltipReturn {
  /** 是否可见 */
  isVisible: Readonly<Ref<boolean>>
  /** 显示提示 */
  show: () => void
  /** 隐藏提示 */
  hide: () => void
  /** 切换提示 */
  toggle: () => void
  /** 绑定提示到元素 */
  bind: (element: HTMLElement) => () => void
}
```

## 示例

### 不同位置

```vue
<template>
  <button v-tooltip="{ content: '上方', placement: 'top' }">上方</button>
  <button v-tooltip="{ content: '下方', placement: 'bottom' }">下方</button>
  <button v-tooltip="{ content: '左侧', placement: 'left' }">左侧</button>
  <button v-tooltip="{ content: '右侧', placement: 'right' }">右侧</button>
</template>
```

### 点击触发

```vue
<template>
  <button v-tooltip="{ content: '点击提示', trigger: 'click' }">
    点击我
  </button>
</template>
```
