# 01 - Directix Introduction & Quick Start

**Duration: 8 minutes**

## Video Info

- Title: Directix Introduction & Quick Start
- Series: Getting Started
- Level: Beginner
- Prerequisites: Vue basics

## Chapters

1. What is Directix? (1 min)
2. Core Features Overview (2 min)
3. Quick Demo (3 min)
4. Learning Path Suggestions (2 min)

## Detailed Script

### Opening (0:00-0:15)

> **Visual: Opening animation + title**

Hello everyone, welcome to the Directix tutorial series. Today let's discover a powerful Vue directive library.

### Chapter 1: What is Directix? (0:15-1:15)

> **Visual: Directix homepage**

Directix is a comprehensive, easy-to-use Vue custom directive library. Its biggest feature is supporting both Vue 2 and Vue 3.

> **Visual: Feature list animation**

Core features:

1. **57+ Common Directives** - Covering events, forms, visibility, scroll, etc.
2. **Vue 2/3 Compatible** - One codebase, both versions work
3. **Tree-shakable** - Import only what you need
4. **TypeScript Support** - Complete type definitions
5. **57 Composables** - Each directive has a corresponding composable

Simply put, Directix lets you handle DOM operations declaratively, no complex logic needed.

### Chapter 2: Core Features (1:15-3:15)

> **Visual: Split screen Vue 2 vs Vue 3**

First, compatibility. Whether your project is Vue 2 or Vue 3, Directix works seamlessly. Great for migrating projects.

> **Visual: Tree-shaking diagram**

Second, Tree-shaking. You only import directives you use, unused code won't be bundled.

> **Visual: TypeScript hints**

Third, TypeScript support. All directives have complete type definitions, IDE gives smart hints.

> **Visual: Composables example**

Finally, Composables. Each directive has a corresponding useXxx function for Composition API.

### Chapter 3: Quick Demo (3:15-6:15)

> **Visual: VS Code**

Let's see some real examples.

**Example 1: v-copy - One-click Copy**

```vue
<template>
  <!-- Click to copy text to clipboard -->
  <button v-copy="textToCopy">Copy Text</button>
</template>

<script setup>
import { ref } from 'vue'

const textToCopy = ref('Hello Directix!')
</script>
```

Just one line to implement copy functionality.

**Example 2: v-debounce - Debounced Input**

```vue
<template>
  <!-- Input debounce, triggers after 500ms -->
  <input v-debounce:500ms="handleSearch" placeholder="Search..." />
</template>

<script setup>
const handleSearch = (value) => {
  console.log('Search:', value)
  // Execute search request
}
</script>
```

Triggers after user stops typing for 500ms, avoiding frequent requests.

**Example 3: v-click-outside - Click Outside to Close**

```vue
<template>
  <div>
    <button @click="show = !show">Toggle</button>
    <div v-if="show" v-click-outside="closeMenu" class="dropdown">
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

Auto-close when clicking outside, standard pattern for dropdowns.

**Example 4: v-lazy - Image Lazy Loading**

```vue
<template>
  <!-- Load image when it enters viewport -->
  <img v-lazy="imageUrl" alt="Lazy loaded image" />
</template>
```

Image loads only when scrolled into viewport, improving performance.

### Chapter 4: Learning Path (6:15-8:00)

> **Visual: Learning roadmap**

How to proceed? I suggest this order:

1. **Getting Started Series** - Master installation and common directives
2. **Advanced Series** - Learn Composables, performance optimization, debugging
3. **Practical Series** - Solidify knowledge through real projects

> **Visual: Documentation site**

Directix official docs are comprehensive, with Chinese, English, and Japanese support. Each directive has detailed API docs and examples.

> **Visual: Playground**

There's also an online Playground to try all directives directly.

### Summary (7:45-8:00)

> **Visual: Summary points**

Today we learned:
- What Directix is
- Its core features
- Usage of several common directives

Next video covers installation and configuration. See you then!

> **Visual: Closing animation + next video preview**

## Code Examples

[GitHub - examples/vue3](https://github.com/saqqdy/directix/tree/master/examples/vue3)

## Exercises

1. Use `v-copy` to implement a copy password feature
2. Use `v-debounce` to optimize search input with 300ms debounce
3. Use `v-click-outside` to implement a modal that closes on outside click

## Resources

- [Official Docs](https://saqqdy.github.io/directix/)
- [GitHub Repo](https://github.com/saqqdy/directix)
- [Online Playground](https://saqqdy.github.io/directix/playground/)