# v-tooltip

Display tooltips on hover, focus, or click with customizable positioning and styling.

> **Since:** `1.2.0`

## Usage

### Basic

```vue
<template>
  <button v-tooltip="'Tooltip text'">Hover me</button>
</template>
```

### With Options

```vue
<template>
  <button v-tooltip="{
    content: 'Tooltip content',
    placement: 'top',
    trigger: 'hover'
  }">
    Hover for tooltip
  </button>
</template>
```

### Rich Content

```vue
<template>
  <span v-tooltip="{ content: '<strong>Bold</strong> tooltip' }">
    Rich tooltip
  </span>
</template>
```

## API

### Types

```typescript
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'

interface TooltipOptions {
  /** Tooltip content (text or HTML) */
  content?: string
  /** Tooltip placement @default 'top' */
  placement?: TooltipPlacement
  /** Trigger type @default 'hover' */
  trigger?: TooltipTrigger
  /** Show delay in milliseconds @default 0 */
  delay?: number
  /** Hide delay in milliseconds @default 0 */
  hideDelay?: number
  /** Custom class for tooltip */
  class?: string
  /** Disable tooltip @default false */
  disabled?: boolean
  /** Offset from element in pixels @default 8 */
  offset?: number
  /** Z-index @default 9999 */
  zIndex?: number
  /** Maximum width */
  maxWidth?: string
  /** Allow HTML content @default true */
  html?: boolean
  /** Show arrow @default true */
  arrow?: boolean
  /** Theme: 'dark' or 'light' @default 'dark' */
  theme?: 'dark' | 'light'
}

type TooltipBinding = string | TooltipOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `content` | `string` | - | Tooltip content |
| `placement` | `string` | `'top'` | Tooltip position |
| `trigger` | `string` | `'hover'` | How to trigger tooltip |
| `delay` | `number` | `0` | Show delay (ms) |
| `hideDelay` | `number` | `0` | Hide delay (ms) |
| `class` | `string` | - | Custom CSS class |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `offset` | `number` | `8` | Distance from element |
| `zIndex` | `number` | `9999` | Z-index |
| `maxWidth` | `string` | - | Maximum width |
| `html` | `boolean` | `true` | Allow HTML content |
| `arrow` | `boolean` | `true` | Show arrow |
| `theme` | `string` | `'dark'` | Color theme |

## Examples

### Different Placements

```vue
<template>
  <div class="demo-grid">
    <button v-tooltip="{ content: 'Top', placement: 'top' }">Top</button>
    <button v-tooltip="{ content: 'Bottom', placement: 'bottom' }">Bottom</button>
    <button v-tooltip="{ content: 'Left', placement: 'left' }">Left</button>
    <button v-tooltip="{ content: 'Right', placement: 'right' }">Right</button>
  </div>
</template>
```

### Click Trigger

```vue
<template>
  <button v-tooltip="{ content: 'Click tooltip', trigger: 'click' }">
    Click me
  </button>
</template>
```

### Manual Control

```vue
<template>
  <button
    v-tooltip="{
      content: 'Manual tooltip',
      trigger: 'manual',
      show: isVisible
    }"
    @click="isVisible = !isVisible"
  >
    Toggle tooltip
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
</script>
```

### Light Theme

```vue
<template>
  <button v-tooltip="{ content: 'Light tooltip', theme: 'light' }">
    Light theme
  </button>
</template>
```

## Composable API

For programmatic use, you can use the `useTooltip` composable:

```typescript
import { useTooltip } from 'directix'

const { isVisible, show, hide, toggle, bind } = useTooltip({
  content: 'Tooltip text',
  placement: 'top',
  trigger: 'hover',
  delay: 0,
  hideDelay: 0,
  arrow: true
})
```

### UseTooltipOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `content` | `string \| Ref<string>` | - | Tooltip content |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip placement |
| `trigger` | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | Trigger type |
| `delay` | `number` | `0` | Show delay (ms) |
| `hideDelay` | `number` | `0` | Hide delay (ms) |
| `arrow` | `boolean` | `true` | Show arrow |
| `class` | `string` | - | Custom CSS class |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable tooltip |
| `onShow` | `() => void` | - | Callback when tooltip shows |
| `onHide` | `() => void` | - | Callback when tooltip hides |

### UseTooltipReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isVisible` | `Readonly<Ref<boolean>>` | Whether tooltip is visible |
| `show` | `() => void` | Show the tooltip |
| `hide` | `() => void` | Hide the tooltip |
| `toggle` | `() => void` | Toggle the tooltip |
| `bind` | `(element: HTMLElement) => () => void` | Bind tooltip to an element |

### Example

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useTooltip } from 'directix'

const buttonRef = ref(null)

const { isVisible, bind } = useTooltip({
  content: 'Tooltip text',
  placement: 'top'
})

onMounted(() => {
  if (buttonRef.value) {
    bind(buttonRef.value)
  }
})
</script>

<template>
  <button ref="buttonRef">Hover me</button>
</template>
```
## Code Generator

<DirectiveConfigurator name="tooltip" description="Display tooltips on hover, focus, or click with customizable positioning and styling." />
