# Directix - Vue Directives 指令库开发方案（详细版）

## 一、项目概述

### 1.1 项目定位

**Directix** 是一个全面、易用、高性能的 Vue 自定义指令库，旨在为 Vue 开发者提供一站式指令解决方案。

### 1.2 核心价值主张

| 维度 | 目标 | 具体指标 |
|------|------|---------|
| **覆盖面** | 涵盖 30+ 常用指令 | 满足 90% 的指令使用场景 |
| **兼容性** | 单代码库同时支持 Vue 2.x 和 Vue 3.x | Vue 2.6+, Vue 3.0+ |
| **易用性** | 统一 API 设计，零学习成本 | 5 分钟上手 |
| **性能** | Tree-shaking 支持，按需引入 | 单指令 < 2KB gzip |
| **类型** | TypeScript 原生支持 | 100% 类型覆盖 |
| **文档** | 中英文双语文档 | 完整示例 + API 文档 |

### 1.3 目标用户

1. **企业开发者** - 需要稳定、可维护的指令解决方案
2. **个人开发者** - 追求快速开发的效率工具
3. **Vue 2 迁移用户** - 需要 Vue 2/3 兼容方案
4. **UI 组件库开发者** - 需要底层指令支持

### 1.4 命名由来

**Directix** = **Directive** + **ix**（后缀，表示"组合/集合"）

---

## 二、技术架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Directix                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        指令层 (Directives Layer)                   │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │  │
│  │  │v-click  │ │ v-lazy  │ │ v-copy  │ │v-debounce│ │  ...    │     │  │
│  │  │-outside │ │         │ │         │ │         │ │         │     │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └─────────┘     │  │
│  └───────┼──────────┼──────────┼──────────┼─────────────────────────┘  │
│          │          │          │          │                            │
│  ┌───────┴──────────┴──────────┴──────────┴─────────────────────────┐  │
│  │                    核心适配层 (Core Adaptor Layer)                │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                │  │
│  │  │    Vue 2 Adapter    │  │    Vue 3 Adapter    │                │  │
│  │  │  - bind/inserted   │  │  - created/mounted  │                │  │
│  │  │  - update/unbind   │  │  - updated/unmounted│                │  │
│  │  └─────────────────────┘  └─────────────────────┘                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                   │                                      │
│  ┌────────────────────────────────┴──────────────────────────────────┐  │
│  │                      共享工具层 (Shared Utilities)                 │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │  │
│  │  │  DOM     │ │  Event   │ │  Utils   │ │  Types   │ │ Constant│ │  │
│  │  │  操作    │ │  处理    │ │  工具    │ │  定义    │ │  常量   │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构详解

```
directix/
├── packages/
│   ├── core/                          # 核心适配层
│   │   ├── src/
│   │   │   ├── adapter/
│   │   │   │   ├── vue2.ts           # Vue 2 适配器
│   │   │   │   ├── vue3.ts           # Vue 3 适配器
│   │   │   │   └── index.ts          # 适配器入口
│   │   │   ├── types/
│   │   │   │   ├── directive.ts      # 指令类型定义
│   │   │   │   ├── binding.ts        # Binding 类型
│   │   │   │   └── index.ts
│   │   │   ├── env.ts                # 环境检测
│   │   │   ├── define.ts             # 指令定义工厂
│   │   │   └── index.ts              # 核心入口
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── directives/                    # 指令集合
│   │   │
│   │   ├── click-outside/            # 点击外部检测
│   │   │   ├── src/
│   │   │   │   ├── directive.ts      # 指令实现
│   │   │   │   ├── types.ts          # 类型定义
│   │   │   │   ├── utils.ts          # 工具函数
│   │   │   │   └── index.ts          # 导出入口
│   │   │   ├── tests/
│   │   │   │   ├── directive.test.ts
│   │   │   │   └── utils.test.ts
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   │
│   │   ├── copy/                     # 复制到剪贴板
│   │   │   ├── src/
│   │   │   │   ├── directive.ts
│   │   │   │   ├── clipboard.ts      # 剪贴板操作
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   │
│   │   ├── debounce/                 # 防抖
│   │   │   ├── src/
│   │   │   │   ├── directive.ts
│   │   │   │   ├── debounce.ts       # 防抖核心逻辑
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   │
│   │   ├── throttle/                 # 节流
│   │   ├── lazy/                     # 懒加载
│   │   ├── permission/               # 权限控制
│   │   ├── long-press/               # 长按
│   │   ├── hover/                    # 悬停
│   │   ├── focus/                    # 聚焦
│   │   ├── ripple/                   # 波纹效果
│   │   ├── scroll/                   # 滚动
│   │   ├── resize/                   # 尺寸监听
│   │   ├── intersect/                # 交叉检测
│   │   ├── infinite-scroll/          # 无限滚动
│   │   ├── sticky/                   # 粘性定位
│   │   ├── mask/                     # 输入掩码
│   │   ├── sanitize/                 # 安全过滤
│   │   ├── loading/                  # 加载状态
│   │   ├── visible/                  # 可见性
│   │   ├── mutation/                 # DOM 监听
│   │   ├── tooltip/                  # 提示框
│   │   ├── draggable/                # 拖拽
│   │   ├── touch/                    # 手势
│   │   ├── image-preview/            # 图片预览
│   │   ├── truncate/                 # 文本截断
│   │   ├── uppercase/                # 大写
│   │   ├── lowercase/                # 小写
│   │   ├── capitalcase/              # 首字母大写
│   │   ├── trim/                     # 去空格
│   │   ├── number/                   # 数字格式化
│   │   ├── money/                    # 金额格式化
│   │   └── skeleton/                 # 骨架屏
│   │
│   ├── shared/                       # 共享工具
│   │   ├── src/
│   │   │   ├── dom/
│   │   │   │   ├── index.ts         # DOM 操作工具
│   │   │   │   ├── style.ts         # 样式操作
│   │   │   │   ├── event.ts         # DOM 事件
│   │   │   │   └── rect.ts          # 尺寸位置
│   │   │   ├── event/
│   │   │   │   ├── index.ts         # 事件处理
│   │   │   │   ├── debounce.ts      # 防抖工具
│   │   │   │   ├── throttle.ts      # 节流工具
│   │   │   │   └── emitter.ts       # 事件发射器
│   │   │   ├── utils/
│   │   │   │   ├── index.ts         # 通用工具
│   │   │   │   ├── is.ts            # 类型判断
│   │   │   │   ├── object.ts        # 对象操作
│   │   │   │   ├── string.ts        # 字符串处理
│   │   │   │   └── array.ts         # 数组处理
│   │   │   ├── types/
│   │   │   │   └── index.ts         # 共享类型
│   │   │   └── index.ts              # 共享入口
│   │   └── package.json
│   │
│   └── plugins/                      # 插件扩展
│       ├── nuxt/                     # Nuxt 模块
│       └── vite/                     # Vite 插件
│
├── src/                              # 主包入口
│   ├── index.ts                      # 导出所有指令
│   ├── install.ts                    # Vue 插件安装
│   ├── defaults.ts                   # 默认配置
│   ├── composables/                  # 组合式 API
│   │   ├── use-copy.ts
│   │   ├── use-debounce.ts
│   │   └── index.ts
│   └── groups.ts                     # 指令分组
│
├── docs/                             # 文档
│   ├── .vitepress/
│   │   └── config.ts
│   ├── public/
│   ├── guide/
│   │   ├── index.md
│   │   ├── getting-started.md
│   │   ├── installation.md
│   │   ├── usage.md
│   │   ├── vue2-support.md
│   │   ├── nuxt.md
│   │   ├── typescript.md
│   │   ├── migration.md
│   │   └── faq.md
│   ├── directives/
│   │   ├── event/
│   │   │   ├── click-outside.md
│   │   │   ├── long-press.md
│   │   │   ├── hover.md
│   │   │   └── debounce-throttle.md
│   │   ├── form/
│   │   │   ├── copy.md
│   │   │   ├── focus.md
│   │   │   ├── mask.md
│   │   │   └── trim.md
│   │   ├── visibility/
│   │   │   ├── lazy.md
│   │   │   ├── intersect.md
│   │   │   ├── visible.md
│   │   │   └── loading.md
│   │   ├── scroll/
│   │   │   ├── scroll.md
│   │   │   ├── infinite-scroll.md
│   │   │   └── sticky.md
│   │   ├── format/
│   │   │   ├── uppercase-lowercase.md
│   │   │   ├── truncate.md
│   │   │   ├── number.md
│   │   │   └── money.md
│   │   ├── security/
│   │   │   ├── permission.md
│   │   │   └── sanitize.md
│   │   └── effect/
│   │       ├── ripple.md
│   │       └── tooltip.md
│   ├── api/
│   │   ├── config.md
│   │   ├── composables.md
│   │   └── types.md
│   ├── examples/
│   │   ├── dropdown.md
│   │   ├── search-input.md
│   │   ├── infinite-list.md
│   │   └── permission-control.md
│   └── index.md
│
├── examples/                         # 示例项目
│   ├── vue2/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── vue3/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── nuxt/
│       ├── pages/
│       └── nuxt.config.ts
│
├── scripts/                          # 构建脚本
│   ├── build.ts                      # 主构建脚本
│   ├── build-types.ts               # 类型声明构建
│   ├── release.ts                   # 发布脚本
│   ├── changelog.ts                 # 变更日志生成
│   └── verify-commit.ts             # 提交信息验证
│
├── tests/                            # 测试
│   ├── setup/
│   │   ├── vue2.ts                  # Vue 2 测试配置
│   │   └── vue3.ts                  # Vue 3 测试配置
│   ├── unit/
│   │   └── directives/
│   ├── integration/
│   │   └── vue2-vue3/
│   └── e2e/
│       ├── playwright.config.ts
│       └── tests/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # CI 工作流
│   │   ├── release.yml              # 发布工作流
│   │   └── docs.yml                 # 文档部署
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .vscode/
│   ├── settings.json
│   └── extensions.json
│
├── internal/                         # 内部文档
│   ├── competitor-analysis.md       # 竞品分析
│   └── development-plan.md          # 开发方案
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .prettierrc
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 三、Vue 2/3 兼容方案详解

### 3.1 指令生命周期对比

```
Vue 2 钩子                      Vue 3 钩子                    调用时机
───────────────────────────────────────────────────────────────────────
bind                            created/beforeMount          指令首次绑定到元素
                                mounted                      元素插入 DOM 后
