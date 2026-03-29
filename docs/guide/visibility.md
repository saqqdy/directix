# Visibility Directives

Visibility directives help you manage element visibility and lazy loading.

## v-lazy

Lazy load images when they enter the viewport.

### Basic Usage

```vue
<template>
  <img v-lazy="imageUrl" />
  <img v-lazy="{ src: imageUrl, placeholder: 'placeholder.jpg' }" />
  <div v-lazy="backgroundImageUrl"></div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `src` | `string` | - | Image source URL |
| `placeholder` | `string` | - | Placeholder image URL |
| `error` | `string` | - | Error image URL |
| `preload` | `number` | `0` | Preload distance in pixels |
| `attempt` | `number` | `1` | Number of retry attempts |
| `onLoad` | `Function` | - | Callback on successful load |
| `onError` | `Function` | - | Callback on load error |

## v-intersect

Observe element intersection with the viewport.

### Basic Usage

```vue
<template>
  <div v-intersect="handleIntersect">Observe me</div>
  <div v-intersect="{ onEnter: handleEnter, onLeave: handleLeave }">
    Track visibility
  </div>
</template>

<script setup>
function handleIntersect(entry, observer) {
  console.log('Intersecting:', entry.isIntersecting)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when element intersects |
| `onEnter` | `Function` | - | Callback when element enters viewport |
| `onLeave` | `Function` | - | Callback when element leaves viewport |
| `threshold` | `number \| number[]` | `0` | Threshold(s) to trigger |
| `rootMargin` | `string` | `'0px'` | Margin around the root |
| `once` | `boolean` | `false` | Trigger only once |

## v-visible

Toggle element visibility with animation support.

### Basic Usage

```vue
<template>
  <div v-visible="showElement">Show/Hide</div>
  <div v-visible="{ useHidden: true, initial: false }">
    Uses visibility: hidden
  </div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when visibility changes |
| `useHidden` | `boolean` | `false` | Use `visibility: hidden` |
| `initial` | `boolean` | `true` | Initial visibility state |

## v-loading

Show a loading overlay on elements.

### Basic Usage

```vue
<template>
  <div v-loading="isLoading">Content</div>
  <div v-loading="{ value: isLoading, text: 'Loading...', lock: true }">
    Content
  </div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `boolean` | `true` | Loading state |
| `text` | `string` | - | Loading text to display |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | Background color |
| `lock` | `boolean` | `false` | Lock scroll while loading |
| `spinner` | `string` | - | Custom spinner HTML |
