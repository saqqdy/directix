# Copy Example

Copy text to clipboard with a simple directive.

## Basic Copy Button

```vue
<template>
  <div>
    <input v-model="text" type="text" placeholder="Enter text to copy" />
    <button v-copy="text" class="btn">Copy to Clipboard</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Hello, World!')
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
}

.btn:hover {
  background: #3aa876;
}
</style>
```

## Copy with Feedback

```vue
<template>
  <div class="copy-container">
    <code class="code-block">{{ code }}</code>
    <button
      v-copy="{ value: code, onSuccess: handleSuccess }"
      class="copy-btn"
      :class="{ copied: justCopied }"
    >
      {{ justCopied ? 'Copied!' : 'Copy' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const code = 'npm install directix'
const justCopied = ref(false)

function handleSuccess() {
  justCopied.value = true
  setTimeout(() => {
    justCopied.value = false
  }, 2000)
}
</script>

<style scoped>
.copy-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-block {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
}

.copy-btn {
  padding: 6px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn.copied {
  background: #35495e;
}
</style>
```

## Copy List Items

```vue
<template>
  <div class="list">
    <div v-for="item in items" :key="item.id" class="list-item">
      <span>{{ item.text }}</span>
      <button v-copy="item.text" class="btn-small">Copy</button>
    </div>
  </div>
</template>

<script setup>
const items = [
  { id: 1, text: 'user@example.com' },
  { id: 2, text: '+1 (555) 123-4567' },
  { id: 3, text: '123 Main Street' },
]
</script>

<style scoped>
.list {
  border: 1px solid #eee;
  border-radius: 4px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.btn-small {
  padding: 4px 8px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
</style>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
