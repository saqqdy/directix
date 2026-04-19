# 01 - Directix 介绍与快速上手

**时长：8 分钟**

## 视频信息

- 标题：Directix 介绍与快速上手
- 系列：入门系列
- 难度：初级
- 前置知识：Vue 基础

## 章节目录

1. 什么是 Directix？（1 分钟）
2. 核心特性介绍（2 分钟）
3. 快速演示（3 分钟）
4. 学习路线建议（2 分钟）

## 详细脚本

### 开场（0:00-0:15）

> **画面：开场动画 + 标题**

大家好，欢迎来到 Directix 教程系列。今天我们来认识一个强大的 Vue 指令库。

### 第一章：什么是 Directix？（0:15-1:15）

> **画面：展示 Directix 官网首页**

Directix 是一个功能全面、易于使用的 Vue 自定义指令库。它最大的特点是同时支持 Vue 2 和 Vue 3。

> **画面：展示特性列表动画**

它的核心特性包括：

1. **57+ 常用指令** - 涵盖事件、表单、可见性、滚动等常见场景
2. **Vue 2/3 兼容** - 一套代码，两个版本都能用
3. **Tree-shakable** - 按需引入，打包体积小
4. **TypeScript 支持** - 完整的类型定义
5. **57 个 Composables** - 每个Directive都有对应的组合式函数

简单来说，Directix 让你用声明式的方式处理 DOM 操作，不再需要手写复杂的逻辑。

### 第二章：核心特性介绍（1:15-3:15）

> **画面：分屏展示 Vue 2 和 Vue 3 代码**

首先看兼容性。无论你的项目是 Vue 2 还是 Vue 3，Directix 都能无缝工作。这对于正在迁移的项目特别友好。

> **画面：展示 Tree-shaking 示意图**

第二个重要特性是 Tree-shaking。你只需要引入用到的指令，未使用的代码不会打包进去。

> **画面：展示 TypeScript 类型提示**

第三个特性是 TypeScript 支持。所有指令都有完整的类型定义，IDE 会给出智能提示，减少错误。

> **画面：展示 Composables 示例**

最后是 Composables。每个指令都有对应的 useXxx 函数，让你可以在 Composition API 中使用同样的功能。

### 第三章：快速演示（3:15-6:15）

> **画面：切换到 VS Code**

让我们看几个实际例子。

**示例 1：v-copy - 一键复制**

```vue
<template>
  <!-- 点击复制文本到剪贴板 -->
  <button v-copy="textToCopy">复制文本</button>
</template>

<script setup>
import { ref } from 'vue'

const textToCopy = ref('Hello Directix!')
</script>
```

就这么简单，一行代码实现复制功能。

**示例 2：v-debounce - 防抖输入**

```vue
<template>
  <!-- 输入防抖，500ms 后触发 -->
  <input v-debounce:500ms="handleSearch" placeholder="搜索..." />
</template>

<script setup>
const handleSearch = (value) => {
  console.log('搜索:', value)
  // 执行搜索请求
}
</script>
```

用户输入后等待 500 毫秒才触发，避免频繁请求。

**示例 3：v-click-outside - 点击外部关闭**

```vue
<template>
  <div>
    <button @click="show = !show">打开菜单</button>
    <div v-if="show" v-click-outside="closeMenu" class="dropdown">
      菜单内容
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

const closeMenu = () => {
  show.value = false
}
</script>
```

点击菜单外部自动关闭，这是下拉菜单的标准模式。

**示例 4：v-lazy - 图片懒加载**

```vue
<template>
  <!-- 图片进入视口才加载 -->
  <img v-lazy="imageUrl" alt="懒加载图片" />
</template>
```

图片只在滚动到视口时才加载，提升页面性能。

### 第四章：学习路线建议（6:15-8:00）

> **画面：展示学习路线图**

接下来怎么学？我建议按这个顺序：

1. **先看入门系列** - 掌握安装和常用指令
2. **再看进阶系列** - 学习 Composables、性能优化、调试技巧
3. **最后看实战系列** - 通过实际项目巩固知识

> **画面：展示文档网站**

Directix 官方文档非常完善，有中英日三语支持。每个指令都有详细的 API 文档和示例。

> **画面：展示 Playground**

还有在线 Playground，可以直接体验所有指令。

### 总结（7:45-8:00）

> **画面：总结要点**

今天我们了解了：
- Directix 是什么
- 它的核心特性
- 几个常用指令的用法

下集我们将详细讲解安装与配置。我们下期见！

> **画面：片尾动画 + 下集预告**

## 配套代码

本视频示例代码：[examples/quick-start](../../examples/vue3/src/demos/)

## 练习题

1. 使用 `v-copy` 实现一个复制密码的功能
2. 使用 `v-debounce` 优化搜索输入，设置 300ms 防抖
3. 使用 `v-click-outside` 实现一个模态框点击外部关闭

## 相关资源

- [官方文档](https://saqqdy.github.io/directix/)
- [GitHub 仓库](https://github.com/saqqdy/directix)
- [在线 Playground](https://saqqdy.github.io/directix/playground/)
