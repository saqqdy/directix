# Vue 版本检测方案对比：Directix vs vue-demi

## 概述

本文档对比分析了 Directix 项目当前的 Vue 版本检测方案与社区标准 `vue-demi` 的异同点，以及在 monorepo 环境下的影响。

---

## 一、vue-demi 的方案

### 核心思路：构建时/安装时切换

```
┌─────────────────────────────────────────────────────────────┐
│                    vue-demi 架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  lib/                                                       │
│  ├── v2/          ← Vue 2.x 版本代码                        │
│  │   └── index.mjs                                        │
│  ├── v2.7/        ← Vue 2.7 版本代码                        │
│  │   └── index.mjs                                        │
│  ├── v3/          ← Vue 3.x 版本代码                        │
│  │   └── index.mjs                                        │
│  └── index.mjs    ← 当前激活的版本（由 postinstall 复制）    │
│                                                             │
│  postinstall.js  ← npm install 后自动执行                   │
│     1. require('vue') 检测版本                              │
│     2. 根据版本复制对应的 v2/v2.7/v3 文件到 lib/            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 关键代码

```javascript
// postinstall.js
const Vue = require('vue')
if (Vue.version.startsWith('2.7.')) {
  switchVersion(2.7)  // 复制 v2.7/index.mjs → lib/index.mjs
} else if (Vue.version.startsWith('2.')) {
  switchVersion(2)    // 复制 v2/index.mjs → lib/index.mjs
} else if (Vue.version.startsWith('3.')) {
  switchVersion(3)    // 复制 v3/index.mjs → lib/index.mjs
}
```

### 特点

| 优点 | 缺点 |
|------|------|
| ✅ 静态切换：安装时确定版本，运行时零开销 | ❌ 依赖 postinstall：需要 npm/pnpm 的 postinstall 钩子 |
| ✅ 类型安全：每个版本有独立的类型定义 | ❌ monorepo 问题：在 workspace 中可能检测到错误的 Vue 版本 |
| ✅ Tree-shaking 友好：不包含其他版本代码 | ❌ ESM 问题：`require` 在纯 ESM 环境可能失败 |

---

## 二、Directix 当前的方案

### 核心思路：运行时延迟检测

```
┌─────────────────────────────────────────────────────────────┐
│                    Directix 架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  defineDirective() 返回 LazyDirective                       │
│       ↓                                                     │
│  LazyDirective 包含 Vue 2 和 Vue 3 所有钩子                 │
│       ↓                                                     │
│  首次调用时 getVueVersion() 检测版本                        │
│       ↓                                                     │
│  缓存并委托给正确的适配器                                    │
│                                                             │
│  检测方法（按优先级）：                                      │
│  1. require('vue').version    (CommonJS)                    │
│  2. window.Vue.version        (全局变量)                    │
│  3. Vue.observable 存在判断   (Vue 2 特有 API)              │
│  4. __VUE_DEVTOOLS_GLOBAL_HOOK__ (DevTools)                 │
│  5. 默认 Vue 3 并警告                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 关键代码

```typescript
// define.ts
function createLazyDirective(hooks) {
  let cachedDirective = null

  return {
    // 同时包含 Vue 2 和 Vue 3 的钩子
    bind() { /* Vue 2 */ },
    inserted() { /* Vue 2 */ },
    mounted() { /* Vue 3 */ },
    unmounted() { /* Vue 3 */ },
    // ...

    // 首次调用时才检测版本
    _getDirective() {
      if (!cachedDirective) {
        cachedDirective = getVueVersion() === 2
          ? createVue2Directive(hooks)
          : createVue3Directive(hooks)
      }
      return cachedDirective
    }
  }
}
```

### 特点

| 优点 | 缺点 |
|------|------|
| ✅ 无 postinstall 依赖：不依赖 npm 钩子 | ❌ 运行时开销：首次使用时有检测开销 |
| ✅ monorepo 友好：每个 app 独立检测 | ❌ 代码体积稍大：包含所有版本的钩子定义 |
| ✅ 可手动设置：提供 `setVueVersion()` 手动覆盖 | ❌ 检测可能失败：ESM 环境中 `require` 可能不工作 |

---

## 三、对比总结

| 特性 | vue-demi | Directix |
|------|----------|----------|
| **切换时机** | 安装时 | 运行时 |
| **检测方式** | `require('vue')` | 多种方式回退 |
| **代码体积** | 最优（只包含一个版本）| 稍大（包含所有钩子）|
| **monorepo 支持** | 较差 | 较好 |
| **手动控制** | `vue-demi-switch` CLI | `setVueVersion()` API |
| **SSR 支持** | 需要正确配置 | 内置 SSR 检测 |
| **类型支持** | 完美（独立 d.ts）| 需要处理 |

---

## 四、monorepo 支持差异详解

### 问题根源：postinstall 检测时机

vue-demi 通过 `postinstall` 钩子在 **npm install 结束时** 检测 Vue 版本：

