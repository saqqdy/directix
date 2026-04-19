# 02 - 安装与配置

**时长：6 分钟**

## 视频信息

- 标题：安装与配置
- 系列：入门系列
- 难度：初级
- 前置知识：Vue 项目基础

## 章节目录

1. 包管理器安装（1.5 分钟）
2. CDN 方式使用（1 分钟）
3. Vue 2 与 Vue 3 配置（2 分钟）
4. 按需引入与全量引入（1.5 分钟）

## 详细脚本

### 开场（0:00-0:10）

> **画面：开场动画 + 标题**

今天我们来学习 Directix 的安装与配置。

### 第一章：包管理器安装（0:10-1:40）

> **画面：终端演示**

首先，使用 npm 安装：

```bash
npm install directix
```

或者使用 yarn：

```bash
yarn add directix
```

或者使用 pnpm（推荐）：

```bash
pnpm add directix
```

> **画面：展示 package.json**

安装完成后，package.json 会添加 directix 依赖。最新版本是 1.9.0。

### 第二章：CDN 方式使用（1:40-2:40）

> **画面：HTML 文件编辑器**

如果你不想用构建工具，可以直接通过 CDN 使用。

**Vue 3 CDN：**

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<div id="app">
  <button v-copy="text">复制</button>
</div>

<script>
  const { createApp, ref } = Vue
  const { Directix } = DirectixLib

  const app = createApp({
    setup() {
      return { text: ref('Hello') }
    }
  })
  app.use(Directix)
  app.mount('#app')
</script>
```

**Vue 2 CDN：**

```html
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>

<div id="app">
  <button v-copy="text">复制</button>
</div>

<script>
  new Vue({
    el: '#app',
    data: { text: 'Hello' }
  })
  Vue.use(DirectixLib.Directix)
</script>
```

### 第三章：Vue 2 与 Vue 3 配置（2:40-4:40）

> **画面：VS Code 项目结构**

**Vue 3 项目配置：**

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Directix from 'directix'

const app = createApp(App)

// 全量注册
app.use(Directix)

// 或按需注册
app.use(Directix, {
  directives: ['copy', 'debounce', 'click-outside']
})

app.mount('#app')
```

> **画面：展示 Vue 2 配置**

**Vue 2.7+ 项目配置：**

```typescript
// main.ts
import Vue from 'vue'
import App from './App.vue'
import Directix from 'directix'

Vue.use(Directix)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

> **画面：展示 Vue 2.6 配置**

**Vue 2.6 及以下版本：**

需要额外安装 Composition API：

```bash
npm install @vue/composition-api
```

然后在 main.ts 中：

```typescript
// main.ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Directix from 'directix'

// 必须先注册 Composition API
Vue.use(VueCompositionAPI)
Vue.use(Directix)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

> **画面：强调顺序**

注意顺序很重要：先注册 Composition API，再注册 Directix。

### 第四章：按需引入与全量引入（4:40-6:00）

> **画面：展示全量引入**

**全量引入：**

```typescript
app.use(Directix)
// 或
app.use(Directix, { all: true })
```

这会注册所有 57 个指令，适合开发环境或需要大量指令的项目。

> **画面：展示按需引入**

**按需引入（推荐）：**

```typescript
app.use(Directix, {
  directives: ['copy', 'debounce', 'focus', 'lazy']
})
```

只注册需要的指令，打包体积更小。

> **画面：展示单指令引入**

**单指令引入：**

```typescript
// 只引入单个指令
import { vCopy } from 'directix'

app.directive('copy', vCopy)
```

这种方式最灵活，打包体积最小。

> **画面：展示体积对比**

体积对比：
- 全量引入：约 30KB (gzip)
- 按需引入：按使用的指令数量
- 单指令：平均 1-2KB (gzip)

### 总结（5:50-6:00）

> **画面：总结要点**

今天我们学习了：
- npm/yarn/pnpm 安装方式
- CDN 使用方式
- Vue 2 和 Vue 3 的配置差异
- 按需引入 vs 全量引入

下集我们将学习常用的事件指令。再见！

> **画面：片尾动画 + 下集预告**

## 配套代码

本视频示例代码：[GitHub - examples/vue3](https://github.com/saqqdy/directix/tree/master/examples/vue3)

## 练习题

1. 在 Vue 3 项目中安装 Directix，只注册 `v-copy` 和 `v-debounce`
2. 使用 CDN 方式创建一个简单的 Vue 3 页面，使用 `v-focus` 指令
3. 在 Vue 2.6 项目中正确配置 Directix（注意 Composition API）

## 相关资源

- [安装文档](https://saqqdy.github.io/directix/guide/installation)
- [Vue 2 支持](https://saqqdy.github.io/directix/guide/installation#vue-2-support)