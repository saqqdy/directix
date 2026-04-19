# 05 - Visibility & Lazy Loading Directives

**Duration: 10 minutes**

## Video Info

- Title: Visibility & Lazy Loading Directives
- Series: Getting Started
- Level: Beginner
- Prerequisites: Vue basics

## Chapters

1. v-lazy Image Lazy Loading (3 min)
2. v-intersect Intersection Observer (2.5 min)
3. v-visible Visibility Control (2 min)
4. v-loading Loading State (2.5 min)

## Detailed Script

### Opening (0:00-0:10)

Today we learn Directix's visibility-related directives. Based on IntersectionObserver, they help optimize page performance.

### Chapter 1: v-lazy (0:10-3:10)

> **Visual: Image lazy loading effect**

**Basic Usage:**

```vue
<template>
  <img v-lazy="imageUrl" alt="Image" />
</template>

<script setup>
const imageUrl = 'https://example.com/photo.jpg'
</script>
```

**Configuration Object:**

```vue
<template>
  <img v-lazy="{
    src: imageUrl,
    loading: '/placeholder.png',
    error: '/error.png',
    threshold: 0.1
  }" />
</template>
```

**Background Image Lazy Loading:**

```vue
<template>
  <div v-lazy:background="imageUrl" class="hero"></div>
</template>
```

**Lazy Loading in Lists:**

```vue
<template>
  <div class="image-list">
    <img
      v-for="img in images"
      :key="img.id"
      v-lazy="img.url"
      :alt="img.title"
    />
  </div>
</template>

<script setup>
const images = ref([
  { id: 1, url: '/img1.jpg', title: 'Image 1' },
  { id: 2, url: '/img2.jpg', title: 'Image 2' },
  // ... more images
])
</script>
```

### Chapter 2: v-intersect (3:10-5:40)

> **Visual: Scroll animation effect**

**Basic Usage:**

```vue
<template>
  <div v-intersect="onIntersect">
    Scrolling here triggers
  </div>
</template>

<script setup>
const onIntersect = (entry) => {
  if (entry.isIntersecting) {
    console.log('Element entered viewport')
  }
}
</script>
```

**Scroll Reveal Animation:**

```vue
<template>
  <div
    v-intersect="{
      handler: onVisible,
      threshold: 0.5,
      once: true
    }"
    :class="{ 'animate-in': isVisible }"
  >
    Fade-in animation content
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)

const onVisible = (entry) => {
  if (entry.isIntersecting) {
    isVisible.value = true
  }
}
</script>

<style>
.animate-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
```

### Chapter 3: v-visible (5:40-7:40)

> **Visual: Conditional display effect**

**Basic Usage:**

```vue
<template>
  <div v-visible="shouldShow">
    Show/hide based on condition (keeps DOM)
  </div>
</template>
```

Difference from v-show: v-visible uses visibility property, element still takes space when hidden.

**With IntersectionObserver:**

```vue
<template>
  <div v-visible:observer="{
    threshold: 0.2,
    onVisible: () => console.log('Visible'),
    onHidden: () => console.log('Hidden')
  }">
    Observe visibility
  </div>
</template>
```

### Chapter 4: v-loading (7:40-10:00)

> **Visual: Loading animation effect**

**Basic Usage:**

```vue
<template>
  <div v-loading="isLoading">
    Content area
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)

// Simulate loading
setTimeout(() => {
  isLoading.value = false
}, 2000)
</script>
```

**Custom Loading Text:**

```vue
<template>
  <div v-loading="{
    active: isLoading,
    text: 'Loading, please wait...',
    background: 'rgba(255, 255, 255, 0.8)',
    spinner: true
  }">
    Data content
  </div>
</template>
```

**Fullscreen Loading:**

```vue
<template>
  <div v-loading:fullscreen="pageLoading">
    <header>Navigation</header>
    <main>Content</main>
  </div>
</template>
```

**With Async Data:**

```vue
<template>
  <div v-loading="loading">
    <div v-for="item in data" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const data = ref([])

onMounted(async () => {
  try {
    data.value = await fetchData()
  } finally {
    loading.value = false
  }
})
</script>
```

### Summary

Today we learned four visibility directives:
- v-lazy - Image lazy loading
- v-intersect - Intersection observer, scroll animations
- v-visible - Visibility control
- v-loading - Loading state

Next starts the Advanced series, learning Composables.

## Exercises

1. Create an image gallery with v-lazy for lazy loading
2. Use v-intersect to trigger animation when scrolling to element
3. Implement a data panel showing loading state during data fetch

## Resources

- [Visibility Directives Docs](https://saqqdy.github.io/directix/guide/visibility)
- [v-lazy API](https://saqqdy.github.io/directix/api/directives/lazy)
- [v-intersect API](https://saqqdy.github.io/directix/api/directives/intersect)