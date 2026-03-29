# 可见性指令

可见性指令帮助您管理元素可见性和懒加载。

## v-lazy

图片进入视口时懒加载。

### 基本用法

```vue
<template>
  <img v-lazy="imageUrl" />
  <img v-lazy="{ src: imageUrl, placeholder: 'placeholder.jpg' }" />
  <div v-lazy="backgroundImageUrl"></div>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `src` | `string` | - | 图片源 URL |
| `placeholder` | `string` | - | 占位图 URL |
| `error` | `string` | - | 错误图 URL |
| `preload` | `number` | `0` | 预加载距离（像素） |
| `attempt` | `number` | `1` | 重试次数 |
| `onLoad` | `Function` | - | 加载成功回调 |
| `onError` | `Function` | - | 加载失败回调 |

## v-intersect

观察元素与视口的交叉状态。

### 基本用法

```vue
<template>
  <div v-intersect="handleIntersect">观察我</div>
  <div v-intersect="{ onEnter: handleEnter, onLeave: handleLeave }">
    跟踪可见性
  </div>
</template>

<script setup>
function handleIntersect(entry, observer) {
  console.log('交叉中:', entry.isIntersecting)
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 元素交叉时的回调 |
| `onEnter` | `Function` | - | 元素进入视口时的回调 |
| `onLeave` | `Function` | - | 元素离开视口时的回调 |
| `threshold` | `number \| number[]` | `0` | 触发阈值 |
| `rootMargin` | `string` | `'0px'` | 根元素边距 |
| `once` | `boolean` | `false` | 只触发一次 |

## v-visible

切换元素可见性，支持动画。

### 基本用法

```vue
<template>
  <div v-visible="showElement">显示/隐藏</div>
  <div v-visible="{ useHidden: true, initial: false }">
    使用 visibility: hidden
  </div>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `handler` | `Function` | - | 可见性改变时的回调 |
| `useHidden` | `boolean` | `false` | 使用 `visibility: hidden` |
| `initial` | `boolean` | `true` | 初始可见性状态 |

## v-loading

在元素上显示加载遮罩。

### 基本用法

```vue
<template>
  <div v-loading="isLoading">内容</div>
  <div v-loading="{ value: isLoading, text: '加载中...', lock: true }">
    内容
  </div>
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `boolean` | `true` | 加载状态 |
| `text` | `string` | - | 加载文本 |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | 背景颜色 |
| `lock` | `boolean` | `false` | 加载时锁定滚动 |
| `spinner` | `string` | - | 自定义加载器 HTML |
