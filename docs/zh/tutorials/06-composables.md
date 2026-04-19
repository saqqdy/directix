# 06 - 自定义指令与 Composables

**时长：12 分钟**

## 视频信息

- 标题：自定义指令与 Composables
- 系列：进阶系列
- 难度：中级
- 前置知识：Composition API 基础

## 章节目录

1. 为什么需要 Composables（1.5 分钟）
2. Composables 基础用法（3 分钟）
3. Directive vs Composable 对比（2 分钟）
4. 创建自定义指令模板（3.5 分钟）
5. Composable 组合模式（2 分钟）

## 详细脚本

### 开场（0:00-0:15）

欢迎来到进阶系列。今天我们学习 Composables - Directive 的编程式替代方案。

### 第一章：为什么需要 Composables（0:15-1:45）

> **画面：展示模板 vs 逻辑分离**

指令是声明式的，适合模板中使用。但有些场景你需要在逻辑层处理：

- 动态控制指令行为
- 在 setup 中获取指令状态
- 组合多个指令功能
- 在非模板环境使用

Composables 就是这些场景的解决方案。

### 第二章：Composables 基础用法（1:45-4:45）

> **画面：VS Code 演示**

**useDebounce：**

```vue
<template>
  <input @input="onInput" placeholder="搜索..." />
  <p>防抖值: {{ debouncedValue }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { useDebounce } from 'directix'

const inputValue = ref('')
const { debouncedValue } = useDebounce(inputValue, 500)

const onInput = (e) => {
  inputValue.value = e.target.value
}
</script>
```

**useClickOutside：**

```vue
<template>
  <div ref="target">
    <button @click="show = !show">打开</button>
    <div v-if="show">菜单</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useClickOutside } from 'directix'

const target = ref(null)
const show = ref(false)

useClickOutside(target, () => {
  show.value = false
})
</script>
```

**useIntersect：**

```vue
<template>
  <div ref="target" :class="{ visible: isVisible }">
    {{ isVisible ? '可见' : '不可见' }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersect } from 'directix'

const target = ref(null)
const { isVisible, entry } = useIntersect(target, { threshold: 0.5 })
</script>
```

### 第三章：Directive vs Composable 对比（4:45-6:45）

> **画面：分屏对比**

| 特性 | Directive | Composable |
|------|-----------|------------|
| 使用方式 | 模板中声明 | setup 中调用 |
| 适用场景 | DOM 绑定 | 逻辑处理 |
| 状态管理 | 隐式 | 显式响应式 |
| 组合性 | 有限 | 灵活组合 |
| SSR 支持 | 需要处理 | 天然支持 |

**选择建议：**
- 简单 DOM 操作 → Directive
- 需要响应式状态 → Composable
- 需要组合功能 → Composable
- 模板中快速使用 → Directive

### 第四章：创建自定义指令模板（6:45-10:15）

> **画面：展示模板系统**

Directix 提供三种指令模板，帮你快速创建自定义指令。

**createDirectiveTemplate：**

```typescript
import { createDirectiveTemplate } from 'directix'

const vHighlight = createDirectiveTemplate({
  name: 'highlight',

  onMount(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },

  onUpdate(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },

  onUnmount(el) {
    el.style.backgroundColor = ''
  },

  validate(options) {
    if (options.color && !CSS.supports('color', options.color)) {
      return '无效的颜色值'
    }
    return null
  }
})
```

**createEventDirective：**

```typescript
import { createEventDirective } from 'directix'

const vTrack = createEventDirective({
  name: 'track',
  eventName: 'click',
  handler(el, binding, event) {
    analytics.track(binding.value, {
      element: el.tagName,
      timestamp: Date.now()
    })
  }
})
```

**createStyleDirective：**

```typescript
import { createStyleDirective } from 'directix'

const vOpacity = createStyleDirective({
  name: 'opacity',
  cssProperty: 'opacity',
  defaultUnit: '',
  validate(value) {
    return typeof value === 'number' && value >= 0 && value <= 1
  }
})
```

**注册为插件：**

```typescript
import { definePlugin } from 'directix'

const myPlugin = definePlugin({
  meta: {
    name: 'directix-my-plugin',
    version: '1.0.0',
    description: '自定义指令插件'
  },
  install(ctx) {
    ctx.registerDirective('highlight', vHighlight)
    ctx.registerDirective('track', vTrack)
    ctx.registerDirective('opacity', vOpacity)
  }
})
```

### 第五章：Composable 组合模式（10:15-12:00）

> **画面：展示组合示例**

Composables 的最大优势是灵活组合：

```vue
<script setup>
import { ref } from 'vue'
import { useDebounce, useIntersect, useCopy } from 'directix'

// 组合：防抖搜索 + 懒加载 + 复制
const searchQuery = ref('')
const { debouncedValue } = useDebounce(searchQuery, 300)

const target = ref(null)
const { isVisible } = useIntersect(target)

const { copy, copied } = useCopy()

const copyResult = () => {
  copy(searchResults.value)
}
</script>
```

### 总结

今天学习了：
- Composables 的用途和优势
- 常用 Composable 的用法
- Directive vs Composable 的选择
- 自定义指令模板的创建
- Composable 组合模式

下集我们学习 Vue DevTools 调试技巧。

## 练习题

1. 使用 useDebounce 实现一个搜索功能
2. 使用 createDirectiveTemplate 创建一个 v-tooltip 自定义指令
3. 组合 useIntersect 和 useCopy 实现滚动到元素时复制内容

## 相关资源

- [插件系统文档](https://saqqdy.github.io/directix/zh/guide/plugin)
- [Composables API](https://saqqdy.github.io/directix/zh/api/)