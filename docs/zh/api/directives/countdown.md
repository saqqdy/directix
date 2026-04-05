# v-countdown

Display a countdown timer to a target time. Supports multiple formats and completion callbacks.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <span v-countdown="targetDate"></span>
</template>

<script setup>
const targetDate = new Date('2026-12-31T00:00:00')
</script>
```

### With Timestamp

```vue
<template>
  <span v-countdown="Date.now() + 60000"></span>
</template>
```

### With Options

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

### Types

```typescript
interface CountdownOptions {
  target: Date | number | string
  format?: string | ((time: CountdownTime) => string)
  interval?: number // default: 1000
  onComplete?: () => void
  onTick?: (time: CountdownTime) => void
  autoStart?: boolean // default: true
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

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `target` | `Date \| number \| string` | - | Target time (required) |
| `format` | `string \| Function` | `'hh:mm:ss'` | Display format or custom function |
| `interval` | `number` | `1000` | Update interval in milliseconds |
| `onComplete` | `() => void` | - | Callback when countdown ends |
| `onTick` | `(time: CountdownTime) => void` | - | Callback on each tick |
| `autoStart` | `boolean` | `true` | Auto-start countdown |

### Format Placeholders

| Placeholder | Description |
| ----------- | ----------- |
| `dd` | Days (2 digits) |
| `hh` | Hours (2 digits) |
| `mm` | Minutes (2 digits) |
| `ss` | Seconds (2 digits) |
| `SSS` | Milliseconds (3 digits) |

## Composable Usage

You can also use the `useCountdown` composable:

```vue
<script setup>
import { useCountdown } from 'directix'

const targetDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

const { time, formatted, running, completed, pause, resume, reset } = useCountdown({
  target: targetDate,
  format: 'hh:mm:ss',
  onComplete: () => console.log('Done!')
})
</script>

<template>
  <div>
    <p>{{ formatted }}</p>
    <p>Remaining: {{ time.days }}d {{ time.hours }}h {{ time.minutes }}m {{ time.seconds }}s</p>
    <button @click="pause" v-if="running">Pause</button>
    <button @click="resume" v-if="!running && !completed">Resume</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### API

```typescript
interface UseCountdownOptions {
  /** Target time (Date object, timestamp, or ISO string) */
  target: Date | number | string | Ref<Date | number | string>
  /** Format string or custom format function */
  format?: string | CountdownFormatFunction | Ref<string | CountdownFormatFunction>
  /** Callback when countdown completes */
  onComplete?: () => void
  /** Callback on each tick */
  onTick?: (time: CountdownTime) => void
  /** Update interval in milliseconds */
  interval?: number | Ref<number>
  /** Whether to auto-start */
  autoStart?: boolean | Ref<boolean>
}

interface UseCountdownReturn {
  /** Current countdown time */
  time: Ref<CountdownTime>
  /** Formatted time string */
  formatted: Ref<string>
  /** Whether countdown is running */
  running: Ref<boolean>
  /** Whether countdown is paused */
  paused: Ref<boolean>
  /** Whether countdown has completed */
  completed: Ref<boolean>
  /** Start the countdown */
  start: () => void
  /** Pause the countdown */
  pause: () => void
  /** Resume the countdown */
  resume: () => void
  /** Reset the countdown */
  reset: () => void
}
```

## Examples

### Sale Countdown

```vue
<template>
  <div class="sale-banner">
    Sale ends in: <span v-countdown="{ target: saleEnd, format: 'dd:hh:mm:ss' }"></span>
  </div>
</template>
```

### Custom Format

```vue
<template>
  <span v-countdown="{
    target: targetDate,
    format: (time) => `${time.days}d ${time.hours}h ${time.minutes}m`
  }"></span>
</template>
```

### With Completion Callback

```vue
<template>
  <span
    v-countdown="{
      target: Date.now() + 5000,
      format: 'ss',
      onComplete: () => completed = true
    }"
  ></span>
  <span v-if="completed">Done!</span>
</template>
```