inserted                        -                            (Vue 2 特有)

update                          beforeUpdate                 VNode 更新前
-                               updated                      VNode 更新后
componentUpdated                -                            (Vue 2 特有)

-                               beforeUnmount                卸载前
unbind                          unmounted                    卸载后
```

### 3.2 统一指令接口设计

```typescript
// packages/core/src/types/directive.ts

import type { ComponentPublicInstance, VNode } from 'vue'

/**
 * 统一的指令绑定对象
 */
export interface DirectiveBinding<T = any> {
  /** 指令绑定的值 */
  value: T
  /** 上一次绑定的值 */
  oldValue: T | null
  /** 指令参数 (v-xxx:arg) */
  arg?: string
  /** 修饰符对象 (v-xxx.modifier) */
  modifiers: Record<string, boolean>
  /** 组件实例 */
  instance: ComponentPublicInstance | null
  /** 指令名称 */
  dir: DirectiveDefinition
}

/**
 * 统一的指令钩子函数
 */
export interface DirectiveHooks<T = any, B extends Element = Element> {
  /**
   * 指令绑定到元素时调用
   * @param el 绑定的 DOM 元素
   * @param binding 绑定对象
   * @param vnode Vue 虚拟节点
   */
  mounted?: (
    el: B,
    binding: DirectiveBinding<T>,
    vnode: VNode
  ) => void

  /**
   * 元素更新时调用
   * @param el 绑定的 DOM 元素
   * @param binding 新的绑定对象
   * @param vnode 新的虚拟节点
   * @param prevBinding 旧的绑定对象
   * @param prevVnode 旧的虚拟节点
   */
  updated?: (
    el: B,
    binding: DirectiveBinding<T>,
    vnode: VNode,
    prevBinding: DirectiveBinding<T>,
    prevVnode: VNode
  ) => void

  /**
   * 指令卸载时调用
   * @param el 绑定的 DOM 元素
   * @param binding 绑定对象
   * @param vnode 虚拟节点
   */
  unmounted?: (
    el: B,
    binding: DirectiveBinding<T>,
    vnode: VNode
  ) => void
}

/**
 * 指令定义接口
 */
export interface DirectiveDefinition<T = any, B extends Element = Element>
  extends DirectiveHooks<T, B> {
  /** 指令名称 */
  name: string
  /** 指令版本 */
  version?: '2' | '3' | 'both'
  /** 是否服务端渲染兼容 */
  ssr?: boolean
  /** 默认值 */
  defaults?: Partial<T>
}

/**
 * 指令选项（用户配置）
 */
export interface DirectiveOptions<T = any> {
  /** 是否启用 */
  enabled?: boolean
  /** 自定义配置 */
  config?: Partial<T>
}
```

### 3.3 核心适配器实现

```typescript
// packages/core/src/adapter/vue2.ts

import type { VNode, VNodeDirective } from 'vue'
import type { DirectiveHooks, DirectiveBinding } from '../types'

/**
 * Vue 2 指令适配器
 */
export function createVue2Directive<T, B extends Element>(
  hooks: DirectiveHooks<T, B>
) {
  return {
    bind(
      el: B,
      binding: VNodeDirective,
      vnode: VNode
    ) {
      // 存储状态
      const state = createState(el, binding, vnode)
      el.__directix_state__ = state

      // 调用 mounted
      if (hooks.mounted) {
        hooks.mounted(el, normalizeBinding(binding), vnode)
      }
    },

    inserted(
      el: B,
      binding: VNodeDirective,
      vnode: VNode
    ) {
      // Vue 2 的 inserted 在 DOM 插入后调用
      // 某些指令可能需要在这里执行 DOM 相关操作
    },

    update(
      el: B,
      binding: VNodeDirective,
      vnode: VNode,
      oldVnode: VNode
    ) {
      const state = el.__directix_state__

      // 检查值是否变化
      if (binding.value !== binding.oldValue) {
        if (hooks.updated) {
          hooks.updated(
            el,
            normalizeBinding(binding),
            vnode,
            normalizeBinding({ ...binding, value: binding.oldValue }),
            oldVnode
          )
        }
      }
    },

    componentUpdated(
      el: B,
      binding: VNodeDirective,
      vnode: VNode,
      oldVnode: VNode
    ) {
      // Vue 2 特有，组件更新完成后调用
      // 通常 update 已经足够
    },

    unbind(
      el: B,
      binding: VNodeDirective,
      vnode: VNode
    ) {
      if (hooks.unmounted) {
        hooks.unmounted(el, normalizeBinding(binding), vnode)
      }

      // 清理状态
      delete el.__directix_state__
    },
  }
}

/**
 * 标准化 Vue 2 binding 为统一格式
 */
function normalizeBinding<T>(
  binding: VNodeDirective
): DirectiveBinding<T> {
  return {
    value: binding.value,
    oldValue: binding.oldValue ?? null,
    arg: binding.arg,
    modifiers: binding.modifiers || {},
    instance: binding.instance || null,
    dir: binding.def,
  }
}

/**
 * 创建指令状态存储
 */
function createState<T>(
  el: Element,
  binding: VNodeDirective,
  vnode: VNode
) {
  return {
    value: binding.value,
    vnode,
    cleanup: [] as (() => void)[],
  }
}

// 扩展 Element 类型
declare global {
  interface Element {
    __directix_state__?: {
      value: any
      vnode: VNode
      cleanup: (() => void)[]
    }
  }
}
```

```typescript
// packages/core/src/adapter/vue3.ts

import type { VNode } from 'vue'
import type { DirectiveHooks, DirectiveBinding } from '../types'

/**
 * Vue 3 指令适配器
 */
export function createVue3Directive<T, B extends Element>(
  hooks: DirectiveHooks<T, B>
) {
  return {
    created(
      el: B,
      binding: any,
      vnode: VNode
    ) {
      // Vue 3 的 created 在元素创建时调用
      // 可以在这里初始化状态
      el.__directix_state__ = {
        value: binding.value,
        vnode,
        cleanup: [],
      }
    },

    beforeMount(
      el: B,
      binding: any,
      vnode: VNode
    ) {
      // 挂载前
    },

    mounted(
      el: B,
      binding: any,
      vnode: VNode
    ) {
      if (hooks.mounted) {
        hooks.mounted(el, normalizeBindingVue3(binding), vnode)
      }
    },

    beforeUpdate(
      el: B,
      binding: any,
      vnode: VNode,
      prevVnode: VNode
    ) {
      // 更新前
    },

    updated(
      el: B,
      binding: any,
      vnode: VNode,
      prevVnode: VNode
    ) {
      if (hooks.updated && binding.value !== binding.oldValue) {
        hooks.updated(
          el,
          normalizeBindingVue3(binding),
          vnode,
          normalizeBindingVue3({ ...binding, value: binding.oldValue }),
          prevVnode
        )
      }
    },

    beforeUnmount(
      el: B,
      binding: any,
      vnode: VNode
    ) {
      // 卸载前
    },

    unmounted(
      el: B,
      binding: any,
      vnode: VNode
    ) {
      if (hooks.unmounted) {
        hooks.unmounted(el, normalizeBindingVue3(binding), vnode)
      }

      // 执行清理函数
      const state = el.__directix_state__
      if (state?.cleanup) {
        state.cleanup.forEach(fn => fn())
      }
      delete el.__directix_state__
    },
  }
}

/**
 * 标准化 Vue 3 binding
 */
function normalizeBindingVue3<T>(binding: any): DirectiveBinding<T> {
  return {
    value: binding.value,
    oldValue: binding.oldValue ?? null,
    arg: binding.arg,
    modifiers: binding.modifiers || {},
    instance: binding.instance,
    dir: binding.dir,
  }
}
```

### 3.4 运行时检测与环境适配

```typescript
// packages/core/src/env.ts

/**
 * Vue 版本检测
 */
let _vueVersion: 2 | 3 | null = null
let _vueDemi: any = null

/**
 * 获取当前 Vue 版本
 */
export function getVueVersion(): 2 | 3 {
  if (_vueVersion !== null) return _vueVersion

  // 方式一：通过 vue-demi
  try {
    const vueDemi = require('vue-demi')
    _vueDemi = vueDemi
    _vueVersion = vueDemi.isVue2 ? 2 : 3
    return _vueVersion
  } catch {
    // vue-demi 不可用，尝试其他方式
  }

  // 方式二：直接检测 Vue
  try {
    const vue = require('vue')
    if (vue.version?.startsWith('2')) {
      _vueVersion = 2
    } else if (vue.version?.startsWith('3')) {
      _vueVersion = 3
    }
  } catch {
    // Vue 不可用
  }

  // 默认返回 Vue 3
  if (_vueVersion === null) {
    console.warn(
      '[Directix] Unable to detect Vue version, defaulting to Vue 3. ' +
      'Please ensure Vue is installed correctly.'
    )
    _vueVersion = 3
  }

  return _vueVersion
}

/**
 * 是否 Vue 2
 */
export const isVue2 = (): boolean => getVueVersion() === 2

/**
 * 是否 Vue 3
 */
export const isVue3 = (): boolean => getVueVersion() === 3

/**
 * 是否浏览器环境
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * 是否服务端渲染
 */
export const isSSR = (): boolean => !isBrowser()

/**
 * 是否支持 Passive 事件监听
 */
