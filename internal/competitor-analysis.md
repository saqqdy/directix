# Vue Directives 指令库竞品分析报告（详细版）

## 一、市场概览

### 1.1 市场现状

Vue 自定义指令库市场呈现以下特点：

1. **碎片化严重**：大多数指令库只专注于单一功能，如 `v-click-outside`、`v-lazyload`、`v-tooltip` 等
2. **缺乏统一解决方案**：市面上没有一个真正全面覆盖所有常用指令的库
3. **版本兼容问题**：很多库仅支持 Vue 2 或 Vue 3，很少有同时兼容两个版本的
4. **维护状态不一**：部分热门库维护活跃，但也有不少已停止维护
5. **质量参差不齐**：TypeScript 支持不完善，测试覆盖率低

### 1.2 竞品分类

| 类型 | 代表产品 | 特点 | 市场份额 |
|------|---------|------|---------|
| 综合工具库 | VueUse、@opentiny/vue-directive | 功能全面，但以 Composition API 为主 | 高 |
| 单一指令库 | v-click-outside、vue-lazyload、v-tooltip | 功能单一，专业化程度高 | 中 |
| 字符串/表单处理 | vue-string-directives、v-mask | 专注表单和字符串处理 | 低 |
| 权限控制 | vue-permission-directive | 专注权限管理 | 低 |
| UI 效果类 | v-wave、vue-ripple-directive | 专注视觉效果 | 低 |

### 1.3 市场规模估算

根据 npm 周下载量统计：

| 指令类别 | 代表库 | 周下载量 | 年增长率 |
|---------|--------|---------|---------|
| 点击外部 | v-click-outside 系列 | 300k+ | -5% |
| 懒加载 | vue-lazyload | 300k+ | +10% |
| 提示框 | v-tooltip/floating-vue | 500k+ | +15% |
| 剪贴板 | v-clipboard 系列 | 150k+ | +8% |
| 波纹效果 | v-wave | 50k+ | +20% |
| 滚动 | vue-scrollto | 150k+ | -3% |

---

## 二、主要竞品详细分析

### 2.1 VueUse (@vueuse/core)

#### 基本信息

| 属性 | 值 |
|------|-----|
| 版本 | 14.2.1 |
| 周下载量 | 1,000,000+ |
| 维护者 | Anthony Fu |
| GitHub Stars | 20,000+ |
| 许可证 | MIT |
| 最后更新 | 2024-02 |

#### 优势

| 优势 | 说明 |
|------|------|
| 功能全面 | 200+ 组合式函数，覆盖面极广 |
| 维护活跃 | 持续迭代，社区活跃 |
| TypeScript | 原生支持，类型完善 |
| 文档优秀 | 完整的中英文文档 |
| Tree-shaking | 完善支持 |
| 生态系统 | 与 Vue 生态深度集成 |

#### 劣势

| 劣势 | 说明 |
|------|------|
| 非指令形式 | 主要提供 Composition API 函数 |
| 包体积大 | 全量约 50KB+ gzipped |
| 学习成本 | 需要了解 Composition API |
| 模板使用不便 | 无法直接在模板中使用 |

#### 指令功能覆盖情况

| 指令类型 | 是否支持 | 支持形式 | 对应函数/组件 |
|---------|---------|---------|--------------|
| click-outside | ✅ | 组件 | `OnClickOutside` |
| lazy | ✅ | 组合式 | `useIntersectionObserver` |
| scroll | ✅ | 组合式 | `useScroll` |
| resize | ✅ | 组合式 | `useElementSize` |
| clipboard | ✅ | 组合式 | `useClipboard` |
| permission | ✅ | 组合式 | `usePermission` |
| focus | ✅ | 组合式 | `useFocus` |
| hover | ✅ | 组合式 | `useElementHover` |
| debounce | ✅ | 工具函数 | `useDebounceFn` |
| throttle | ✅ | 工具函数 | `useThrottleFn` |

#### 代码示例

```vue
<!-- VueUse 方式：需要使用组件或组合式 API -->
<template>
  <!-- 组件方式 -->
  <OnClickOutside @trigger="handleClickOutside">
    <div>内容</div>
  </OnClickOutside>
</template>

<script setup>
import { OnClickOutside, useClipboard, useDebounceFn } from '@vueuse/core'

// 组合式 API
const { copy, copied } = useClipboard()
const debouncedFn = useDebounceFn(() => {}, 300)
</script>
```

---

### 2.2 @opentiny/vue-directive

#### 基本信息

| 属性 | 值 |
|------|-----|
| 版本 | 3.29.0 |
| 维护者 | OpenTiny 团队（华为） |
| Vue 2 支持 | ✅ |
| Vue 3 支持 | ✅ |
| 许可证 | ISC |
| 最后更新 | 2024-02 |

#### 优势

