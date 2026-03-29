# Event Directives

Event directives help you manage DOM events more efficiently.

## v-click-outside

Detect clicks outside an element. Perfect for closing dropdowns, modals, and popovers.

### Basic Usage

```vue
<template>
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">Toggle</button>
    <div v-if="show">Dropdown content</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function closeDropdown() {
  show.value = false
}
</script>
```

### With Options

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    exclude: ['.ignore'],
    events: ['click', 'touchstart']
  }">
    <!-- content -->
  </div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `(event: MouseEvent \| TouchEvent) => void` | - | Callback when click outside detected |
| `exclude` | `(string \| HTMLElement \| (() => HTMLElement))[]` | `[]` | Elements to exclude from detection |
| `capture` | `boolean` | `true` | Use capture mode |
| `events` | `('click' \| 'mousedown' \| 'mouseup' \| 'touchstart' \| 'touchend')[]` | `['click']` | Events to listen for |
| `disabled` | `boolean` | `false` | Disable the directive |
| `stop` | `boolean` | `false` | Stop event propagation |
| `prevent` | `boolean` | `false` | Prevent default behavior |

## v-debounce

Debounce event handlers to limit execution frequency.

### Basic Usage

```vue
<template>
  <!-- Default: 300ms -->
  <input v-debounce="handleInput" />

  <!-- Custom wait time with modifier -->
  <input v-debounce:500ms="handleInput" />

  <!-- With options object -->
  <input v-debounce="{ handler: handleInput, wait: 500 }" />
</template>

<script setup>
function handleInput(event) {
  console.log('Debounced input:', event.target.value)
}
</script>
```

### Event Modifiers

You can specify the event type using modifiers:

```vue
<template>
  <input v-debounce.input="handleInput" />
  <div v-debounce.scroll="handleScroll">Scroll me</div>
  <button v-debounce.click="handleClick">Click me</button>
</template>
```

Supported events: `click`, `input`, `change`, `submit`, `scroll`, `resize`, `mouseenter`, `mouseleave`, `mousemove`, `mousedown`, `mouseup`, `keydown`, `keyup`, `focus`, `blur`, `touchstart`, `touchmove`, `touchend`

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to debounce |
| `wait` | `number` | `300` | Wait time in milliseconds |
| `leading` | `boolean` | `false` | Invoke on leading edge |
| `trailing` | `boolean` | `true` | Invoke on trailing edge |

## v-throttle

Throttle event handlers to limit execution frequency.

### Basic Usage

```vue
<template>
  <!-- Default: 300ms -->
  <button v-throttle="handleClick">Throttled click</button>

  <!-- Custom wait time with modifier -->
  <button v-throttle:1s="handleClick">1 second throttle</button>

  <!-- With options object -->
  <button v-throttle="{ handler: handleClick, wait: 1000 }">
    Throttle with options
  </button>
</template>

<script setup>
function handleClick() {
  console.log('Throttled click')
}
</script>
```

### Event Modifiers

Same as v-debounce, supports event type modifiers.

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | The function to throttle |
| `wait` | `number` | `300` | Wait time in milliseconds |
| `leading` | `boolean` | `true` | Invoke on leading edge |
| `trailing` | `boolean` | `true` | Invoke on trailing edge |

## v-long-press

Detect long press gestures on elements.

### Basic Usage

```vue
<template>
  <button v-long-press="handleLongPress">Long Press Me</button>
  <button v-long-press="{ handler: handleLongPress, duration: 1000 }">
    1 Second Press
  </button>
</template>

<script setup>
function handleLongPress(event) {
  console.log('Long press triggered!')
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `(event: MouseEvent \| TouchEvent) => void` | - | Callback when long press triggers |
| `duration` | `number` | `500` | Duration in milliseconds |
| `distance` | `number` | `10` | Max movement before canceling |
| `disabled` | `boolean` | `false` | Disable the directive |
| `prevent` | `boolean` | `true` | Prevent default behavior |
| `stop` | `boolean` | `false` | Stop event propagation |
| `onStart` | `Function` | - | Callback when press starts |
| `onCancel` | `Function` | - | Callback when press is canceled |
| `onTick` | `Function` | - | Callback during press (for progress) |
| `tickInterval` | `number` | `100` | Interval for onTick callback |

## v-hover

Track hover state with callbacks and CSS classes.

### Basic Usage

```vue
<template>
  <div v-hover="handleHover">Hover me</div>
  <div v-hover="{ onEnter: handleEnter, onLeave: handleLeave, class: 'is-hovering' }">
    Hover me
  </div>
</template>

<script setup>
function handleHover(isHovering, event) {
  console.log('Hovering:', isHovering)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `(isHovering: boolean, event: MouseEvent) => void` | - | Callback when hover state changes |
| `onEnter` | `(event: MouseEvent) => void` | - | Callback on mouse enter |
| `onLeave` | `(event: MouseEvent) => void` | - | Callback on mouse leave |
| `class` | `string` | `'v-hover'` | CSS class to add when hovering |
| `disabled` | `boolean` | `false` | Disable the directive |
| `enterDelay` | `number` | `0` | Delay before enter callback |
| `leaveDelay` | `number` | `0` | Delay before leave callback |

## v-ripple

Add Material Design ripple effect to elements.

### Basic Usage

```vue
<template>
  <button v-ripple>Click me</button>
  <button v-ripple="'rgba(255, 255, 255, 0.3)'">Custom color</button>
  <button v-ripple="{ color: 'red', duration: 800 }">Custom options</button>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `color` | `string` | `'currentColor'` | Ripple color |
| `duration` | `number` | `600` | Animation duration in ms |
| `disabled` | `boolean` | `false` | Disable ripple |
| `initialScale` | `number` | `0` | Initial scale of ripple |
| `finalScale` | `number` | `2` | Final scale of ripple |
