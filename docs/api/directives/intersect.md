# v-intersect

Observe element intersection with the viewport using IntersectionObserver.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <div v-intersect="handleIntersect">Observe me</div>
</template>

<script setup>
function handleIntersect(entry, observer) {
  console.log('Intersecting:', entry.isIntersecting)
}
</script>
```

### With Options

```vue
<template>
  <div v-intersect="{
    onEnter: handleEnter,
    onLeave: handleLeave,
    threshold: 0.5
  }">
    Track visibility
  </div>
</template>

<script setup>
function handleEnter(entry, observer) {
  console.log('Element entered viewport')
}

function handleLeave(entry, observer) {
  console.log('Element left viewport')
}
</script>
```

## API

### Types

```typescript
type IntersectHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void

interface IntersectOptions {
  /** Callback when element intersects */
  handler?: IntersectHandler
  /** Callback when element enters viewport */
  onEnter?: IntersectHandler
  /** Callback when element leaves viewport */
  onLeave?: IntersectHandler
  /** Callback when element changes intersection */
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
  /** Root element for intersection */
  root?: Element | null
  /** Margin around the root */
  rootMargin?: string
  /** Threshold(s) at which to trigger callback */
  threshold?: number | number[]
  /** Disable the directive */
  disabled?: boolean
  /** Trigger only once */
  once?: boolean
}

type IntersectBinding = IntersectHandler | IntersectOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when element intersects |
| `onEnter` | `Function` | - | Callback when element enters viewport |
| `onLeave` | `Function` | - | Callback when element leaves viewport |
| `onChange` | `Function` | - | Callback when intersection changes |
| `root` | `Element` | `null` | Root element for intersection |
| `rootMargin` | `string` | `'0px'` | Margin around the root |
| `threshold` | `number \| number[]` | `0` | Threshold(s) to trigger |
| `disabled` | `boolean` | `false` | Disable the directive |
| `once` | `boolean` | `false` | Trigger only once |

## Examples

### Trigger Animation on Scroll

```vue
<template>
  <div v-intersect="{
    onEnter: startAnimation,
    once: true
  }" class="animate-on-scroll">
    This will animate once when visible
  </div>
</template>

<script setup>
function startAnimation(entry) {
  entry.target.classList.add('animated')
}
</script>
```

### Lazy Load Component

```vue
<template>
  <div v-intersect="{
    onEnter: loadComponent,
    rootMargin: '200px'
  }">
    <component :is="loadedComponent" v-if="loaded" />
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const loaded = ref(false)
const loadedComponent = ref(null)

function loadComponent() {
  loadedComponent.value = defineAsyncComponent(() =>
    import('./HeavyComponent.vue')
  )
  loaded.value = true
}
</script>
```

### Track Visibility Percentage

```vue
<template>
  <div v-intersect="{
    threshold: [0, 0.25, 0.5, 0.75, 1],
    onChange: handleVisibilityChange
  }">
    Visibility: {{ visibility }}%
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visibility = ref(0)

function handleVisibilityChange(isIntersecting, entry) {
  visibility.value = Math.round(entry.intersectionRatio * 100)
}
</script>
```