| 优势 | 说明 |
|------|------|
| 企业级维护 | 华为团队背书 |
| 双版本支持 | 同时支持 Vue 2 和 Vue 3 |
| 版本迭代活跃 | 持续更新 |
| 指令形式 | 真正的指令库 |

#### 劣势

| 劣势 | 说明 |
|------|------|
| 文档缺乏 | 独立文档不完善 |
| 知名度低 | 社区认知度不足 |
| 独立性不足 | 作为 TinyUI 的一部分 |
| 覆盖有限 | 指令数量较少 |

#### 包含指令

| 指令 | 功能描述 |
|------|---------|
| v-tooltip | 提示框 |
| v-popover | 弹出框 |
| v-contextmenu | 右键菜单 |
| v-drag | 拖拽 |
| v-resize | 尺寸监听 |

---

### 2.3 Click Outside 类指令库详细对比

#### 2.3.1 v-click-outside

| 属性 | 值 |
|------|-----|
| 版本 | 3.2.0 |
| 周下载量 | 200,000+ |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止维护 |
| 最后更新 | 2020-05 |

**功能特点**
- 基础的点击外部检测
- 支持排除元素
- 轻量级

**API 设计**
```vue
<template>
  <div v-click-outside="handler">内容</div>
</template>

<script>
export default {
  methods: {
    handler(e) {
      console.log('clicked outside')
    }
  }
}
</script>
```

#### 2.3.2 v-click-outside-x

| 属性 | 值 |
|------|-----|
| 版本 | 4.1.3 |
| 周下载量 | 50,000+ |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 停止维护 |
| 最后更新 | 2021-04 |

**功能特点**
- 支持 Vue 2 和 Vue 3
- 支持多个事件类型
- 支持排除元素
- 支持条件判断

**API 设计**
```vue
<template>
  <div
    v-click-outside="{
      handler: handler,
      exclude: ['button'],
      events: ['click', 'touchstart']
    }"
  >
    内容
  </div>
</template>
```

#### 2.3.3 click-outside-vue3

| 属性 | 值 |
|------|-----|
| 版本 | 4.0.1 |
| 周下载量 | 20,000+ |
| Vue 支持 | Vue 3 |
| 维护状态 | 停止维护 |
| 最后更新 | 2021-04 |

#### 2.3.4 vue3-click-away

| 属性 | 值 |
|------|-----|
| 版本 | 1.2.4 |
| 周下载量 | 10,000+ |
| Vue 支持 | Vue 3 |
| 维护状态 | 停止维护 |
| 最后更新 | 2022-03 |

#### 2.3.5 对比总结

| 特性 | v-click-outside | v-click-outside-x | click-outside-vue3 | vue3-click-away |
|------|----------------|-------------------|-------------------|-----------------|
| Vue 2 | ✅ | ✅ | ❌ | ❌ |
| Vue 3 | ❌ | ✅ | ✅ | ✅ |
| 排除元素 | ✅ | ✅ | ✅ | ✅ |
| 多事件类型 | ❌ | ✅ | ❌ | ✅ |
| 触摸事件 | ❌ | ✅ | ❌ | ✅ |
| TypeScript | ❌ | ✅ | ❌ | ✅ |
| 维护状态 | 停止 | 停止 | 停止 | 停止 |
| 包体积 | 1.2KB | 2.1KB | 1.5KB | 1.8KB |

---

### 2.4 懒加载类指令库详细对比

#### 2.4.1 vue-lazyload

| 属性 | 值 |
|------|-----|
| 版本 | 3.0.0 |
| 周下载量 | 300,000+ |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 活跃 |
| 最后更新 | 2023-04 |

**功能特点**
- 图片懒加载
- 背景图懒加载
- 响应式图片
- 加载状态管理
- 自定义加载器

**API 设计**
```vue
<template>
  <!-- 基础用法 -->
  <img v-lazy="imageUrl">

  <!-- 背景图 -->
  <div v-lazy:background-image="imageUrl"></div>

  <!-- 响应式 -->
  <img v-lazy="{ src: imageUrl, loading: placeholder, error: errorImage }">
</template>

<script>
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'error.png',
  loading: 'loading.gif',
  attempt: 1,
})
</script>
```

**配置选项**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| preLoad | number | 1.3 | 预加载高度比例 |
| error | string | - | 加载失败图片 |
| loading | string | - | 加载中图片 |
| attempt | number | 1 | 尝试次数 |
| lazyComponent | boolean | false | 是否懒加载组件 |
| adapter | object | - | 自定义适配器 |
| filter | object | - | 过滤器 |

#### 2.4.2 vue-lazy

| 属性 | 值 |
|------|-----|
| 版本 | 0.2.4 |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 停止 |
| 特点 | 基于 IntersectionObserver |

#### 2.4.3 @xunlei/vue-lazy-component

| 属性 | 值 |
|------|-----|
| 版本 | 1.1.3 |
| Vue 支持 | Vue 2 |
| 特点 | 组件级懒加载 |

---

