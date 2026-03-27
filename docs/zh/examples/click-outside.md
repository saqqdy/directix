# Click Outside 示例

检测元素外部的点击事件，用于关闭下拉菜单、弹窗和弹出框。

## 基础下拉菜单

```vue
<template>
  <div v-click-outside="closeDropdown" class="dropdown-container">
    <button @click="isOpen = !isOpen" class="dropdown-trigger">
      {{ isOpen ? '关闭' : '打开' }}下拉菜单
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <a href="#" class="dropdown-item">个人资料</a>
      <a href="#" class="dropdown-item">设置</a>
      <a href="#" class="dropdown-item">退出登录</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function closeDropdown() {
  isOpen.value = false
}
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 150px;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background: #f5f5f5;
}
</style>
```

## 弹窗对话框

```vue
<template>
  <div>
    <button @click="showModal = true" class="btn">打开弹窗</button>

    <div v-if="showModal" class="modal-overlay">
      <div v-click-outside="closeModal" class="modal">
        <h2>弹窗标题</h2>
        <p>点击弹窗外部区域可关闭弹窗。</p>
        <button @click="closeModal" class="btn">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)

function closeModal() {
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
  max-width: 400px;
}
</style>
```

## 在线体验

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
