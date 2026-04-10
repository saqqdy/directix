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

## Composable API

For programmatic use, you can use the `useCountdown` composable:

```typescript
import { useCountdown, parseTargetTime, calculateTime, formatTime } from 'directix'

const {
  time,
  formatted,
  running,
  paused,
  completed,
  start,
  pause,
  resume,
  reset
} = useCountdown({
  target: targetDate,
  format: 'hh:mm:ss',
  interval: 1000,
  autoStart: true,
  onComplete: () => console.log('Done!'),
  onTick: (time) => console.log('Tick:', time)
})

// Control countdown
start()
pause()
resume()
reset()
```

### UseCountdownOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `target` | `Date \| number \| string \| Ref` | - | Target time (required) |
| `format` | `string \| Function \| Ref` | `'hh:mm:ss'` | Display format or custom function |
| `interval` | `number \| Ref<number>` | `1000` | Update interval in milliseconds |
| `autoStart` | `boolean \| Ref<boolean>` | `true` | Auto-start countdown |
| `onComplete` | `() => void` | - | Callback when countdown ends |
| `onTick` | `(time: CountdownTime) => void` | - | Callback on each tick |
| `showMilliseconds` | `boolean \| Ref<boolean>` | `false` | Show milliseconds |
| `labels` | `object` | - | Custom labels for i18n |

### UseCountdownReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `time` | `Ref<CountdownTime>` | Current countdown time object |
| `formatted` | `Ref<string>` | Formatted time string |
| `running` | `Ref<boolean>` | Whether countdown is running |
| `paused` | `Ref<boolean>` | Whether countdown is paused |
| `completed` | `Ref<boolean>` | Whether countdown has completed |
| `start` | `() => void` | Start the countdown |
| `pause` | `() => void` | Pause the countdown |
| `resume` | `() => void` | Resume the countdown |
| `reset` | `() => void` | Reset the countdown |

### Example

```vue
<script setup>
import { useCountdown } from 'directix'

const targetDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

const { formatted, running, completed, pause, resume } = useCountdown({
  target: targetDate,
  format: 'hh:mm:ss',
  onComplete: () => console.log('Done!')
})
</script>

<template>
  <div>
    <p>{{ formatted }}</p>
    <button @click="pause" v-if="running">Pause</button>
    <button @click="resume" v-if="!running && !completed">Resume</button>
  </div>
</template>
```
## Code Generator

<DirectiveConfigurator name="countdown" description="Display a countdown timer to a target time. Supports multiple formats and completion callbacks." />