### 2.5 Tooltip 类指令库详细对比

#### 2.5.1 v-tooltip

| 属性 | 值 |
|------|-----|
| 版本 | 2.1.3 (Vue 2) / 4.0.0-beta.17 (Vue 3) |
| 周下载量 | 500,000+ |
| 作者 | Guillaume Chau (Vue 核心团队成员) |
| 维护状态 | 活跃 |

**功能特点**
- 指令式 tooltip
- 多种触发方式
- 自定义主题
- 响应式定位
- HTML 内容支持

**API 设计**
```vue
<template>
  <!-- 基础用法 -->
  <button v-tooltip="'提示内容'">悬停</button>

  <!-- 配置对象 -->
  <button v-tooltip="{ content: '提示', placement: 'top' }">悬停</button>

  <!-- 动态内容 -->
  <button v-tooltip="tooltipContent">悬停</button>
</template>
```

**配置选项**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| content | string | - | 提示内容 |
| placement | string | 'top' | 位置 |
| delay | object | { show: 0, hide: 0 } | 延迟 |
| trigger | string | 'hover' | 触发方式 |
| offset | number | 10 | 偏移量 |
| classes | string | - | 自定义类名 |

#### 2.5.2 floating-vue

| 属性 | 值 |
|------|-----|
| 版本 | 5.2.2 |
| Vue 支持 | Vue 3 |
| 维护状态 | 活跃 |
| 基础 | floating-ui |

**功能特点**
- 支持 tooltip、popover、dropdown、menu
- 基于 floating-ui（原 Popper.js v2）
- 更现代的 API
- 更好的定位算法

**API 设计**
```vue
<template>
  <!-- Tooltip -->
  <VTooltip placement="top">
    <button>悬停</button>
    <template #popper>提示内容</template>
  </VTooltip>

  <!-- Dropdown -->
  <VDropdown>
    <button>下拉</button>
    <template #popper>
      <div>下拉内容</div>
    </template>
  </VDropdown>
</template>
```

#### 2.5.3 对比总结

| 特性 | v-tooltip | floating-vue |
|------|-----------|--------------|
| Vue 2 | ✅ | ❌ |
| Vue 3 | ✅ (beta) | ✅ |
| Tooltip | ✅ | ✅ |
| Popover | ✅ | ✅ |
| Dropdown | ❌ | ✅ |
| Menu | ❌ | ✅ |
| 指令形式 | ✅ | ❌ (组件形式) |
| TypeScript | ✅ | ✅ |
| 包体积 | 8KB | 12KB |
| 维护状态 | 活跃 | 活跃 |

---

### 2.6 复制粘贴类指令库详细对比

#### 2.6.1 v-clipboard

| 属性 | 值 |
|------|-----|
| 版本 | 3.0.0-next.1 |
| 周下载量 | 100,000+ |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 活跃 |

**API 设计**
```vue
<template>
  <!-- 基础用法 -->
  <button v-clipboard="text">复制</button>

  <!-- 成功回调 -->
  <button v-clipboard:success="onSuccess">复制</button>

  <!-- 失败回调 -->
  <button v-clipboard:error="onError">复制</button>
</template>

<script setup>
import { ref } from 'vue'
import clipboard from 'v-clipboard'

const text = ref('要复制的内容')

function onSuccess() {
  console.log('复制成功')
}

function onError() {
  console.log('复制失败')
}
</script>
```

#### 2.6.2 vue-clipboard3

| 属性 | 值 |
|------|-----|
| 版本 | 2.0.0 |
| Vue 支持 | Vue 3 |
| 特点 | Composition API |

**API 设计**
```vue
<script setup>
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()

async function copy() {
  await toClipboard('要复制的内容')
}
</script>
```

#### 2.6.3 vue-clipboards

| 属性 | 值 |
|------|-----|
| 版本 | 1.3.0 |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |

#### 2.6.4 对比总结

| 特性 | v-clipboard | vue-clipboard3 | vue-clipboards |
|------|-------------|----------------|----------------|
| Vue 2 | ✅ | ❌ | ✅ |
| Vue 3 | ✅ | ✅ | ❌ |
| 指令形式 | ✅ | ❌ | ✅ |
| Composition API | ❌ | ✅ | ❌ |
| TypeScript | ✅ | ✅ | ❌ |
| Promise 支持 | ✅ | ✅ | ❌ |
| 包体积 | 2KB | 1.5KB | 2.5KB |

---

### 2.7 Ripple 波纹效果类指令库详细对比

#### 2.7.1 v-wave

| 属性 | 值 |
|------|-----|
| 版本 | 3.0.4 |
| 周下载量 | 30,000+ |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 活跃 |

**功能特点**
- Material Design 风格
- 多种颜色支持
- 自定义持续时间
- 自定义初始透明度
- 支持禁用