export const supportsPassive = (): boolean => {
  if (!isBrowser()) return false

  let supports = false
  try {
    const options = {
      get passive() {
        supports = true
        return false
      },
    }
    window.addEventListener('test', null as any, options)
    window.removeEventListener('test', null as any, options as any)
  } catch {
    supports = false
  }
  return supports
}

/**
 * 是否支持 IntersectionObserver
 */
export const supportsIntersectionObserver = (): boolean => {
  return isBrowser() && 'IntersectionObserver' in window
}

/**
 * 是否支持 ResizeObserver
 */
export const supportsResizeObserver = (): boolean => {
  return isBrowser() && 'ResizeObserver' in window
}

/**
 * 是否支持 Clipboard API
 */
export const supportsClipboard = (): boolean => {
  return isBrowser() && 'clipboard' in navigator
}
```

### 3.5 统一指令定义工厂

```typescript
// packages/core/src/define.ts

import { isVue2, isVue3, isSSR } from './env'
import { createVue2Directive } from './adapter/vue2'
import { createVue3Directive } from './adapter/vue3'
import type {
  DirectiveHooks,
  DirectiveDefinition,
  DirectiveBinding,
} from './types'

/**
 * 定义一个跨版本兼容的指令
 * @param definition 指令定义
 * @returns Vue 指令对象
 */
export function defineDirective<T = any, B extends Element = Element>(
  definition: DirectiveDefinition<T, B>
) {
  const { name, version, ssr, defaults, ...hooks } = definition

  // SSR 检查
  if (isSSR() && !ssr) {
    console.warn(
      `[Directix] Directive "${name}" is not compatible with SSR. ` +
      'It will be a no-op on the server side.'
    )
    return createNoOpDirective()
  }

  // 应用默认值
  const wrappedHooks: DirectiveHooks<T, B> = {
    mounted: hooks.mounted
      ? (el, binding, vnode) => {
          const mergedBinding = applyDefaults(binding, defaults)
          hooks.mounted!(el, mergedBinding, vnode)
        }
      : undefined,

    updated: hooks.updated
      ? (el, binding, vnode, prevBinding, prevVnode) => {
          const mergedBinding = applyDefaults(binding, defaults)
          hooks.updated!(el, mergedBinding, vnode, prevBinding, prevVnode)
        }
      : undefined,

    unmounted: hooks.unmounted,
  }

  // 根据版本创建对应指令
  if (isVue2()) {
    return createVue2Directive(wrappedHooks)
  }

  return createVue3Directive(wrappedHooks)
}

/**
 * 应用默认值
 */
function applyDefaults<T>(
  binding: DirectiveBinding<T>,
  defaults?: Partial<T>
): DirectiveBinding<T> {
  if (!defaults) return binding

  const value =
    typeof binding.value === 'object' && binding.value !== null
      ? { ...defaults, ...binding.value }
      : binding.value

  return { ...binding, value: value as T }
}

/**
 * 创建空操作指令（用于 SSR）
 */
function createNoOpDirective() {
  return {
    mounted: () => {},
    updated: () => {},
    unmounted: () => {},
  }
}

/**
 * 定义指令组
 */
export function defineDirectiveGroup(
  name: string,
  directives: Record<string, any>
) {
  return {
    name,
    directives,
    install(app: any, options?: any) {
      Object.entries(directives).forEach(([directiveName, directive]) => {
        const fullName = `${name}-${directiveName}`
        app.directive(fullName, directive)
      })
    },
  }
}
```

---

## 四、核心指令详细实现

### 4.1 v-click-outside 点击外部检测

#### 4.1.1 功能需求

| 功能 | 描述 |
|------|------|
| 基础功能 | 检测元素外部的点击事件 |
| 排除元素 | 支持排除特定元素不触发 |
| 多实例支持 | 同一页面多个实例互不干扰 |
| 捕获模式 | 支持捕获/冒泡模式切换 |
| 事件类型 | 支持自定义事件类型 |
| 移动端支持 | 支持触摸事件 |

#### 4.1.2 类型定义

```typescript
// packages/directives/click-outside/src/types.ts

/**
 * 点击外部处理函数
 */
export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void

/**
 * 点击外部指令选项
 */
export interface ClickOutsideOptions {
  /**
   * 点击外部时的回调函数
   * @required
   */
  handler: ClickOutsideHandler

  /**
   * 排除的元素选择器或元素引用
   * 点击这些元素不会触发 handler
   */
  exclude?: (string | HTMLElement | (() => HTMLElement | null))[]

  /**
   * 是否使用捕获模式
   * @default true
   */
  capture?: boolean

  /**
   * 监听的事件类型
   * @default ['click']
   */
  events?: ('click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend')[]

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 停止传播
   * @default false
   */
  stop?: boolean

  /**
   * 阻止默认行为
   * @default false
   */
  prevent?: boolean
}

/**
 * 指令绑定值类型
 */
export type ClickOutsideBinding =
  | ClickOutsideHandler
  | ClickOutsideOptions
```

#### 4.1.3 完整实现

```typescript
// packages/directives/click-outside/src/directive.ts

import { defineDirective } from '@directix/core'
import { on, off, isElement, getElement } from '@directix/shared'
import type { DirectiveBinding } from '@directix/core'
import type {
  ClickOutsideOptions,
  ClickOutsideBinding,
  ClickOutsideHandler,
} from './types'

/**
 * v-click-outside 指令
 *
 * @example
 * ```vue
 * <template>
 *   <div v-click-outside="handleClickOutside">
 *     下拉菜单
 *   </div>
 * </template>
 * ```
 */
export const vClickOutside = defineDirective<ClickOutsideBinding, HTMLElement>({
  name: 'click-outside',
  ssr: false,

  defaults: {
    capture: true,
    events: ['click'],
    disabled: false,
    stop: false,
    prevent: false,
  },

  mounted(el: HTMLElement, binding: DirectiveBinding<ClickOutsideBinding>) {
    const options = normalizeOptions(binding.value)

    if (options.disabled) return

    const state: ClickOutsideState = {
      options,
      handlers: new Map(),
    }

    el.__clickOutside = state

    // 创建事件处理器
    const createHandler = (eventType: string) => {
      return (event: Event) => {
        // 检查事件目标
        if (!isValidClick(el, event, options)) {
          return
        }

        // 停止传播
        if (options.stop) {
          event.stopPropagation()
        }

        // 阻止默认行为
        if (options.prevent) {
          event.preventDefault()
        }

        // 调用处理函数
        options.handler(event as MouseEvent | TouchEvent)
      }
    }

    // 绑定事件
    options.events!.forEach((eventType) => {
      const handler = createHandler(eventType)
      state.handlers.set(eventType, handler)

      // 使用 passive: false 以支持 preventDefault
      const listenerOptions = {
        capture: options.capture,
        passive: false,
      }

      on(document, eventType, handler, listenerOptions)
    })
  },

  updated(el: HTMLElement, binding: DirectiveBinding<ClickOutsideBinding>) {
    const state = el.__clickOutside
    if (!state) return

    const oldOptions = state.options
    const newOptions = normalizeOptions(binding.value)

    // 如果禁用状态变化，需要更新监听
    if (oldOptions.disabled !== newOptions.disabled) {
      if (newOptions.disabled) {
        // 移除所有监听
        state.handlers.forEach((handler, eventType) => {
          off(document, eventType, handler, { capture: oldOptions.capture })
        })
        state.handlers.clear()
      } else {
        // 重新添加监听
        // ... 类似 mounted 的逻辑
      }
    }

    state.options = newOptions
  },

  unmounted(el: HTMLElement) {
    const state = el.__clickOutside
    if (!state) return

    // 移除所有事件监听
    state.handlers.forEach((handler, eventType) => {
      off(document, eventType, handler, { capture: state.options.capture })
    })

    delete el.__clickOutside
  },
})

/**
 * 标准化选项
 */
function normalizeOptions(binding: ClickOutsideBinding): ClickOutsideOptions {
  if (typeof binding === 'function') {
    return { handler: binding }
  }
  return binding
}

/**
 * 检查点击是否有效（在元素外部）
 */
function isValidClick(
  el: HTMLElement,
  event: Event,
  options: ClickOutsideOptions
): boolean {
  const target = event.target as Node

  // 检查是否点击了元素本身或其子元素
  if (el.contains(target)) {
    return false
  }

  // 检查排除元素
  if (options.exclude?.length) {
    for (const exclude of options.exclude) {
      const excludeEl = typeof exclude === 'function' ? exclude() : getElement(exclude)
      if (excludeEl && (excludeEl === target || excludeEl.contains(target))) {
        return false
      }
    }
  }

  return true
}

/**
 * 元素状态存储
 */
interface ClickOutsideState {
  options: ClickOutsideOptions
  handlers: Map<string, EventListener>
}

declare global {
  interface HTMLElement {
    __clickOutside?: ClickOutsideState
  }
}

export default vClickOutside
```

#### 4.1.4 使用示例

```vue
<template>
  <!-- 基础用法 -->
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">Toggle</button>
    <div v-if="show" class="dropdown">Content</div>
  </div>

  <!-- 高级配置 -->
  <div v-click-outside="options">
    <button ref="trigger">Toggle</button>
    <div class="dropdown">Content</div>
  </div>

  <!-- 简写：排除指定元素 -->
  <div v-click-outside:exclude="'.trigger'"="close">
    <button class="trigger">Toggle</button>
    <div class="dropdown">Content</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { vClickOutside } from 'directix'

const show = ref(false)
const trigger = ref<HTMLElement>()

function closeDropdown() {
  show.value = false
}

const options = reactive({
  handler: closeDropdown,
  exclude: [() => trigger.value],
  events: ['click', 'touchstart'],
})
</script>
```

---

### 4.2 v-copy 复制到剪贴板

#### 4.2.1 功能需求

| 功能 | 描述 |
|------|------|
| 基础复制 | 点击复制文本到剪贴板 |
| 动态文本 | 支持动态更新的文本 |
| 成功回调 | 复制成功后的回调 |
| 失败回调 | 复制失败后的回调 |
| 反馈状态 | 提供 copied 状态 |
| 兼容性 | 兼容不支持 Clipboard API 的浏览器 |

#### 4.2.2 类型定义

```typescript
// packages/directives/copy/src/types.ts

