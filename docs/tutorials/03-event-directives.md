# 03 - Common Event Directives

**Duration: 12 minutes**

## Video Info

- Title: Common Event Directives
- Series: Getting Started
- Level: Beginner
- Prerequisites: Vue event handling basics

## Chapters

1. v-debounce Debouncing (3 min)
2. v-throttle Throttling (2 min)
3. v-click-outside Click Outside (2 min)
4. v-long-press Long Press (2 min)
5. v-hotkey Keyboard Shortcuts (3 min)

## Detailed Script

### Opening (0:00-0:15)

> **Visual: Opening animation + title**

Hello! Today we learn Directix's most commonly used event directives for handling user interactions.

### Chapter 1: v-debounce (0:15-3:15)

> **Visual: Debounce concept animation**

First is the most commonly used debounce directive. What does debounce mean? When user makes continuous operations, execute only once after stopping.

> **Visual: VS Code demo**

**Basic Usage:**

```vue
<template>
  <input
    v-debounce="handleSearch"
    placeholder="Search..."
  />
</template>

<script setup>
const handleSearch = (value) => {
  console.log('Search:', value)
  // Execute API request
}
</script>
```

**Specify Delay:**

```vue
<template>
  <!-- Default 300ms -->
  <input v-debounce="search1" />

  <!-- Custom delay -->
  <input v-debounce:500="search2" />

  <!-- Modifier syntax -->
  <input v-debounce:500ms="search3" />
</template>
```

**Configuration Object:**

```vue
<template>
  <input v-debounce="{
    handler: handleSearch,
    wait: 500,
    leading: false,
    trailing: true
  }" />
</template>
```

> **Visual: Debounce effect demo**

Typical use cases:
- Search input boxes
- Window resize events
- Form validation

### Chapter 2: v-throttle (3:15-5:15)

> **Visual: Throttle concept animation**

Throttling is similar but different: execute at fixed intervals.

> **Visual: VS Code demo**

**Basic Usage:**

```vue
<template>
  <button v-throttle="handleSubmit">
    Submit
  </button>
</template>

<script setup>
const handleSubmit = () => {
  console.log('Submit form')
  // Repeated clicks will be throttled
}
</script>
```

**Specify Interval:**

```vue
<template>
  <!-- Default 300ms -->
  <button v-throttle="submit1">Submit</button>

  <!-- Custom interval -->
  <button v-throttle:1000="submit2">Submit</button>

  <!-- Modifier syntax -->
  <button v-throttle:1s="submit3">Submit</button>
</template>
```

> **Visual: Compare debounce vs throttle**

Debounce vs Throttle:
- Debounce: Wait for stop, execute once at end
- Throttle: Fixed interval, continuous execution

Typical scenarios:
- Prevent button double-clicks
- Scroll event handling
- Mouse movement events

### Chapter 3: v-click-outside (5:15-7:15)

> **Visual: Dropdown close effect**

Click outside is very practical, commonly used for closing dropdowns, modals, etc.

> **Visual: VS Code demo**

**Basic Usage:**

```vue
<template>
  <div>
    <button @click="show = !show">Toggle</button>
    <div
      v-if="show"
      v-click-outside="closeMenu"
      class="dropdown"
    >
      Menu content
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

const closeMenu = () => {
  show.value = false
}
</script>
```

**Exclude Specific Elements:**

```vue
<template>
  <div>
    <!-- Clicking this button won't close -->
    <button ref="trigger">Open</button>
    <div v-click-out:trigger="closeMenu">
      Content
    </div>
  </div>
</template>
```

> **Visual: Real-world applications**

Typical scenarios:
- Dropdown menus
- Modals
- Sidebars

### Chapter 4: v-long-press (7:15-9:15)

> **Visual: Long press effect**

Long press directive handles user long-pressing elements.

> **Visual: VS Code demo**

**Basic Usage:**

```vue
<template>
  <button v-long-press="handleLongPress">
    Long Press Me
  </button>
</template>

<script setup>
const handleLongPress = () => {
  alert('Long press triggered!')
}
</script>
```

**Custom Duration:**

```vue
<template>
  <!-- Default 500ms -->
  <button v-long-press="handler1">500ms</button>

  <!-- Custom duration -->
  <button v-long-press:1000="handler2">1 second</button>

  <!-- Modifier syntax -->
  <button v-long-press:1s="handler3">1 second</button>
</template>
```

**Configuration Object:**

```vue
<template>
  <button v-long-press="{
    handler: handleLongPress,
    duration: 800,
    onStart: () => console.log('Started'),
    onFinish: () => console.log('Finished'),
    onCancel: () => console.log('Cancelled')
  }">
    Long Press Me
  </button>
</template>
```

### Chapter 5: v-hotkey (9:15-12:00)

> **Visual: Hotkey effect**

Hotkey directive adds keyboard shortcut support to your app.

> **Visual: VS Code demo**

**Basic Usage:**

```vue
<template>
  <div v-hotkey="hotkeys">
    Press Ctrl+S to save
  </div>
</template>

<script setup>
const hotkeys = {
  'ctrl+s': (e) => {
    e.preventDefault()
    console.log('Save')
  },
  'ctrl+enter': () => {
    console.log('Submit')
  }
}
</script>
```

**Multiple Shortcuts:**

```vue
<template>
  <div v-hotkey="{
    'ctrl+s': save,
    'ctrl+z': undo,
    'ctrl+y': redo,
    'escape': cancel,
    'enter': submit
  }">
    Edit area
  </div>
</script>
```

**Scope Control:**

```vue
<template>
  <!-- Only when element focused -->
  <input
    v-hotkey:focus="{
      'ctrl+a': selectAll,
      'escape': clear
    }"
  />

  <!-- Global hotkeys -->
  <div v-hotkey:global="globalHotkeys">
    App content
  </div>
</template>
```

**Supported Modifiers:**

- `ctrl` / `control`
- `alt` / `option`
- `shift`
- `meta` / `cmd` / `command`

### Summary (11:50-12:00)

> **Visual: Summary points**

Today we learned five common event directives:
- v-debounce - Debouncing, great for search boxes
- v-throttle - Throttling, great for button clicks
- v-click-outside - Close on outside click
- v-long-press - Long press operations
- v-hotkey - Keyboard shortcuts

Next video covers form directives. Bye!

> **Visual: Closing animation + preview**

## Code Examples

[GitHub - examples/vue3](https://github.com/saqqdy/directix/tree/master/examples/vue3)

## Exercises

1. Create a search box with v-debounce for 300ms debounce
2. Implement a button with v-throttle to prevent repeated clicks within 1 second
3. Use v-click-outside for a dropdown menu that closes on outside click
4. Create a delete button requiring 2-second long press
5. Add Ctrl+S save shortcut to an editor

## Resources

- [Event Directives Docs](https://saqqdy.github.io/directix/guide/events)
- [v-debounce API](https://saqqdy.github.io/directix/api/directives/debounce)
- [v-throttle API](https://saqqdy.github.io/directix/api/directives/throttle)