**API 设计**
```vue
<template>
  <!-- 基础用法 -->
  <button v-wave>点击</button>

  <!-- 配置对象 -->
  <button v-wave="{ color: 'red', duration: 0.6 }">点击</button>
</template>

<script>
import VWave from 'v-wave'

app.use(VWave, {
  color: 'currentColor',
  duration: 0.4,
  dissolveDuration: 0.3,
  initialOpacity: 0.2,
  finalOpacity: 0.1,
})
</script>
```

#### 2.7.2 vue-ripple-directive

| 属性 | 值 |
|------|-----|
| 版本 | 2.0.1 |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |
| 最后更新 | 2017-11 |

#### 2.7.3 vue-ripple-lite

| 属性 | 值 |
|------|-----|
| 版本 | 2.0.1 |
| Vue 支持 | Vue 2 & Vue 3 |
| 特点 | 轻量级 |

#### 2.7.4 对比总结

| 特性 | v-wave | vue-ripple-directive | vue-ripple-lite |
|------|--------|---------------------|-----------------|
| Vue 2 | ✅ | ✅ | ✅ |
| Vue 3 | ✅ | ❌ | ✅ |
| TypeScript | ✅ | ❌ | ❌ |
| 自定义颜色 | ✅ | ✅ | ❌ |
| 自定义动画 | ✅ | ❌ | ✅ |
| 包体积 | 3KB | 2KB | 1.5KB |
| 维护状态 | 活跃 | 停止 | 活跃 |

---

### 2.8 滚动类指令库详细对比

#### 2.8.1 vue-scrollto

| 属性 | 值 |
|------|-----|
| 版本 | 2.20.0 |
| 周下载量 | 150,000+ |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |

**功能特点**
- 平滑滚动
- 自定义缓动函数
- 支持容器滚动
- 响应式偏移

**API 设计**
```vue
<template>
  <!-- 指令方式 -->
  <button v-scroll-to="'#element'">滚动到元素</button>

  <!-- 配置对象 -->
  <button v-scroll-to="{ el: '#element', duration: 500 }">滚动</button>
</template>

<script>
import VueScrollTo from 'vue-scrollto'

Vue.use(VueScrollTo, {
  container: 'body',
  duration: 500,
  easing: 'ease',
  offset: 0,
})
</script>
```

#### 2.8.2 vue-scroll

| 属性 | 值 |
|------|-----|
| 版本 | 2.1.13 |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |
| 特点 | 滚动事件监听 |

#### 2.8.3 vue-infinite-scroll

| 属性 | 值 |
|------|-----|
| 版本 | 2.0.2 |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |
| 特点 | 无限滚动 |

**API 设计**
```vue
<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
  </div>
</template>
```

---

### 2.9 权限控制类指令库详细对比

#### 2.9.1 vue-permission-directive

| 属性 | 值 |
|------|-----|
| 版本 | 3.0.6 |
| Vue 支持 | Vue 3 |
| 维护状态 | 活跃 |
| 特点 | 支持 Nuxt 3 |

**功能特点**
- AND/OR 逻辑
- 正则匹配
- 模式匹配
- RBAC 支持
- 自定义检查函数

**API 设计**
```vue
<template>
  <!-- 单个权限 -->
  <button v-permission="'admin'">管理员</button>

  <!-- AND 逻辑 -->
  <div v-permission:and="['admin', 'editor']">需要两个权限</div>

  <!-- OR 逻辑 -->
  <div v-permission:or="['admin', 'editor']">任一权限即可</div>

  <!-- 正则 -->
  <div v-permission:regex="'^admin'">匹配 admin 开头</div>
</template>

<script setup>
import { configurePermission } from 'vue-permission-directive'

configurePermission({
  getPermissions: () => ['admin', 'editor'],
})
</script>
```

#### 2.9.2 vue-permission

| 属性 | 值 |
|------|-----|
| 版本 | 1.0.12 |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |
| 最后更新 | 2018-05 |

---

### 2.10 字符串/表单处理类指令库详细对比

#### 2.10.1 vue-string-directives

| 属性 | 值 |
|------|-----|
| 版本 | 1.2.2 |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 活跃 |

**支持指令**

| 指令 | 功能 |
|------|------|
| v-trim | 去除空格 |
| v-lowercase | 转小写 |
| v-uppercase | 转大写 |
| v-capitalize | 首字母大写 |
| v-slugify | URL 友好化 |
| v-truncate | 截断 |
| v-mask | 掩码 |

**API 设计**
```vue
<template>
  <input v-trim v-model="text">
  <input v-uppercase v-model="text">
  <input v-lowercase v-model="text">
  <input v-capitalize v-model="text">
</template>
```

#### 2.10.2 v-mask

| 属性 | 值 |
|------|-----|
| 版本 | 2.3.0 |
| 周下载量 | 200,000+ |
| Vue 支持 | Vue 2 |
| 维护状态 | 停止 |

**API 设计**
```vue
<template>
  <input v-mask="'(###) ###-####'" v-model="phone">
  <input v-mask="'##/##/####'" v-model="date">
</template>
```