/**
 * 复制成功回调
 */
export type CopySuccessCallback = (text: string) => void

/**
 * 复制失败回调
 */
export type CopyErrorCallback = (error: Error) => void

/**
 * 复制指令选项
 */
export interface CopyOptions {
  /**
   * 要复制的文本
   * @required
   */
  value: string

  /**
   * 复制成功回调
   */
  onSuccess?: CopySuccessCallback

  /**
   * 复制失败回调
   */
  onError?: CopyErrorCallback

  /**
   * 复制按钮的提示文本
   */
  title?: string

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
}

/**
 * 指令绑定值类型
 */
export type CopyBinding = string | CopyOptions

/**
 * 复制结果
 */
export interface CopyResult {
  success: boolean
  text?: string
  error?: Error
}
```

#### 4.2.3 核心实现

```typescript
// packages/directives/copy/src/clipboard.ts

import { supportsClipboard } from '@directix/core'

/**
 * 复制文本到剪贴板
 * 优先使用 Clipboard API，降级使用 execCommand
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 方式一：使用 Clipboard API
  if (supportsClipboard()) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      // 权限被拒绝或其他错误，降级处理
      console.warn('[Directix] Clipboard API failed, falling back to execCommand')
    }
  }

  // 方式二：使用 execCommand（已废弃但兼容性好）
  return copyWithExecCommand(text)
}

/**
 * 使用 execCommand 复制
 */