```javascript
// vue-demi/scripts/postinstall.js
const Vue = require('vue')

if (Vue.version.startsWith('2.7.')) {
  switchVersion(2.7)  // 复制 v2.7 文件到 lib/
} else if (Vue.version.startsWith('2.')) {
  switchVersion(2)
} else if (Vue.version.startsWith('3.')) {
  switchVersion(3)
}
```

### 问题场景

#### 场景 1：根目录 hoist 模式

```
monorepo/
├── package.json          # 根目录，安装 vue-demi
├── node_modules/
│   └── vue-demi/         # postinstall 在这里执行
│       └── lib/
│           └── index.mjs # 此时被"锁定"为某个版本
├── packages/
│   ├── admin/            # Vue 3 项目
│   │   └── package.json
│   └── mobile/           # Vue 2 项目
│       └── package.json
└── examples/
    ├── vue2/             # Vue 2 项目
    └── vue3/             # Vue 3 项目
```

```bash
# 在 monorepo 根目录执行
pnpm install

# vue-demi 的 postinstall 执行时：
# 1. require('vue') 找到的是根目录的 node_modules/vue
# 2. 如果根目录没有 vue，或者版本不对，就会检测错误
# 3. 整个 monorepo 所有项目都被锁定为同一个版本
```

**影响：**
- 如果根目录是 Vue 3，`examples/vue2` 项目也会使用 Vue 3 版本的 vue-demi，导致指令不工作
- 无法在同一 monorepo 中同时开发 Vue 2 和 Vue 3 项目

#### 场景 2：本项目的情况

```
directix/
├── package.json          # 库本身
├── node_modules/
│   └── vue/              # 可能是 Vue 3（库开发环境）
└── examples/
    ├── vue2/             # Vue 2.7 示例项目
    │   └── node_modules/
    │       └── directix/ # link 到根目录
    └── vue3/             # Vue 3 示例项目
```

**问题链：**

```bash
# 1. 在 directix/ 根目录安装依赖
pnpm install
# vue-demi 检测到根目录可能是 Vue 3（或没有 vue）
# → vue-demi 切换到 Vue 3 模式

# 2. 构建 directix 库
pnpm build
# 打包的代码使用 Vue 3 格式

# 3. 在 examples/vue2 中运行
cd examples/vue2 && pnpm dev
# directix 是 link 过来的
# 但 vue-demi 已经被"锁定"为 Vue 3 模式
# → Vue 2 指令不工作！
```

#### 场景 3：CI/CD 环境

```yaml
# GitHub Actions 中
- run: pnpm install  # 根目录安装，vue-demi 检测版本
- run: pnpm build    # 构建
- run: cd examples/vue2 && pnpm test  # Vue 2 测试失败！
```

### 对比：本项目当前方案

```typescript
// 本项目的运行时检测
export function getVueVersion(): 2 | 3 {
  // 每个应用独立检测
  // 在 Vue 2 项目中，检测到的是 Vue 2
  // 在 Vue 3 项目中，检测到的是 Vue 3
}

// 延迟绑定：在指令首次使用时才检测
function createLazyDirective(hooks) {
  return {
    mounted() {
      // 这里检测的是当前运行环境的 Vue 版本
      // 而不是安装时的版本
      const directive = getVueVersion() === 2
        ? createVue2Directive(hooks)
        : createVue3Directive(hooks)
    }
  }
}
```

### monorepo 支持对比

| 场景 | vue-demi | 当前方案 |
|------|----------|----------|
| 单一 Vue 版本项目 | ✅ 完美 | ✅ 正常 |
| monorepo 多 Vue 版本 | ❌ 需要额外配置 | ✅ 自动适配 |
| 库开发 + 示例项目 | ❌ 可能冲突 | ✅ 各自独立 |
| CI/CD 环境 | ⚠️ 需要注意顺序 | ✅ 无需关心 |
| pnpm workspace | ⚠️ hoist 问题 | ✅ 无问题 |

### vue-demi 的解决方案

vue-demi 提供了 `vue-demi-switch` CLI 工具手动切换：

```bash
# 强制切换到 Vue 2
npx vue-demi-switch 2

# 强制切换到 Vue 3
npx vue-demi-switch 3
```

但这需要：
1. 在每个子项目中单独安装 vue-demi（不 hoist）
2. 或者在 CI 脚本中手动切换

---

## 五、如果采用 vue-demi 可精简的代码

### 1. 完全可删除的文件

| 文件 | 行数 | 说明 |
|------|------|------|
| `packages/core/src/adapter/vue2.ts` | ~106 行 | Vue 2 适配器（由 vue-demi 的 v2 版本替代） |
| `packages/core/src/adapter/vue3.ts` | ~112 行 | Vue 3 适配器（由 vue-demi 的 v3 版本替代） |
| `packages/core/src/adapter/index.ts` | ~2 行 | 适配器入口 |
| **小计** | **~220 行** | |

### 2. 可大幅精简的文件