#### 2.10.3 vue-input-facade

| 属性 | 值 |
|------|-----|
| 版本 | 2.2.0 |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 活跃 |

**功能特点**
- 多种掩码模式
- 正则支持
- 格式化函数
- 解析函数

---

### 2.11 安全类指令库详细对比

#### 2.11.1 vue-dompurify-html

| 属性 | 值 |
|------|-----|
| 版本 | 5.3.0 |
| Vue 支持 | Vue 2 & Vue 3 |
| 维护状态 | 活跃 |
| 基础 | DOMPurify |

**功能特点**
- XSS 防护
- HTML 白名单
- 自定义规则
- SVG 支持

**API 设计**
```vue
<template>
  <!-- 基础用法 -->
  <div v-dompurify-html="userContent"></div>

  <!-- 自定义配置 -->
  <div v-dompurify-html:no-attrs="userContent"></div>
</template>
```

---

### 2.12 其他值得关注的指令库

#### 2.12.1 vue-long-click

| 属性 | 值 |
|------|-----|
| 版本 | 0.1.0 |
| Vue 支持 | Vue 2 |
| 功能 | 长按事件 |

#### 2.12.2 draggable-vue-directive

| 属性 | 值 |
|------|-----|
| 版本 | 2.1.0 |
| Vue 支持 | Vue 2 |
| 功能 | 拖拽 |

#### 2.12.3 vue-directive-touch

| 属性 | 值 |
|------|-----|
| 版本 | 1.0.28 |
| Vue 支持 | Vue 2 |
| 功能 | 手势识别 |

#### 2.12.4 vue-sticky-directive

| 属性 | 值 |
|------|-----|
| 版本 | 0.0.10 |
| Vue 支持 | Vue 2 |
| 功能 | 粘性定位 |

#### 2.12.5 vue-resize-directive

| 属性 | 值 |
|------|-----|
| 版本 | 1.2.0 |
| Vue 支持 | Vue 2 |
| 功能 | 尺寸监听 |

#### 2.12.6 vue-directive-image-previewer

| 属性 | 值 |
|------|-----|
| 版本 | 2.2.2 |
| Vue 支持 | Vue 2 |
| 功能 | 图片预览 |

---

## 三、功能覆盖对比矩阵

### 3.1 指令功能覆盖表

| 指令类型 | VueUse | OpenTiny | 单一库存在 | 最佳单一库 | 我们的机遇 |
|---------|--------|---------|-----------|-----------|-----------|
| click-outside | 组件 | ✅ | ✅ 多个库 | v-click-outside-x | 统一兼容版本 |
| lazy-load | 组合式 | ❌ | ✅ | vue-lazyload | 扩展功能 |
| scroll | 组合式 | ❌ | ✅ | vue-scrollto | 统一API |
| resize | 组合式 | ❌ | ✅ | vue-resize-directive | 增强功能 |
| tooltip | ❌ | ✅ | ✅ | floating-vue | 轻量化 |
| ripple | ❌ | ❌ | ✅ | v-wave | 可整合 |
| clipboard | 组合式 | ❌ | ✅ | v-clipboard | 指令化 |
| permission | ❌ | ❌ | ✅ | vue-permission-directive | 扩展场景 |
| mask | ❌ | ❌ | ✅ | vue-input-facade | 增强功能 |
| long-press | ❌ | ❌ | ✅ | vue-long-click | 可整合 |
| draggable | ❌ | ❌ | ✅ | draggable-vue-directive | 可整合 |
| touch | ❌ | ❌ | ✅ | vue-directive-touch | 可整合 |
| sticky | ❌ | ❌ | ✅ | vue-sticky-directive | 可整合 |
| infinite-scroll | ❌ | ❌ | ✅ | vue-infinite-scroll | 可整合 |
| sanitize/html | ❌ | ❌ | ✅ | vue-dompurify-html | 安全增强 |
| image-preview | ❌ | ❌ | ✅ | vue-directive-image-previewer | 可整合 |
| copy | 组合式 | ❌ | ✅ | v-clipboard | 指令化 |
| debounce | 组合式 | ❌ | ❌ | - | 指令化 |
| throttle | 组合式 | ❌ | ❌ | - | 指令化 |
| focus | 组合式 | ❌ | ❌ | - | 指令化 |
| hover | 组合式 | ❌ | ❌ | - | 指令化 |
| intersect | 组合式 | ❌ | ❌ | - | 指令化 |
| mutation | 组合式 | ❌ | ❌ | - | 指令化 |

### 3.2 版本兼容性对比

