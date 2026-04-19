# Scenario Examples

Real-world examples demonstrating how to combine Directix directives for practical use cases.

## Form Validation System

Combine `v-debounce`, `v-mask`, `v-trim`, `v-focus`, and `v-money` for a complete form validation solution.

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Auto-focus with debounced validation -->
    <input
      v-model.trim="form.username"
      v-debounce:500ms="{ handler: () => validate('username'), wait: 500 }"
      v-focus
      placeholder="Username"
    />
    
    <!-- Phone with input mask -->
    <input
      v-model="form.phone"
      v-mask="{ pattern: '###########' }"
      placeholder="Phone number"
    />
    
    <!-- Currency formatted input -->
    <input
      v-model="form.amount"
      v-money="{ currency: '¥', precision: 2 }"
      placeholder="Amount"
    />
  </form>
</template>
```

## Permission Management

Combine `v-permission` and `v-click-outside` for RBAC access control.

```vue
<template>
  <!-- Only show for users with write permission -->
  <button v-permission="'user:write'">Edit</button>
  
  <!-- Dropdown with click-outside detection -->
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">Actions</button>
    <div v-if="show">
      <div v-permission="'user:delete'">Delete</div>
    </div>
  </div>
</template>
```

## Image Gallery

Combine `v-lazy`, `v-image-preview`, and `v-swipe` for responsive image display.

```vue
<template>
  <div class="gallery">
    <div
      v-for="img in images"
      :key="img.id"
      v-image-preview="{ src: img.src }"
    >
      <img v-lazy="{ src: img.src }" />
    </div>
  </div>
  
  <!-- Swipe gesture detection for mobile -->
  <div v-swipe="{ onSwipe: handleSwipe }">
    Swipe to navigate
  </div>
</template>
```

## Infinite Scroll List

Combine `v-infinite-scroll`, `v-virtual-list`, and `v-loading` for large data lists.

```vue
<template>
  <div
    v-infinite-scroll="{ handler: loadMore, distance: 100 }"
  >
    <div v-virtual-list="{ items, itemSize: 50 }">
      <template #default="{ item }">
        {{ item.text }}
      </template>
    </div>
    <div v-loading="loading">Loading more...</div>
  </div>
</template>
```

## Rich Text Editor

Combine `v-sanitize`, `v-highlight`, and `v-emoji` for content editing.

```vue
<template>
  <!-- Highlight search keywords -->
  <div v-highlight="{ keyword: searchKey, color: '#ffeb3b' }">
    {{ content }}
  </div>
  
  <!-- Sanitize HTML to prevent XSS -->
  <div v-sanitize="{ allowedTags: ['p', 'strong', 'em'] }" v-html="rawHtml" />
</template>
```

## Gesture Interaction

Combine `v-touch`, `v-swipe`, `v-pan`, and `v-pinch` for mobile interactions.

```vue
<template>
  <div
    v-touch="{ onStart, onMove, onEnd }"
    v-pan="{ onPan }"
    v-pinch="{ onPinch }"
  >
    Touch area
  </div>
</template>
```

## Data Visualization

Combine `v-progress`, `v-counter`, and `v-countdown` for data display animations.

```vue
<template>
  <div v-progress="{ value: 75, showText: true }" />
  <span v-counter="{ from: 0, to: 10000, duration: 2000 }" />
  <span v-countdown="{ time: 60000, format: 'mm:ss' }" />
</template>
```

## Drag & Sort

Combine `v-draggable` and `v-intersect` for sortable lists.

```vue
<template>
  <div
    v-for="item in items"
    :key="item.id"
    v-draggable="{ axis: 'y' }"
    v-intersect="{ handler: onVisible }"
  >
    {{ item.title }}
  </div>
</template>
```

## Print & Export

Combine `v-print` and `v-export` for document processing.

```vue
<template>
  <button v-print="{ title: 'Report' }">Print</button>
  <button v-export="{ type: 'image', filename: 'report' }">Export</button>
</template>
```

## Fullscreen Media

Combine `v-fullscreen` and `v-lottie` for media playback control.

```vue
<template>
  <div v-fullscreen="{ value: isFullscreen }">
    <div v-lottie="{ path: animationUrl, autoplay: true, loop: true }" />
  </div>
</template>
```
