# Copy 示例

一键复制文本到剪贴板。

## 基础复制按钮

```vue
<template>
  <div>
    <input v-model="text" type="text" placeholder="输入要复制的文本" />
    <button v-copy="text" class="btn">复制到剪贴板</button>
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

## 复制并显示反馈

```vue
<template>
  <div class="copy-container">
    <code class="code-block">{{ code }}</code>
    <button
      v-copy="{ value: code, onSuccess: handleSuccess }"
      class="copy-btn"
      :class="{ copied: justCopied }"
    >
      {{ justCopied ? '已复制!' : '复制' }}
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

## 复制列表项

```vue
<template>
  <div class="list">
    <div v-for="item in items" :key="item.id" class="list-item">
      <span>{{ item.text }}</span>
      <button v-copy="item.text" class="btn-small">复制</button>
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

## 在线体验

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
