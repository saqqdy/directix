# 02 - Installation & Configuration

**Duration: 6 minutes**

## Video Info

- Title: Installation & Configuration
- Series: Getting Started
- Level: Beginner
- Prerequisites: Vue project basics

## Chapters

1. Package Manager Installation (1.5 min)
2. CDN Usage (1 min)
3. Vue 2 vs Vue 3 Configuration (2 min)
4. On-demand vs Full Import (1.5 min)

## Detailed Script

### Opening (0:00-0:10)

> **Visual: Opening animation + title**

Today we learn how to install and configure Directix.

### Chapter 1: Package Manager (0:10-1:40)

> **Visual: Terminal demo**

First, install with npm:

```bash
npm install directix
```

Or with yarn:

```bash
yarn add directix
```

Or with pnpm (recommended):

```bash
pnpm add directix
```

> **Visual: package.json**

After installation, package.json adds directix dependency. Latest version is 1.9.0.

### Chapter 2: CDN Usage (1:40-2:40)

> **Visual: HTML editor**

If you don't use build tools, use CDN directly.

**Vue 3 CDN:**

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<div id="app">
  <button v-copy="text">Copy</button>
</div>

<script>
  const { createApp, ref } = Vue
  const { Directix } = DirectixLib

  const app = createApp({
    setup() {
      return { text: ref('Hello') }
    }
  })
  app.use(Directix)
  app.mount('#app')
</script>
```

**Vue 2 CDN:**

```html
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<div id="app">
  <button v-copy="text">Copy</button>
</div>

<script>
  new Vue({
    el: '#app',
    data: { text: 'Hello' }
  })
  Vue.use(DirectixLib.Directix)
</script>
```

### Chapter 3: Vue 2 & Vue 3 Config (2:40-4:40)

> **Visual: VS Code project structure**

**Vue 3 Project:**

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Directix from 'directix'

const app = createApp(App)

// Full registration
app.use(Directix)

// Or on-demand registration
app.use(Directix, {
  directives: ['copy', 'debounce', 'click-outside']
})

app.mount('#app')
```

> **Visual: Vue 2 config**

**Vue 2.7+ Project:**

```typescript
// main.ts
import Vue from 'vue'
import App from './App.vue'
import Directix from 'directix'

Vue.use(Directix)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

> **Visual: Vue 2.6 config**

**Vue 2.6 and below:**

Need additional Composition API:

```bash
npm install @vue/composition-api
```

Then in main.ts:

```typescript
// main.ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Directix from 'directix'

// Must register Composition API first
Vue.use(VueCompositionAPI)
Vue.use(Directix)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

> **Visual: Emphasize order**

Order matters: register Composition API first, then Directix.

### Chapter 4: On-demand vs Full Import (4:40-6:00)

> **Visual: Full import**

**Full Import:**

```typescript
app.use(Directix)
// or
app.use(Directix, { all: true })
```

Registers all 57 directives. Good for development or projects needing many directives.

> **Visual: On-demand import**

**On-demand Import (Recommended):**

```typescript
app.use(Directix, {
  directives: ['copy', 'debounce', 'focus', 'lazy']
})
```

Only registers needed directives, smaller bundle.

> **Visual: Single directive import**

**Single Directive Import:**

```typescript
// Import just one directive
import { vCopy } from 'directix'

app.directive('copy', vCopy)
```

Most flexible, smallest bundle.

> **Visual: Size comparison**

Size comparison:
- Full import: ~30KB (gzip)
- On-demand: depends on directives used
- Single directive: ~1-2KB (gzip) average

### Summary (5:50-6:00)

> **Visual: Summary points**

Today we learned:
- npm/yarn/pnpm installation
- CDN usage
- Vue 2 and Vue 3 config differences
- On-demand vs full import

Next video covers common event directives. Bye!

> **Visual: Closing animation + preview**

## Code Examples

[GitHub - examples/vue3](https://github.com/saqqdy/directix/tree/master/examples/vue3)

## Exercises

1. Install Directix in a Vue 3 project, only register `v-copy` and `v-debounce`
2. Use CDN to create a simple Vue 3 page with `v-focus` directive
3. Properly configure Directix in a Vue 2.6 project (note Composition API)

## Resources

- [Installation Docs](https://saqqdy.github.io/directix/guide/installation)
- [Vue 2 Support](https://saqqdy.github.io/directix/guide/installation#vue-2-support)