# v-sticky

Make elements sticky when scrolling.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <div v-sticky>Sticky header</div>
</template>
```

### With Offset

```vue
<template>
  <div v-sticky="50">Sticky with 50px top offset</div>
</template>
```

### With Options

```vue
<template>
  <div v-sticky="{
    top: 60,
    zIndex: 1000,
    stickyClass: 'is-sticky'
  }">
    Custom sticky
  </div>
</template>
```

## API

### Types

```typescript
interface StickyOptions {
  /** Top offset when sticky */
  top?: number | string
  /** Bottom offset when sticky */
  bottom?: number | string
  /** Z-index when sticky */
  zIndex?: number
  /** CSS class to add when sticky */
  stickyClass?: string
  /** Disable the directive */
  disabled?: boolean
  /** Callback when sticky state changes */
  onChange?: (isSticky: boolean) => void
  /** Custom scroll container */
  container?: string | Element | null
}

type StickyBinding = boolean | number | StickyOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `top` | `number \| string` | `0` | Top offset when sticky |
| `bottom` | `number \| string` | - | Bottom offset when sticky |
| `zIndex` | `number` | `100` | Z-index when sticky |
| `stickyClass` | `string` | `'v-sticky--fixed'` | CSS class when sticky |
| `disabled` | `boolean` | `false` | Disable the directive |
| `onChange` | `Function` | - | Callback when sticky state changes |
| `container` | `string \| Element` | - | Custom scroll container |

## Examples

### Sticky Navigation

```vue
<template>
  <nav v-sticky class="navbar">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</template>

<style>
.navbar {
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar.v-sticky--fixed {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
</style>
```

### Table Header

```vue
<template>
  <table>
    <thead v-sticky="{ top: 60, zIndex: 10 }">
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <!-- rows -->
    </tbody>
  </table>
</template>
```

### Detect State Change

```vue
<template>
  <div v-sticky="{
    top: 0,
    onChange: handleStickyChange
  }">
    {{ isSticky ? 'Sticky' : 'Normal' }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSticky = ref(false)

function handleStickyChange(sticky) {
  isSticky.value = sticky
}
</script>
```

## Composable API

For programmatic use, you can use the `useSticky` composable:

```typescript
import { useSticky } from 'directix'

const { isSticky, bind, stop } = useSticky({
  offsetTop: 0,
  onStick: (isSticky) => console.log('Sticky:', isSticky),
  disabled: false
})

// Bind to element
onMounted(() => bind(headerRef.value))
```

### UseStickyOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `offsetTop` | `number \| Ref<number>` | `0` | Offset from top in pixels |
| `onStick` | `(isSticky: boolean) => void` | - | Callback when stick state changes |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable sticky behavior |

### UseStickyReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isSticky` | `Readonly<Ref<boolean>>` | Whether the element is sticky |
| `bind` | `(element: HTMLElement) => () => void` | Bind sticky behavior to an element |
| `stop` | `() => void` | Stop observing |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useSticky } from 'directix'

const headerRef = ref(null)
const { isSticky, bind } = useSticky({
  offsetTop: 60,
  onStick: (sticky) => console.log('Sticky:', sticky)
})

onMounted(() => bind(headerRef.value))
</script>

<template>
  <header ref="headerRef" :class="{ sticky: isSticky }">
    Navigation
  </header>
</template>
```
