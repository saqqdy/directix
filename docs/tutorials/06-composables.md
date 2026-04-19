# 06 - Custom Directives & Composables

**Duration: 12 minutes**

## Video Info

- Title: Custom Directives & Composables
- Series: Advanced
- Level: Intermediate
- Prerequisites: Composition API basics

## Chapters

1. Why Composables? (1.5 min)
2. Composables Basic Usage (3 min)
3. Directive vs Composable Comparison (2 min)
4. Creating Custom Directive Templates (3.5 min)
5. Composable Composition Patterns (2 min)

## Detailed Script

### Opening (0:00-0:15)

Welcome to the Advanced series. Today we learn Composables - the programmatic alternative to directives.

### Chapter 1: Why Composables? (0:15-1:45)

> **Visual: Template vs logic separation**

Directives are declarative, suitable for templates. But some scenarios need logic-layer handling:

- Dynamically control directive behavior
- Get directive state in setup
- Combine multiple directive features
- Use in non-template environments

Composables solve these scenarios.

### Chapter 2: Basic Usage (1:45-4:45)

> **Visual: VS Code demo**

**useDebounce:**

```vue
<template>
  <input @input="onInput" placeholder="Search..." />
  <p>Debounced value: {{ debouncedValue }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { useDebounce } from 'directix'

const inputValue = ref('')
const { debouncedValue } = useDebounce(inputValue, 500)

const onInput = (e) => {
  inputValue.value = e.target.value
}
</script>
```

**useClickOutside:**

```vue
<template>
  <div ref="target">
    <button @click="show = !show">Open</button>
    <div v-if="show">Menu</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useClickOutside } from 'directix'

const target = ref(null)
const show = ref(false)

useClickOutside(target, () => {
  show.value = false
})
</script>
```

**useIntersect:**

```vue
<template>
  <div ref="target" :class="{ visible: isVisible }">
    {{ isVisible ? 'Visible' : 'Hidden' }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersect } from 'directix'

const target = ref(null)
const { isVisible, entry } = useIntersect(target, { threshold: 0.5 })
</script>
```

### Chapter 3: Directive vs Composable (4:45-6:45)

> **Visual: Split screen comparison**

| Feature | Directive | Composable |
|---------|-----------|------------|
| Usage | Template declaration | setup call |
| Use Case | DOM binding | Logic handling |
| State | Implicit | Explicit reactive |
| Composability | Limited | Flexible combination |
| SSR Support | Needs handling | Natural support |

**Selection Guide:**
- Simple DOM operations → Directive
- Need reactive state → Composable
- Need to combine features → Composable
- Quick template usage → Directive

### Chapter 4: Custom Directive Templates (6:45-10:15)

> **Visual: Template system**

Directix provides three directive templates for quick custom directive creation.

**createDirectiveTemplate:**

```typescript
import { createDirectiveTemplate } from 'directix'

const vHighlight = createDirectiveTemplate({
  name: 'highlight',

  onMount(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },

  onUpdate(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },

  onUnmount(el) {
    el.style.backgroundColor = ''
  },

  validate(options) {
    if (options.color && !CSS.supports('color', options.color)) {
      return 'Invalid color value'
    }
    return null
  }
})
```

**createEventDirective:**

```typescript
import { createEventDirective } from 'directix'

const vTrack = createEventDirective({
  name: 'track',
  eventName: 'click',
  handler(el, binding, event) {
    analytics.track(binding.value, {
      element: el.tagName,
      timestamp: Date.now()
    })
  }
})
```

**createStyleDirective:**

```typescript
import { createStyleDirective } from 'directix'

const vOpacity = createStyleDirective({
  name: 'opacity',
  cssProperty: 'opacity',
  defaultUnit: '',
  validate(value) {
    return typeof value === 'number' && value >= 0 && value <= 1
  }
})
```

**Register as Plugin:**

```typescript
import { definePlugin } from 'directix'

const myPlugin = definePlugin({
  meta: {
    name: 'directix-my-plugin',
    version: '1.0.0',
    description: 'Custom directive plugin'
  },
  install(ctx) {
    ctx.registerDirective('highlight', vHighlight)
    ctx.registerDirective('track', vTrack)
    ctx.registerDirective('opacity', vOpacity)
  }
})
```

### Chapter 5: Composition Patterns (10:15-12:00)

> **Visual: Composition example**

Composables' biggest advantage is flexible composition:

```vue
<script setup>
import { ref } from 'vue'
import { useDebounce, useIntersect, useCopy } from 'directix'

// Combine: debounced search + lazy load + copy
const searchQuery = ref('')
const { debouncedValue } = useDebounce(searchQuery, 300)

const target = ref(null)
const { isVisible } = useIntersect(target)

const { copy, copied } = useCopy()

const copyResult = () => {
  copy(searchResults.value)
}
</script>
```

### Summary

Today we learned:
- Composables purpose and advantages
- Common Composable usage
- Directive vs Composable selection
- Custom directive template creation
- Composable composition patterns

Next video covers Vue DevTools debugging tips.

## Exercises

1. Implement search functionality using useDebounce
2. Create a v-tooltip custom directive using createDirectiveTemplate
3. Combine useIntersect and useCopy to copy content when scrolling to element

## Resources

- [Plugin System Docs](https://saqqdy.github.io/directix/guide/plugin)
- [Composables API](https://saqqdy.github.io/directix/api/)