| 库名 | Vue 2 | Vue 3 | 双版本维护 | 维护策略 |
|------|-------|-------|-----------|---------|
| VueUse | ❌ | ✅ | 单版本 | 仅 Vue 3 |
| @opentiny/vue-directive | ✅ | ✅ | 双版本独立包 | 分别维护 |
| vue-lazyload | ✅ | ✅ | 单包双版本 | 条件导出 |
| v-wave | ✅ | ✅ | 单包双版本 | 条件导出 |
| v-click-outside-x | ✅ | ✅ | 单包双版本 | 条件导出 |
| vue-dompurify-html | ✅ | ✅ | 单包双版本 | 条件导出 |
| v-tooltip | ✅ | ✅ | 双版本独立包 | 分别维护 |
| vue-string-directives | ✅ | ✅ | 单包双版本 | 条件导出 |

### 3.3 包体积对比

| 库名 | Gzipped 体积 | 说明 |
|------|-------------|------|
| @vueuse/core (完整) | ~50KB | 全量引入 |
| @vueuse/core (单函数) | ~1-3KB | 按需引入 |
| vue-lazyload | ~4KB | 完整包 |
| v-tooltip | ~8KB | 完整包 |
| floating-vue | ~12KB | 完整包 |
| v-wave | ~3KB | 完整包 |
| v-clipboard | ~2KB | 完整包 |
| v-click-outside-x | ~2KB | 完整包 |
| vue-permission-directive | ~1.5KB | 完整包 |

---

## 四、差距分析与机遇

### 4.1 市场空白详细分析

#### 4.1.1 统一指令库缺失

**现状**
- 开发者需要为不同功能安装不同包
- 包管理复杂度增加
- 版本冲突风险
- 维护成本高

**影响**
```bash
# 当前开发者的依赖示例
npm install v-click-outside vue-lazyload v-tooltip v-clipboard v-wave vue-permission-directive

# 未来使用 Directix
npm install directix
```

#### 4.1.2 Vue 2/3 兼容方案稀缺

**现状**
- 大多数库只支持单一版本
- 迁移成本高
- 代码重复

**Vue 2/3 市场份额**

| 版本 | 市场份额 | 趋势 |
|------|---------|------|
| Vue 2 | ~40% | 下降中 |
| Vue 3 | ~60% | 上升中 |

#### 4.1.3 指令形式需求存在

**现状**
- VueUse 主要提供 Composition API
- 指令形式在某些场景更简洁
- 模板直接使用更直观

**使用场景对比**

```vue
<!-- Composition API 方式 -->
<template>
  <div ref="container">内容</div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const container = ref(null)
onClickOutside(container, () => {
  // 处理逻辑
})
</script>

<!-- 指令方式（更简洁） -->
<template>
  <div v-click-outside="handler">内容</div>
</template>

<script setup>
function handler() {
  // 处理逻辑
}
</script>
```

#### 4.1.4 文档和示例不足

**现状**
- 多数库缺乏中文文档
- 使用示例不够丰富
- 最佳实践缺失

### 4.2 竞争优势定位

| 维度 | 现状 | 我们的机会 | 实现难度 |
|------|------|-----------|---------|
| 覆盖面 | 碎片化 | 提供一站式解决方案 | 中 |
| 兼容性 | 版本割裂 | 单代码库支持 Vue 2/3 | 高 |
| 易用性 | API 不统一 | 统一的 API 设计 | 低 |
| 文档 | 多数缺乏中文文档 | 完善的中英文文档 | 中 |
| Tree-shaking | 部分支持 | 按需引入优化 | 低 |
| TypeScript | 部分支持 | 原生 TS 支持 | 中 |
| 服务端渲染 | 支持不一致 | 完整 SSR 支持 | 高 |
| 测试覆盖 | 普遍较低 | 完整测试覆盖 | 中 |

---

## 五、建议规划的功能列表

### 5.1 第一阶段：核心指令 (v1.0)

| 指令 | 说明 | 优先级 | 参考 | 差异化点 |
|------|------|-------|------|---------|
| v-click-outside | 点击外部检测 | P0 | v-click-outside-x | 统一 Vue 2/3，增强排除逻辑 |
| v-lazy | 图片/组件懒加载 | P0 | vue-lazyload | 更轻量，支持 IntersectionObserver |
| v-copy | 复制到剪贴板 | P0 | v-clipboard | 组合式 API 支持 |
| v-debounce | 防抖 | P0 | - | 指令形式，VueUse 互补 |
| v-throttle | 节流 | P0 | - | 指令形式，VueUse 互补 |
| v-permission | 权限控制 | P0 | vue-permission-directive | Vue 2 支持 |
| v-long-press | 长按事件 | P1 | vue-long-click | 增强配置 |
| v-hover | 悬停状态 | P1 | - | 指令形式 |
| v-focus | 自动聚焦 | P1 | - | 增强选择器 |
| v-ripple | 波纹效果 | P1 | v-wave | 更轻量 |

### 5.2 第二阶段：增强指令 (v1.1)

