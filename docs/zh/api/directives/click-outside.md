# v-click-outside

检测元素外部的点击事件。非常适合关闭下拉菜单、弹窗和弹出框。

> **起始版本：** `1.0.0`

## 用法

### 基本用法

```vue
<template>
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">切换</button>
    <div v-if="show">下拉菜单内容</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function closeDropdown() {
  show.value = false
}
</script>
```

### 带配置选项

```vue
<template>
  <div v-click-outside="{
    handler: closeDropdown,
    include: ['.trigger'],
    exclude: ['.ignore']
  }">
    <button class="trigger">切换</button>
    <div class="ignore">此区域被忽略</div>
  </div>
</template>
```

## API

### 类型定义

```typescript
interface ClickOutsideOptions {
  /** 点击外部时的回调函数 */
  handler: (event: MouseEvent) => void
  /** 包含在检测中的 CSS 选择器 */
  include?: string[]
  /** 从检测中排除的 CSS 选择器 */
  exclude?: string[]
}

type ClickOutsideBinding = ClickOutsideOptions['handler'] | ClickOutsideOptions
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 点击外部时的回调函数 |
| `include` | `string[]` | `[]` | 包含的 CSS 选择器 |
| `exclude` | `string[]` | `[]` | 排除的 CSS 选择器 |

## 示例

### 下拉菜单

```vue
<template>
  <div v-click-outside="closeMenu" class="dropdown">
    <button @click="isOpen = !isOpen">
      {{ isOpen ? '关闭' : '打开' }}菜单
    </button>
    <ul v-if="isOpen" class="menu">
      <li @click="selectItem('item1')">选项 1</li>
      <li @click="selectItem('item2')">选项 2</li>
      <li @click="selectItem('item3')">选项 3</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function closeMenu() {
  isOpen.value = false
}

function selectItem(item) {
  console.log('已选择:', item)
  closeMenu()
}
</script>
```

### 弹窗对话框

```vue
<template>
  <div v-if="showModal" class="modal-overlay">
    <div v-click-outside="closeModal" class="modal">
      <h2>弹窗标题</h2>
      <p>弹窗内容...</p>
      <button @click="closeModal">关闭</button>
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
```