#### `packages/core/src/define.ts`

**当前：** ~204 行 → **精简后：** ~50 行

**可删除的代码：**

```typescript
// ❌ 删除：整个 createLazyDirective 函数（约 105 行）
function createLazyDirective<T, B extends Element>(hooks: DirectiveHooks<T, B>): Directive {
  let cachedDirective: any = null
  function getOrCreateDirective(): any { ... }

  // 包含所有 Vue 2 和 Vue 3 钩子的 proxy 对象（约 85 行）
  const lazyDirective: any = {
    bind() { ... },      // Vue 2
    inserted() { ... },  // Vue 2
    update() { ... },    // Vue 2
    componentUpdated() { ... },  // Vue 2
    unbind() { ... },    // Vue 2
    created() { ... },   // Vue 3
    beforeMount() { ... },  // Vue 3
    mounted() { ... },   // Vue 3
    beforeUpdate() { ... },  // Vue 3
    updated() { ... },   // Vue 3
    beforeUnmount() { ... },  // Vue 3
    unmounted() { ... }, // Vue 3
  }
}
```

**精简后：**

```typescript
// ✅ 简化版：直接返回 Vue 3 格式的指令（vue-demi 会自动处理兼容）
export function defineDirective<T, B extends Element>(
  definition: DirectiveDefinition<T, B>,
): Directive {
  const { name, ssr, defaults, ...hooks } = definition

  if (isSSR() && !ssr) {
    return createNoOpDirective()
  }

  // vue-demi 环境下，直接使用 Vue 3 格式即可
  return {
    mounted(el, binding) {
      hooks.mounted?.(el, applyDefaults(binding, defaults), null)
    },
    updated(el, binding) {
      hooks.updated?.(el, applyDefaults(binding, defaults), null, null, null)
    },
    unmounted(el, binding) {
      hooks.unmounted?.(el, binding, null)
    },
  }
}
```

**精简：约 100 行**

#### `packages/core/src/env.ts`

**当前：** ~179 行 → **精简后：** ~50 行

**可删除的代码：**

```typescript
// ❌ 删除：整个 Vue 版本检测逻辑（约 95 行）
let _vueVersion: 2 | 3 | null = null
export function getVueVersion(): 2 | 3 { ... }
export function setVueVersion(version: 2 | 3): void { ... }
export const isVue2 = (): boolean => ...
export const isVue3 = (): boolean => ...
```

**精简后：**

```typescript
// ✅ 直接从 vue-demi 导入
export { isVue2, isVue3 } from 'vue-demi'

// ✅ 保留：环境检测函数（约 50 行）
export const isBrowser = () => ...
export const isSSR = () => ...
export const supportsPassive = () => ...
export const supportsIntersectionObserver = () => ...
export const supportsResizeObserver = () => ...
export const supportsClipboard = () => ...
export const supportsMutationObserver = () => ...
```

**精简：约 95 行**

### 3. 精简代码统计汇总

| 类别 | 当前行数 | 精简后行数 | 精简行数 |
|------|----------|------------|----------|
| `adapter/vue2.ts` | 106 | 0（删除） | **-106** |
| `adapter/vue3.ts` | 112 | 0（删除） | **-112** |
| `adapter/index.ts` | 2 | 0（删除） | **-2** |
| `define.ts` | 204 | ~50 | **-154** |
| `env.ts` | 179 | ~50 | **-129** |
| **总计** | **603** | **~100** | **~-503 行** |

### 4. 需要新增的配置

```json
// package.json 添加
{
  "scripts": {
    "postinstall": "npx vue-demi-fix"
  },
  "peerDependencies": {
    "vue-demi": "^0.14.0"
  }
}
```

---

## 六、结论与建议

### 选择建议

| 项目类型 | 推荐方案 | 原因 |
|----------|----------|------|
| 单一 Vue 版本的库 | vue-demi | 代码更简洁，体积更优 |
| monorepo 多 Vue 版本 | 当前方案 | 自动适配，无需额外配置 |
| 库开发 + 多版本示例 | 当前方案 | 避免 link 后的版本冲突 |
| VueUse 风格的生态库 | vue-demi | 与生态保持一致 |

### 如果采用 vue-demi 的额外好处

1. **类型安全**：无需手动维护 Vue 2/3 类型适配
2. **自动 polyfill**：Vue 2 下自动注入 `@vue/composition-api`
3. **社区维护**：vue-demi 由 antfu 维护，与 VueUse 生态兼容
4. **Tree-shaking**：只打包当前 Vue 版本的代码
5. **DevTools 支持**：更好的 Vue DevTools 集成

### 最终建议

考虑到本项目包含 Vue 2 和 Vue 3 两套示例项目，且需要支持 monorepo 开发模式，**建议保留当前方案**，但可以优化检测逻辑以提高可靠性。

如果未来决定只支持单一 Vue 版本，或不再需要在 monorepo 中同时测试多个 Vue 版本，可以考虑迁移到 vue-demi。