| 指令 | 说明 | 优先级 | 参考 |
|------|------|-------|------|
| v-scroll | 滚动监听与滚动到 | P1 | vue-scrollto |
| v-resize | 元素尺寸变化监听 | P1 | vue-resize-directive |
| v-intersect | 进入视口检测 | P1 | - |
| v-infinite-scroll | 无限滚动 | P1 | vue-infinite-scroll |
| v-sticky | 粘性定位 | P1 | vue-sticky-directive |
| v-mask | 输入掩码 | P1 | vue-input-facade |
| v-tooltip | 提示框 | P2 | v-tooltip |
| v-draggable | 拖拽 | P2 | draggable-vue-directive |
| v-touch | 手势支持 | P2 | vue-directive-touch |
| v-sanitize | HTML 安全过滤 | P2 | vue-dompurify-html |

### 5.3 第三阶段：扩展指令 (v1.2)

| 指令 | 说明 | 优先级 | 参考 |
|------|------|-------|------|
| v-image-preview | 图片预览 | P2 | vue-directive-image-previewer |
| v-truncate | 文本截断 | P2 | vue-string-directives |
| v-uppercase/lowercase | 大小写转换 | P2 | vue-string-directives |
| v-capitalcase | 首字母大写 | P2 | vue-string-directives |
| v-trim | 自动去除空格 | P2 | vue-string-directives |
| v-number | 数字格式化 | P2 | - |
| v-money | 金额格式化 | P2 | - |
| v-ellipsis | 自动省略 | P3 | - |
| v-skeleton | 骨架屏 | P3 | - |
| v-visible | 可见性控制 | P3 | - |

---

## 六、技术方案建议

### 6.1 架构设计

```
directix/
├── packages/
│   ├── core/                 # 核心工具函数
│   ├── directives/           # 所有指令
│   │   ├── click-outside/
│   │   ├── lazy/
│   │   ├── copy/
│   │   └── ...
│   └── shared/               # 共享工具
├── src/
│   ├── index.ts              # 入口文件
│   └── install.ts            # Vue 插件安装
└── docs/                     # 文档
```

### 6.2 Vue 2/3 兼容策略

```typescript
// 统一的指令定义接口
interface DirectiveDefinition<T = any> {
  name: string
  directive: DirectiveFunction
  version: '2' | '3' | 'both'
}

// 版本适配层
function createDirective(definition: DirectiveDefinition) {
  if (isVue3) {
    return definition.directive
  } else {
    return adaptForVue2(definition.directive)
  }
}
```

### 6.3 Tree-shaking 支持

```typescript
// 按需引入
import { vClickOutside, vCopy } from 'directix'

// 或全局注册
import Directix from 'directix'
Vue.use(Directix, {
  directives: ['click-outside', 'copy', 'lazy']
})
```

---

## 七、差异化竞争策略

### 7.1 vs VueUse

| 维度 | VueUse | Directix |
|------|--------|----------|
| 形式 | Composition API | 指令形式 |
| 学习成本 | 需要了解 Composition API | 模板直接使用 |
| 适用场景 | 复杂逻辑处理 | 简单场景快速实现 |
| 体积 | 较大 | 按需引入更小 |
| Vue 2 支持 | ❌ | ✅ |

**定位**：与 VueUse 互补，提供更简单的指令化解决方案

### 7.2 vs 单一指令库

| 维度 | 单一库 | Directix |
|------|--------|----------|
| 安装复杂度 | 需要多个依赖 | 一次安装 |
| API 一致性 | 各不相同 | 统一设计 |
| 版本兼容 | 分散维护 | 统一兼容 |
| 文档质量 | 参差不齐 | 统一完善 |
| TypeScript | 部分支持 | 完整支持 |

**定位**：一站式解决方案，降低集成成本

### 7.3 vs @opentiny/vue-directive

| 维度 | OpenTiny | Directix |
|------|----------|----------|
| 指令数量 | 少 | 多 |
| 独立性 | 依赖 TinyUI | 完全独立 |
| 文档 | 缺乏 | 完善 |
| 社区 | 企业内部 | 开源社区 |
| 定制性 | 低 | 高 |

**定位**：更全面、更独立、更开放

---

## 八、结论与建议

### 8.1 市场机遇

1. **存在明确的市场空白**：没有全面的 Vue 指令库
2. **Vue 2/3 兼容是痛点**：现有方案都不够完善
3. **指令形式需求存在**：Composition API 不是唯一解
4. **中文市场未饱和**：缺乏完善的中文文档解决方案

### 8.2 核心竞争力

1. **全面覆盖**：涵盖 50+ 常用指令
2. **版本兼容**：单代码库支持 Vue 2 & Vue 3
3. **极致体验**：统一 API、完善文档、TypeScript 支持
4. **体积优化**：Tree-shaking、按需引入
5. **开发友好**：完整的测试覆盖、详细的示例

### 8.3 建议优先级

