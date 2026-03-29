# 观察者指令

观察者指令帮助您观察 DOM 变化和元素大小变化。

## v-resize

使用 ResizeObserver 观察元素大小变化。

### 基本用法

```vue
<template>
  <div v-resize="handleResize">调整我的大小</div>
</template>

<script setup>
function handleResize(entry) {
  console.log('新尺寸:', entry.contentRect.width, entry.contentRect.height)
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 大小变化事件处理程序（必填） |
| `box` | `'content-box' \| 'border-box'` | `'content-box'` | 观察的盒模型 |
| `debounce` | `number` | `0` | 防抖时间（毫秒） |

### 大小信息

处理程序接收一个 `ResizeObserverEntry`：

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `contentRect` | `DOMRectReadOnly` | 内容矩形 |
| `borderBoxSize` | `Array` | 边框盒大小 |
| `contentBoxSize` | `Array` | 内容盒大小 |

## v-mutation

使用 MutationObserver 观察 DOM 变化。

### 基本用法

```vue
<template>
  <div v-mutation="handleMutation">
    观察我的变化
  </div>
</template>

<script setup>
function handleMutation(mutations, observer) {
  mutations.forEach(mutation => {
    console.log('类型:', mutation.type)
    console.log('目标:', mutation.target)
  })
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 变化时的回调（必填） |
| `attributes` | `boolean` | `false` | 观察属性变化 |
| `attributeFilter` | `string[]` | - | 指定观察的属性 |
| `childList` | `boolean` | `true` | 观察子节点变化 |
| `subtree` | `boolean` | `false` | 观察所有后代 |
| `characterData` | `boolean` | `false` | 观察文本内容变化 |

### 变化类型

| 类型 | 描述 |
| ---- | ---- |
| `attributes` | 属性被添加、移除或更改 |
| `childList` | 子节点被添加或移除 |
| `characterData` | 文本内容被更改 |

### 示例

#### 观察子节点变化

```vue
<template>
  <div v-mutation="{
    handler: handleChange,
    childList: true,
    subtree: true
  }">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
  </div>
</template>
```

#### 观察属性变化

```vue
<template>
  <div v-mutation="{
    handler: handleAttributeChange,
    attributes: true,
    attributeFilter: ['class', 'style']
  }">
    观察 class 和 style 变化
  </div>
</template>
```
