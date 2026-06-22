# Lazy Loading Example

Images and components load only when they enter the viewport.

## Basic Image Lazy Load

```vue
<template>
  <div class="lazy-demo">
    <div class="scroll-hint">⬇ Scroll down to load images</div>
    <img
      v-for="photo in photos"
      :key="photo.id"
      v-lazy="{ src: photo.url, placeholder: '/placeholder.svg' }"
      alt="Lazy loaded image"
      class="photo"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const photos = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/400/300?random=${i + 1}`,
  })),
)
</script>

<style scoped>
.lazy-demo { max-width: 600px; }
.scroll-hint { text-align: center; padding: 20px; color: #666; font-size: 14px; }
.photo { width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; background: #f5f5f5; }
.v-lazy--loading { opacity: 0.6; }
.v-lazy--loaded { opacity: 1; transition: opacity 0.3s ease; }
.v-lazy--error { opacity: 0.5; }
</style>
```

## Lazy Load with Error Handling

```vue
<template>
  <img
    v-lazy="{
      src: imageUrl,
      placeholder: '/placeholder.svg',
      error: '/error.svg',
      onLoad: handleLoad,
      onError: handleError,
    }"
    alt="Lazy loaded image"
  />
  <p v-if="loaded" class="status success">✅ Image loaded</p>
  <p v-if="error" class="status error">❌ Failed to load image</p>
</template>

<script setup>
import { ref } from 'vue'

const imageUrl = ref('https://picsum.photos/800/600')
const loaded = ref(false)
const error = ref(false)

function handleLoad(el) { loaded.value = true; error.value = false }
function handleError(el, err) { loaded.value = false; error.value = true }
</script>
```

## Prefetch Distance

```vue
<template>
  <!-- Images start loading 200px before entering viewport -->
  <img v-lazy="{ src: photo.url, preload: 200 }" v-for="photo in photos" :key="photo.id" />
</template>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
