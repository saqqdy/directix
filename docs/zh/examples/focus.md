# Focus 示例

元素出现时自动获取焦点。

## 自动聚焦输入框

```vue
<template>
  <div>
    <input v-focus placeholder="此输入框自动聚焦" class="input" />
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}
</style>
```

## 带聚焦的弹窗

```vue
<template>
  <div>
    <button @click="showModal = true" class="btn">打开弹窗</button>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h2>登录</h2>
        <form @submit.prevent="submit">
          <input
            v-focus
            v-model="email"
            type="email"
            placeholder="邮箱 (自动聚焦)"
            class="input"
          />
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            class="input"
          />
          <button type="submit" class="btn btn-primary">登录</button>
        </form>
        <button @click="showModal = false" class="btn-close">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const email = ref('')
const password = ref('')

function submit() {
  console.log('登录:', email.value)
  showModal.value = false
}
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  width: 100%;
  padding: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 12px;
}

.btn-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}
</style>
```

## 可编辑文本

```vue
<template>
  <div class="editable">
    <div v-if="!editing" @click="startEdit" class="text">
      {{ text || '点击编辑' }}
    </div>
    <input
      v-else
      v-focus="{ refocus: true }"
      v-model="text"
      @blur="editing = false"
      @keyup.enter="editing = false"
      class="input"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('点击编辑此文本')
const editing = ref(false)

function startEdit() {
  editing.value = true
}
</script>

<style scoped>
.editable {
  display: inline-block;
}

.text {
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}

.text:hover {
  background: #eee;
}

.input {
  padding: 8px 12px;
  border: 2px solid #42b883;
  border-radius: 4px;
  font-size: 16px;
}
</style>
```

## 在线体验

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/main/examples/vue3)
