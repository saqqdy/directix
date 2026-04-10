# v-counter

Display animated number counter.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <span v-counter="1000">0</span>
</template>
```

### With Options

```vue
<template>
  <span v-counter="{
    value: 10000,
    duration: 3000,
    decimals: 2,
    useGrouping: true
  }">0</span>
</template>
```

### With Formatter

```vue
<template>
  <span v-counter="{
    value: targetValue,
    formatter: (v) => '$' + v.toFixed(2)
  }">0</span>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `number` | `0` | Target value |
| `duration` | `number` | `2000` | Animation duration in milliseconds |
| `decimals` | `number` | `0` | Number of decimal places |
| `useGrouping` | `boolean` | `true` | Use thousands separator |
| `easing` | `string` | `'easeOutQuart'` | Easing function |
| `formatter` | `(value: number) => string` | - | Custom formatter function |

### Easing Functions

Available easing functions:
- `linear`
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- `easeInExpo`, `easeOutExpo`, `easeInOutExpo`

## Examples

### Currency

```vue
<template>
  <span v-counter="{
    value: 1234.56,
    decimals: 2,
    formatter: (v) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2 })
  }">0</span>
</template>
```

### Large Numbers

```vue
<template>
  <span v-counter="{
    value: 1000000,
    duration: 3000,
    formatter: (v) => {
      if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M'
      if (v >= 1000) return (v / 1000).toFixed(1) + 'K'
      return v.toString()
    }
  }">0</span>
</template>
```

## Composable API

For programmatic use, you can use the `useCounter` composable:

```typescript
import { useCounter } from 'directix'

const { start, pause, reset, update, currentValue } = useCounter({
  startValue: 0,
  endValue: 1000,
  duration: 2000,
  formatter: (v) => `$${v.toFixed(2)}`
})

// Start animation
start()

// Pause animation
pause()

// Reset to start value
reset()

// Update end value
update(2000)
```

### UseCounterReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `start` | `() => void` | Start animation |
| `pause` | `() => void` | Pause animation |
| `reset` | `() => void` | Reset to start value |
| `update` | `(value: number) => void` | Update end value |
| `currentValue` | `Ref<number>` | Current animated value |
## Code Generator

<DirectiveConfigurator name="counter" description="Display animated number counter." />
