# Debounce Example

Debounce event handlers to limit execution frequency.

## Search Input

```vue
<template>
  <div class="search-container">
    <input
      v-debounce:300ms="search"
      placeholder="Search... (300ms debounce)"
      type="text"
      class="search-input"
    />
    <div v-if="loading" class="loading">Loading...</div>
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

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  results.value = [
    { id: 1, name: `Result 1 for "${query}"` },
    { id: 2, name: `Result 2 for "${query}"` },
    { id: 3, name: `Result 3 for "${query}"` },
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

## Form Validation

```vue
<template>
  <form class="form">
    <div class="form-group">
      <label>Email</label>
      <input
        v-debounce="{ handler: validateEmail, wait: 500 }"
        type="email"
        placeholder="Enter your email"
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
  emailError.value = isValid ? '' : 'Please enter a valid email'
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

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/main/examples/vue3)
