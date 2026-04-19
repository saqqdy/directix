# 05 - 可见性与懒加载指令

**时长：10 分钟**

## 视频信息

- 标题：可见性与懒加载指令
- 系列：入门系列
- 难度：初级
- 前置知识：Vue 基础

## 章节目录

1. v-lazy 图片懒加载（3 分钟）
2. v-intersect 交叉观察（2.5 分钟）
3. v-visible 可见性控制（2 分钟）
4. v-loading 加载状态（2.5 分钟）

## 详细脚本

### 开场（0:00-0:10）

今天学习 Directix 的可见性相关指令，这些指令基于 IntersectionObserver，能帮你优化页面性能。

### 第一章：v-lazy 图片懒加载（0:10-3:10）

> **画面：展示图片懒加载效果**

**基础用法：**

```vue
<template>
  <img v-lazy="imageUrl" alt="图片" />
</template>

<script setup>
const imageUrl = 'https://example.com/photo.jpg'
</script>
```

**配置对象：**

```vue
<template>
  <img v-lazy="{
    src: imageUrl,
    loading: '/placeholder.png',
    error: '/error.png',
    threshold: 0.1
  }" />
</template>
```

**背景图懒加载：**

```vue
<template>
  <div v-lazy:background="imageUrl" class="hero"></div>
</template>
```

**列表中的懒加载：**

```vue
<template>
  <div class="image-list">
    <img 
      v-for="img in images" 
      :key="img.id" 
      v-lazy="img.url" 
      :alt="img.title" 
    />
  </div>
</template>

<script setup>
const images = ref([
  { id: 1, url: '/img1.jpg', title: '图片1' },
  { id: 2, url: '/img2.jpg', title: '图片2' },
  // ...更多图片
])
</script>
```

### 第二章：v-intersect 交叉观察（3:10-5:40）

> **画面：展示滚动动画效果**

**基础用法：**

```vue
<template>
  <div v-intersect="onIntersect">
    滚动到这里会触发
  </div>
</template>

<script setup>
const onIntersect = (entry) => {
  if (entry.isIntersecting) {
    console.log('元素进入视口')
  }
}
</script>
```

**滚动显示动画：**

```vue
<template>
  <div 
    v-intersect="{
      handler: onVisible,
      threshold: 0.5,
      once: true
    }"
    :class="{ 'animate-in': isVisible }"
  >
    渐入动画内容
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)

const onVisible = (entry) => {
  if (entry.isIntersecting) {
    isVisible.value = true
  }
}
</script>

<style>
.animate-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
```

### 第三章：v-visible 可见性控制（5:40-7:40）

> **画面：展示条件显示效果**

**基础用法：**

```vue
<template>
  <div v-visible="shouldShow">
    根据条件显示/隐藏（保留DOM）
  </div>
</template>
```

与 v-show 的区别：v-visible 使用 visibility 属性，元素不可见时仍占空间。

**结合 IntersectionObserver：**

```vue
<template>
  <div v-visible:observer="{
    threshold: 0.2,
    onVisible: () => console.log('可见'),
    onHidden: () => console.log('不可见')
  }">
    观察可见性
  </div>
</template>
```

### 第四章：v-loading 加载状态（7:40-10:00）

> **画面：展示加载动画效果**

**基础用法：**

```vue
<template>
  <div v-loading="isLoading">
    内容区域
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)

// 模拟加载
setTimeout(() => {
  isLoading.value = false
}, 2000)
</script>
```

**自定义加载文本：**

```vue
<template>
  <div v-loading="{
    active: isLoading,
    text: '加载中，请稍候...',
    background: 'rgba(255, 255, 255, 0.8)',
    spinner: true
  }">
    数据内容
  </div>
</template>
```

**全屏加载：**

```vue
<template>
  <div v-loading:fullscreen="pageLoading">
    <header>导航</header>
    <main>内容</main>
  </div>
</template>
```

**结合异步数据：**

```vue
<template>
  <div v-loading="loading">
    <div v-for="item in data" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const data = ref([])

onMounted(async () => {
  try {
    data.value = await fetchData()
  } finally {
    loading.value = false
  }
})
</script>
```

### 总结

今天学习了四个可见性指令：
- v-lazy - 图片懒加载
- v-intersect - 交叉观察，滚动动画
- v-visible - 可见性控制
- v-loading - 加载状态

下集开始进阶系列，学习 Composables。

## 练习题

1. 创建一个图片画廊，使用 v-lazy 实现图片懒加载
2. 使用 v-intersect 实现滚动到元素时触发动画
3. 实现一个数据面板，使用 v-loading 在数据加载时显示加载状态

## 相关资源

- [可见性指令文档](https://saqqdy.github.io/directix/guide/visibility)
- [v-lazy API](https://saqqdy.github.io/directix/api/directives/lazy)
- [v-intersect API](https://saqqdy.github.io/directix/api/directives/intersect)
