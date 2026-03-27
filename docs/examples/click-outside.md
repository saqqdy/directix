# Click Outside Example

Detect clicks outside an element to close dropdowns, modals, and popovers.

## Basic Dropdown

```vue
<template>
  <div v-click-outside="closeDropdown" class="dropdown-container">
    <button @click="isOpen = !isOpen" class="dropdown-trigger">
      {{ isOpen ? 'Close' : 'Open' }} Dropdown
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <a href="#" class="dropdown-item">Profile</a>
      <a href="#" class="dropdown-item">Settings</a>
      <a href="#" class="dropdown-item">Logout</a>
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

## Modal Dialog

```vue
<template>
  <div>
    <button @click="showModal = true" class="btn">Open Modal</button>

    <div v-if="showModal" class="modal-overlay">
      <div v-click-outside="closeModal" class="modal">
        <h2>Modal Title</h2>
        <p>Click outside this modal to close it.</p>
        <button @click="closeModal" class="btn">Close</button>
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

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/main/examples/vue3)
