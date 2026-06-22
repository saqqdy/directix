# Watermark Example

Add watermarks to protect sensitive content.

## Text Watermark

```vue
<template>
  <div
    v-watermark="{
      content: 'CONFIDENTIAL',
      fontSize: 16,
      color: 'rgba(0, 0, 0, 0.1)',
      gap: 100,
      rotate: -30,
    }"
    class="watermarked-content"
  >
    <p>This content is protected with a text watermark.</p>
    <p>Sensitive information appears here.</p>
  </div>
</template>

<style scoped>
.watermarked-content { padding: 40px; border: 1px solid #eee; border-radius: 8px; min-height: 200px; position: relative; }
</style>
```

## Multi-line Watermark

```vue
<template>
  <div
    v-watermark="{
      content: ['Directix', '2026-06-21'],
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.08)',
      gap: 80,
    }"
    class="watermarked-content"
  >
    <p>Watermark with company name and date.</p>
  </div>
</template>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
