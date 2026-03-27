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

For Vue 2.0-2.6, you need to install `@vue/composition-api`:

```bash
npm install @vue/composition-api
```

Vue 2.7+ has built-in Composition API support, so no additional dependencies are needed.

## CDN

You can also use Directix via CDN:

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<!-- Vue 2.7+ -->
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

The CDN build includes `vue-demi` bundled internally, so it works seamlessly with both Vue 2 and Vue 3.

## Requirements

- Vue 2.0+ or Vue 3.0+
- Node.js 12.20+ (for build tools)
- For Vue 2.0-2.6: `@vue/composition-api` is required

## Next Steps

- [Quick Start](/guide/quick-start) - Learn how to use Directix
- [Event Directives](/guide/events) - Explore event-related directives
- [Form Directives](/guide/forms) - Explore form-related directives
