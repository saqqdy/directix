# v-mutation

使用 MutationObserver 观察 DOM 变化。

> **起始版本：** `1.0.0`

## 用法

### 基本

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

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 变化时的回调（必填） |
| `attributes` | `boolean` | `false` | 观察属性变化 |
| `attributeFilter` | `string[]` | - | 指定观察的属性 |
| `childList` | `boolean` | `true` | 观察子节点变化 |
| `subtree` | `boolean` | `false` | 观察所有后代 |
| `characterData` | `boolean` | `false` | 观察文本内容变化 |
