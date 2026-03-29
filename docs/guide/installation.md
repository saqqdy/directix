# Installation

## Package Manager

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

## Vue 2 Support

### Vue 2.7+

Vue 2.7 has built-in Composition API support, so no additional dependencies are needed.

```bash
npm install directix
```

### Vue 2.6 and below

For Vue 2.0-2.6, you need to install `@vue/composition-api` as a peer dependency:

```bash
npm install directix @vue/composition-api
```

::: warning Important
Directix internally uses Composition API features. Vue 2.6 and below require `@vue/composition-api` to provide these features.
:::

Make sure to register `@vue/composition-api` before using Directix:

```typescript
// Vue 2.6 and below
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Directix from 'directix'

Vue.use(VueCompositionAPI)
Vue.use(Directix)
```

## CDN

You can also use Directix via CDN:

### Vue 3

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

### Vue 2.7+

```html
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

### Vue 2.6 and below

For Vue 2.6 and below with CDN, you need to include `@vue/composition-api`:

```html
<script src="https://unpkg.com/vue@2.6/dist/vue.js"></script>
<script src="https://unpkg.com/@vue/composition-api/dist/vue-composition-api.prod.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

## Requirements

| Vue Version | Additional Dependencies |
|-------------|------------------------|
| Vue 3.0+ | None |
| Vue 2.7+ | None |
| Vue 2.0-2.6 | `@vue/composition-api` |

**Node.js**: 12.20+ (for build tools)

## Manual Version Detection

In some cases, you may need to manually specify the Vue version:

```typescript
import { setVueVersion } from 'directix'

// For Vue 2.6
setVueVersion(2)

// For Vue 2.7
setVueVersion(2.7)

// For Vue 3
setVueVersion(3)
```

Or via environment variable:

```bash
# Vue 2.6
DIRECTIX_VUE_VERSION=2

# Vue 2.7
DIRECTIX_VUE_VERSION=2.7

# Vue 3
DIRECTIX_VUE_VERSION=3
```

## Next Steps

- [Quick Start](/guide/quick-start) - Learn how to use Directix
- [Event Directives](/guide/events) - Explore event-related directives
- [Form Directives](/guide/forms) - Explore form-related directives
