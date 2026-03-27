# Throttle Example

Throttle event handlers to limit execution frequency.

## Throttled Button

```vue
<template>
  <div>
    <button v-throttle:1s="increment" class="btn">
      Click me (1s throttle)
    </button>
    <p>Click count: {{ count }}</p>
    <p class="hint">You can only click once per second</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<style scoped>
.btn {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background: #3aa876;
}

.hint {
  color: #666;
  font-size: 14px;
}
</style>
```

## Scroll Progress

```vue
<template>
  <div class="container">
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <p>Scroll progress: {{ progress }}%</p>

    <div class="scroll-area">
      <p v-for="i in 20" :key="i">
        Scroll down to see the progress bar update (throttled at 100ms)
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function handleScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  const maxScroll = scrollHeight - clientHeight
  progress.value = Math.round((scrollTop / maxScroll) * 100)
}

onMounted(() => {
  const scrollArea = document.querySelector('.scroll-area')
  if (scrollArea) {
    scrollArea.addEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.container {
  position: relative;
}

.progress-bar {
  height: 4px;
  background: #42b883;
  transition: width 0.1s;
}

.scroll-area {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 16px;
  margin-top: 16px;
}
</style>
```

## Mouse Position Tracker

```vue
<template>
  <div
    v-throttle:50ms="handleMouseMove"
    class="tracking-area"
    @mousemove="handleMouseMove"
  >
    <p>Move your mouse here</p>
    <p>Position: {{ x }}, {{ y }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const x = ref(0)
const y = ref(0)

function handleMouseMove(event) {
  x.value = event.clientX
  y.value = event.clientY
}
</script>

<style scoped>
.tracking-area {
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
}
</style>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/main/examples/vue3)