| 阶段 | 时间 | 目标 |
|------|------|------|
| 短期 | 2 周 | 实现 10 个核心指令，支持 Vue 2/3 |
| 中期 | 4 周 | 扩展到 20+ 指令，完善文档 |
| 长期 | 8 周 | 生态建设，社区贡献 |

### 8.4 风险与应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|-------|------|---------|
| VueUse 推出指令版本 | 中 | 高 | 差异化定位，专注指令 |
| 社区接受度低 | 低 | 高 | 完善文档，积极推广 |
| 维护成本高 | 中 | 中 | 自动化测试，社区贡献 |
| 兼容性问题 | 中 | 高 | 充分测试，渐进增强 |

---

## 附录A：竞品链接汇总

### 综合工具库
- [VueUse](https://vueuse.org/) - [GitHub](https://github.com/vueuse/vueuse)
- [@opentiny/vue-directive](https://www.npmjs.com/package/@opentiny/vue-directive) - [GitHub](https://github.com/opentiny/tiny-vue)

### 点击外部检测
- [v-click-outside](https://www.npmjs.com/package/v-click-outside) - [GitHub](https://github.com/ndelvalle/v-click-outside)
- [v-click-outside-x](https://www.npmjs.com/package/v-click-outside-x) - [GitHub](https://github.com/nickstenning/vue-click-outside-x)
- [click-outside-vue3](https://www.npmjs.com/package/click-outside-vue3)
- [vue3-click-away](https://www.npmjs.com/package/vue3-click-away)

### 懒加载
- [vue-lazyload](https://www.npmjs.com/package/vue-lazyload) - [GitHub](https://github.com/hilongjw/vue-lazyload)

### 提示框
- [v-tooltip](https://www.npmjs.com/package/v-tooltip) - [GitHub](https://github.com/Akryum/v-tooltip)
- [floating-vue](https://floating-vue.starpad.dev/) - [GitHub](https://github.com/Akryum/floating-vue)

### 剪贴板
- [v-clipboard](https://www.npmjs.com/package/v-clipboard) - [GitHub](https://github.com/euvl/v-clipboard)
- [vue-clipboard3](https://www.npmjs.com/package/vue-clipboard3)

### 波纹效果
- [v-wave](https://www.npmjs.com/package/v-wave) - [GitHub](https://github.com/justintaddei/v-wave)

### 滚动
- [vue-scrollto](https://www.npmjs.com/package/vue-scrollto) - [GitHub](https://github.com/rigor789/vue-scrollto)

### 权限控制
- [vue-permission-directive](https://www.npmjs.com/package/vue-permission-directive)

### 表单处理
- [vue-string-directives](https://www.npmjs.com/package/vue-string-directives)
- [v-mask](https://www.npmjs.com/package/v-mask)
- [vue-input-facade](https://www.npmjs.com/package/vue-input-facade)

### 安全
- [vue-dompurify-html](https://www.npmjs.com/package/vue-dompurify-html)

---

## 附录B：npm 包下载量统计（截至 2024 年）

| 包名 | 周下载量 | 月下载量 | 年下载量 |
|------|---------|---------|---------|
| @vueuse/core | 1,000,000+ | 4,000,000+ | 48,000,000+ |
| vue-lazyload | 300,000+ | 1,200,000+ | 14,400,000+ |
| v-tooltip | 500,000+ | 2,000,000+ | 24,000,000+ |
| v-click-outside | 200,000+ | 800,000+ | 9,600,000+ |
| v-clipboard | 100,000+ | 400,000+ | 4,800,000+ |
| vue-scrollto | 150,000+ | 600,000+ | 7,200,000+ |
| v-mask | 200,000+ | 800,000+ | 9,600,000+ |

---

## 附录C：竞品维护状态追踪

| 库名 | 最新版本 | 最后更新 | GitHub Stars | Issue 数量 | 维护评级 |
|------|---------|---------|-------------|-----------|---------|
| VueUse | 14.2.1 | 2024-02 | 20,000+ | ~100 | ⭐⭐⭐⭐⭐ |
| vue-lazyload | 3.0.0 | 2023-04 | 8,000+ | ~100 | ⭐⭐⭐⭐ |
| v-tooltip | 2.1.3 | 2021-03 | 9,000+ | ~50 | ⭐⭐⭐ |
| floating-vue | 5.2.2 | 2024-01 | 3,000+ | ~30 | ⭐⭐⭐⭐ |
| v-click-outside | 3.2.0 | 2020-05 | 1,000+ | ~30 | ⭐⭐ |
| v-wave | 3.0.4 | 2024-09 | 300+ | ~10 | ⭐⭐⭐⭐ |
| vue-scrollto | 2.20.0 | 2020-10 | 3,000+ | ~50 | ⭐⭐ |

**维护评级说明**：
- ⭐⭐⭐⭐⭐：活跃维护，快速响应
- ⭐⭐⭐⭐：持续维护，响应及时
- ⭐⭐⭐：维护一般，响应较慢
- ⭐⭐：维护停滞
- ⭐：已弃用
