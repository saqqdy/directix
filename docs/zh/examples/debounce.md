# Debounce 示例

对事件处理函数进行防抖，限制执行频率。

## 搜索输入

```vue
<template>
  <div class="search-container">
    <input
      v-debounce:300ms="search"
      placeholder="搜索... (300ms 防抖)"
      type="text"
      class="search-input"
    />
    <div v-if="loading" class="loading">加载中...</div>
    <ul v-if="results.length" class="results">
      <li v-for="result in results" :key="result.id">
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const results = ref([])

async function search(event) {
  const query = event.target.value

  if (!query) {
    results.value = []
    return
  }

  loading.value = true

  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 500))

  results.value = [
    { id: 1, name: `"${query}" 的结果 1` },
    { id: 2, name: `"${query}" 的结果 2` },
    { id: 3, name: `"${query}" 的结果 3` },
  ]

  loading.value = false
}
</script>

<style scoped>
.search-container {
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.loading {
  padding: 10px;
  color: #666;
}

.results {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  border: 1px solid #eee;
  border-radius: 4px;
}

.results li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.results li:last-child {
  border-bottom: none;
}
</style>
```

## 表单验证

```vue
<template>
  <form class="form">
    <div class="form-group">
      <label>邮箱</label>
      <input
        v-debounce="{ handler: validateEmail, wait: 500 }"
        type="email"
        placeholder="输入你的邮箱"
        :class="{ error: emailError }"
      />
      <span v-if="emailError" class="error-message">{{ emailError }}</span>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emailError = ref('')

function validateEmail(event) {
  const email = event.target.value

  if (!email) {
    emailError.value = ''
    return
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  emailError.value = isValid ? '' : '请输入有效的邮箱地址'
}
</script>

<style scoped>
.form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}
</style>
```

## 在线体验

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/main/examples/vue3)