function copyWithExecCommand(text: string): boolean {
  // 创建临时 textarea
  const textarea = document.createElement('textarea')
  textarea.value = text

  // 设置样式使其不可见
  textarea.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  `

  document.body.appendChild(textarea)

  try {
    // 选中并复制
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    return document.execCommand('copy')
  } catch (err) {
    return false
  } finally {
    // 清理
    document.body.removeChild(textarea)
  }
}
```

```typescript
// packages/directives/copy/src/directive.ts

import { defineDirective } from '@directix/core'
import { copyToClipboard } from './clipboard'
import type { DirectiveBinding } from '@directix/core'
import type { CopyBinding, CopyOptions } from './types'

export const vCopy = defineDirective<CopyBinding, HTMLElement>({
  name: 'copy',
  ssr: false,

  mounted(el: HTMLElement, binding: DirectiveBinding<CopyBinding>) {
    const options = normalizeOptions(binding.value)

    if (options.disabled) return

    // 设置提示
    if (options.title) {
      el.setAttribute('title', options.title)
    }

    // 添加点击事件
    const handler = async () => {
      const text = options.value

      if (!text) {
        console.warn('[Directix] v-copy: No text to copy')
        return
      }

      try {
        const success = await copyToClipboard(text)

        if (success) {
          options.onSuccess?.(text)
          el.dispatchEvent(new CustomEvent('copy:success', { detail: { text } }))
        } else {
          throw new Error('Copy failed')
        }
      } catch (err) {
        const error = err as Error
        options.onError?.(error)
        el.dispatchEvent(new CustomEvent('copy:error', { detail: { error } }))
      }
    }

    el.addEventListener('click', handler)

    el.__copy = { handler, options }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<CopyBinding>) {
    const state = el.__copy
    if (!state) return

    state.options = normalizeOptions(binding.value)

    if (state.options.title) {
      el.setAttribute('title', state.options.title)
    }
  },

  unmounted(el: HTMLElement) {
    const state = el.__copy
    if (!state) return

    el.removeEventListener('click', state.handler)
    delete el.__copy
  },
})

function normalizeOptions(binding: CopyBinding): CopyOptions {
  if (typeof binding === 'string') {
    return { value: binding }
  }
  return binding
}

interface CopyState {
  handler: () => void
  options: CopyOptions
}

declare global {
  interface HTMLElement {
    __copy?: CopyState
  }
}
```

---

### 4.3 v-debounce 防抖指令

#### 4.3.1 功能需求

| 功能 | 描述 |
|------|------|
| 基础防抖 | 函数防抖，延迟执行 |
| 时间配置 | 可配置延迟时间 |
| 立即执行 | 支持首次立即执行 |
| 取消功能 | 支持取消待执行的函数 |
| 刷新功能 | 支持刷新计时器 |
| 响应式 | 值更新时自动重新绑定 |

#### 4.3.2 类型定义

```typescript
// packages/directives/debounce/src/types.ts

/**
 * 防抖函数类型
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void
  cancel(): void
  flush(): void
  pending(): boolean
}

/**
 * 防抖指令选项
 */
export interface DebounceOptions<T extends (...args: any[]) => any = any> {
  /**
   * 要防抖的函数
   */
  handler: T

  /**
   * 延迟时间（毫秒）
   * @default 300
   */
  wait?: number

  /**
   * 是否在延迟开始前立即调用
   * @default false
   */
  leading?: boolean

  /**
   * 是否在延迟结束后调用
   * @default true
   */
  trailing?: boolean

  /**
   * 最大等待时间
   */
  maxWait?: number
}

/**
 * 指令绑定值类型
 */
export type DebounceBinding<T extends (...args: any[]) => any = any> =
  | T
  | DebounceOptions<T>
```

#### 4.3.3 核心实现

```typescript
// packages/directives/debounce/src/debounce.ts

import type { DebouncedFunction } from './types'

/**
 * 创建防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  options: {
    leading?: boolean
    trailing?: boolean
    maxWait?: number
  } = {}
): DebouncedFunction<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: any = null
  let result: ReturnType<T>
  let lastCallTime = 0

  const { leading = false, trailing = true, maxWait } = options

  const invokeFunc = (time: number) => {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = null
    lastThis = null
    lastCallTime = time

    result = func.apply(thisArg, args!)
    return result
  }

  const startTimer = (pendingFunc: () => void, wait: number) => {
    if (timerId !== null) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(pendingFunc, wait)
  }

  const leadingEdge = (time: number) => {
    if (leading) {
      return invokeFunc(time)
    }
    return result
  }

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - lastCallTime
    return wait - timeSinceLastCall
  }

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - lastCallTime
    return lastCallTime === 0 || timeSinceLastCall >= wait
  }

  const timerExpired = () => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      if (trailing && lastArgs) {
        return invokeFunc(time)
      }
      timerId = null
    } else {
      startTimer(timerExpired, remainingWait(time))
    }
  }

  const debounced = function (this: any, ...args: Parameters<T>) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === null) {
        startTimer(timerExpired, wait)
        return leadingEdge(lastCallTime)
      }
      if (maxWait !== undefined) {
        startTimer(timerExpired, maxWait)
      }
    }

    if (timerId === null) {
      startTimer(timerExpired, wait)
    }

    return result
  } as DebouncedFunction<T>

  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
    lastArgs = null
    lastThis = null
    lastCallTime = 0
  }

  debounced.flush = () => {
    if (timerId !== null && lastArgs) {
      clearTimeout(timerId)
      return invokeFunc(Date.now())
    }
    return result
  }

  debounced.pending = () => {
    return timerId !== null
  }

  return debounced
}
```

```typescript
// packages/directives/debounce/src/directive.ts

import { defineDirective } from '@directix/core'
import { debounce } from './debounce'
import type { DirectiveBinding } from '@directix/core'
import type { DebounceBinding, DebounceOptions, DebouncedFunction } from './types'

export const vDebounce = defineDirective<DebounceBinding, HTMLElement>({
  name: 'debounce',
  ssr: false,

  defaults: {
    wait: 300,
    leading: false,
    trailing: true,
  },

  mounted(el: HTMLElement, binding: DirectiveBinding<DebounceBinding>) {
    const options = normalizeOptions(binding.value, binding)
    const eventType = binding.arg || 'input'

    // 创建防抖函数
    const debouncedFn = debounce(options.handler, options.wait, {
      leading: options.leading,
      trailing: options.trailing,
      maxWait: options.maxWait,
    })

    // 绑定事件
    el.addEventListener(eventType, debouncedFn as any)

    el.__debounce = {
      debouncedFn,
      eventType,
      options,
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<DebounceBinding>) {
    const state = el.__debounce
    if (!state) return

    const newOptions = normalizeOptions(binding.value, binding)

    // 如果配置变化，重新创建防抖函数
    if (
      newOptions.wait !== state.options.wait ||
      newOptions.leading !== state.options.leading ||
      newOptions.trailing !== state.options.trailing
    ) {
      // 取消旧的
      state.debouncedFn.cancel()

      // 创建新的
      const debouncedFn = debounce(newOptions.handler, newOptions.wait, {
        leading: newOptions.leading,
        trailing: newOptions.trailing,
        maxWait: newOptions.maxWait,
      })

      el.removeEventListener(state.eventType, state.debouncedFn as any)
      el.addEventListener(state.eventType, debouncedFn as any)

      el.__debounce = {
        debouncedFn,
        eventType: state.eventType,
        options: newOptions,
      }
    } else if (newOptions.handler !== state.options.handler) {
      // 只更新 handler
      state.options.handler = newOptions.handler
    }
  },

  unmounted(el: HTMLElement) {
    const state = el.__debounce
    if (!state) return

    state.debouncedFn.cancel()
    el.removeEventListener(state.eventType, state.debouncedFn as any)
    delete el.__debounce
  },
})

function normalizeOptions(
  binding: DebounceBinding,
  directiveBinding: DirectiveBinding<DebounceBinding>
): DebounceOptions {
  const wait = parseTime(directiveBinding.arg) || 300

  if (typeof binding === 'function') {
    return { handler: binding, wait }
  }

  return { ...binding, wait: binding.wait || wait }
}

/**
 * 解析时间参数
 * 支持格式: "300" | "300ms" | "1s"
 */
function parseTime(arg?: string): number | null {
  if (!arg) return null

  if (arg.endsWith('ms')) {
    return parseInt(arg, 10)
  }

  if (arg.endsWith('s')) {
    return parseFloat(arg) * 1000
  }

  const num = parseInt(arg, 10)
  return isNaN(num) ? null : num
}

interface DebounceState {
  debouncedFn: DebouncedFunction<any>
  eventType: string
  options: DebounceOptions
}

declare global {
  interface HTMLElement {
    __debounce?: DebounceState
  }
}
```

---

### 4.4 v-lazy 懒加载指令

#### 4.4.1 功能需求

| 功能 | 描述 |
|------|------|
| 图片懒加载 | 图片进入视口时加载 |
| 组件懒加载 | 组件进入视口时渲染 |
| 加载状态 | 提供加载中/加载失败状态 |
| 占位图 | 支持占位图显示 |
| 自定义触发 | 支持自定义触发条件 |
| 预加载距离 | 支持提前加载 |

#### 4.4.2 完整实现

```typescript
// packages/directives/lazy/src/types.ts

export interface LazyOptions {
  /**
   * 图片源地址
   */
  src?: string

  /**
   * 占位图
   */
  placeholder?: string

  /**
   * 加载失败时显示的图片
   */
  error?: string

  /**
   * 预加载距离（像素）
   * @default 0
   */
  preload?: number

  /**
   * 加载成功回调
   */
  onLoad?: (el: HTMLElement) => void

  /**
   * 加载失败回调
   */
  onError?: (el: HTMLElement, error: Error) => void

  /**
   * 是否尝试重新加载
   * @default true
   */
  attempt?: number

  /**
   * 过滤器，返回 false 不加载
   */
  filter?: (src: string) => boolean

  /**
   * 自定义观察器
   */
  observer?: IntersectionObserver
}

export type LazyBinding = string | LazyOptions

export type LazyState = 'pending' | 'loading' | 'loaded' | 'error'
```

```typescript
// packages/directives/lazy/src/directive.ts

import { defineDirective, supportsIntersectionObserver } from '@directix/core'
import type { DirectiveBinding } from '@directix/core'
import type { LazyBinding, LazyOptions, LazyState } from './types'

// 全局观察器
let globalObserver: IntersectionObserver | null = null

export const vLazy = defineDirective<LazyBinding, HTMLElement>({
  name: 'lazy',
  ssr: false,

  defaults: {
    preload: 0,
    attempt: 1,
  },

  mounted(el: HTMLElement, binding: DirectiveBinding<LazyBinding>) {
    const options = normalizeOptions(binding.value)

    if (!options.src) {
      console.warn('[Directix] v-lazy: No source provided')
      return
    }

    // 设置初始状态
    setState(el, 'pending')

    // 设置占位图
    if (options.placeholder) {
      setSrc(el, options.placeholder)
    }

    // 添加自定义类
    el.classList.add('v-lazy')

    // 存储状态
    el.__lazy = {
      options,
      attempt: 0,
    }

    // 开始观察
    observe(el)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<LazyBinding>) {
    const state = el.__lazy
    if (!state) return

    const newOptions = normalizeOptions(binding.value)

    if (newOptions.src !== state.options.src) {
      state.options = newOptions
      state.attempt = 0

      // 如果已经加载过，重新加载
      if (getState(el) !== 'pending') {
        setState(el, 'pending')
        observe(el)
      }
    }
  },

  unmounted(el: HTMLElement) {
    unobserve(el)
    delete el.__lazy
  },
})

/**
 * 观察元素
 */
function observe(el: HTMLElement) {
  const state = el.__lazy
  if (!state) return

  // 检查是否支持 IntersectionObserver
  if (!supportsIntersectionObserver()) {
    // 降级：直接加载
    load(el)
    return
  }

  // 使用自定义观察器或全局观察器
  if (state.options.observer) {
    state.options.observer.observe(el)
  } else {
    getGlobalObserver(state.options.preload || 0).observe(el)
  }
}

/**
 * 取消观察
 */
function unobserve(el: HTMLElement) {
  const state = el.__lazy
  if (!state) return

  if (state.options.observer) {
    state.options.observer.unobserve(el)
  } else if (globalObserver) {
    globalObserver.unobserve(el)
  }
}

/**
 * 获取全局观察器
 */
function getGlobalObserver(preload: number): IntersectionObserver {
  if (globalObserver) return globalObserver

  globalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load(entry.target as HTMLElement)
          globalObserver?.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: `${preload}px`,
    }
  )

  return globalObserver
}

/**
 * 加载图片
 */
function load(el: HTMLElement) {
  const state = el.__lazy
  if (!state || !state.options.src) return

  // 过滤检查
  if (state.options.filter && !state.options.filter(state.options.src)) {
    return
  }

  setState(el, 'loading')
  state.attempt++

  const img = new Image()

  img.onload = () => {
    setSrc(el, state.options.src!)
    setState(el, 'loaded')
    el.classList.remove('v-lazy--loading')
    el.classList.add('v-lazy--loaded')
    state.options.onLoad?.(el)
  }

  img.onerror = () => {
    el.classList.remove('v-lazy--loading')

    // 检查是否需要重试
    if (state.attempt < (state.options.attempt || 1)) {
      setTimeout(() => load(el), 1000 * state.attempt)
      return
    }

    // 显示错误图片
    if (state.options.error) {
      setSrc(el, state.options.error)
    }

    setState(el, 'error')
    el.classList.add('v-lazy--error')
    state.options.onError?.(el, new Error('Failed to load image'))
  }

  el.classList.add('v-lazy--loading')
  img.src = state.options.src
}

/**
 * 设置元素 src
 */
function setSrc(el: HTMLElement, src: string) {
  if (el.tagName === 'IMG') {
    ;(el as HTMLImageElement).src = src
  } else {
    el.style.backgroundImage = `url("${src}")`
  }
}

/**
 * 设置状态
 */
function setState(el: HTMLElement, state: LazyState) {
  el.dataset.lazyState = state
}

/**
 * 获取状态
 */
function getState(el: HTMLElement): LazyState {
  return (el.dataset.lazyState as LazyState) || 'pending'
}

/**
 * 标准化选项
 */
function normalizeOptions(binding: LazyBinding): LazyOptions {
  if (typeof binding === 'string') {
    return { src: binding }
  }
  return binding
}

interface LazyElementState {
  options: LazyOptions
  attempt: number
}

declare global {
  interface HTMLElement {
    __lazy?: LazyElementState
    dataset: {
      lazyState?: LazyState
    }
  }
}
```

---

### 4.5 v-permission 权限控制指令

#### 4.5.1 功能需求

| 功能 | 描述 |
|------|------|
| 单权限 | 检查单个权限 |
| 多权限 OR | 满足任一权限即可 |
| 多权限 AND | 需要满足所有权限 |
| 角色检查 | 支持角色权限映射 |
| 自定义检查 | 支持自定义检查函数 |
| 移除元素 | 无权限时移除元素 |
| 禁用元素 | 无权限时禁用元素 |

#### 4.5.2 完整实现

```typescript
// packages/directives/permission/src/types.ts

export type PermissionMode = 'remove' | 'disable' | 'hide'

export interface PermissionOptions {
  /**
   * 权限值（单个或多个）
   */
  value: string | string[]

  /**
   * 多权限时的逻辑
   * - 'some': 满足任一即可 (OR)
   * - 'every': 需要满足所有 (AND)
   * @default 'some'
   */
  mode?: 'some' | 'every'

  /**
   * 无权限时的处理方式
   * - 'remove': 移除元素
   * - 'disable': 禁用元素
   * - 'hide': 隐藏元素
   * @default 'remove'
   */
  action?: PermissionMode

  /**
   * 自定义权限检查函数
   */
  check?: (permission: string | string[], mode: 'some' | 'every') => boolean

  /**
   * 权限变更回调
   */
  onChange?: (hasPermission: boolean) => void
}

export type PermissionBinding = string | string[] | PermissionOptions

export interface PermissionConfig {
  /**
   * 获取当前用户权限列表
   */
  getPermissions: () => string[]

  /**
   * 获取当前用户角色
   */
  getRoles?: () => string[]

  /**
   * 角色到权限的映射
   */
  roleMap?: Record<string, string[]>
}
```

```typescript
// packages/directives/permission/src/directive.ts

import { defineDirective } from '@directix/core'
import type { DirectiveBinding } from '@directix/core'
import type { PermissionBinding, PermissionOptions, PermissionConfig } from './types'

// 全局配置
let globalConfig: PermissionConfig | null = null

/**
 * 配置权限指令
 */
export function configurePermission(config: PermissionConfig) {
  globalConfig = config
}

export const vPermission = defineDirective<PermissionBinding, HTMLElement>({
  name: 'permission',
  ssr: true, // SSR 时也需要检查

  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionBinding>) {
    checkPermission(el, binding)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<PermissionBinding>) {
    checkPermission(el, binding)
  },
})

/**
 * 检查权限
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionBinding>) {
  const options = normalizeOptions(binding.value)
  const hasPermission = verifyPermission(options)

  // 触发变更回调
  if (options.onChange) {
    options.onChange(hasPermission)
  }

  // 根据结果处理元素
  if (!hasPermission) {
    handleNoPermission(el, options.action || 'remove')
  } else {
    restoreElement(el, options.action || 'remove')
  }
}

/**
 * 验证权限
 */
function verifyPermission(options: PermissionOptions): boolean {
  // 自定义检查函数优先
  if (options.check) {
    return options.check(options.value, options.mode || 'some')
  }

  // 使用全局配置
  if (!globalConfig) {
    console.warn('[Directix] v-permission: No permission config provided')
    return true
  }

  const permissions = globalConfig.getPermissions()
  const required = Array.isArray(options.value) ? options.value : [options.value]
  const mode = options.mode || 'some'

  // 检查权限
  const result = mode === 'every'
    ? required.every(p => permissions.includes(p))
    : required.some(p => permissions.includes(p))

  // 如果有角色映射，也要检查角色
  if (!result && globalConfig.getRoles && globalConfig.roleMap) {
    const roles = globalConfig.getRoles()
    for (const role of roles) {
      const rolePermissions = globalConfig.roleMap[role] || []
      const roleResult = mode === 'every'
        ? required.every(p => rolePermissions.includes(p))
        : required.some(p => rolePermissions.includes(p))
      if (roleResult) return true
    }
  }

  return result
}

/**
 * 处理无权限情况
 */
function handleNoPermission(el: HTMLElement, action: PermissionMode) {
  switch (action) {
    case 'remove':
      el.parentNode?.removeChild(el)
      break
    case 'disable':
      el.setAttribute('disabled', 'true')
      el.classList.add('v-permission--disabled')
      break
    case 'hide':
      el.style.display = 'none'
      el.classList.add('v-permission--hidden')
      break
  }
}

/**
 * 恢复元素
 */
function restoreElement(el: HTMLElement, action: PermissionMode) {
  switch (action) {
    case 'disable':
      el.removeAttribute('disabled')
      el.classList.remove('v-permission--disabled')
      break
    case 'hide':
      el.style.display = ''
      el.classList.remove('v-permission--hidden')
      break
  }
}

/**
 * 标准化选项
 */
function normalizeOptions(binding: PermissionBinding): PermissionOptions {
  if (typeof binding === 'string') {
    return { value: binding }
  }
  if (Array.isArray(binding)) {
    return { value: binding }
  }
  return binding
}
```

---

## 五、共享工具库实现

### 5.1 DOM 操作工具

```typescript
// packages/shared/src/dom/index.ts

/**
 * 检查是否为元素
 */
export function isElement(value: unknown): value is Element {
  return value instanceof Element
}

/**
 * 检查是否为 HTML 元素
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement
}

/**
 * 获取元素
 */
export function getElement(
  target: string | Element | null | undefined
): Element | null {
  if (!target) return null

  if (typeof target === 'string') {
    return document.querySelector(target)
  }

  return isElement(target) ? target : null
}

/**
 * 获取所有匹配元素
 */
export function getAllElements(target: string): Element[] {
  return Array.from(document.querySelectorAll(target))
}

/**
 * 添加类名
 */
export function addClass(el: Element, ...classes: string[]): void {
  el.classList.add(...classes)
}

/**
 * 移除类名
 */
export function removeClass(el: Element, ...classes: string[]): void {
  el.classList.remove(...classes)
}

/**
 * 切换类名
 */
export function toggleClass(el: Element, className: string, force?: boolean): void {
  el.classList.toggle(className, force)
}

/**
 * 检查是否有类名
 */
export function hasClass(el: Element, className: string): boolean {
  return el.classList.contains(className)
}

/**
 * 获取元素样式
 */
export function getStyle(el: Element, property: string): string {
  return getComputedStyle(el).getPropertyValue(property)
}

/**
 * 设置元素样式
 */
export function setStyle(
  el: HTMLElement,
  property: string,
  value: string | number
): void {
  el.style.setProperty(property, typeof value === 'number' ? `${value}px` : value)
}

/**
 * 获取元素位置
 */
export function getOffset(el: Element): { top: number; left: number } {
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  }
}

/**
 * 获取元素尺寸
 */
export function getSize(el: Element): { width: number; height: number } {
  const rect = el.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
  }
}

/**
 * 检查元素是否在视口内
 */
export function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 获取最近的滚动父元素
 */
export function getScrollParent(el: Element): Element | Window {
  let parent: Element | null = el.parentElement

  while (parent) {
    const { overflow, overflowX, overflowY } = getComputedStyle(parent)

    if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) {
      return parent
    }

    parent = parent.parentElement
  }

  return window
}
```

### 5.2 事件处理工具

```typescript
// packages/shared/src/event/index.ts

import { supportsPassive } from '@directix/core'

export interface EventOptions {
  capture?: boolean
  passive?: boolean
  once?: boolean
}

/**
 * 添加事件监听
 */
export function on(
  target: EventTarget,
  event: string,
  handler: EventListener,
  options: boolean | EventOptions = false
): void {
  const opts = normalizeOptions(options)
  target.addEventListener(event, handler, opts)
}

/**
 * 移除事件监听
 */
export function off(
  target: EventTarget,
  event: string,
  handler: EventListener,
  options: boolean | EventOptions = false
): void {
  const opts = normalizeOptions(options)
  target.removeEventListener(event, handler, opts)
}

/**
 * 触发自定义事件
 */
export function emit(
  target: EventTarget,
  event: string,
  detail?: any
): boolean {
  return target.dispatchEvent(new CustomEvent(event, { detail }))
}

/**
 * 标准化事件选项
 */
function normalizeOptions(options: boolean | EventOptions): AddEventListenerOptions | boolean {
  if (typeof options === 'boolean') {
    return options
  }

  const { capture = false, passive = false, once = false } = options

  if (supportsPassive()) {
    return { capture, passive, once }
  }

  return capture
}

/**
 * 创建事件委托
 */
export function delegate(
  container: Element,
  selector: string,
  event: string,
  handler: (el: Element, e: Event) => void,
  options?: EventOptions
): () => void {
  const listener = (e: Event) => {
    const target = e.target as Element
    const matched = target.closest(selector)

    if (matched && container.contains(matched)) {
      handler(matched, e)
    }
  }

  on(container, event, listener, options)

  return () => off(container, event, listener, options)
}

/**
 * 阻止事件冒泡
 */
export function stopPropagation(e: Event): void {
  e.stopPropagation()
}

/**
 * 阻止默认行为
 */
export function preventDefault(e: Event): void {
  e.preventDefault()
}

/**
 * 停止事件传播并阻止默认行为
 */
export function stopEvent(e: Event): void {
  stopPropagation(e)
  preventDefault(e)
}
```

### 5.3 通用工具函数

```typescript
// packages/shared/src/utils/is.ts

/**
 * 检查是否为字符串
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * 检查是否为数字
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * 检查是否为布尔值
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * 检查是否为函数
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function'
}

/**
 * 检查是否为对象
 */
export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null
}

/**
 * 检查是否为数组
 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value)
}

/**
 * 检查是否为空
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (isString(value) || isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

/**
 * 检查是否为 Promise
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return isObject(value) && isFunction((value as any).then)
}
```

```typescript
// packages/shared/src/utils/object.ts

import { isObject } from './is'

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

/**
 * 深合并
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target

  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        }
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * 获取嵌套属性值
 */
export function get<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue as T
    }
    result = result[key]
  }

  return result === undefined ? (defaultValue as T) : result
}

/**
 * 设置嵌套属性值
 */
export function set(
  obj: Record<string, any>,
  path: string,
  value: any
): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let current = obj

  for (const key of keys) {
    if (current[key] === undefined) {
      current[key] = {}
    }
    current = current[key]
  }

  current[lastKey] = value
}
```

---

## 六、API 设计详解

### 6.1 安装方式

#### 全局安装

```typescript
// Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

const app = createApp(App)

// 安装所有指令
app.use(Directix)

// 选择性安装
app.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce', 'lazy'],
})

// 带配置安装
app.use(Directix, {
  directives: {
    'click-outside': { capture: false },
    'debounce': { wait: 500 },
    'permission': {
      getPermissions: () => store.getters.permissions,
    },
  },
})
```

```typescript
// Vue 2
import Vue from 'vue'
import Directix from 'directix'

Vue.use(Directix, {
  directives: ['click-outside', 'copy'],
})
```

#### 按需引入

```typescript
// 单个指令
import { vClickOutside } from 'directix/click-outside'
app.directive('click-outside', vClickOutside)

// 从主入口
import { vClickOutside, vCopy, vDebounce } from 'directix'

// 指令分组
import { eventDirectives, formDirectives } from 'directix'
app.use(eventDirectives) // v-debounce, v-throttle, v-long-press
```

### 6.2 指令分组

```typescript
// src/groups.ts

import type { Plugin } from 'vue'

// 事件类指令
export const eventDirectives: Plugin = {
  install(app: any) {
    app.directive('debounce', vDebounce)
    app.directive('throttle', vThrottle)
    app.directive('long-press', vLongPress)
    app.directive('click-outside', vClickOutside)
  },
}

// 表单类指令
export const formDirectives: Plugin = {
  install(app: any) {
    app.directive('copy', vCopy)
    app.directive('focus', vFocus)
    app.directive('mask', vMask)
    app.directive('trim', vTrim)
    app.directive('uppercase', vUppercase)
    app.directive('lowercase', vLowercase)
  },
}

// 可见性指令
export const visibilityDirectives: Plugin = {
  install(app: any) {
    app.directive('lazy', vLazy)
    app.directive('intersect', vIntersect)
    app.directive('visible', vVisible)
    app.directive('loading', vLoading)
  },
}

// 安全类指令
export const securityDirectives: Plugin = {
  install(app: any) {
    app.directive('permission', vPermission)
    app.directive('sanitize', vSanitize)
  },
}
```

### 6.3 组合式 API

```typescript
// src/composables/use-copy.ts

import { ref, readonly } from 'vue'
import { copyToClipboard } from '@directix/directives/copy'

export interface UseCopyOptions {
  source?: string | Ref<string>
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
}

export function useCopy(options: UseCopyOptions = {}) {
  const { source, onSuccess, onError } = options
  const copied = ref(false)
  const error = ref<Error | null>(null)
  const isSupported = supportsClipboard()

  async function copy(text?: string) {
    const value = text ?? unref(source)

    if (!value) {
      console.warn('[Directix] useCopy: No text to copy')
      return false
    }

    error.value = null

    try {
      await copyToClipboard(value)
      copied.value = true
      onSuccess?.(value)

      // 自动重置 copied 状态
      setTimeout(() => {
        copied.value = false
      }, 1500)

      return true
    } catch (err) {
      error.value = err as Error
      copied.value = false
      onError?.(error.value)
      return false
    }
  }

  return {
    copy,
    copied: readonly(copied),
    error: readonly(error),
    isSupported,
  }
}
```

```typescript
// src/composables/use-debounce.ts

import { ref, watch, onUnmounted } from 'vue'
import { debounce } from '@directix/shared'

export interface UseDebounceOptions<T extends (...args: any[]) => any> {
  handler: T
  wait?: number
  leading?: boolean
  trailing?: boolean
}

export function useDebounce<T extends (...args: any[]) => any>(
  options: UseDebounceOptions<T>
) {
  const { handler, wait = 300, leading = false, trailing = true } = options

  const debouncedFn = debounce(handler, wait, { leading, trailing })

  onUnmounted(() => {
    debouncedFn.cancel()
  })

  return {
    run: debouncedFn,
    cancel: debouncedFn.cancel,
    flush: debouncedFn.flush,
    pending: debouncedFn.pending,
  }
}
```

---

## 七、构建与发布

### 7.1 构建配置详解

```typescript
// vite.config.ts

import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts', 'packages/**/*.ts'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Directix',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        const map: Record<string, string> = {
          es: 'index.esm.js',
          cjs: 'index.cjs.js',
          umd: 'index.umd.js',
        }
        return map[format]
      },
    },

    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },

    // 生成 sourcemap
    sourcemap: true,

    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@directix/core': resolve(__dirname, 'packages/core/src'),
      '@directix/shared': resolve(__dirname, 'packages/shared/src'),
    },
  },
})
```

### 7.2 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "preserve",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@directix/core": ["packages/core/src"],
      "@directix/shared": ["packages/shared/src"]
    },

    "types": ["vitest/globals", "node"]
  },
  "include": [
    "src/**/*.ts",
    "packages/**/*.ts",
    "tests/**/*.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

### 7.3 发布脚本

```typescript
// scripts/release.ts

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import semver from 'semver'
import chalk from 'chalk'

const args = process.argv.slice(2)
const versionType = args[0] || 'patch' // major | minor | patch | premajor | preminor | prepatch | prerelease

async function release() {
  console.log(chalk.blue('🚀 Starting release process...\n'))

  // 1. 检查工作区是否干净
  const status = execSync('git status --porcelain').toString()
  if (status) {
    console.error(chalk.red('❌ Working directory is not clean. Please commit changes first.'))
    process.exit(1)
  }

  // 2. 运行测试
  console.log(chalk.yellow('📦 Running tests...'))
  execSync('pnpm test', { stdio: 'inherit' })

  // 3. 构建
  console.log(chalk.yellow('🔨 Building...'))
  execSync('pnpm build', { stdio: 'inherit' })

  // 4. 更新版本号
  const pkgPath = resolve('package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const oldVersion = pkg.version
  const newVersion = semver.inc(oldVersion, versionType as semver.ReleaseType)

  if (!newVersion) {
    console.error(chalk.red('❌ Invalid version type'))
    process.exit(1)
  }

  pkg.version = newVersion
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

  console.log(chalk.green(`\n📝 Version: ${oldVersion} → ${newVersion}\n`))

  // 5. 生成 changelog
  console.log(chalk.yellow('📝 Generating changelog...'))
  execSync('pnpm changelog', { stdio: 'inherit' })

  // 6. 提交更改
  console.log(chalk.yellow('💾 Committing changes...'))
  execSync('git add .')
  execSync(`git commit -m "chore(release): v${newVersion}"`)

  // 7. 创建标签
  execSync(`git tag v${newVersion}`)

  // 8. 发布到 npm
  console.log(chalk.yellow('🚀 Publishing to npm...'))
  execSync('pnpm publish --access public', { stdio: 'inherit' })

  // 9. 推送到远程
  console.log(chalk.yellow('⬆️  Pushing to remote...'))
  execSync('git push origin main --tags')

  console.log(chalk.green(`\n✅ Release v${newVersion} completed!\n`))
}

release().catch((err) => {
  console.error(chalk.red('❌ Release failed:'), err)
  process.exit(1)
})
```

---

## 八、测试策略详解

### 8.1 Vitest 配置

```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'packages/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
    setupFiles: ['./tests/setup/vue3.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@directix/core': resolve(__dirname, 'packages/core/src'),
      '@directix/shared': resolve(__dirname, 'packages/shared/src'),
    },
  },
})
```

### 8.2 测试工具函数

```typescript
// tests/utils.ts

import { mount, VueWrapper } from '@vue/test-utils'
import type { DefineComponent } from 'vue'

/**
 * 创建测试组件
 */
export function createTestComponent(
  template: string,
  setup?: () => Record<string, any>
): DefineComponent {
  return {
    template,
    setup,
  }
}

/**
 * 触发 DOM 事件
 */
export function trigger(
  wrapper: VueWrapper | Element,
  event: string,
  options?: EventInit
): Promise<void> {
  const element = 'element' in wrapper ? wrapper.element : wrapper
  const eventType = event.toLowerCase()

  let eventObj: Event
  if (eventType.startsWith('key')) {
    eventObj = new KeyboardEvent(eventType, options)
  } else if (eventType.includes('mouse') || eventType.includes('click')) {
    eventObj = new MouseEvent(eventType, options)
  } else if (eventType.includes('touch')) {
    eventObj = new TouchEvent(eventType, options)
  } else {
    eventObj = new Event(eventType, options)
  }

  element.dispatchEvent(eventObj)
  return Promise.resolve()
}

/**
 * 等待时间
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 等待下一个 tick
 */
export async function nextTick(): Promise<void> {
  await new Promise(resolve => requestAnimationFrame(resolve))
}

/**
 * 创建模拟的 IntersectionObserver
 */
export function mockIntersectionObserver() {
  const instances: IntersectionObserver[] = []

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []

    private callback: IntersectionObserverCallback
    private elements: Element[] = []

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback
      instances.push(this)
    }

    observe(element: Element): void {
      this.elements.push(element)
    }

    unobserve(element: Element): void {
      this.elements = this.elements.filter(el => el !== element)
    }

    disconnect(): void {
      this.elements = []
    }

    takeRecords(): IntersectionObserverEntry[] {
      return []
    }

    // 测试辅助方法
    simulateEntry(element: Element, isIntersecting: boolean) {
      const entry: IntersectionObserverEntry = {
        target: element,
        isIntersecting,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      }

      this.callback([entry], this)
    }
  }

  window.IntersectionObserver = MockIntersectionObserver as any

  return {
    instances,
    MockIntersectionObserver,
  }
}
```

### 8.3 指令测试示例

```typescript
// tests/unit/directives/click-outside.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vClickOutside } from '@directix/directives/click-outside'
import { trigger } from '../../utils'

describe('v-click-outside', () => {
  it('should call handler when clicking outside', async () => {
    const handler = vi.fn()

    const wrapper = mount({
      template: `
        <div>
          <div id="target" v-click-outside="handler">Target</div>
          <div id="outside">Outside</div>
        </div>
      `,
      directives: { clickOutside: vClickOutside },
      data() {
        return { handler }
      },
    })

    await trigger(wrapper.find('#outside'), 'click')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should not call handler when clicking inside', async () => {
    const handler = vi.fn()

    const wrapper = mount({
      template: `
        <div id="target" v-click-outside="handler">Target</div>
      `,
      directives: { clickOutside: vClickOutside },
      data() {
        return { handler }
      },
    })

    await trigger(wrapper.find('#target'), 'click')
    expect(handler).not.toHaveBeenCalled()
  })

  it('should respect exclude option', async () => {
    const handler = vi.fn()

    const wrapper = mount({
      template: `
        <div>
          <button id="trigger" ref="trigger">Trigger</button>
          <div v-click-outside="options">Target</div>
        </div>
      `,
      directives: { clickOutside: vClickOutside },
      setup() {
        const options = {
          handler,
          exclude: ['#trigger'] as string[],
        }
        return { options }
      },
    })

    await trigger(wrapper.find('#trigger'), 'click')
    expect(handler).not.toHaveBeenCalled()
  })

  it('should work with disabled option', async () => {
    const handler = vi.fn()

    const wrapper = mount({
      template: `
        <div v-click-outside="options">Target</div>
      `,
      directives: { clickOutside: vClickOutside },
      data() {
        return {
          options: {
            handler,
            disabled: true,
          },
        }
      },
    })

    await trigger(document.body, 'click')
    expect(handler).not.toHaveBeenCalled()
  })

  it('should cleanup on unmount', async () => {
    const handler = vi.fn()

    const wrapper = mount({
      template: `
        <div v-click-outside="handler">Target</div>
      `,
      directives: { clickOutside: vClickOutside },
      data() {
        return { handler }
      },
    })

    wrapper.unmount()
    await trigger(document.body, 'click')
    expect(handler).not.toHaveBeenCalled()
  })
})
```

---

## 九、文档规划

### 9.1 文档站点结构

```
docs/
├── .vitepress/
│   ├── config.ts              # VitePress 配置
│   ├── theme/                 # 自定义主题
│   │   ├── index.ts
│   │   └── components/
│   └── cache/
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
├── index.md                   # 首页
├── guide/                     # 指南
│   ├── getting-started.md    # 快速开始
│   ├── installation.md       # 安装
│   ├── usage.md              # 使用方式
│   ├── vue2-support.md       # Vue 2 支持
│   ├── nuxt.md               # Nuxt 集成
│   ├── typescript.md         # TypeScript
│   ├── migration.md          # 迁移指南
│   └── faq.md                # 常见问题
│
├── directives/               # 指令文档
│   ├── overview.md          # 概览
│   ├── event/               # 事件类
│   ├── form/                # 表单类
│   ├── visibility/          # 可见性
│   ├── scroll/              # 滚动
│   ├── security/            # 安全
│   └── effect/              # 效果
│
├── api/                     # API 文档
│   ├── config.md           # 配置
│   ├── composables.md      # 组合式函数
│   └── types.md            # 类型定义
│
├── examples/               # 示例
│   ├── dropdown.md
│   ├── search-input.md
│   ├── infinite-list.md
│   └── permission-control.md
│
└── changelog.md            # 更新日志
```

### 9.2 VitePress 配置

```typescript
// docs/.vitepress/config.ts

import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Directix',
  description: '全面、易用、高性能的 Vue 自定义指令库',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#42b883' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '指令', link: '/directives/', activeMatch: '/directives/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' },
      { text: '示例', link: '/examples/', activeMatch: '/examples/' },
      {
        text: 'v1.0',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: '迁移指南', link: '/guide/migration' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '使用方式', link: '/guide/usage' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: 'Vue 2 支持', link: '/guide/vue2-support' },
            { text: 'Nuxt 集成', link: '/guide/nuxt' },
            { text: 'TypeScript', link: '/guide/typescript' },
          ],
        },
      ],
      '/directives/': [
        {
          text: '概览',
          link: '/directives/',
        },
        {
          text: '事件类',
          collapsed: false,
          items: [
            { text: 'v-click-outside', link: '/directives/event/click-outside' },
            { text: 'v-debounce', link: '/directives/event/debounce' },
            { text: 'v-throttle', link: '/directives/event/throttle' },
            { text: 'v-long-press', link: '/directives/event/long-press' },
          ],
        },
        {
          text: '表单类',
          collapsed: false,
          items: [
            { text: 'v-copy', link: '/directives/form/copy' },
            { text: 'v-focus', link: '/directives/form/focus' },
            { text: 'v-mask', link: '/directives/form/mask' },
          ],
        },
        // ... 更多分组
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/saqqdy/directix' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present',
    },
  },
})
```

---

## 十、开发计划与里程碑

### 10.1 详细开发计划

#### 第一阶段：项目搭建 (Week 1) ✅ 已完成

| 任务 | 工时 | 负责人 | 产出 | 状态 |
|------|------|--------|------|------|
| 项目初始化 | 2h | - | 项目骨架 | ✅ |
| 配置构建工具 | 4h | - | Vite/Vitest/ESLint 配置 | ✅ |
| 核心适配层开发 | 8h | - | Vue 2/3 兼容层 | ✅ |
| 共享工具开发 | 4h | - | DOM/事件/工具函数 | ✅ |
| CI/CD 配置 | 2h | - | GitHub Actions | 待完成 |
| 文档站点搭建 | 4h | - | VitePress 配置 | 待完成 |

**里程碑 M1：项目基础设施完成** ✅

#### 第二阶段：核心指令开发 (Week 2-3) 🚧 进行中

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-click-outside | 4h | P0 | - | ✅ 已完成 |
| v-copy | 4h | P0 | - | ✅ 已完成 |
| v-debounce | 4h | P0 | - | ✅ 已完成 |
| v-throttle | 4h | P0 | - | ✅ 已完成 |
| v-focus | 2h | P0 | - | ✅ 已完成 |
| v-lazy | 8h | P0 | IntersectionObserver | ⏳ 待开发 |
| v-permission | 6h | P0 | - | ⏳ 待开发 |
| v-long-press | 4h | P1 | - | ⏳ 待开发 |
| v-hover | 4h | P1 | - | ⏳ 待开发 |
| v-ripple | 6h | P1 | - | ⏳ 待开发 |

**里程碑 M2：核心指令完成，可用性验证** 🚧 进行中

#### 第三阶段：增强指令开发 (Week 4-5)

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-scroll | 6h | P1 | - | ⏳ 待开发 |
| v-resize | 4h | P1 | ResizeObserver | ⏳ 待开发 |
| v-intersect | 4h | P1 | IntersectionObserver | ⏳ 待开发 |
| v-infinite-scroll | 6h | P1 | v-scroll, v-intersect | ⏳ 待开发 |
| v-sticky | 4h | P1 | v-scroll | ⏳ 待开发 |
| v-mask | 8h | P1 | - | ⏳ 待开发 |
| v-sanitize | 4h | P2 | DOMPurify | ⏳ 待开发 |
| v-loading | 4h | P2 | - | ⏳ 待开发 |
| v-visible | 4h | P2 | - | ⏳ 待开发 |
| v-mutation | 4h | P2 | MutationObserver | ⏳ 待开发 |

**里程碑 M3：增强指令完成**

#### 第四阶段：扩展指令开发 (Week 6)

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-tooltip | 8h | P2 | floating-ui | ⏳ 待开发 |
| v-draggable | 8h | P2 | - | ⏳ 待开发 |
| v-touch | 8h | P2 | - | ⏳ 待开发 |
| v-image-preview | 6h | P3 | - | ⏳ 待开发 |
| v-truncate | 2h | P3 | - | ⏳ 待开发 |
| v-uppercase/lowercase | 2h | P3 | - | ⏳ 待开发 |
| v-number | 4h | P3 | - | ⏳ 待开发 |
| v-money | 4h | P3 | - | ⏳ 待开发 |

**里程碑 M4：全部指令开发完成**

#### 第五阶段：优化与发布 (Week 7)

| 任务 | 工时 | 产出 | 状态 |
|------|------|------|------|
| 性能优化 | 8h | 体积优化、性能报告 | ⏳ 待开发 |
| 文档完善 | 12h | 完整文档、示例 | ⏳ 待开发 |
| 测试覆盖 | 8h | 测试覆盖率 > 80% | ⏳ 待开发 |
| 发布准备 | 4h | 发布脚本、NPM 发布 | ⏳ 待开发 |

**里程碑 M5：v1.0 正式发布**

---

### 10.2 当前进度总览

#### 已完成指令 (5/30+)

| 指令 | 功能描述 | 测试 | 示例 |
|------|---------|------|------|
| v-click-outside | 点击外部检测 | ✅ | ✅ |
| v-copy | 复制到剪贴板 | ✅ | ✅ |
| v-debounce | 防抖指令 | ✅ | ✅ |
| v-throttle | 节流指令 | ✅ | ✅ |
| v-focus | 自动聚焦 | ✅ | ✅ |

#### 开发中

暂无

#### 待开发指令 (25+)

**P0 高优先级：**
- v-lazy - 图片/组件懒加载
- v-permission - 权限控制

**P1 中优先级：**
- v-long-press - 长按事件
- v-hover - 悬停状态
- v-ripple - 波纹效果
- v-scroll - 滚动监听
- v-resize - 尺寸监听
- v-intersect - 交叉检测
- v-infinite-scroll - 无限滚动
- v-sticky - 粘性定位
- v-mask - 输入掩码

**P2/P3 低优先级：**
- v-sanitize - 安全过滤
- v-loading - 加载状态
- v-visible - 可见性
- v-mutation - DOM 监听
- v-tooltip - 提示框
- v-draggable - 拖拽
- v-touch - 手势
- v-image-preview - 图片预览
- v-truncate - 文本截断
- v-uppercase/lowercase - 大小写转换
- v-number - 数字格式化
- v-money - 金额格式化
- v-skeleton - 骨架屏

### 10.3 版本规划

| 版本 | 时间 | 主要内容 |
|------|------|---------|
| v1.0.0 | Week 7 | 核心指令、基础文档 |
| v1.1.0 | Week 9 | 增强指令、SSR 优化 |
| v1.2.0 | Week 11 | 扩展指令、Nuxt 模块 |
| v1.3.0 | Week 13 | 组合式 API 增强、性能优化 |
| v2.0.0 | Q2 | Vue 3 专属优化、Web Components |

---

## 十一、质量保证

### 11.1 代码规范

```javascript
// eslint.config.js

import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      vue,
    },
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',

      // 通用规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
    },
  },
]
```

### 11.2 提交规范

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
ci: CI 配置
revert: 回滚
```

### 11.3 PR 检查清单

```markdown
## PR Checklist

- [ ] 代码遵循项目编码规范
- [ ] 已添加/更新测试用例
- [ ] 测试覆盖率未降低
- [ ] 文档已更新（如有必要）
- [ ] 提交信息遵循 Conventional Commits
- [ ] 变更日志已更新
- [ ] 无 TypeScript 类型错误
- [ ] 无 ESLint 错误
- [ ] CI 通过
```

---

## 十二、后续展望

### 12.1 v2.0 规划

1. **Vue 3 专属优化**
   - 移除 Vue 2 兼容代码，减小体积
   - 利用 Vue 3 新特性优化性能
   - 支持 Suspense 等新功能

2. **Web Components 支持**
   - 指令可用于 Web Components
   - 框架无关的指令实现

3. **可视化配置工具**
   - 在线配置指令参数
   - 实时预览效果
   - 生成代码片段

4. **在线 Playground**
   - 类似 Vue SFC Playground
   - 支持实时编辑和预览

### 12.2 社区建设

1. **贡献指南**
   - 详细的贡献流程
   - 代码规范说明
   - PR 模板

2. **Issue 模板**
   - Bug 报告模板
   - 功能请求模板
   - 问题讨论模板

3. **开源协议**
   - MIT 协议
   - 商业友好

---

## 附录

### A. 常见问题解答

**Q: 为什么要开发这个库？**

A: 市面上缺乏一个全面、统一、支持 Vue 2/3 的指令库，开发者需要安装多个包来满足需求，我们希望提供一个一站式解决方案。

**Q: 与 VueUse 的区别是什么？**

A: VueUse 主要提供 Composition API 函数，而 Directix 专注于指令形式。两者可以互补使用。

**Q: 支持哪些浏览器？**

A: 支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 的最新版本。IE 不支持。

**Q: 性能如何？**

A: 所有指令都经过优化，支持 Tree-shaking。单个指令体积 < 2KB gzip。

### B. 技术栈总览

| 类型 | 技术选型 |
|------|---------|
| 语言 | TypeScript 5.x |
| 框架 | Vue 2.6+ / Vue 3.0+ |
| 构建 | Vite + tsdown |
| 测试 | Vitest + Playwright |
| 文档 | VitePress |
| 包管理 | pnpm |
| CI/CD | GitHub Actions |
| 代码规范 | ESLint + Prettier |
| 提交规范 | Conventional Commits |
