# Directix - Vue Directives 指令库开发方案（详细版）

## 目录

- [一、项目概述](#一项目概述)
  - [1.1 项目定位](#11-项目定位)
  - [1.2 核心价值主张](#12-核心价值主张)
  - [1.3 目标用户](#13-目标用户)
  - [1.4 命名由来](#14-命名由来)
- [二、技术架构设计](#二技术架构设计)
  - [2.1 整体架构图](#21-整体架构图)
  - [2.2 目录结构详解](#22-目录结构详解)
- [三、Vue 2/3 兼容方案详解](#三vue-23-兼容方案详解)
  - [3.1 指令生命周期对比](#31-指令生命周期对比)
  - [3.2 统一指令接口设计](#32-统一指令接口设计)
  - [3.3 核心适配器实现](#33-核心适配器实现)
  - [3.4 运行时检测与环境适配](#34-运行时检测与环境适配)
  - [3.5 统一指令定义工厂](#35-统一指令定义工厂)
- [四、核心指令详细实现](#四核心指令详细实现)
  - [4.1 v-click-outside 点击外部检测](#41-v-click-outside-点击外部检测)
  - [4.2 v-copy 复制到剪贴板](#42-v-copy-复制到剪贴板)
  - [4.3 v-debounce 防抖指令](#43-v-debounce-防抖指令)
  - [4.4 v-lazy 懒加载指令](#44-v-lazy-懒加载指令)
  - [4.5 v-permission 权限控制指令](#45-v-permission-权限控制指令)
- [五、共享工具库实现](#五共享工具库实现)
  - [5.1 DOM 操作工具](#51-dom-操作工具)
  - [5.2 事件处理工具](#52-事件处理工具)
  - [5.3 通用工具函数](#53-通用工具函数)
- [六、API 设计详解](#六api-设计详解)
  - [6.1 安装方式](#61-安装方式)
  - [6.2 指令分组](#62-指令分组)
  - [6.3 组合式 API](#63-组合式-api)
- [七、构建与发布](#七构建与发布)
  - [7.1 构建配置详解](#71-构建配置详解)
  - [7.2 TypeScript 配置](#72-typescript-配置)
  - [7.3 发布脚本](#73-发布脚本)
- [八、测试策略详解](#八测试策略详解)
  - [8.1 Vitest 配置](#81-vitest-配置)
  - [8.2 测试工具函数](#82-测试工具函数)
  - [8.3 指令测试示例](#83-指令测试示例)
- [九、文档规划](#九文档规划)
  - [9.1 文档站点结构](#91-文档站点结构)
  - [9.2 VitePress 配置](#92-vitepress-配置)
- [十、开发计划与里程碑](#十开发计划与里程碑)
  - [10.1 详细开发计划](#101-详细开发计划)
  - [10.2 当前进度总览](#102-当前进度总览)
  - [10.3 当前版本亮点（v1.6.0）](#103-当前版本亮点v160)
  - [10.4 v1.5.0 新增指令](#104-v150-新增指令-已完成)
  - [10.5 v1.7.0 开发计划](#105-v170-开发计划---可视化配置工具-week-12)
  - [10.6 v1.8.0 开发计划](#106-v180-开发计划---测试覆盖性能优化与生态集成-week-13-14)
  - [10.7 v1.9.0 开发计划](#107-v190-开发计划---文档完善国际化与开发者体验-week-15-16)
  - [10.8 v1.10.0 开发计划](#108-v1100-开发计划---vue-3-优化移动端无障碍与安全-week-17-18)
  - [10.9 v1.11.0 开发计划](#109-v1110-开发计划---稳定性性能极限与企业级功能-week-19-20)
  - [10.10 v2.0.0 发布记录](#1010-v200-发布记录)
  - [10.11 版本规划](#1011-版本规划)
- [十一、质量保证](#十一质量保证)
  - [11.1 代码规范](#111-代码规范)
  - [11.2 提交规范](#112-提交规范)
  - [11.3 PR 检查清单](#113-pr-检查清单)
- [十二、后续展望](#十二后续展望)
  - [12.1 v2.1+ 规划](#121-v21-规划)
  - [12.2 社区建设](#122-社区建设)
- [附录](#附录)
  - [A. 常见问题解答](#a-常见问题解答)
  - [B. 技术栈总览](#b-技术栈总览)
  - [C. 版本发布记录](#c-版本发布记录)

---

## 一、项目概述

### 1.1 项目定位

**Directix** 是一个全面、易用、高性能的 Vue 自定义指令库，旨在为 Vue 开发者提供一站式指令解决方案。

### 1.2 核心价值主张

| 维度 | 目标 | 具体指标 |
|------|------|---------|
| **覆盖面** | 涵盖 40+ 常用指令 | 满足 95% 的指令使用场景 |
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
  execSync('git push origin master --tags')

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

#### 第二阶段：核心指令开发 (Week 2-3) ✅ 已完成

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-click-outside | 4h | P0 | - | ✅ 已完成 |
| v-copy | 4h | P0 | - | ✅ 已完成 |
| v-debounce | 4h | P0 | - | ✅ 已完成 |
| v-throttle | 4h | P0 | - | ✅ 已完成 |
| v-focus | 2h | P0 | - | ✅ 已完成 |
| v-lazy | 8h | P0 | IntersectionObserver | ✅ 已完成 |
| v-permission | 6h | P0 | - | ✅ 已完成 |
| v-long-press | 4h | P1 | - | ✅ 已完成 |
| v-hover | 4h | P1 | - | ✅ 已完成 |
| v-ripple | 6h | P1 | - | ✅ 已完成 |

**里程碑 M2：核心指令完成，可用性验证** ✅

#### 第三阶段：增强指令开发 (Week 4-5) ✅ 已完成

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-scroll | 6h | P1 | - | ✅ 已完成 |
| v-resize | 4h | P1 | ResizeObserver | ✅ 已完成 |
| v-intersect | 4h | P1 | IntersectionObserver | ✅ 已完成 |
| v-infinite-scroll | 6h | P1 | v-scroll, v-intersect | ✅ 已完成 |
| v-sticky | 4h | P1 | v-scroll | ✅ 已完成 |
| v-mask | 8h | P1 | - | ✅ 已完成 |
| v-sanitize | 4h | P2 | DOMPurify | ✅ 已完成 |
| v-loading | 4h | P2 | - | ✅ 已完成 |
| v-visible | 4h | P2 | - | ✅ 已完成 |
| v-mutation | 4h | P2 | MutationObserver | ✅ 已完成 |

**里程碑 M3：增强指令完成** ✅

#### 第四阶段：扩展指令开发 (Week 6) ✅ 已完成

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-tooltip | 8h | P2 | floating-ui | ✅ 已完成 |
| v-draggable | 8h | P2 | - | ✅ 已完成 |
| v-touch | 8h | P2 | - | ✅ 已完成 |
| v-image-preview | 6h | P3 | - | ✅ 已完成 |
| v-truncate | 2h | P3 | - | ✅ 已完成 |
| v-uppercase/lowercase | 2h | P3 | - | ✅ 已完成 |
| v-capitalcase | 2h | P3 | - | ✅ 已完成 |
| v-number | 4h | P3 | - | ✅ 已完成 |
| v-money | 4h | P3 | - | ✅ 已完成 |
| v-trim | 2h | P3 | - | ✅ 已完成 |

**里程碑 M4：全部指令开发完成** ✅

#### 第五阶段：优化与发布 (Week 7) ✅ 已完成

| 任务 | 工时 | 产出 | 状态 |
|------|------|------|------|
| 性能优化 | 8h | 体积优化、性能报告 | ✅ 已完成 |
| 文档完善 | 12h | 完整文档、示例 | ✅ 已完成 |
| 测试覆盖 | 8h | 测试覆盖率 > 80% | ⏳ 待开发 |
| 发布准备 | 4h | 发布脚本、NPM 发布 | ✅ 已完成 |

**里程碑 M5：v1.0 正式发布** ✅

#### 第六阶段：高价值指令扩展 (Week 8) ✅ 已完成

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-click-delay | 2h | P1 | - | ✅ 已完成 |
| v-hotkey | 6h | P1 | - | ✅ 已完成 |
| v-ellipsis | 2h | P2 | - | ✅ 已完成 |
| v-countdown | 4h | P2 | - | ✅ 已完成 |
| v-print | 4h | P2 | - | ✅ 已完成 |
| v-watermark | 6h | P2 | - | ✅ 已完成 |
| v-pull-refresh | 6h | P2 | - | ✅ 已完成 |
| v-swipe | 6h | P2 | - | ✅ 已完成 |
| v-virtual-list | 12h | P1 | - | ✅ 已完成 |

**里程碑 M6：v1.3.0 发布** ✅

#### 第七阶段：组合式 API 与生态完善 (Week 9) ✅ 已完成

| 任务 | 工时 | 产出 | 状态 |
|------|------|------|------|
| 组合式 API 开发 | 20h | 41 个 composables 与指令对应 | ✅ 已完成 |
| 组合式 API 单元测试 | 8h | composables 测试用例 | ✅ 已完成 |
| API 文档完善 | 8h | 所有指令和 composables 完整 API 文档 | ✅ 已完成 |
| 示例优化 | 6h | Vue2/Vue3 示例完善 | ✅ 已完成 |
| Demo 演示开发 | 12h | 所有指令和 composables 的交互式演示 | ✅ 已完成 |

**里程碑 M7：v1.4.0 发布** ✅

#### 第八阶段：v1.5.0 高价值指令扩展 (Week 10) ✅ 已完成

| 指令 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| v-click-wave | 4h | P2 | - | ✅ 已完成 |
| v-context-menu | 6h | P1 | - | ✅ 已完成 |
| v-fullscreen | 3h | P2 | - | ✅ 已完成 |
| v-skeleton | 4h | P3 | - | ✅ 已完成 |
| v-export | 8h | P2 | - | ✅ 已完成 |
| v-highlight | 4h | P3 | - | ✅ 已完成 |
| v-emoji | 2h | P3 | - | ✅ 已完成 |
| v-pan | 4h | P3 | - | ✅ 已完成 |
| v-pinch | 4h | P3 | - | ✅ 已完成 |
| v-rotate-gesture | 4h | P3 | - | ✅ 已完成 |
| v-blur | 3h | P3 | - | ✅ 已完成 |
| v-fade | 3h | P3 | - | ✅ 已完成 |
| v-parallax | 6h | P3 | - | ✅ 已完成 |
| v-lottie | 6h | P3 | - | ✅ 已完成 |
| v-typewriter | 4h | P3 | - | ✅ 已完成 |
| v-progress | 3h | P3 | - | ✅ 已完成 |
| v-counter | 4h | P3 | - | ✅ 已完成 |

**里程碑 M8：v1.5.0 发布** ✅

#### 第九阶段：v1.6.0 Nuxt 模块 (Week 11) ✅ 已完成

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| Nuxt 模块开发 | 8h | P1 | @nuxt/kit, @nuxt/schema | ✅ 已完成 |
| 运行时插件 | 4h | P1 | - | ✅ 已完成 |
| 自动导入 composables | 4h | P1 | - | ✅ 已完成 |
| 指令自动注册 | 2h | P1 | - | ✅ 已完成 |
| SSR 兼容性处理 | 2h | P1 | - | ✅ 已完成 |
| 类型定义 | 2h | P1 | - | ✅ 已完成 |
| 构建脚本 | 2h | P1 | esbuild | ✅ 已完成 |
| 文档更新 | 2h | P2 | - | ✅ 已完成 |

**里程碑 M9：v1.6.0 发布** ✅

#### 第十阶段：v1.7.0 可视化配置工具 (Week 12) ✅ 已完成

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| Playground 架构设计 | 4h | P0 | - | ✅ 已完成 |
| Vue SFC Playground 集成 | 4h | P0 | @vue/repl | ✅ 已完成 |
| 代码编辑器集成 | 4h | P0 | Monaco Editor | ✅ 已完成 |
| 实时预览面板 | 6h | P0 | - | ✅ 已完成 |
| 指令参数配置面板 | 8h | P0 | - | ✅ 已完成 |
| 参数可视化编辑器 | 6h | P1 | - | ✅ 已完成 |
| 配置预设模板 | 4h | P1 | - | ✅ 已完成 |
| Vue 2/3 代码生成 | 6h | P0 | - | ✅ 已完成 |
| 组合式 API 代码生成 | 4h | P0 | - | ✅ 已完成 |
| Nuxt 代码生成 | 2h | P1 | - | ✅ 已完成 |
| TypeScript 类型生成 | 4h | P1 | - | ✅ 已完成 |
| 文档站点嵌入 Playground | 4h | P0 | - | ✅ 已完成 |
| 指令文档页面配置器入口 | 2h | P1 | - | ✅ 已完成 |
| Playground 独立部署 | 2h | P1 | - | ✅ 已完成 |
| CDN 资源优化 | 2h | P2 | - | ✅ 已完成 |
| 响应式布局适配 | 2h | P2 | - | ✅ 已完成 |

**里程碑 M10：v1.7.0 发布** ✅ 已完成

---

### 10.2 当前进度总览

#### 已完成指令 (57/57) ✅ 全部完成

| 指令 | 功能描述 | SSR | 示例 | Composable | 版本 |
|------|---------|-----|------|------------|------|
| v-click-outside | 点击外部检测 | ❌ | ✅ | ✅ | v1.0.0 |
| v-copy | 复制到剪贴板 | ❌ | ✅ | ✅ | v1.0.0 |
| v-debounce | 防抖指令 | ✅ | ✅ | ✅ | v1.0.0 |
| v-throttle | 节流指令 | ✅ | ✅ | ✅ | v1.0.0 |
| v-focus | 自动聚焦 | ✅ | ✅ | ✅ | v1.0.0 |
| v-lazy | 图片懒加载 | ❌ | ✅ | ✅ | v1.0.0 |
| v-permission | 权限控制 | ✅ | ✅ | ✅ | v1.0.0 |
| v-long-press | 长按事件 | ❌ | ✅ | ✅ | v1.0.0 |
| v-hover | 悬停状态 | ❌ | ✅ | ✅ | v1.0.0 |
| v-ripple | 波纹效果 | ❌ | ✅ | ✅ | v1.0.0 |
| v-scroll | 滚动监听 | ❌ | ✅ | ✅ | v1.0.0 |
| v-resize | 尺寸监听 | ❌ | ✅ | ✅ | v1.0.0 |
| v-intersect | 交叉检测 | ❌ | ✅ | ✅ | v1.0.0 |
| v-infinite-scroll | 无限滚动 | ❌ | ✅ | ✅ | v1.0.0 |
| v-sticky | 粘性定位 | ❌ | ✅ | ✅ | v1.0.0 |
| v-mask | 输入掩码 | ❌ | ✅ | ✅ | v1.0.0 |
| v-sanitize | 安全过滤 | ✅ | ✅ | ✅ | v1.0.0 |
| v-loading | 加载状态 | ✅ | ✅ | ✅ | v1.0.0 |
| v-visible | 可见性控制 | ✅ | ✅ | ✅ | v1.0.0 |
| v-mutation | DOM 监听 | ❌ | ✅ | ✅ | v1.0.0 |
| v-truncate | 文本截断 | ✅ | ✅ | ✅ | v1.2.0 |
| v-uppercase | 大写转换 | ✅ | ✅ | ✅ | v1.2.0 |
| v-lowercase | 小写转换 | ✅ | ✅ | ✅ | v1.2.0 |
| v-capitalcase | 首字母大写 | ✅ | ✅ | ✅ | v1.2.0 |
| v-number | 数字格式化 | ✅ | ✅ | ✅ | v1.2.0 |
| v-money | 金额格式化 | ✅ | ✅ | ✅ | v1.2.0 |
| v-trim | 去空格 | ✅ | ✅ | ✅ | v1.2.0 |
| v-tooltip | 提示框 | ❌ | ✅ | ✅ | v1.2.0 |
| v-draggable | 拖拽 | ❌ | ✅ | ✅ | v1.2.0 |
| v-touch | 手势 | ❌ | ✅ | ✅ | v1.2.0 |
| v-image-preview | 图片预览 | ❌ | ✅ | ✅ | v1.2.0 |
| v-click-delay | 防重复点击 | ✅ | ✅ | ✅ | v1.3.0 |
| v-hotkey | 快捷键绑定 | ✅ | ✅ | ✅ | v1.3.0 |
| v-ellipsis | 多行文本省略 | ✅ | ✅ | ✅ | v1.3.0 |
| v-countdown | 倒计时显示 | ✅ | ✅ | ✅ | v1.3.0 |
| v-print | 打印指定区域 | ❌ | ✅ | ✅ | v1.3.0 |
| v-watermark | 添加水印 | ❌ | ✅ | ✅ | v1.3.0 |
| v-pull-refresh | 下拉刷新 | ❌ | ✅ | ✅ | v1.3.0 |
| v-swipe | 滑动切换 | ❌ | ✅ | ✅ | v1.3.0 |
| v-virtual-list | 虚拟列表 | ❌ | ✅ | ✅ | v1.3.0 |
| v-click-wave | 点击波纹效果 | ❌ | ✅ | ✅ | v1.5.0 |
| v-context-menu | 右键菜单 | ❌ | ✅ | ✅ | v1.5.0 |
| v-fullscreen | 全屏切换 | ❌ | ✅ | ✅ | v1.5.0 |
| v-skeleton | 骨架屏 | ✅ | ✅ | ✅ | v1.5.0 |
| v-export | 数据导出 | ❌ | ✅ | ✅ | v1.5.0 |
| v-highlight | 关键词高亮 | ✅ | ✅ | ✅ | v1.5.0 |
| v-emoji | Emoji过滤 | ❌ | ✅ | ✅ | v1.5.0 |
| v-pan | 平移手势 | ❌ | ✅ | ✅ | v1.5.0 |
| v-pinch | 缩放手势 | ❌ | ✅ | ✅ | v1.5.0 |
| v-rotate-gesture | 旋转手势 | ❌ | ✅ | ✅ | v1.5.0 |
| v-blur | 背景模糊遮罩 | ❌ | ✅ | ✅ | v1.5.0 |
| v-fade | 淡入淡出过渡 | ✅ | ✅ | ✅ | v1.5.0 |
| v-parallax | 视差滚动效果 | ❌ | ✅ | ✅ | v1.5.0 |
| v-lottie | Lottie动画 | ❌ | ✅ | ✅ | v1.5.0 |
| v-typewriter | 打字机效果 | ✅ | ✅ | ✅ | v1.5.0 |
| v-progress | 进度条动画 | ❌ | ✅ | ✅ | v1.5.0 |
| v-counter | 数字滚动动画 | ✅ | ✅ | ✅ | v1.5.0 |

#### 已完成 Composables (57/57) ✅ v1.5.0 完成

所有 57 个指令均已提供对应的组合式 API，详见 [10.3 当前版本亮点](#103-当前版本亮点v150)

#### v1.2.0 新增指令 ✅ 已完成

| 指令 | 功能描述 | SSR | 状态 |
|------|---------|-----|------|
| v-truncate | 文本截断 | ✅ | ✅ |
| v-uppercase | 大写转换 | ✅ | ✅ |
| v-lowercase | 小写转换 | ✅ | ✅ |
| v-capitalcase | 首字母大写 | ✅ | ✅ |
| v-number | 数字格式化 | ✅ | ✅ |
| v-money | 金额格式化 | ✅ | ✅ |
| v-trim | 去空格 | ✅ | ✅ |
| v-tooltip | 提示框 | ❌ | ✅ |
| v-draggable | 拖拽 | ❌ | ✅ |
| v-touch | 手势 | ❌ | ✅ |
| v-image-preview | 图片预览 | ❌ | ✅ |

#### v1.3.0 新增指令 ✅ 已完成

| 指令 | 功能描述 | SSR | 状态 |
|------|---------|-----|------|
| v-click-delay | 防重复点击，在指定时间内禁止重复触发 | ✅ | ✅ |
| v-hotkey | 快捷键绑定，如 `v-hotkey.ctrl.s="save"` | ✅ | ✅ |
| v-ellipsis | 多行文本省略，支持指定行数 | ✅ | ✅ |
| v-countdown | 倒计时显示 | ✅ | ✅ |
| v-print | 打印指定区域内容 | ❌ | ✅ |
| v-watermark | 添加水印 | ❌ | ✅ |
| v-pull-refresh | 下拉刷新 | ❌ | ✅ |
| v-swipe | 滑动切换（轮播/Tab场景） | ❌ | ✅ |
| v-virtual-list | 虚拟列表优化 | ❌ | ✅ |

#### 开发中

暂无

#### v1.5.0 新增指令 ✅ 已完成

| 指令 | 功能描述 | SSR | 状态 |
|------|---------|-----|------|
| v-click-wave | 点击波纹效果（v-ripple 的简化版） | ❌ | ✅ |
| v-context-menu | 右键菜单 | ❌ | ✅ |
| v-fullscreen | 全屏切换 | ❌ | ✅ |
| v-skeleton | 骨架屏 | ✅ | ✅ |
| v-export | 导出数据（CSV/JSON/HTML/TXT） | ❌ | ✅ |
| v-highlight | 关键词高亮 | ✅ | ✅ |
| v-emoji | 限制/过滤 emoji 输入 | ❌ | ✅ |
| v-pan | 平移手势 | ❌ | ✅ |
| v-pinch | 缩放手势 | ❌ | ✅ |
| v-rotate-gesture | 旋转手势 | ❌ | ✅ |
| v-blur | 背景模糊遮罩 | ❌ | ✅ |
| v-fade | 淡入淡出过渡 | ✅ | ✅ |
| v-parallax | 视差滚动效果 | ❌ | ✅ |
| v-lottie | Lottie 动画播放 | ❌ | ✅ |
| v-typewriter | 打字机效果 | ✅ | ✅ |
| v-progress | 进度条动画 | ❌ | ✅ |
| v-counter | 数字滚动动画 | ✅ | ✅ |

### 10.3 当前版本亮点（v1.6.0）

#### 🚀 Nuxt 3 模块

官方 Nuxt 3 模块，提供无缝集成体验：

**核心功能：**
- ✅ 自动注册所有指令为 Vue directives
- ✅ 自动导入所有 composables
- ✅ 支持 include/exclude 选择性加载
- ✅ 支持指令默认配置
- ✅ SSR 兼容性自动处理

**配置示例：**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  directix: {
    enabled: true,
    include: ['v-click-outside', 'v-copy', 'v-debounce'],
    exclude: ['v-ripple'],
    directiveOptions: {
      'v-permission': {
        config: { getPermissions: () => ['read', 'write'] }
      }
    },
    autoImportComposables: true
  }
})
```

**使用示例：**
```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">Copy</button>
  </div>
</template>

<script setup>
// Composables 自动导入，无需手动 import
const { copy, copied } = useCopy({ source: text })
</script>
```

#### ✨ 组合式 API 完成

所有 57 个指令都已提供对应的组合式 API (composables)，提供更灵活的使用方式：

| Composable | 对应指令 | 功能描述 |
|------------|---------|---------|
| useClickOutside | v-click-outside | 点击外部检测 |
| useCopy | v-copy | 复制到剪贴板 |
| useDebounce | v-debounce | 防抖处理 |
| useThrottle | v-throttle | 节流处理 |
| useFocus | v-focus | 自动聚焦 |
| useLazy | v-lazy | 图片懒加载 |
| usePermission | v-permission | 权限控制 |
| useLongPress | v-long-press | 长按事件 |
| useHover | v-hover | 悬停状态 |
| useRipple | v-ripple | 波纹效果 |
| useScroll | v-scroll | 滚动监听 |
| useResize | v-resize | 尺寸监听 |
| useIntersect | v-intersect | 交叉检测 |
| useInfiniteScroll | v-infinite-scroll | 无限滚动 |
| useSticky | v-sticky | 粘性定位 |
| useMask | v-mask | 输入掩码 |
| useSanitize | v-sanitize | 安全过滤 |
| useLoading | v-loading | 加载状态 |
| useVisible | v-visible | 可见性控制 |
| useMutation | v-mutation | DOM 监听 |
| useTruncate | v-truncate | 文本截断 |
| useUppercase | v-uppercase | 大写转换 |
| useLowercase | v-lowercase | 小写转换 |
| useCapitalcase | v-capitalcase | 首字母大写 |
| useNumber | v-number | 数字格式化 |
| useMoney | v-money | 金额格式化 |
| useTrim | v-trim | 去空格 |
| useTooltip | v-tooltip | 提示框 |
| useDraggable | v-draggable | 拖拽 |
| useTouch | v-touch | 手势 |
| useImagePreview | v-image-preview | 图片预览 |
| useClickDelay | v-click-delay | 防重复点击 |
| useHotkey | v-hotkey | 快捷键绑定 |
| useEllipsis | v-ellipsis | 多行文本省略 |
| useCountdown | v-countdown | 倒计时显示 |
| usePrint | v-print | 打印指定区域 |
| useWatermark | v-watermark | 添加水印 |
| usePullRefresh | v-pull-refresh | 下拉刷新 |
| useSwipe | v-swipe | 滑动切换 |
| useVirtualList | v-virtual-list | 虚拟列表 |
| useClickWave | v-click-wave | 点击波纹效果 |
| useContextMenu | v-context-menu | 右键菜单 |
| useFullscreen | v-fullscreen | 全屏切换 |
| useSkeleton | v-skeleton | 骨架屏 |
| useExport | v-export | 导出数据 |
| useHighlight | v-highlight | 关键词高亮 |
| useEmoji | v-emoji | Emoji 过滤 |
| usePan | v-pan | 平移手势 |
| usePinch | v-pinch | 缩放手势 |
| useRotateGesture | v-rotate-gesture | 旋转手势 |
| useBlur | v-blur | 背景模糊遮罩 |
| useFade | v-fade | 淡入淡出过渡 |
| useParallax | v-parallax | 视差滚动效果 |
| useLottie | v-lottie | Lottie 动画播放 |
| useTypewriter | v-typewriter | 打字机效果 |
| useProgress | v-progress | 进度条动画 |
| useCounter | v-counter | 数字滚动动画 |

#### 📚 文档完善

- ✅ 所有 57 个指令的完整 API 文档
- ✅ 所有 57 个 composables 的使用文档
- ✅ 每个指令和 composable 都有交互式 Demo
- ✅ Vue 2 和 Vue 3 示例项目

### 10.4 v1.5.0 新增指令 ✅ 已完成

共新增 17 个指令，所有指令均已包含对应的 composable：

#### 🎯 高价值指令 (3个)
- v-click-wave - 点击波纹效果
- v-context-menu - 右键菜单
- v-fullscreen - 全屏切换

#### 🔧 实用工具指令 (3个)
- v-skeleton - 骨架屏
- v-export - 导出数据（CSV/JSON/HTML/TXT）
- v-highlight - 关键词高亮

#### 📱 移动端专用 (4个)
- v-emoji - 限制/过滤 emoji 输入
- v-pan - 平移手势
- v-pinch - 缩放手势
- v-rotate-gesture - 旋转手势

#### 🎨 视觉增强 (5个)
- v-blur - 背景模糊遮罩
- v-fade - 淡入淡出过渡
- v-parallax - 视差滚动效果
- v-lottie - Lottie 动画播放
- v-typewriter - 打字机效果

#### 📊 数据可视化 (2个)
- v-progress - 进度条动画
- v-counter - 数字滚动动画

### 10.5 v1.7.0 开发计划 - 可视化配置工具 (Week 12)

#### 核心目标

开发在线指令配置器，帮助用户快速配置指令参数、实时预览效果并生成可用的代码片段。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **配置器基础设施** | | | | |
| Playground 架构设计 | 4h | P0 | - | ✅ 已完成 |
| Vue SFC Playground 集成 | 4h | P0 | @vue/repl | ✅ 已完成 |
| 代码编辑器集成 (Monaco/CodeMirror) | 4h | P0 | - | ✅ 已完成 |
| 实时预览面板 | 6h | P0 | - | ✅ 已完成 |
| **指令配置器** | | | | |
| 指令参数配置面板 | 8h | P0 | - | ✅ 已完成 |
| 参数可视化编辑器 | 6h | P1 | - | ✅ 已完成 |
| 配置预设模板 | 4h | P1 | - | ✅ 已完成 |
| **代码生成器** | | | | |
| Vue 2/3 代码生成 | 6h | P0 | - | ✅ 已完成 |
| 组合式 API 代码生成 | 4h | P0 | - | ✅ 已完成 |
| Nuxt 代码生成 | 2h | P1 | - | ✅ 已完成 |
| TypeScript 类型生成 | 4h | P1 | - | ✅ 已完成 |
| **文档集成** | | | | |
| 文档站点嵌入 Playground | 4h | P0 | - | ✅ 已完成 |
| 指令文档页面配置器入口 | 2h | P1 | - | ✅ 已完成 |
| **部署与优化** | | | | |
| Playground 独立部署 | 2h | P1 | - | ✅ 已完成 |
| CDN 资源优化 | 2h | P2 | - | ✅ 已完成 |
| 响应式布局适配 | 2h | P2 | - | ✅ 已完成 |

**里程碑 M10：v1.7.0 发布** ✅ 已完成

#### 功能详解

##### 1. 在线 Playground

**核心功能：**
- 基于 `@vue/repl` 构建实时编辑环境
- 支持选择 Vue 2 或 Vue 3 环境
- 自动导入 Directix 指令和 composables
- 支持保存和分享代码片段

**用户流程：**
```
选择指令 → 配置参数 → 实时预览 → 生成代码 → 复制/下载
```

##### 2. 指令配置器

**配置面板功能：**
- 参数类型智能识别（字符串、数字、布尔、对象、数组、函数）
- 可视化表单控件（滑块、颜色选择器、开关、下拉选择）
- 参数验证和提示
- 常用配置预设

**示例配置面板：**
```vue
<template>
  <!-- v-debounce 配置器示例 -->
  <DirectiveConfig directive="debounce">
    <ParamField name="wait" type="number" :min="0" :max="5000" :default="300" />
    <ParamField name="leading" type="boolean" :default="false" />
    <ParamField name="trailing" type="boolean" :default="true" />
  </DirectiveConfig>
</template>
```

##### 3. 代码生成器

**生成内容：**
- Vue 2/3 模板语法代码
- 组合式 API 使用代码
- TypeScript 类型定义
- Nuxt 模块配置代码

**输出格式示例：**
```vue
<!-- 生成的 Vue 3 代码 -->
<template>
  <input v-debounce="{ handler: handleInput, wait: 300 }" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')

function handleInput(event: Event) {
  console.log('搜索:', (event.target as HTMLInputElement).value)
}
</script>
```

```typescript
// 生成的组合式 API 代码
import { useDebounce } from 'directix'

const { run: debouncedSearch, cancel } = useDebounce({
  handler: (query: string) => {
    console.log('搜索:', query)
  },
  wait: 300
})
```

#### 技术方案

##### Playground 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Directix Playground                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  配置面板     │  │  代码编辑器   │  │    预览面板      │  │
│  │              │  │              │  │                  │  │
│  │ - 指令选择   │  │ - Vue SFC    │  │ - 实时渲染      │  │
│  │ - 参数配置   │  │ - 语法高亮   │  │ - 交互测试      │  │
│  │ - 预设模板   │  │ - 自动补全   │  │ - 状态查看      │  │
│  │              │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    代码输出区                           │ │
│  │  [Vue 2] [Vue 3] [Composable] [TypeScript] [Nuxt]      │ │
│  │  ┌────────────────────────────────────────────────────┐│ │
│  │  │  生成的代码...                                      ││ │
│  │  └────────────────────────────────────────────────────┘│ │
│  │  [复制代码] [下载文件] [分享链接]                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

##### 依赖技术栈

| 功能 | 技术选型 | 说明 |
|------|---------|------|
| Playground 核心 | @vue/repl | Vue 官方在线编译器 |
| 代码编辑器 | Monaco Editor | VS Code 同款编辑器 |
| 语法高亮 | Shiki | 高性能语法高亮 |
| 代码格式化 | Prettier | 代码美化 |
| 剪贴板 | Clipboard API | 复制功能 |
| 文件下载 | FileSaver.js | 下载功能 |

#### 文件结构

```
docs/
├── .vitepress/
│   └── theme/
│       └── components/
│           ├── Playground.vue          # Playground 主组件
│           ├── ConfigPanel.vue         # 配置面板
│           ├── CodeEditor.vue          # 代码编辑器
│           ├── PreviewPanel.vue        # 预览面板
│           ├── CodeOutput.vue          # 代码输出区
│           └── presets/                # 预设模板
│               ├── debounce.ts
│               ├── throttle.ts
│               ├── click-outside.ts
│               └── ...
│
├── playground/                         # Playground 独立页面
│   ├── index.md                        # Playground 入口
│   └── directive/                      # 指令配置页
│       ├── click-outside.md
│       ├── debounce.md
│       └── ...
│
└── api/
    └── config-generator.md             # 配置生成器 API 文档
```

### 10.6 v1.8.0 开发计划 - 测试覆盖、性能优化与生态集成 (Week 13-14)

#### 核心目标

全面提升项目质量、性能表现和开发体验，构建完善的生态系统。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **测试覆盖率提升** | | | | |
| 单元测试框架优化 | 4h | P0 | Vitest | 📋 待开发 |
| 核心指令测试用例完善 | 16h | P0 | - | 📋 待开发 |
| Composables 测试用例完善 | 12h | P0 | - | 📋 待开发 |
| 测试覆盖率达到 90%+ | 8h | P0 | - | 📋 待开发 |
| E2E 测试框架搭建 | 6h | P1 | Playwright | 📋 待开发 |
| E2E 测试用例编写 | 8h | P1 | - | 📋 待开发 |
| CI/CD 自动化测试集成 | 4h | P0 | GitHub Actions | 📋 待开发 |
| **性能优化** | | | | |
| 打包体积分析与优化 | 6h | P0 | rollup-plugin-visualizer | 📋 待开发 |
| Tree-shaking 优化 | 4h | P0 | - | 📋 待开发 |
| 运行时性能基准测试 | 4h | P1 | - | 📋 待开发 |
| 核心指令性能优化 | 8h | P1 | - | 📋 待开发 |
| 懒加载与按需加载优化 | 4h | P2 | - | 📋 待开发 |
| Bundle 大小监控 CI | 2h | P1 | - | 📋 待开发 |
| **VS Code 插件** | | | | |
| 插件架构设计 | 4h | P0 | - | 📋 待开发 |
| 指令自动补全 | 8h | P0 | - | 📋 待开发 |
| 指令悬浮提示 | 6h | P0 | - | 📋 待开发 |
| 指令文档跳转 | 4h | P1 | - | 📋 待开发 |
| 代码片段 (Snippets) | 4h | P1 | - | 📋 待开发 |
| 插件发布 | 2h | P0 | - | 📋 待开发 |
| **CLI 工具** | | | | |
| CLI 架构设计 | 4h | P0 | - | 📋 待开发 |
| 指令快速创建命令 | 6h | P0 | - | 📋 待开发 |
| 项目初始化模板 | 4h | P1 | - | 📋 待开发 |
| 配置迁移工具 | 4h | P2 | - | 📋 待开发 |

**里程碑 M11：v1.8.0 发布** ✅ 已完成

#### 功能详解

##### 1. 测试覆盖率提升

**目标：**
- 单元测试覆盖率 ≥ 90%
- E2E 测试覆盖核心场景
- CI/CD 自动化测试

**测试框架：**
```typescript
// vitest.config.ts 优化
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        'docs/**',
        'examples/**',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
})
```

**测试分类：**
| 类型 | 覆盖范围 | 工具 |
|------|---------|------|
| 单元测试 | 指令、Composables、工具函数 | Vitest |
| 集成测试 | Vue 2/3 兼容性 | Vitest + @vue/test-utils |
| E2E 测试 | 用户交互场景 | Playwright |

##### 2. 性能优化

**打包体积目标：**
- 单指令 ≤ 1.5KB gzip
- 全量包 ≤ 30KB gzip

**优化措施：**
```
┌─────────────────────────────────────────────────────────────┐
│                    性能优化策略                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  打包优化                    运行时优化                      │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ - 代码分割      │        │ - 延迟初始化    │            │
│  │ - Tree-shaking  │        │ - 事件委托      │            │
│  │ - 压缩优化      │        │ - 防抖节流优化  │            │
│  │ - 依赖精简      │        │ - 内存管理      │            │
│  └─────────────────┘        └─────────────────┘            │
│                                                              │
│  监控                        基准测试                        │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ - Bundle 大小   │        │ - 性能基准      │            │
│  │ - CI 阈值检查   │        │ - 对比分析      │            │
│  │ - 变更报告      │        │ - 回归检测      │            │
│  └─────────────────┘        └─────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**性能基准测试：**
```typescript
// tests/benchmark/index.ts
import { Bench } from 'tinybench'

const bench = new Bench({ time: 1000 })

bench
  .add('v-debounce (1000 calls)', () => {
    // 性能测试代码
  })
  .add('v-throttle (1000 calls)', () => {
    // 性能测试代码
  })

await bench.run()
console.table(bench.table())
```

##### 3. VS Code 插件

**插件功能：**

| 功能 | 描述 |
|------|------|
| 自动补全 | 输入 `v-` 自动提示所有可用指令 |
| 悬浮提示 | 鼠标悬浮显示指令用法和参数 |
| 文档跳转 | 点击指令跳转到官方文档 |
| 代码片段 | 快速插入指令模板代码 |
| 参数提示 | 指令参数类型提示 |

**补全示例：**
```vue
<template>
  <!-- 输入 v-de 自动补全 -->
  <input v-debounce="handleInput" />
  
  <!-- 悬浮提示 -->
  <!-- 
    v-debounce
    防抖指令，延迟执行事件处理函数
    
    @param handler - 事件处理函数
    @param wait - 延迟时间 (ms)，默认 300
    @param leading - 是否在延迟开始前调用
    @param trailing - 是否在延迟结束后调用
    
    示例: v-debounce="{ handler: fn, wait: 500 }"
  -->
</template>
```

**代码片段：**
```json
{
  "Directix Debounce": {
    "prefix": "vdebounce",
    "body": [
      "v-debounce=\"{ handler: ${1:handleInput}, wait: ${2:300} }\""
    ],
    "description": "Debounce directive with options"
  }
}
```

##### 4. CLI 工具

**命令列表：**

```bash
# 创建新指令
directix create directive v-my-directive

# 创建新 composable
directix create composable useMyFeature

# 初始化项目模板
directix init my-project --template vue3

# 检查依赖和配置
directix doctor

# 迁移配置
directix migrate --from vueuse
```

**CLI 架构：**
```
directix-cli/
├── src/
│   ├── commands/
│   │   ├── create.ts        # 创建命令
│   │   ├── init.ts          # 初始化命令
│   │   ├── doctor.ts        # 诊断命令
│   │   └── migrate.ts       # 迁移命令
│   ├── templates/
│   │   ├── directive.ts     # 指令模板
│   │   ├── composable.ts    # Composable 模板
│   │   └── project/         # 项目模板
│   └── index.ts
├── package.json
└── README.md
```

**创建指令模板：**
```typescript
// templates/directive.ts
export const directiveTemplate = (name: string) => `
import { defineDirective } from 'directix'

export const ${name} = defineDirective({
  name: '${name}',
  ssr: false,

  mounted(el, binding) {
    // 实现逻辑
  },

  updated(el, binding) {
    // 更新逻辑
  },

  unmounted(el) {
    // 清理逻辑
  },
})

export default ${name}
`
```

#### 技术栈

| 功能 | 技术选型 | 说明 |
|------|---------|------|
| 单元测试 | Vitest | Vite 原生测试框架 |
| E2E 测试 | Playwright | 跨浏览器测试 |
| 覆盖率 | v8 coverage | 代码覆盖率工具 |
| 性能测试 | tinybench | 基准测试库 |
| VS Code 插件 | vscode-extension-api | 官方插件 API |
| CLI 框架 | cac / commander | 命令行框架 |
| 模板引擎 | handlebars | 代码模板生成 |

### 10.7 v1.9.0 开发计划 - 文档完善、国际化与开发者体验 (Week 15-16)

#### 核心目标

全面提升文档质量、国际化支持和开发者体验，构建活跃的开源社区。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **文档与示例完善** | | | | |
| 交互式文档升级 | 8h | P0 | - | ✅ 已完成 |
| 实际场景示例（10+案例） | 12h | P0 | - | ✅ 已完成 |
| 最佳实践指南 | 6h | P1 | - | ✅ 已完成 |
| 视频教程制作 | 16h | P2 | - | ✅ 已完成 |
| API 文档自动生成 | 4h | P1 | TypeDoc | ✅ 已完成 |
| **国际化与本地化** | | | | |
| i18n 架构设计 | 4h | P0 | - | ✅ 已完成 |
| 英文文档完善 | 8h | P0 | - | ✅ 已完成 |
| 中文文档完善 | 8h | P0 | - | ✅ 已完成 |
| 日文文档支持 | 6h | P2 | - | ✅ 已完成 |
| 时区/地区适配 | 4h | P2 | - | ✅ 已完成 |
| **开发者体验提升** | | | | |
| 错误提示优化 | 6h | P0 | - | ✅ 已完成 |
| 调试工具集成 | 8h | P1 | Vue DevTools | ✅ 已完成 |
| 性能监控面板 | 8h | P2 | - | ✅ 已完成 |
| 开发者控制台 | 4h | P2 | - | 📋 待开发 |
| 警告信息分级 | 4h | P1 | - | ✅ 已完成 |
| **社区功能** | | | | |
| 插件系统设计 | 8h | P0 | - | ✅ 已完成 |
| 插件 API 开发 | 12h | P0 | - | ✅ 已完成 |
| 自定义指令模板系统 | 6h | P1 | - | ✅ 已完成 |
| 贡献指南完善 | 4h | P1 | - | ✅ 已完成 |
| Issue/PR 模板优化 | 2h | P1 | - | ✅ 已完成 |
| 社区插件仓库 | 4h | P2 | - | ✅ 已完成 |

**里程碑 M12：v1.9.0 发布** ✅ 已完成

#### 功能详解

##### 1. 文档与示例完善

**交互式文档升级：**
```
┌─────────────────────────────────────────────────────────────┐
│                    交互式文档架构                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  在线演示区     │  │  代码编辑区     │                  │
│  │                 │  │                 │                  │
│  │ - 实时预览     │  │ - 语法高亮     │                  │
│  │ - 交互测试     │  │ - 即时编辑     │                  │
│  │ - 状态展示     │  │ - 错误提示     │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  实际场景示例                                         │   │
│  │  - 表单验证场景                                       │   │
│  │  - 权限管理场景                                       │   │
│  │  - 数据展示场景                                       │   │
│  │  - 移动端交互场景                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**实际场景示例：**

| 场景 | 涉及指令 | 描述 |
|------|---------|------|
| 表单验证系统 | v-debounce, v-mask, v-trim, v-focus | 完整表单验证方案 |
| 权限管理 | v-permission, v-click-outside | RBAC 权限控制 |
| 图片画廊 | v-lazy, v-image-preview, v-swipe | 响应式图片展示 |
| 无限滚动列表 | v-infinite-scroll, v-virtual-list, v-loading | 大数据列表优化 |
| 富文本编辑器 | v-sanitize, v-highlight, v-emoji | 内容编辑与过滤 |
| 手势交互 | v-touch, v-swipe, v-pan, v-pinch | 移动端手势操作 |
| 数据可视化 | v-progress, v-counter, v-countdown | 数据展示动画 |
| 拖拽排序 | v-draggable, v-intersect | 列表拖拽排序 |
| 打印导出 | v-print, v-export | 文档处理 |
| 全屏媒体 | v-fullscreen, v-lottie, v-video | 媒体播放控制 |

**最佳实践指南：**
- 性能优化建议
- SSR 兼容性指南
- Vue 2/3 差异处理
- 常见问题解决方案
- 安全最佳实践

##### 2. 国际化与本地化

**i18n 架构：**
```typescript
// i18n 配置
import { createI18n } from 'directix/i18n'

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': {
      directives: {
        debounce: {
          description: '防抖指令',
          param_wait: '延迟时间（毫秒）',
          param_leading: '是否在延迟开始前调用',
          // ...
        }
      },
      errors: {
        invalid_param: '参数 {param} 无效',
        // ...
      }
    },
    'en-US': {
      // 英文翻译
    },
    'ja-JP': {
      // 日文翻译
    }
  }
})
```

**多语言文档支持：**
```
docs/
├── en/                    # 英文文档
│   ├── guide/
│   ├── directives/
│   └── api/
├── zh-CN/                 # 中文文档
│   ├── guide/
│   ├── directives/
│   └── api/
└── ja/                    # 日文文档
    ├── guide/
    ├── directives/
    └── api/
```

##### 3. 开发者体验提升

**错误提示优化：**
```typescript
// 优化前
console.warn('[Directix] Invalid parameter')

// 优化后
console.warn(`[Directix] v-debounce: Invalid "wait" parameter.
  Expected: number (positive integer)
  Received: ${typeof wait} (${wait})
  
  Example:
    v-debounce="{ handler: fn, wait: 300 }"
    v-debounce:500ms="fn"
  
  See: https://directix.dev/docs/debounce#wait
`)
```

**调试工具集成：**
```typescript
// Vue DevTools 集成
export const DirectixDevTools = {
  // 指令状态检查
  inspectDirective(el: Element, directiveName: string) {
    return {
      name: directiveName,
      value: el.__directix_binding?.value,
      state: el.__directix_state,
      performance: el.__directix_perf,
    }
  },

  // 性能监控
  getPerformanceMetrics() {
    return {
      mountTime: {},
      updateTime: {},
      memoryUsage: {},
    }
  },

  // 指令列表
  getActiveDirectives() {
    return Array.from(document.querySelectorAll('[data-directix]'))
  }
}
```

**性能监控面板：**
```
┌─────────────────────────────────────────────────────────────┐
│              Directix Performance Monitor                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Active Directives: 12                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Directive    │ Mount │ Update │ Memory │ Status    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ v-debounce   │ 2ms   │ 0.1ms  │ 1.2KB  │ ✅ Active │   │
│  │ v-lazy       │ 5ms   │ -      │ 0.8KB  │ ✅ Active │   │
│  │ v-scroll     │ 1ms   │ 0.5ms  │ 0.5KB  │ ✅ Active │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Total Bundle: 15.2KB | Tree-shaken: 8.3KB                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

##### 4. 社区功能

**插件系统：**
```typescript
// 插件定义
interface DirectixPlugin {
  name: string
  version: string
  directives?: Record<string, DirectiveDefinition>
  composables?: Record<string, ComposableDefinition>
  install?(context: PluginContext): void
}

// 插件注册
import { usePlugin } from 'directix'

usePlugin({
  name: 'directix-charts',
  version: '1.0.0',
  directives: {
    'chart': vChart,
    'graph': vGraph,
  },
  composables: {
    useChart,
    useGraph,
  },
  install(context) {
    context.registerTheme('dark', darkTheme)
    context.addPresets(chartPresets)
  }
})
```

**自定义指令模板：**
```typescript
// templates/custom-directive.ts
export const customDirectiveTemplate = {
  name: 'custom-directive',
  description: 'Custom directive template',
  options: [
    { name: 'ssr', type: 'boolean', default: false },
    { name: 'lifecycle', type: 'select', options: ['mounted', 'created'] },
  ],
  generate(options) {
    return `
import { defineDirective } from 'directix'

export const vCustomDirective = defineDirective({
  name: 'custom-directive',
  ssr: ${options.ssr},

  mounted(el, binding) {
    // Your implementation
  },

  updated(el, binding) {
    // Update logic
  },

  unmounted(el) {
    // Cleanup
  },
})
`
  }
}
```

**贡献指南完善：**
- 开发环境搭建指南
- 代码风格规范
- PR 提交流程
- 测试要求
- 文档贡献指南

#### 技术栈

| 功能 | 技术选型 | 说明 |
|------|---------|------|
| 国际化 | vue-i18n / intl-messageformat | i18n 解决方案 |
| 文档生成 | TypeDoc | API 文档自动生成 |
| 调试工具 | Vue DevTools API | 开发者工具集成 |
| 视频托管 | YouTube / Bilibili | 教程视频平台 |
| 插件系统 | 事件驱动架构 | 插件生命周期管理 |

### 10.8 v1.10.0 开发计划 - Vue 3 优化、移动端、无障碍与安全 (Week 17-18)

#### 核心目标

作为功能增强版本，提前预览 Vue 3 专属优化特性，同时提升移动端体验、无障碍访问和安全性。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **Vue 3 专属优化预览** | | | | |
| Composition API 深度优化 | 8h | P0 | - | ✅ 已完成 |
| Vue 3 响应式系统优化 | 6h | P0 | - | ✅ 已完成 |
| Suspense 支持增强 | 4h | P1 | - | ✅ 已完成 |
| Teleport 指令增强 | 4h | P1 | - | ✅ 已完成 |
| Vue 3 专属 API 利用 | 6h | P1 | - | ✅ 已完成 |
| **移动端优化** | | | | |
| 触摸手势优化 | 8h | P0 | - | ✅ 已完成 |
| 移动端性能优化 | 6h | P0 | - | ✅ 已完成 |
| PWA 支持集成 | 6h | P1 | - | ✅ 已完成 |
| 手势库扩展 | 8h | P1 | - | ✅ 已完成 |
| 触摸反馈优化 | 4h | P2 | - | ✅ 已完成 |
| **无障碍访问 (A11y)** | | | | |
| ARIA 属性支持 | 8h | P0 | - | ✅ 已完成 |
| 键盘导航增强 | 6h | P0 | - | ✅ 已完成 |
| 屏幕阅读器兼容 | 6h | P1 | - | ✅ 已完成 |
| 无障碍最佳实践文档 | 4h | P1 | - | ✅ 已完成 |
| 自动 ARIA 生成 | 4h | P2 | - | ✅ 已完成 |
| **安全增强** | | | | |
| XSS 防护增强 | 6h | P0 | - | ✅ 已完成 |
| CSP 兼容性优化 | 4h | P0 | - | ✅ 已完成 |
| 安全审计工具 | 4h | P1 | - | ✅ 已完成 |
| 依赖漏洞扫描 | 2h | P1 | - | ✅ 已完成 |
| 安全最佳实践文档 | 2h | P1 | - | ✅ 已完成 |

**里程碑 M13：v1.10.0 发布** ✅ 已完成

#### 功能详解

##### 1. Vue 3 专属优化预览

**Composition API 深度优化：**
```typescript
// Vue 3 专属优化示例
import { watchEffect, computed, shallowRef } from 'vue'

// 使用 shallowRef 优化大对象性能
export function useLazyOptimized(options: LazyOptions) {
  const state = shallowRef({
    loading: false,
    loaded: false,
    error: null,
  })

  // 使用 watchEffect 自动追踪依赖
  watchEffect((onCleanup) => {
    const observer = new IntersectionObserver(/* ... */)
    onCleanup(() => observer.disconnect())
  })

  return {
    state: computed(() => state.value),
    // ...
  }
}
```

**Vue 3 响应式系统优化：**
```typescript
// 响应式优化
import { reactive, readonly, markRaw, toRaw } from 'vue'

// 使用 markRaw 标记不需要响应式的对象
export function useDirectiveInstance(el: HTMLElement) {
  const element = markRaw(el) // DOM 元素不需要响应式

  // 使用 reactive 创建响应式状态
  const state = reactive({
    bindings: {},
    modifiers: {},
  })

  return {
    element,
    state: readonly(state),
  }
}
```

**Suspense 支持增强：**
```vue
<template>
  <Suspense>
    <template #default>
      <LazyComponent v-lazy="imageUrl" />
    </template>
    <template #fallback>
      <div v-loading="true">Loading...</div>
    </template>
  </Suspense>
</template>
```

**Teleport 指令增强：**
```vue
<template>
  <!-- 指令内容可传送到任意位置 -->
  <div v-tooltip="{ content: '提示', teleport: 'body' }">
    悬停我
  </div>

  <!-- 支持 Teleport 目标选择器 -->
  <div v-context-menu="{ menu, teleport: '#menu-container' }">
    右键菜单
  </div>
</template>
```

##### 2. 移动端优化

**触摸手势优化：**
```typescript
// 增强的触摸手势支持
export interface TouchGestureOptions {
  // 手势识别阈值
  threshold: {
    tap: number        // 点击识别阈值
    longPress: number  // 长按时间阈值
    swipe: number      // 滑动距离阈值
    pinch: number      // 缩放比例阈值
    rotate: number     // 旋转角度阈值
  }

  // 手势优先级
  priority: ('tap' | 'longPress' | 'swipe' | 'pinch' | 'rotate')[]

  // 防抖与节流
  debounce: number
  throttle: number

  // 触摸反馈
  feedback: {
    haptic: boolean    // 触觉反馈
    visual: boolean    // 视觉反馈
    sound: boolean     // 声音反馈
  }
}
```

**移动端性能优化：**
```
┌─────────────────────────────────────────────────────────────┐
│                    移动端性能优化策略                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  渲染优化                    事件优化                        │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ - 虚拟滚动      │        │ - 被动事件监听  │            │
│  │ - 延迟渲染      │        │ - 事件委托      │            │
│  │ - CSS 硬件加速  │        │ - 防抖节流      │            │
│  │ - 图片懒加载    │        │ - 触摸事件优化  │            │
│  └─────────────────┘        └─────────────────┘            │
│                                                              │
│  内存优化                    网络优化                        │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ - 对象池复用    │        │ - 资源预加载    │            │
│  │ - 及时清理      │        │ - 缓存策略      │            │
│  │ - WeakMap 使用  │        │ - 压缩传输      │            │
│  │ - 内存监控      │        │ - 离线支持      │            │
│  └─────────────────┘        └─────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**PWA 支持集成：**
```typescript
// PWA 配置
export interface PWAOptions {
  // Service Worker 配置
  serviceWorker: {
    enabled: boolean
    scope: string
    updateStrategy: 'auto' | 'manual'
  }

  // 缓存策略
  cache: {
    static: 'cache-first' | 'network-first' | 'stale-while-revalidate'
    dynamic: 'network-first' | 'cache-first'
    maxAge: number
    maxSize: number
  }

  // 离线支持
  offline: {
    enabled: boolean
    fallbackPage: string
    offlineIndicator: boolean
  }
}
```

**手势库扩展：**
```typescript
// 新增手势类型
export type GestureType =
  | 'tap'          // 单击
  | 'doubleTap'    // 双击
  | 'longPress'    // 长按
  | 'swipe'        // 滑动
  | 'pan'          // 拖拽
  | 'pinch'        // 双指缩放
  | 'rotate'       // 双指旋转
  | 'twoFingerTap' // 双指点击
  | 'threeFingerTap' // 三指点击
  | 'pinchIn'      // 双指向内捏合
  | 'pinchOut'     // 双指向外展开
  | 'edgeSwipe'    // 边缘滑动
```

##### 3. 无障碍访问 (A11y)

**ARIA 属性支持：**
```typescript
// ARIA 属性自动生成
export interface ARIAConfig {
  // 角色
  role?: string

  // 状态
  ariaExpanded?: boolean
  ariaSelected?: boolean
  ariaChecked?: boolean
  ariaDisabled?: boolean
  ariaHidden?: boolean
  ariaBusy?: boolean

  // 属性
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaControls?: string
  ariaOwns?: string
  ariaHasPopup?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

  // 实时区域
  ariaLive?: 'off' | 'polite' | 'assertive'
  ariaAtomic?: boolean
  ariaRelevant?: 'additions' | 'removals' | 'text' | 'all'
}

// 指令自动添加 ARIA 属性
export const vTooltip = defineDirective({
  mounted(el, binding) {
    // 自动添加 ARIA 属性
    el.setAttribute('role', 'tooltip')
    el.setAttribute('aria-hidden', 'true')

    // 触发元素
    const trigger = el.previousElementSibling
    if (trigger) {
      trigger.setAttribute('aria-describedby', el.id)
      trigger.setAttribute('aria-haspopup', 'tooltip')
    }
  }
})
```

**键盘导航增强：**
```typescript
// 键盘导航配置
export interface KeyboardNavigationConfig {
  // 焦点管理
  focus: {
    trap: boolean           // 焦点陷阱
    initial: string         // 初始焦点
    returnFocus: boolean    // 关闭时返回焦点
  }

  // 导航键
  keys: {
    next: string[]          // 下一个 (默认: Tab, ArrowDown, ArrowRight)
    prev: string[]          // 上一个 (默认: Shift+Tab, ArrowUp, ArrowLeft)
    select: string[]        // 选择 (默认: Enter, Space)
    close: string[]         // 关闭 (默认: Escape)
  }

  // 导航模式
  mode: 'linear' | 'grid' | 'tree'

  // 循环导航
  loop: boolean
}

// 示例：v-context-menu 键盘导航
export const vContextMenu = defineDirective({
  mounted(el, binding) {
    const config: KeyboardNavigationConfig = {
      focus: { trap: true, returnFocus: true },
      keys: {
        next: ['ArrowDown'],
        prev: ['ArrowUp'],
        select: ['Enter', 'Space'],
        close: ['Escape'],
      },
      mode: 'linear',
      loop: true,
    }

    setupKeyboardNavigation(el, config)
  }
})
```

**屏幕阅读器兼容：**
```typescript
// 屏幕阅读器公告
export function announce(message: string, options?: {
  priority?: 'polite' | 'assertive'
  timeout?: number
  clear?: boolean
}) {
  const announcer = document.getElementById('sr-announcer') ||
    createAnnouncer()

  announcer.setAttribute('aria-live', options?.priority || 'polite')
  announcer.textContent = message

  if (options?.clear !== false) {
    setTimeout(() => {
      announcer.textContent = ''
    }, options?.timeout || 1000)
  }
}

// 使用示例
export const vCopy = defineDirective({
  mounted(el, binding) {
    el.addEventListener('click', async () => {
      await copyToClipboard(binding.value)
      // 屏幕阅读器公告
      announce('已复制到剪贴板')
    })
  }
})
```

##### 4. 安全增强

**XSS 防护增强：**
```typescript
// XSS 防护配置
export interface XSSProtectionConfig {
  // 允许的标签
  allowedTags: string[]

  // 允许的属性
  allowedAttributes: Record<string, string[]>

  // 允许的协议
  allowedProtocols: string[]

  // 自定义过滤规则
  customFilters: ((html: string) => string)[]

  // 危险模式检测
  detectDangerousPatterns: boolean
}

// 增强的 sanitize 指令
export const vSanitize = defineDirective({
  mounted(el, binding) {
    const config: XSSProtectionConfig = {
      allowedTags: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
      allowedAttributes: {
        '*': ['class', 'id'],
        'a': ['href', 'title'],
      },
      allowedProtocols: ['http', 'https', 'mailto'],
      detectDangerousPatterns: true,
      ...binding.value,
    }

    const sanitized = sanitizeHTML(el.innerHTML, config)
    el.innerHTML = sanitized
  }
})
```

**CSP 兼容性优化：**
```typescript
// CSP 安全配置
export interface CSPConfig {
  // 禁用内联脚本
  noInlineScripts: boolean

  // 禁用内联样式
  noInlineStyles: boolean

  // 禁用 eval
  noEval: boolean

  // 使用 nonce
  nonce?: string
}

// CSP 兼容的样式注入
export function injectStyles(css: string, options?: CSPConfig) {
  if (options?.nonce) {
    const style = document.createElement('style')
    style.setAttribute('nonce', options.nonce)
    style.textContent = css
    document.head.appendChild(style)
  } else {
    // 使用 CSS 文件
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = getStylesheetURL(css)
    document.head.appendChild(link)
  }
}
```

**安全审计工具：**
```typescript
// 安全审计 API
export const SecurityAudit = {
  // 扫描潜在安全问题
  scan(): SecurityReport {
    return {
      vulnerabilities: this.findVulnerabilities(),
      warnings: this.findWarnings(),
      recommendations: this.getRecommendations(),
    }
  },

  // 检查依赖漏洞
  async checkDependencies(): Promise<DependencyVulnerability[]> {
    const result = await auditDependencies()
    return result.vulnerabilities
  },

  // 检查 CSP 配置
  checkCSP(): CSPReport {
    return {
      policies: this.parseCSPMeta(),
      violations: this.findCSPViolations(),
      recommendations: this.getCSPRecommendations(),
    }
  },

  // 生成安全报告
  generateReport(format: 'json' | 'html' | 'markdown'): string {
    // ...
  }
}
```

#### 技术栈

| 功能 | 技术选型 | 说明 |
|------|---------|------|
| Vue 3 优化 | Vue 3 响应式 API | shallowRef, markRaw 等 |
| PWA | vite-plugin-pwa | PWA 支持插件 |
| 手势识别 | @use-gesture/vue | 手势库 |
| A11y | @vue-a11y/* | 无障碍工具集 |
| XSS 防护 | DOMPurify | HTML 消毒库 |
| 安全审计 | npm audit / snyk | 漏洞扫描工具 |

### 10.9 v1.11.0 开发计划 - 稳定性、性能极限与企业级功能 (Week 19-20)

#### 核心目标

作为重要里程碑版本，全面提升稳定性、性能极限，增加企业级功能，为后续 Web Components 支持做好准备。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **稳定性与兼容性** | | | | |
| 浏览器兼容性增强 | 8h | P0 | - | ✅ 已完成 |
| 旧版本迁移支持 | 6h | P0 | - | ✅ 已完成 |
| 边缘场景修复 | 8h | P1 | - | ✅ 已完成 |
| 向后兼容保障测试 | 6h | P0 | - | ✅ 已完成 |
| 兼容性测试矩阵 | 4h | P1 | - | ✅ 已完成 |
| **性能极限优化** | | | | |
| Bundle 体积极限优化 | 8h | P0 | - | ✅ 已完成 |
| 运行时性能极致优化 | 8h | P0 | - | ✅ 已完成 |
| 内存占用优化 | 6h | P1 | - | ✅ 已完成 |
| 首屏加载优化 | 6h | P1 | - | ✅ 已完成 |
| 性能基准测试 | 4h | P1 | - | ✅ 已完成 |
| **企业级功能** | | | | |
| 企业级权限管理增强 | 8h | P0 | - | ✅ 已完成 |
| 审计日志系统 | 6h | P1 | - | ✅ 已完成 |
| 配置中心集成 | 6h | P2 | - | ✅ 已完成 |
| 监控告警集成 | 6h | P2 | - | ✅ 已完成 |
| 企业级文档 | 4h | P1 | - | ✅ 已完成 |
| **v2.0.0 核心功能** | | | | |
| Web Components 支持 | 12h | P0 | - | ✅ 已完成 |
| Vue 3 专属优化层 | 6h | P0 | - | ✅ 已完成 |
| 示例文件更新 | 4h | P1 | - | ✅ 已完成 |
| 文档更新 | 4h | P1 | - | ✅ 已完成 |

**里程碑 M14：v1.11.0 发布** ✅ 已完成
**里程碑 M15：v2.0.0 发布** ✅ 已完成

#### 功能详解

##### 1. 稳定性与兼容性

**浏览器兼容性增强：**
```typescript
// 浏览器兼容性配置
export interface BrowserCompatibilityConfig {
  // 目标浏览器
  targets: {
    chrome: string    // 例: '>= 80'
    firefox: string   // 例: '>= 78'
    safari: string    // 例: '>= 14'
    edge: string      // 例: '>= 88'
    samsung: string   // 例: '>= 12'
  }

  // 降级策略
  fallback: {
    intersectionObserver: boolean  // IntersectionObserver 降级
    resizeObserver: boolean        // ResizeObserver 降级
    clipboard: boolean             // Clipboard API 降级
    mutationObserver: boolean      // MutationObserver 降级
  }

  // Polyfill 策略
  polyfill: 'auto' | 'manual' | 'none'
}
```

**浏览器兼容性测试矩阵：**
```
┌─────────────────────────────────────────────────────────────┐
│                    浏览器兼容性测试矩阵                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  桌面浏览器                  移动浏览器                      │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ Chrome 80+  ✅  │        │ iOS Safari 14+ ✅│            │
│  │ Firefox 78+ ✅  │        │ Android 80+   ✅│            │
│  │ Safari 14+  ✅  │        │ Samsung 12+   ✅│            │
│ │ Edge 88+    ✅  │        │ UC Browser    ⚠️│            │
│  │ Opera 67+   ✅  │        │ WeChat        ⚠️│            │
│  └─────────────────┘        └─────────────────┘            │
│                                                              │
│  ✅ 完全支持  ⚠️ 部分支持  ❌ 不支持                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**旧版本迁移支持：**
```typescript
// 迁移助手
export const MigrationHelper = {
  // 检测旧版本用法
  detectLegacyUsage(code: string): LegacyUsageReport {
    return {
      deprecatedAPIs: this.findDeprecatedAPIs(code),
      breakingChanges: this.findBreakingChanges(code),
      warnings: this.generateWarnings(code),
      suggestions: this.generateSuggestions(code),
    }
  },

  // 自动迁移代码
  migrate(code: string, options: MigrationOptions): MigrationResult {
    let migrated = code

    // 应用迁移规则
    for (const rule of options.rules) {
      migrated = this.applyRule(migrated, rule)
    }

    return {
      code: migrated,
      changes: this.getChanges(code, migrated),
      warnings: this.getWarnings(migrated),
    }
  },

  // 生成迁移报告
  generateReport(result: MigrationResult): string {
    // ...
  }
}
```

**向后兼容保障：**
```typescript
// 兼容性测试套件
describe('Backward Compatibility', () => {
  // 测试所有历史版本的 API
  it('should maintain v1.0.0 API compatibility', () => {
    // ...
  })

  it('should maintain v1.5.0 API compatibility', () => {
    // ...
  })

  it('should support deprecated options with warnings', () => {
    const warn = vi.spyOn(console, 'warn')
    // 使用已废弃的选项
    renderDirective({ deprecatedOption: true })
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[Directix] deprecated')
    )
  })
})
```

##### 2. 性能极限优化

**Bundle 体积极限优化：**
```typescript
// 体积优化策略
export const BundleOptimization = {
  // 代码分割
  codeSplitting: {
    // 按指令分割
    directives: 'auto',
    // 按 composable 分割
    composables: 'auto',
    // 工具函数按需加载
    utils: 'lazy',
  },

  // Tree-shaking 优化
  treeShaking: {
    // 移除未使用的代码
    aggressive: true,
    // 保留副作用
    sideEffects: ['**/*.css'],
  },

  // 压缩优化
  minification: {
    // Terser 配置
    terser: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    },
  },

  // 目标体积
  targets: {
    singleDirective: '1KB',      // 单指令 ≤ 1KB
    coreBundle: '15KB',          // 核心包 ≤ 15KB
    fullBundle: '25KB',          // 完整包 ≤ 25KB
  }
}
```

**运行时性能极致优化：**
```typescript
// 性能优化技术
export const PerformanceOptimizations = {
  // 事件委托
  eventDelegation: {
    enabled: true,
    // 全局事件池
    globalListeners: new Map(),
    // 批量处理
    batchProcessing: true,
  },

  // 虚拟化
  virtualization: {
    // 虚拟 DOM 优化
    vdom: true,
    // 虚拟滚动
    scroll: true,
    // 虚拟列表
    list: true,
  },

  // 缓存策略
  caching: {
    // 计算结果缓存
    computed: new WeakMap(),
    // DOM 查询缓存
    dom: new WeakMap(),
    // 样式计算缓存
    style: new WeakMap(),
  },

  // 延迟初始化
  lazyInit: {
    // 延迟加载指令
    directives: true,
    // 延迟绑定事件
    events: true,
    // 延迟初始化观察器
    observers: true,
  }
}
```

**内存占用优化：**
```typescript
// 内存管理
export const MemoryManagement = {
  // 对象池
  objectPool: {
    // 复用事件对象
    events: new ObjectPool(() => ({ type: '', target: null })),
    // 复用观察器条目
    observerEntries: new ObjectPool(() => ({})),
  },

  // WeakMap 使用
  weakReferences: {
    // 元素状态使用 WeakMap
    elementState: new WeakMap(),
    // 观察器使用 WeakMap
    observers: new WeakMap(),
  },

  // 及时清理
  cleanup: {
    // 指令卸载时清理
    onUnmount: true,
    // 组件销毁时清理
    onDestroy: true,
    // 定期清理未使用资源
    periodic: 60000, // 每分钟
  },

  // 内存监控
  monitoring: {
    enabled: process.env.NODE_ENV === 'development',
    warnThreshold: 50 * 1024 * 1024, // 50MB 警告
    logInterval: 30000, // 30秒记录一次
  }
}
```

**性能基准测试：**
```typescript
// 性能基准
export const PerformanceBenchmarks = {
  // 指令挂载时间
  mountTime: {
    vClickOutside: '< 1ms',
    vDebounce: '< 0.5ms',
    vLazy: '< 2ms',
    vVirtualList: '< 5ms (1000 items)',
  },

  // 更新时间
  updateTime: {
    vClickOutside: '< 0.1ms',
    vDebounce: '< 0.1ms',
    vLazy: '< 0.5ms',
  },

  // 内存占用
  memoryUsage: {
    perDirective: '< 1KB',
    perInstance: '< 100 bytes',
  },

  // 运行基准测试
  async run(): Promise<BenchmarkReport> {
    const results = await Promise.all([
      this.benchmarkMount(),
      this.benchmarkUpdate(),
      this.benchmarkMemory(),
    ])
    return this.generateReport(results)
  }
}
```

##### 3. 企业级功能

**企业级权限管理增强：**
```typescript
// 企业级权限配置
export interface EnterprisePermissionConfig {
  // 权限源
  sources: {
    // 静态权限
    static?: string[]
    // API 获取
    api?: {
      url: string
      method: 'GET' | 'POST'
      headers?: Record<string, string>
      transform?: (response: any) => string[]
    }
    // 本地存储缓存
    cache?: {
      enabled: boolean
      key: string
      ttl: number
    }
  }

  // 角色管理
  roles: {
    // 角色定义
    definitions: Record<string, string[]>
    // 角色继承
    inheritance: Record<string, string[]>
    // 动态角色
    dynamic?: (user: any) => string[]
  }

  // 权限检查
  check: {
    // 检查函数
    handler: (permission: string, context: any) => boolean
    // 缓存结果
    cache: boolean
    // 缓存时间
    cacheTTL: number
  }

  // 审计
  audit: {
    enabled: boolean
    onCheck?: (permission: string, result: boolean, context: any) => void
    onDeny?: (permission: string, context: any) => void
  }
}

// 使用示例
configureEnterprisePermission({
  sources: {
    api: {
      url: '/api/permissions',
      transform: (res) => res.data.permissions,
    },
    cache: { enabled: true, key: 'user_permissions', ttl: 300000 },
  },
  roles: {
    definitions: {
      admin: ['*'],
      editor: ['read', 'write', 'edit'],
      viewer: ['read'],
    },
    inheritance: {
      super_editor: ['editor', 'export'],
    },
  },
  audit: {
    enabled: true,
    onDeny: (permission, context) => {
      logSecurityEvent('permission_denied', { permission, context })
    },
  },
})
```

**审计日志系统：**
```typescript
// 审计日志配置
export interface AuditLogConfig {
  // 日志级别
  level: 'debug' | 'info' | 'warn' | 'error'

  // 日志存储
  storage: {
    type: 'memory' | 'localStorage' | 'indexedDB' | 'api'
    maxSize?: number
    endpoint?: string
  }

  // 日志格式
  format: {
    timestamp: boolean
    level: boolean
    context: boolean
    stack: boolean
  }

  // 敏感信息过滤
  sensitive: {
    keys: string[]
    mask: string
  }

  // 日志上报
  report: {
    enabled: boolean
    endpoint: string
    batch: boolean
    batchSize: number
    interval: number
  }
}

// 审计日志 API
export const AuditLogger = {
  // 记录事件
  log(event: AuditEvent): void {
    // ...
  },

  // 记录指令操作
  logDirectiveAction(
    directive: string,
    action: string,
    details: Record<string, any>
  ): void {
    this.log({
      type: 'directive',
      directive,
      action,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
  },

  // 查询日志
  query(filter: AuditFilter): AuditEvent[] {
    // ...
  },

  // 导出日志
  export(format: 'json' | 'csv'): string {
    // ...
  }
}
```

**配置中心集成：**
```typescript
// 配置中心
export interface ConfigCenterConfig {
  // 配置源
  source: {
    type: 'static' | 'api' | 'nacos' | 'apollo'
    endpoint?: string
    namespace?: string
    group?: string
  }

  // 配置刷新
  refresh: {
    enabled: boolean
    interval: number
    onRefresh?: (config: any) => void
  }

  // 配置加密
  encryption: {
    enabled: boolean
    algorithm: 'AES' | 'RSA'
    key?: string
  }

  // 配置验证
  validation: {
    enabled: boolean
    schema?: object
    onInvalid?: (errors: any[]) => void
  }
}

// 使用示例
const configCenter = createConfigCenter({
  source: {
    type: 'apollo',
    endpoint: 'https://apollo.example.com',
    namespace: 'directix',
  },
  refresh: {
    enabled: true,
    interval: 30000,
    onRefresh: (config) => {
      updateDirectiveConfig(config)
    },
  },
})

// 获取配置
const debounceConfig = configCenter.get('directives.debounce')
```

**监控告警集成：**
```typescript
// 监控集成
export interface MonitoringConfig {
  // 性能监控
  performance: {
    enabled: boolean
    sampleRate: number
    reportEndpoint?: string
  }

  // 错误监控
  error: {
    enabled: boolean
    captureUncaught: boolean
    captureUnhandledRejection: boolean
    reportEndpoint?: string
  }

  // 行为监控
  behavior: {
    enabled: boolean
    trackClicks: boolean
    trackInputs: boolean
    reportEndpoint?: string
  }

  // 告警规则
  alerts: {
    rules: AlertRule[]
    channels: ('email' | 'webhook' | 'slack')[]
    webhook?: string
  }
}

// 告警规则
interface AlertRule {
  name: string
  condition: string
  threshold: number
  duration: number
  severity: 'info' | 'warning' | 'critical'
  actions: string[]
}

// 集成示例
setupMonitoring({
  performance: {
    enabled: true,
    sampleRate: 0.1, // 10% 采样
    reportEndpoint: '/api/monitoring/performance',
  },
  error: {
    enabled: true,
    captureUncaught: true,
    reportEndpoint: '/api/monitoring/errors',
  },
  alerts: {
    rules: [
      {
        name: 'high_error_rate',
        condition: 'error_rate > threshold',
        threshold: 5,
        duration: 60000,
        severity: 'critical',
        actions: ['notify_team'],
      },
    ],
    channels: ['webhook', 'slack'],
    webhook: '/api/alerts',
  },
})
```

##### 4. v2.0.0 准备工作

> **注意**: v2.0.0 将保留 Vue 2 支持，迁移工具主要用于 API 升级和优化建议。

**迁移工具开发：**
```bash
# CLI 迁移命令（用于 API 升级建议）
directix migrate --check

# 迁移选项
directix migrate [options]

Options:
  --dry-run          预览迁移变更，不实际修改
  --check            检查是否有待更新的 API
  --report           生成迁移报告
  --interactive      交互式迁移，逐步确认
```

```typescript
// 迁移工具实现
export const MigrationTool = {
  // 分析项目
  async analyze(projectPath: string): Promise<AnalysisReport> {
    const files = await this.findVueFiles(projectPath)
    const issues: MigrationIssue[] = []

    for (const file of files) {
      const content = await readFile(file)
      issues.push(...this.findIssues(content, file))
    }

    return {
      files: files.length,
      issues,
      summary: this.summarize(issues),
    }
  },

  // 执行迁移
  async migrate(
    projectPath: string,
    options: MigrationOptions
  ): Promise<MigrationResult> {
    const analysis = await this.analyze(projectPath)
    const changes: FileChange[] = []

    for (const issue of analysis.issues) {
      const fix = this.createFix(issue)
      if (options.dryRun) {
        console.log(`[Dry Run] ${fix.description}`)
      } else {
        await this.applyFix(fix)
        changes.push(fix)
      }
    }

    return { changes, warnings: this.getWarnings(analysis) }
  },

  // 生成迁移报告
  generateReport(result: MigrationResult): string {
    // Markdown 格式报告
  }
}
```

**Breaking Changes 预警系统：**
```typescript
// Breaking Changes 检测
export const BreakingChangesDetector = {
  // 已知 Breaking Changes
  breakingChanges: [
    {
      version: '2.0.0',
      type: 'removed',
      api: 'v-old-directive',
      replacement: 'v-new-directive',
      migration: 'Rename v-old-directive to v-new-directive',
    },
    {
      version: '2.0.0',
      type: 'changed',
      api: 'v-debounce',
      change: 'Default wait changed from 300ms to 100ms',
      migration: 'Explicitly set wait: 300 to maintain behavior',
    },
  ],

  // 检测使用
  detect(code: string): BreakingChangeWarning[] {
    const warnings: BreakingChangeWarning[] = []

    for (const change of this.breakingChanges) {
      if (this.matchesPattern(code, change)) {
        warnings.push({
          ...change,
          line: this.findLine(code, change),
          severity: this.getSeverity(change),
        })
      }
    }

    return warnings
  },

  // 控制台警告
  warn(warnings: BreakingChangeWarning[]): void {
    for (const warning of warnings) {
      console.warn(
        `[Directix] Breaking Change Warning:\n` +
        `  API: ${warning.api}\n` +
        `  Change: ${warning.change || warning.type}\n` +
        `  Migration: ${warning.migration}\n` +
        `  More info: https://directix.dev/migration#${warning.api}`
      )
    }
  }
}
```

**兼容层开发：**
```typescript
// v1.x 兼容层
export const CompatibilityLayer = {
  // 指令别名
  aliases: {
    'v-old-name': 'v-new-name',
    'v-deprecated': 'v-replacement',
  },

  // 选项兼容
  optionCompat: {
    // 旧选项名 -> 新选项名
    'oldOption': 'newOption',
    'deprecatedParam': 'replacementParam',
  },

  // 行为兼容
  behaviorCompat: {
    // 保持 v1.x 默认行为
    'v-debounce.defaultWait': 300,
    'v-throttle.defaultWait': 300,
  },

  // 启用兼容层
  enable(): void {
    // 注册别名
    for (const [oldName, newName] of Object.entries(this.aliases)) {
      const directive = getDirective(newName)
      registerDirective(oldName, directive)
    }

    // 应用行为兼容
    applyBehaviorCompat(this.behaviorCompat)

    console.warn(
      '[Directix] Compatibility layer enabled. ' +
      'Some features are deprecated and will be updated in v2.0.0. ' +
      'See https://directix.dev/migration for details.'
    )
  }
}
```

**迁移文档编写：**
```markdown
# Upgrade Guide: v1.x to v2.0

## Overview

v2.0 保留 Vue 2 支持，同时提供 Vue 3 专属优化功能。

## New Features in v2.0

### 1. Web Components 支持
- `isCustomElement()` - 检测自定义元素
- `applyDirectiveToCustomElement()` - 应用指令到自定义元素
- `createDirectiveElement()` - 从指令创建自定义元素

### 2. Vue 3 条件优化
- `markRaw` DOM 元素优化（仅 Vue 3）
- `shallowReactive` 状态优化（仅 Vue 3）

## Upgrading

Run the upgrade check tool:

\`\`\`bash
npx directix migrate --check
\`\`\`

## Manual Upgrade Steps

1. Update dependencies
2. Check deprecated APIs (if any)
3. Test thoroughly
```

#### 技术栈

| 功能 | 技术选型 | 说明 |
|------|---------|------|
| 浏览器测试 | BrowserStack / Playwright | 跨浏览器测试 |
| 性能监控 | web-vitals / custom | 性能指标采集 |
| 配置中心 | Apollo / Nacos | 配置管理 |
| 监控告警 | Sentry / 自研 | 错误监控 |
| 代码迁移 | AST / jscodeshift | 代码转换 |

### 10.10 v2.0.0 发布记录

#### ✅ v2.0.0 已发布 (2026-05-05)

> **重要决策**: 根据项目需求，决定保留 Vue 2 支持，v2.0.0 为无破坏性升级版本。

**兼容性增强版本 - 已发布：**

**保留功能（继续维护）：**
- ✅ Vue 2 和 Vue 3 双版本支持
- ✅ `isVue2()`、`isVue27()`、`isVue3()` 环境检测函数
- ✅ `setVueVersion()`、`resetVueVersion()` 版本设置
- ✅ `packages/core/src/adapter/vue2.ts` Vue 2 适配器
- ✅ `examples/vue2/` Vue 2 示例项目

**新增功能（已完成）：**
- ✅ Web Components 支持（兼容 Vue 2/3）
  - `isCustomElement()` - 检测自定义元素
  - `applyDirectiveToCustomElement()` - 应用指令到自定义元素
  - `defineCustomElementDirective()` - 定义包装指令的自定义元素
  - `createDirectiveElement()` - 从指令创建自定义元素类
  - `registerDirectiveElements()` - 注册多个指令为自定义元素

**性能优化（已实现）：**
- ✅ 使用 `markRaw` 标记 DOM 元素（仅 Vue 3）
- ✅ 使用 `shallowReactive` 优化指令状态（仅 Vue 3）
- ✅ 运行时版本检测保持，确保兼容性
- ✅ 包体积优化，比 v1.11.0 减小 10-15%

**发布状态：**
- ✅ package.json 版本号更新为 2.0.0
- ✅ CHANGELOG.md 更新完成
- ✅ 迁移指南文档更新（中英文）
- ✅ Web Components 测试通过
- ✅ 构建产物生成成功

#### 🔮 v2.x 版本规划

---

### v2.1.0 开发计划 - Web Components 增强 (Week 21-22)

#### ✅ v2.1.0 已完成 (2026-06-06)

**核心目标**: 完善 Web Components 支持，增强 SSR 兼容性，提供更强大的自定义元素能力。

**已完成任务:**

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **Web Components 增强** | | | | |
| Shadow DOM 样式隔离 | 8h | P0 | - | ✅ 已完成 |
| 自定义元素生命周期钩子 | 6h | P0 | - | ✅ 已完成 |
| 属性变化监听 (observedAttributes) | 4h | P1 | - | ✅ 已完成 |
| Slot 内容投射支持 | 6h | P1 | - | ✅ 已完成 |
| **SSR 支持** | | | | |
| SSR 安全的 Web Components | 8h | P0 | - | ✅ 已完成 |
| Hydration 优化 | 6h | P1 | - | ✅ 已完成 |
| Nuxt 模块集成增强 | 4h | P1 | - | ✅ 已完成 |

**新增 API:**
- `CustomElementLifecycleHooks` - 生命周期钩子接口
- `SSRSafeCustomElement` - SSR 安全自定义元素类型
- `isCustomElementDefined(name)` - 检查元素是否已定义
- `whenCustomElementDefined(name)` - 异步等待元素定义
- `getRegisteredCustomElements()` - 获取已注册元素列表
- `hydrateCustomElements(root)` - 客户端水合
- `createSSRSafeCustomElement()` - 创建 SSR 安全元素

**里程碑 M16：v2.1.0 发布** ✅ 已完成

---

### v2.2.0 开发计划 - 性能极限优化 (Week 23-24)

#### 核心目标

极致性能优化，减小包体积，提升运行时性能和内存效率。目标：单指令 ≤ 1KB gzip，全量包 ≤ 20KB gzip。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **包体积优化** | | | | |
| 代码分割策略优化 | 8h | P0 | - | 📋 待开发 |
| Tree-shaking 增强 | 6h | P0 | - | 📋 待开发 |
| 压缩算法优化 | 4h | P1 | - | 📋 待开发 |
| 副作用标记完善 | 4h | P1 | - | 📋 待开发 |
| **运行时优化** | | | | |
| 事件委托优化 | 6h | P0 | - | 📋 待开发 |
| 批量处理增强 | 6h | P1 | - | 📋 待开发 |
| 虚拟化性能提升 | 8h | P1 | - | 📋 待开发 |
| **内存优化** | | | | |
| 对象池扩展 | 4h | P1 | - | 📋 待开发 |
| WeakMap 使用优化 | 4h | P2 | - | 📋 待开发 |
| 内存泄漏检测工具 | 6h | P2 | - | 📋 待开发 |

#### 功能详解

##### 1. 包体积优化

**代码分割策略：**
- 按指令独立分割，支持按需加载
- preserveModules 模式优化
- 手动 chunk 分割（core、shared、utils）

**Tree-shaking 增强：**
- package.json sideEffects 标记
- Rollup treeshake 预设优化
- 按指令入口导出

**体积目标：**
| 模块 | 目标 (gzip) |
|------|------------|
| 单指令 | ≤ 1KB |
| 核心包 | ≤ 5KB |
| 全量包 | ≤ 20KB |

##### 2. 运行时优化

**事件委托优化：**
- EventDelegationManager 全局事件委托
- 减少 DOM 事件监听器数量
- 支持选择器匹配批量处理

**批量处理增强：**
- BatchProcessor 任务队列
- DOMBatchUpdater 批量更新
- 读写分离，避免强制同步布局

**虚拟化性能提升：**
- VirtualListOptimizer 列表优化器
- VNode 缓存与回收池
- 项高度缓存

##### 3. 内存优化

**对象池扩展：**
- ObjectPool 通用对象池
- eventPool 事件对象池
- observerEntryPool 观察器条目池

**WeakMap 优化：**
- WeakCache 弱引用缓存
- elementStateCache 元素状态缓存
- 自动清理无效引用

**内存泄漏检测：**
- MemoryLeakDetector 检测器
- 定期快照对比
- 优化建议生成

#### 性能目标表

| 指标 | 当前 | 目标 | 提升 |
|------|------|------|------|
| 单指令体积 | 1.2KB | 1KB | 17% |
| 全量包体积 | 25KB | 20KB | 20% |
| 挂载时间 | 2ms | 1ms | 50% |
| 更新时间 | 1ms | 0.5ms | 50% |
| 内存占用 | 150B | 100B | 33% |

**里程碑 M17：v2.2.0 发布** ✅ 已完成

---

### v2.3.0 开发计划 - 国际化扩展 (Week 25-26)

#### 核心目标

完善国际化支持，新增 5 种语言（韩/法/德/西/俄），提供便捷的翻译工具、验证系统和社区贡献流程。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **语言支持** | | | | |
| 韩语 (ko-KR) | 4h | P0 | - | ✅ 已完成 |
| 法语 (fr-FR) | 4h | P0 | - | ✅ 已完成 |
| 德语 (de-DE) | 4h | P0 | - | ✅ 已完成 |
| 西班牙语 (es-ES) | 4h | P1 | - | ✅ 已完成 |
| 俄语 (ru-RU) | 4h | P1 | - | ✅ 已完成 |
| **翻译工具** | | | | |
| 语言包提取工具 | 6h | P0 | - | ✅ 已完成 |
| 翻译验证工具 | 4h | P1 | - | ✅ 已完成 |
| i18n CLI 命令 | 6h | P1 | - | ✅ 已完成 |
| **社区贡献** | | | | |
| 翻译贡献指南 | 4h | P0 | - | ✅ 已完成 |
| Crowdin/Transifex 集成 | 6h | P2 | - | 📋 待开发 |

**里程碑 M18：v2.3.0 发布** ✅ 已完成 (2026-06-20)

#### 功能详解

##### 1. 多语言支持

**语言包架构：**

```
packages/i18n/
├── src/
│   ├── locales/
│   │   ├── zh-CN.ts      # 简体中文（已完成）
│   │   ├── en-US.ts      # 英语（已完成）
│   │   ├── ja-JP.ts      # 日语（已完成）
│   │   ├── ko-KR.ts      # 韩语（新增）
│   │   ├── fr-FR.ts      # 法语（新增）
│   │   ├── de-DE.ts      # 德语（新增）
│   │   ├── es-ES.ts      # 西班牙语（新增）
│   │   └── ru-RU.ts      # 俄语（新增）
│   ├── types.ts          # 类型定义
│   ├── loader.ts         # 语言加载器
│   ├── detector.ts       # 语言检测
│   ├── fallback.ts       # 回退策略
│   └── index.ts          # 导出入口
└── package.json
```

**语言包结构定义：**

```typescript
// packages/i18n/src/types.ts

export interface LocaleMessages {
  // 指令名称
  directives: {
    [name: string]: {
      name: string           // 指令显示名
      description: string    // 简短描述
      details?: string       // 详细说明
    }
  }

  // 指令参数
  params: {
    [key: string]: {
      name: string           // 参数名
      description: string    // 参数说明
      type?: string          // 类型提示
      default?: string       // 默认值说明
    }
  }

  // 警告和错误信息
  messages: {
    warn: {
      [key: string]: string  // 警告消息模板
    }
    error: {
      [key: string]: string  // 错误消息模板
    }
    info: {
      [key: string]: string  // 信息消息模板
    }
  }

  // 文档相关
  docs: {
    guide: {
      [key: string]: string  // 指南文本
    }
    api: {
      [key: string]: string  // API 文本
    }
    example: {
      [key: string]: string  // 示例说明
    }
  }

  // 通用文本
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    // ...
  }
}

export type LocaleCode = 
  | 'zh-CN' 
  | 'en-US' 
  | 'ja-JP' 
  | 'ko-KR' 
  | 'fr-FR' 
  | 'de-DE' 
  | 'es-ES' 
  | 'ru-RU'

export interface I18nConfig {
  locale: LocaleCode
  fallback?: LocaleCode
  silent?: boolean  // 缺失翻译时是否静默
}
```

**韩语 (ko-KR) 语言包示例：**

```typescript
// packages/i18n/src/locales/ko-KR.ts

import type { LocaleMessages } from '../types'

export const koKR: LocaleMessages = {
  directives: {
    'click-outside': {
      name: 'v-click-outside',
      description: '요소 외부 클릭 감지',
      details: '지정된 요소 외부를 클릭했을 때 이벤트를 트리거합니다.',
    },
    'copy': {
      name: 'v-copy',
      description: '클립보드에 복사',
      details: '클릭 시 텍스트를 클립보드에 복사합니다.',
    },
    'debounce': {
      name: 'v-debounce',
      description: '디바운스',
      details: '함수 실행을 지연시키고 마지막 호출만 실행합니다.',
    },
    // ... 其他 57 个指令
  },

  params: {
    'wait': {
      name: '지연 시간',
      description: '실행 전 대기 시간 (밀리초)',
      type: 'number',
      default: '300',
    },
    'handler': {
      name: '핸들러',
      description: '실행할 함수',
      type: 'Function',
    },
    // ... 其他参数
  },

  messages: {
    warn: {
      'invalid_param': '매개변수 "{param}"이(가) 잘못되었습니다. 예상: {expected}, 실제: {actual}',
      'deprecated_api': 'API "{api}"은(는) 더 이상 사용되지 않습니다. "{replacement}"을(를) 사용하세요.',
      'ssr_incompatible': '指令 "{directive}"은(는) SSR과 호환되지 않습니다.',
    },
    error: {
      'missing_required': '필수 매개변수 "{param}"이(가) 누락되었습니다.',
      'type_mismatch': '유형 불일치: "{param}"은(는) {expected} 유형이어야 합니다.',
      'copy_failed': '클립보드에 복사하지 못했습니다.',
    },
    info: {
      'copied': '클립보드에 복사되었습니다!',
      'loaded': '이미지가 로드되었습니다.',
    },
  },

  docs: {
    guide: {
      'getting-started': '시작하기',
      'installation': '설치',
      'usage': '사용법',
    },
    api: {
      'config': '구성',
      'options': '옵션',
    },
    example: {
      'basic': '기본 사용법',
      'advanced': '고급 사용법',
    },
  },

  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
    success: '성공!',
    cancel: '취소',
    confirm: '확인',
  },
}
```

**语言检测与自动切换：**

```typescript
// packages/i18n/src/detector.ts

export class LocaleDetector {
  private static storedLocale: LocaleCode | null = null
  private static readonly STORAGE_KEY = 'directix_locale'

  /**
   * 检测用户语言
   * 优先级：存储 > 浏览器语言 > 默认
   */
  static detect(fallback: LocaleCode = 'en-US'): LocaleCode {
    // 1. 检查存储
    if (this.storedLocale) {
      return this.storedLocale
    }

    // 2. 尝试从 localStorage 读取
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored && this.isValidLocale(stored)) {
        this.storedLocale = stored as LocaleCode
        return this.storedLocale
      }
    }

    // 3. 检测浏览器语言
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || (navigator as any).userLanguage
      const detected = this.normalizeLocale(browserLang)
      if (detected && this.isSupported(detected)) {
        return detected
      }
    }

    // 4. 返回默认
    return fallback
  }

  /**
   * 设置语言
   */
  static setLocale(locale: LocaleCode): void {
    this.storedLocale = locale
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, locale)
    }
  }

  /**
   * 标准化语言代码
   */
  private static normalizeLocale(lang: string): LocaleCode | null {
    // 处理 zh-CN, zh-TW, zh-HK 等
    if (lang.startsWith('zh')) {
      return 'zh-CN'
    }
    // 处理 ko, ko-KR
    if (lang.startsWith('ko')) {
      return 'ko-KR'
    }
    // 处理 ja, ja-JP
    if (lang.startsWith('ja')) {
      return 'ja-JP'
    }
    // 处理 en, en-US, en-GB 等
    if (lang.startsWith('en')) {
      return 'en-US'
    }
    // 处理 fr, fr-FR
    if (lang.startsWith('fr')) {
      return 'fr-FR'
    }
    // 处理 de, de-DE
    if (lang.startsWith('de')) {
      return 'de-DE'
    }
    // 处理 es, es-ES
    if (lang.startsWith('es')) {
      return 'es-ES'
    }
    // 处理 ru, ru-RU
    if (lang.startsWith('ru')) {
      return 'ru-RU'
    }
    return null
  }

  /**
   * 检查是否支持
   */
  private static isSupported(locale: LocaleCode): boolean {
    const supported: LocaleCode[] = [
      'zh-CN', 'en-US', 'ja-JP', 'ko-KR', 
      'fr-FR', 'de-DE', 'es-ES', 'ru-RU'
    ]
    return supported.includes(locale)
  }

  /**
   * 验证语言代码
   */
  private static isValidLocale(code: string): boolean {
    return [
      'zh-CN', 'en-US', 'ja-JP', 'ko-KR', 
      'fr-FR', 'de-DE', 'es-ES', 'ru-RU'
    ].includes(code)
  }
}
```

##### 2. 翻译工具

**语言包提取工具：**

```typescript
// scripts/i18n/extract.ts

import { glob } from 'glob'
import { readFileSync, writeFileSync } from 'fs'

/**
 * 从源码提取需要翻译的文本
 */
export async function extractMessages(): Promise<void> {
  const files = await glob('src/**/*.ts')
  const messages: Set<string> = new Set()

  // 正则匹配翻译调用
  const patterns = [
    /warn\(['"`]([^'"`]+)['"`]/g,
    /error\(['"`]([^'"`]+)['"`]/g,
    /info\(['"`]([^'"`]+)['"`]/g,
    /\$t\(['"`]([^'"`]+)['"`]/g,
  ]

  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        messages.add(match[1])
      }
    }
  }

  // 生成待翻译文件
  const output = {
    extracted: Array.from(messages),
    count: messages.size,
    timestamp: new Date().toISOString(),
  }

  writeFileSync('i18n-extracted.json', JSON.stringify(output, null, 2))
  console.log(`✅ Extracted ${messages.size} messages`)
}
```

**翻译验证工具：**

```typescript
// scripts/i18n/validate.ts

import { glob } from 'glob'
import { readFileSync } from 'fs'

interface ValidationResult {
  locale: string
  missing: string[]
  extra: string[]
  coverage: number
}

/**
 * 验证语言包完整性
 */
export async function validateLocales(): Promise<ValidationResult[]> {
  const locales = await glob('packages/i18n/src/locales/*.ts')
  const baseLocale = 'en-US' // 基准语言

  // 加载基准语言包
  const baseMessages = await loadLocale(baseLocale)
  const baseKeys = Object.keys(baseMessages)

  const results: ValidationResult[] = []

  for (const localeFile of locales) {
    const locale = extractLocaleName(localeFile)
    const messages = await loadLocale(locale)
    const keys = Object.keys(messages)

    // 检查缺失的键
    const missing = baseKeys.filter(k => !keys.includes(k))

    // 检查多余的键
    const extra = keys.filter(k => !baseKeys.includes(k))

    // 计算覆盖率
    const coverage = ((baseKeys.length - missing.length) / baseKeys.length) * 100

    results.push({
      locale,
      missing,
      extra,
      coverage,
    })
  }

  // 输出报告
  console.table(results.map(r => ({
    语言: r.locale,
    覆盖率: `${r.coverage.toFixed(1)}%`,
    缺失: r.missing.length,
    多余: r.extra.length,
  })))

  return results
}

/**
 * 检查翻译质量
 */
export async function checkTranslationQuality(locale: string): Promise<string[]> {
  const messages = await loadLocale(locale)
  const issues: string[] = []

  for (const [key, value] of Object.entries(messages)) {
    // 检查空翻译
    if (!value || value.trim() === '') {
      issues.push(`❌ [${key}]: 空翻译`)
      continue
    }

    // 检查占位符是否匹配
    const placeholders = value.match(/\{[^}]+\}/g) || []
    const expectedPlaceholders = key.match(/\{[^}]+\}/g) || []

    if (placeholders.length !== expectedPlaceholders.length) {
      issues.push(`⚠️  [${key}]: 占位符数量不匹配`)
    }

    // 检查 HTML 标签
    if (/<[^>]+>/.test(value)) {
      issues.push(`⚠️  [${key}]: 包含 HTML 标签`)
    }
  }

  return issues
}
```

##### 3. i18n CLI 命令

```typescript
// packages/cli/src/commands/i18n.ts

import { cac } from 'cac'

export function registerI18nCommands(cli: cac.CAC): void {
  cli
    .command('i18n:extract', '提取需要翻译的文本')
    .option('--output <file>', '输出文件路径', { default: 'i18n-extracted.json' })
    .action(async (options) => {
      console.log('📝 正在提取翻译文本...')
      await extractMessages()
      console.log(`✅ 已提取到 ${options.output}`)
    })

  cli
    .command('i18n:validate', '验证语言包完整性')
    .option('--locale <code>', '验证特定语言')
    .action(async (options) => {
      console.log('🔍 正在验证语言包...')
      const results = await validateLocales()
      
      // 检查覆盖率低于 90% 的语言
      const lowCoverage = results.filter(r => r.coverage < 90)
      if (lowCoverage.length > 0) {
        console.warn('⚠️  以下语言覆盖率低于 90%:')
        lowCoverage.forEach(r => {
          console.warn(`   - ${r.locale}: ${r.coverage.toFixed(1)}%`)
        })
      }
    })

  cli
    .command('i18n:sync', '同步语言包结构')
    .option('--base <locale>', '基准语言', { default: 'en-US' })
    .action(async (options) => {
      console.log('🔄 正在同步语言包...')
      await syncLocaleStructure(options.base)
      console.log('✅ 同步完成')
    })

  cli
    .command('i18n:translate', '自动翻译（需配置 API）')
    .option('--source <locale>', '源语言', { default: 'en-US' })
    .option('--target <locale>', '目标语言', { default: 'zh-CN' })
    .option('--service <name>', '翻译服务', { default: 'google' })
    .action(async (options) => {
      console.log(`🌐 正在翻译: ${options.source} → ${options.target}`)
      await autoTranslate(options)
      console.log('✅ 翻译完成')
    })

  cli
    .command('i18n:report', '生成翻译报告')
    .action(async () => {
      console.log('📊 正在生成报告...')
      const report = await generateI18nReport()
      writeFileSync('i18n-report.html', report)
      console.log('✅ 报告已生成: i18n-report.html')
    })
}
```

##### 4. 社区贡献系统

**翻译贡献指南：**

```markdown
# 翻译贡献指南

## 如何贡献翻译

### 1. 选择要翻译的语言

查看 `packages/i18n/src/locales/` 目录，选择需要更新的语言文件。

### 2. 复制模板

```bash
cp packages/i18n/src/locales/en-US.ts packages/i18n/src/locales/xx-XX.ts
```

### 3. 翻译内容

编辑文件，将英文文本翻译为目标语言：

```typescript
directives: {
  'click-outside': {
    name: 'v-click-outside',  // 保持指令名称不变
    description: '点击外部检测', // 翻译描述
    details: '点击元素外部区域时触发回调函数', // 翻译详细说明
  },
}
```

### 4. 翻译规范

- ✅ 保持变量占位符格式：`{param}`
- ✅ 保持 HTML 标签不变：`<strong>...</strong>`
- ✅ 保持代码块不变：`code` 或 `v-directive`
- ✅ 使用正式、专业的语气
- ❌ 不要翻译指令名称（如 `v-debounce`）
- ❌ 不要翻译技术术语（如 SSR、API）

### 5. 提交 PR

```bash
git checkout -b i18n/xx-XX
git add packages/i18n/src/locales/xx-XX.ts
git commit -m "i18n: add xx-XX translations"
git push origin i18n/xx-XX
```

### 6. 验证

运行验证命令确保翻译完整：

```bash
pnpm i18n:validate --locale xx-XX
```
```

**Crowdin 集成配置：**

```yaml
# crowdin.yml

project_id: "directix"
api_token_env: CROWDIN_TOKEN

files:
  - source: /packages/i18n/src/locales/en-US.ts
    translation: /packages/i18n/src/locales/%locale%.ts
    languages_mapping:
      locale:
        'zh-CN': 'zh-CN'
        'ja': 'ja-JP'
        'ko': 'ko-KR'
        'fr': 'fr-FR'
        'de': 'de-DE'
        'es': 'es-ES'
        'ru': 'ru-RU'

# 保留原有翻译
preserve_translations: true

# 翻译更新时自动提交
commit_message: "i18n: update %language% translations (%origin%)"
```

##### 5. 语言包动态加载

```typescript
// packages/i18n/src/loader.ts

export class LocaleLoader {
  private static cache: Map<LocaleCode, LocaleMessages> = new Map()
  private static loading: Map<LocaleCode, Promise<LocaleMessages>> = new Map()

  /**
   * 加载语言包
   */
  static async load(locale: LocaleCode): Promise<LocaleMessages> {
    // 检查缓存
    if (this.cache.has(locale)) {
      return this.cache.get(locale)!
    }

    // 检查是否正在加载
    if (this.loading.has(locale)) {
      return this.loading.get(locale)!
    }

    // 开始加载
    const promise = this.doLoad(locale)
    this.loading.set(locale, promise)

    try {
      const messages = await promise
      this.cache.set(locale, messages)
      return messages
    } finally {
      this.loading.delete(locale)
    }
  }

  /**
   * 实际加载逻辑
   */
  private static async doLoad(locale: LocaleCode): Promise<LocaleMessages> {
    // 动态导入
    const module = await import(`./locales/${locale}.ts`)
    return module.default || module[Object.keys(module)[0]]
  }

  /**
   * 预加载语言包
   */
  static async preload(locales: LocaleCode[]): Promise<void> {
    await Promise.all(locales.map(l => this.load(l)))
  }

  /**
   * 清除缓存
   */
  static clearCache(): void {
    this.cache.clear()
    this.loading.clear()
  }
}
```

#### 语言覆盖目标

| 语言 | 代码 | 状态 | 覆盖率目标 |
|------|------|------|-----------|
| 简体中文 | zh-CN | ✅ 已完成 | 100% |
| 英语 | en-US | ✅ 已完成 | 100% |
| 日语 | ja-JP | ✅ 已完成 | 100% |
| 韩语 | ko-KR | 📋 新增 | 100% |
| 法语 | fr-FR | 📋 新增 | 100% |
| 德语 | de-DE | 📋 新增 | 100% |
| 西班牙语 | es-ES | 📋 新增 | 100% |
| 俄语 | ru-RU | 📋 新增 | 100% |

#### 技术栈

| 功能 | 技术选型 | 说明 |
|------|---------|------|
| 语言包管理 | 自研 i18n 系统 | 轻量级实现 |
| 动态加载 | 动态 import | 按需加载 |
| 翻译平台 | Crowdin | 社区翻译 |
| CLI 工具 | cac | 命令行框架 |
| 验证工具 | TypeScript | 类型检查 |

**里程碑 M18：v2.3.0 发布** ✅ 已完成 (2026-06-20)

---

### v2.4.0 开发计划 - 开发者体验增强 (Week 27-28)

#### 核心目标

提升开发者体验，增强调试能力，完善文档和示例。

#### 任务清单

| 任务 | 预计工时 | 优先级 | 依赖 | 状态 |
|------|---------|--------|------|------|
| **VS Code 插件增强** | | | | |
| 指令智能提示 | 8h | P0 | - | 📋 待开发 |
| 配置可视化编辑 | 6h | P1 | - | 📋 待开发 |
| 代码片段扩展 | 4h | P1 | - | 📋 待开发 |
| **调试工具** | | | | |
| 浏览器扩展 | 12h | P0 | - | 📋 待开发 |
| 指令性能分析器 | 6h | P1 | - | 📋 待开发 |
| 状态检查工具 | 4h | P1 | - | 📋 待开发 |
| **文档完善** | | | | |
| 交互式示例 | 8h | P0 | - | 📋 待开发 |
| 视频教程 | 12h | P1 | - | 📋 待开发 |
| 最佳实践指南 | 6h | P1 | - | 📋 待开发 |

#### 详细技术方案

##### 1. VS Code 插件增强

**插件架构设计：**

```
packages/vscode-directix/
├── src/
│   ├── extension.ts          # 扩展入口
│   ├── features/
│   │   ├── completion.ts     # 智能补全
│   │   ├── hover.ts         # 悬停提示
│   │   ├── diagnostics.ts   # 诊断功能
│   │   └── commands.ts      # 命令注册
│   ├── providers/
│   │   ├── DirectiveCompletionProvider.ts
│   │   ├── ConfigCompletionProvider.ts
│   │   ├── HoverProvider.ts
│   │   └── CodeActionProvider.ts
│   ├── parser/
│   │   ├── templateParser.ts # 模板解析
│   │   └── configParser.ts  # 配置解析
│   ├── data/
│   │   ├── directives.json   # 指令元数据
│   │   └── snippets.json     # 代码片段
│   └── utils/
│       ├── vscode.ts         # VS Code 工具函数
│       └── types.ts          # 类型定义
├── syntaxes/
│   └── directix.tmLanguage.json
├── package.json
└── README.md
```

**指令智能提示实现：**

```typescript
// packages/vscode-directix/src/providers/DirectiveCompletionProvider.ts

import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionContext,
  MarkdownString,
  SnippetString,
} from 'vscode'
import { parse } from '@vue/compiler-dom'
import { directives } from '../data/directives'

export class DirectiveCompletionProvider implements CompletionItemProvider {
  /**
   * 提供指令补全
   */
  async provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[]> {
    // 获取当前行内容
    const line = document.lineAt(position.line)
    const textBeforeCursor = line.text.substring(0, position.character)

    // 检查是否在元素属性位置
    if (!this.isInAttributePosition(textBeforeCursor)) {
      return []
    }

    // 提取已有属性
    const existingDirectives = this.extractExistingDirectives(line.text)

    // 生成补全项
    return directives
      .filter(d => !existingDirectives.includes(d.name))
      .map(directive => this.createCompletionItem(directive))
  }

  /**
   * 检查是否在属性位置
   */
  private isInAttributePosition(text: string): boolean {
    // 匹配 <element | 或 <element attr="value" |
    const patterns = [
      /<\w+\s+$/,                           // 开始标签后
      /<\w+[^>]*\s+$/,                      // 已有属性后
      /<\w+[^>]*\s+v-\w+="[^"]*"\s+$/,      // 指令值后
    ]
    return patterns.some(p => p.test(text))
  }

  /**
   * 提取已有指令
   */
  private extractExistingDirectives(lineText: string): string[] {
    const regex = /v-(\w+)/g
    const directives: string[] = []
    let match
    while ((match = regex.exec(lineText)) !== null) {
      directives.push(`v-${match[1]}`)
    }
    return directives
  }

  /**
   * 创建补全项
   */
  private createCompletionItem(directive: DirectiveMeta): CompletionItem {
    const item = new CompletionItem(
      directive.name,
      CompletionItemKind.Property
    )

    // 设置插入文本
    item.insertText = new SnippetString(this.generateSnippet(directive))

    // 设置文档
    item.documentation = new MarkdownString()
      .appendMarkdown(`## ${directive.name}\n\n`)
      .appendMarkdown(`${directive.description}\n\n`)
      .appendCodeblock(directive.example, 'vue')

    // 设置排序
    item.sortText = this.getSortText(directive.priority)

    // 设置详情
    item.detail = `Directix: ${directive.category}`

    return item
  }

  /**
   * 生成代码片段
   */
  private generateSnippet(directive: DirectiveMeta): string {
    const params = directive.params
      .map(p => p.optional ? `${p.name}=\${${p.position}:${p.default}}` : `${p.name}=\${${p.position}}`)
      .join('.')

    if (directive.modifiers.length > 0) {
      return `${directive.name}="\${1|${directive.modifiers.join(',')}|}.${params}"`
    }

    return `${directive.name}="${params}"`
  }

  /**
   * 获取排序文本
   */
  private getSortText(priority: 'high' | 'medium' | 'low'): string {
    return priority === 'high' ? '0' : priority === 'medium' ? '1' : '2'
  }
}

interface DirectiveMeta {
  name: string
  description: string
  category: string
  params: Array<{
    name: string
    type: string
    optional: boolean
    default?: string
    position: number
  }>
  modifiers: string[]
  example: string
  priority: 'high' | 'medium' | 'low'
}
```

**悬停提示实现：**

```typescript
// packages/vscode-directix/src/providers/HoverProvider.ts

import {
  Hover,
  HoverProvider,
  TextDocument,
  Position,
  CancellationToken,
  MarkdownString,
} from 'vscode'
import { directives } from '../data/directives'

export class DirectiveHoverProvider implements HoverProvider {
  async provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Promise<Hover | undefined> {
    const range = document.getWordRangeAtPosition(position, /v-[\w-]+/)
    if (!range) return undefined

    const directiveName = document.getText(range)
    const directive = directives.find(d => d.name === directiveName)

    if (!directive) return undefined

    const markdown = new MarkdownString()
      .appendMarkdown(`### ${directive.name}\n\n`)
      .appendMarkdown(`${directive.description}\n\n`)
      .appendMarkdown('#### 参数\n\n')

    directive.params.forEach(param => {
      markdown.appendMarkdown(
        `- **${param.name}** (\`${param.type}\`): ${param.description}`
      )
      if (param.optional) {
        markdown.appendMarkdown(` _可选，默认: \`${param.default}\`_`)
      }
      markdown.appendMarkdown('\n')
    })

    if (directive.modifiers.length > 0) {
      markdown
        .appendMarkdown('\n#### 修饰符\n\n')
        .appendMarkdown(directive.modifiers.map(m => `- \`.${m}\``).join('\n'))
    }

    markdown
      .appendMarkdown('\n\n#### 示例\n\n')
      .appendCodeblock(directive.example, 'vue')

    return new Hover(markdown, range)
  }
}
```

**配置可视化编辑器：**

```typescript
// packages/vscode-directix/src/features/ConfigEditor.ts

import {
  WebviewPanel,
  Uri,
  ViewColumn,
  window,
  ExtensionContext,
} from 'vscode'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export class ConfigEditor {
  private panel: WebviewPanel | undefined
  private context: ExtensionContext

  constructor(context: ExtensionContext) {
    this.context = context
  }

  /**
   * 打开配置编辑器
   */
  async open(configPath: Uri): Promise<void> {
    if (this.panel) {
      this.panel.reveal(ViewColumn.One)
      return
    }

    this.panel = window.createWebviewPanel(
      'directixConfig',
      'Directix 配置编辑器',
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    )

    // 加载配置
    const config = this.loadConfig(configPath)

    // 加载 Webview
    this.panel.webview.html = this.getWebviewContent(config)

    // 监听消息
    this.panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'save':
          await this.saveConfig(configPath, message.config)
          window.showInformationMessage('✅ 配置已保存')
          break

        case 'reset':
          const resetConfig = this.getDefaultConfig()
          this.panel!.webview.postMessage({
            command: 'update',
            config: resetConfig,
          })
          break

        case 'validate':
          const errors = this.validateConfig(message.config)
          this.panel!.webview.postMessage({
            command: 'validationResult',
            errors,
          })
          break
      }
    })

    this.panel.onDidDispose(() => {
      this.panel = undefined
    })
  }

  /**
   * 获取 Webview HTML
   */
  private getWebviewContent(config: DirectixConfig): string {
    const nonce = this.getNonce()

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${this.panel!.webview.cspSource}; script-src 'nonce-${nonce}';">
  <title>Directix 配置编辑器</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 24px; }
    .section { background: var(--vscode-editorWidget-background); border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .section h2 { font-size: 18px; margin-bottom: 12px; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
    .form-group input, .form-group select { width: 100%; padding: 8px 12px; border-radius: 4px; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); }
    .directive-list { display: grid; gap: 8px; }
    .directive-item { display: flex; align-items: center; padding: 8px 12px; background: var(--vscode-list-hoverBackground); border-radius: 4px; }
    .directive-item input[type="checkbox"] { margin-right: 12px; }
    .actions { display: flex; gap: 12px; margin-top: 24px; }
    button { padding: 10px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; }
    .btn-primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
    .btn-secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
    .error { color: var(--vscode-errorForeground); font-size: 12px; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 Directix 配置编辑器</h1>

    <div class="section">
      <h2>基础配置</h2>
      <div class="form-group">
        <label for="prefix">指令前缀</label>
        <input type="text" id="prefix" value="${config.prefix || ''}">
      </div>
      <div class="form-group">
        <label for="ssr">SSR 支持</label>
        <select id="ssr">
          <option value="true" ${config.ssr === true ? 'selected' : ''}>启用</option>
          <option value="false" ${config.ssr === false ? 'selected' : ''}>禁用</option>
        </select>
      </div>
    </div>

    <div class="section">
      <h2>启用的指令</h2>
      <div class="directive-list" id="directives"></div>
    </div>

    <div class="section">
      <h2>性能配置</h2>
      <div class="form-group">
        <label for="lazy">懒加载模式</label>
        <select id="lazy">
          <option value="true" ${config.lazy === true ? 'selected' : ''}>启用</option>
          <option value="false" ${config.lazy === false ? 'selected' : ''}>禁用</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cacheSize">缓存大小</label>
        <input type="number" id="cacheSize" value="${config.cacheSize || 100}">
      </div>
    </div>

    <div class="actions">
      <button class="btn-primary" onclick="save()">💾 保存配置</button>
      <button class="btn-secondary" onclick="reset()">🔄 重置为默认</button>
      <button class="btn-secondary" onclick="validate()">✅ 验证配置</button>
    </div>
    <div id="errors"></div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi()

    // 保存配置
    function save() {
      const config = {
        prefix: document.getElementById('prefix').value,
        ssr: document.getElementById('ssr').value === 'true',
        lazy: document.getElementById('lazy').value === 'true',
        cacheSize: parseInt(document.getElementById('cacheSize').value),
      }
      vscode.postMessage({ command: 'save', config })
    }

    // 重置配置
    function reset() {
      vscode.postMessage({ command: 'reset' })
    }

    // 验证配置
    function validate() {
      const config = {
        prefix: document.getElementById('prefix').value,
        ssr: document.getElementById('ssr').value === 'true',
        lazy: document.getElementById('lazy').value === 'true',
        cacheSize: parseInt(document.getElementById('cacheSize').value),
      }
      vscode.postMessage({ command: 'validate', config })
    }

    // 接收消息
    window.addEventListener('message', event => {
      const message = event.data
      if (message.command === 'validationResult') {
        const errorsDiv = document.getElementById('errors')
        if (message.errors.length === 0) {
          errorsDiv.innerHTML = '<div style="color: green;">✅ 配置验证通过</div>'
        } else {
          errorsDiv.innerHTML = message.errors.map(e => 
            '<div class="error">' + e + '</div>'
          ).join('')
        }
      } else if (message.command === 'update') {
        // 更新表单
        document.getElementById('prefix').value = message.config.prefix || ''
        document.getElementById('ssr').value = message.config.ssr ? 'true' : 'false'
        document.getElementById('lazy').value = message.config.lazy ? 'true' : 'false'
        document.getElementById('cacheSize').value = message.config.cacheSize || 100
      }
    })
  </script>
</body>
</html>`
  }

  private getNonce(): string {
    return Math.random().toString(36).substring(2)
  }
}

interface DirectixConfig {
  prefix?: string
  ssr?: boolean
  lazy?: boolean
  cacheSize?: number
  directives?: string[]
}
```

**代码片段扩展：**

```json
// packages/vscode-directix/src/data/snippets.json
{
  "v-debounce": {
    "prefix": "vdebounce",
    "body": [
      "v-debounce=\"${1:handler}\"",
      ".${2|immediate,leading,trailing|}",
      "=\"${3:300}\""
    ],
    "description": "Debounce 指令：防抖处理"
  },
  "v-throttle": {
    "prefix": "vthrottle",
    "body": [
      "v-throttle=\"${1:handler}\"",
      ".${2|leading,trailing|}",
      "=\"${3:300}\""
    ],
    "description": "Throttle 指令：节流处理"
  },
  "v-click-outside": {
    "prefix": "vclickoutside",
    "body": [
      "v-click-outside=\"${1:handler}\"",
      "${2:,options}\""
    ],
    "description": "ClickOutside 指令：点击外部检测"
  },
  "v-lazy": {
    "prefix": "vlazy",
    "body": [
      "v-lazy=\"${1:imageUrl}\"",
      "${2:,options}\""
    ],
    "description": "Lazy 指令：图片懒加载"
  },
  "v-permission": {
    "prefix": "vpermission",
    "body": [
      "v-permission=\"['${1:permission}']\""
    ],
    "description": "Permission 指令：权限控制"
  },
  "v-copy": {
    "prefix": "vcopy",
    "body": [
      "v-copy=\"${1:text}\"",
      "${2:,options}\""
    ],
    "description": "Copy 指令：复制到剪贴板"
  },
  "v-loading": {
    "prefix": "vloading",
    "body": [
      "v-loading=\"${1:isLoading}\"",
      ".${2|fullscreen,lock,spinner|}"
    ],
    "description": "Loading 指令：加载状态"
  }
}
```

##### 2. 浏览器扩展

**扩展架构：**

```
packages/browser-extension/
├── src/
│   ├── devtools/
│   │   ├── panel.html        # DevTools 面板
│   │   ├── panel.ts         # 面板逻辑
│   │   ├── components/      # UI 组件
│   │   │   ├── DirectiveTree.vue
│   │   │   ├── PerfMonitor.vue
│   │   │   └── StateInspector.vue
│   │   └── stores/         # 状态管理
│   │       └── devtools.ts
│   ├── content/            # 内容脚本
│   │   ├── injector.ts     # 注入器
│   │   ├── bridge.ts       # 消息桥接
│   │   └── hook.ts         # DevTools 钩子
│   ├── background/         # 后台脚本
│   │   └── index.ts
│   └── popup/              # 弹窗页面
│       ├── popup.html
│       └── popup.ts
├── manifest.json
└── package.json
```

**DevTools 面板实现：**

```typescript
// packages/browser-extension/src/devtools/panel.ts

import { createApp, ref, computed, onMounted, onUnmounted } from 'vue'
import DirectiveTree from './components/DirectiveTree.vue'
import PerfMonitor from './components/PerfMonitor.vue'
import StateInspector from './components/StateInspector.vue'

interface DevtoolsMessage {
  type: 'directives' | 'performance' | 'state'
  payload: any
}

export function initDevtoolsPanel(): void {
  const app = createApp({
    setup() {
      // 状态
      const directives = ref<DirectiveInfo[]>([])
      const selectedDirective = ref<DirectiveInfo | null>(null)
      const performance = ref<PerfData | null>(null)
      const connected = ref(false)

      // 计算属性
      const directiveCount = computed(() => directives.value.length)
      const activeDirectives = computed(() =>
        directives.value.filter(d => d.active)
      )

      // 消息处理
      const handleMessage = (message: DevtoolsMessage) => {
        switch (message.type) {
          case 'directives':
            directives.value = message.payload
            break
          case 'performance':
            performance.value = message.payload
            break
          case 'state':
            if (selectedDirective.value) {
              selectedDirective.value.state = message.payload
            }
            break
        }
      }

      // 连接到页面
      const connect = () => {
        chrome.devtools.panels.create(
          'Directix',
          'icons/icon48.png',
          'panel.html',
          (panel) => {
            panel.onShown.addListener((window) => {
              connected.value = true
              // 发送初始化消息
              chrome.runtime.sendMessage({
                type: 'init',
                tabId: chrome.devtools.inspectedWindow.tabId,
              })
            })

            panel.onHidden.addListener(() => {
              connected.value = false
            })
          }
        )
      }

      // 监听消息
      chrome.runtime.onMessage.addListener((message) => {
        if (message.tabId === chrome.devtools.inspectedWindow.tabId) {
          handleMessage(message)
        }
      })

      // 选择指令
      const selectDirective = (directive: DirectiveInfo) => {
        selectedDirective.value = directive
        chrome.runtime.sendMessage({
          type: 'selectDirective',
          directiveId: directive.id,
        })
      }

      // 刷新数据
      const refresh = () => {
        chrome.runtime.sendMessage({ type: 'refresh' })
      }

      // 清除状态
      const clearState = () => {
        chrome.runtime.sendMessage({ type: 'clearState' })
      }

      // 导出数据
      const exportData = () => {
        const data = {
          directives: directives.value,
          performance: performance.value,
          timestamp: new Date().toISOString(),
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `directix-debug-${Date.now()}.json`
        a.click()
      }

      onMounted(() => {
        connect()
      })

      return {
        directives,
        selectedDirective,
        performance,
        connected,
        directiveCount,
        activeDirectives,
        selectDirective,
        refresh,
        clearState,
        exportData,
      }
    },
    template: `
      <div class="directix-devtools">
        <header>
          <h1>🎯 Directix DevTools</h1>
          <div class="status">
            <span :class="{ connected }">
              {{ connected ? '已连接' : '未连接' }}
            </span>
            <span class="count">
              {{ directiveCount }} 个指令
            </span>
          </div>
          <div class="actions">
            <button @click="refresh">🔄 刷新</button>
            <button @click="exportData">📥 导出</button>
            <button @click="clearState">🗑️ 清除</button>
          </div>
        </header>

        <main>
          <aside>
            <DirectiveTree
              :directives="directives"
              :selected="selectedDirective"
              @select="selectDirective"
            />
          </aside>

          <section>
            <StateInspector :directive="selectedDirective" />
          </section>

          <aside>
            <PerfMonitor :data="performance" />
          </aside>
        </main>
      </div>
    `,
  })

  app.mount('#app')
}

interface DirectiveInfo {
  id: string
  name: string
  element: string
  active: boolean
  state: any
  bindings: any
  timestamp: number
}

interface PerfData {
  mountTime: number
  updateTime: number
  unmountTime: number
  totalCalls: number
  avgTime: number
  maxTime: number
}
```

**指令性能分析器：**

```typescript
// packages/browser-extension/src/content/perfAnalyzer.ts

export class PerformanceAnalyzer {
  private static metrics: Map<string, PerfMetric> = new Map()
  private static observers: PerformanceObserver[] = []

  /**
   * 开始性能监控
   */
  static startMonitoring(): void {
    // 监控 long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('directix')) {
          this.recordLongTask(entry)
        }
      }
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })
    this.observers.push(longTaskObserver)

    // 监控 measure
    const measureObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith('directix:')) {
          this.recordMeasure(entry)
        }
      }
    })
    measureObserver.observe({ entryTypes: ['measure'] })
    this.observers.push(measureObserver)
  }

  /**
   * 停止性能监控
   */
  static stopMonitoring(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
  }

  /**
   * 记录指令操作
   */
  static recordDirectiveOperation(
    directiveId: string,
    operation: 'mount' | 'update' | 'unmount',
    callback: () => void
  ): number {
    const startMark = `directix:${directiveId}:${operation}:start`
    const endMark = `directix:${directiveId}:${operation}:end`
    const measureName = `directix:${directiveId}:${operation}`

    performance.mark(startMark)
    callback()
    performance.mark(endMark)
    performance.measure(measureName, startMark, endMark)

    const entries = performance.getEntriesByName(measureName, 'measure')
    const duration = entries[entries.length - 1]?.duration || 0

    // 更新指标
    this.updateMetric(directiveId, operation, duration)

    return duration
  }

  /**
   * 更新性能指标
   */
  private static updateMetric(
    directiveId: string,
    operation: string,
    duration: number
  ): void {
    const existing = this.metrics.get(directiveId) || {
      mount: { count: 0, total: 0, max: 0, avg: 0 },
      update: { count: 0, total: 0, max: 0, avg: 0 },
      unmount: { count: 0, total: 0, max: 0, avg: 0 },
    }

    const metric = existing[operation as keyof typeof existing]
    metric.count++
    metric.total += duration
    metric.max = Math.max(metric.max, duration)
    metric.avg = metric.total / metric.count

    this.metrics.set(directiveId, existing)
  }

  /**
   * 获取性能报告
   */
  static getPerformanceReport(): PerfReport {
    const allMetrics = Array.from(this.metrics.entries()).map(
      ([id, metrics]) => ({
        directiveId: id,
        ...metrics,
        total: Object.values(metrics).reduce(
          (sum, m) => sum + m.total,
          0
        ),
      })
    )

    return {
      directives: allMetrics,
      summary: {
        totalTime: allMetrics.reduce((sum, m) => sum + m.total, 0),
        slowDirectives: allMetrics
          .filter((m) => m.total > 16)
          .sort((a, b) => b.total - a.total),
        recommendations: this.generateRecommendations(allMetrics),
      },
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * 生成优化建议
   */
  private static generateRecommendations(
    metrics: any[]
  ): string[] {
    const recommendations: string[] = []

    // 检查慢指令
    metrics.forEach((m) => {
      if (m.mount.max > 50) {
        recommendations.push(
          `⚠️ ${m.directiveId}: 挂载时间过长 (${m.mount.max.toFixed(2)}ms)，建议优化初始化逻辑`
        )
      }

      if (m.update.avg > 16) {
        recommendations.push(
          `⚠️ ${m.directiveId}: 更新频率过高或逻辑过重 (平均 ${m.update.avg.toFixed(2)}ms)，建议使用防抖或节流`
        )
      }

      if (m.update.count > 100) {
        recommendations.push(
          `ℹ️ ${m.directiveId}: 更新次数过多 (${m.update.count}次)，检查是否有不必要的触发`
        )
      }
    })

    return recommendations
  }

  /**
   * 清除性能数据
   */
  static clearMetrics(): void {
    this.metrics.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }
}

interface PerfMetric {
  mount: { count: number; total: number; max: number; avg: number }
  update: { count: number; total: number; max: number; avg: number }
  unmount: { count: number; total: number; max: number; avg: number }
}

interface PerfReport {
  directives: any[]
  summary: {
    totalTime: number
    slowDirectives: any[]
    recommendations: string[]
  }
  timestamp: string
}
```

##### 3. 调试工具

**状态检查工具：**

```typescript
// packages/browser-extension/src/content/stateInspector.ts

export class StateInspector {
  private static inspectedElements: WeakMap<Element, DirectiveState> = new WeakMap()

  /**
   * 检查元素的所有指令状态
   */
  static inspectElement(element: Element): DirectiveState[] {
    const states: DirectiveState[] = []
    const attributes = element.getAttributeNames()

    for (const attr of attributes) {
      if (attr.startsWith('v-')) {
        const state = this.inspectDirective(element, attr)
        if (state) {
          states.push(state)
        }
      }
    }

    return states
  }

  /**
   * 检查单个指令状态
   */
  private static inspectDirective(
    element: Element,
    directiveAttr: string
  ): DirectiveState | null {
    const directiveName = directiveAttr.substring(2)
    const instance = this.getDirectiveInstance(element, directiveName)

    if (!instance) return null

    return {
      name: directiveName,
      element: {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
      },
      value: element.getAttribute(directiveAttr),
      modifiers: this.parseModifiers(directiveAttr),
      state: {
        mounted: instance._mounted,
        active: instance._active,
        bindings: instance._bindings,
        cleanup: instance._cleanup ? '已注册' : '未注册',
      },
      performance: {
        mountTime: instance._mountTime,
        lastUpdateTime: instance._lastUpdateTime,
        updateCount: instance._updateCount,
      },
      issues: this.detectIssues(instance),
    }
  }

  /**
   * 检测潜在问题
   */
  private static detectIssues(instance: any): string[] {
    const issues: string[] = []

    // 检查内存泄漏
    if (instance._mounted && !instance._cleanup) {
      issues.push('⚠️ 指令已挂载但未注册清理函数，可能存在内存泄漏')
    }

    // 检查更新频率
    if (instance._updateCount > 100 && instance._lastUpdateTime < 1000) {
      issues.push('⚠️ 短时间内更新次数过多，建议使用防抖或节流')
    }

    // 检查挂载时间
    if (instance._mountTime > 50) {
      issues.push(`⚠️ 挂载时间过长 (${instance._mountTime}ms)，建议优化初始化逻辑`)
    }

    // 检查响应式依赖
    if (instance._bindings && Object.keys(instance._bindings).length > 10) {
      issues.push('ℹ️ 绑定参数过多，可能影响性能')
    }

    return issues
  }

  /**
   * 解析修饰符
   */
  private static parseModifiers(attr: string): string[] {
    const parts = attr.split('.')
    return parts.length > 1 ? parts.slice(1) : []
  }

  /**
   * 获取指令实例（模拟）
   */
  private static getDirectiveInstance(
    element: Element,
    directiveName: string
  ): any {
    // 实际实现需要访问 Directix 内部实例
    const key = `__directix_${directiveName}`
    return (element as any)[key]
  }

  /**
   * 导出调试信息
   */
  static exportDebugInfo(): DebugExport {
    const allElements = document.querySelectorAll('[class*="v-"], [v-debounce], [v-throttle], [v-click-outside], [v-lazy], [v-permission], [v-copy], [v-loading]')
    const states: DirectiveState[] = []

    allElements.forEach((element) => {
      const elementStates = this.inspectElement(element)
      states.push(...elementStates)
    })

    return {
      page: {
        url: window.location.href,
        title: document.title,
      },
      directives: states,
      summary: {
        total: states.length,
        mounted: states.filter((s) => s.state.mounted).length,
        active: states.filter((s) => s.state.active).length,
        issues: states.flatMap((s) => s.issues),
      },
      exportedAt: new Date().toISOString(),
    }
  }
}

interface DirectiveState {
  name: string
  element: {
    tagName: string
    id: string
    className: string
  }
  value: string | null
  modifiers: string[]
  state: {
    mounted: boolean
    active: boolean
    bindings: any
    cleanup: string
  }
  performance: {
    mountTime: number
    lastUpdateTime: number
    updateCount: number
  }
  issues: string[]
}

interface DebugExport {
  page: {
    url: string
    title: string
  }
  directives: DirectiveState[]
  summary: {
    total: number
    mounted: number
    active: number
    issues: string[]
  }
  exportedAt: string
}
```

##### 4. 交互式示例

**示例平台架构：**

```
docs/interactive/
├── index.html              # 示例首页
├── playground/
│   ├── index.html          # Playground 入口
│   ├── editor.ts           # 代码编辑器
│   ├── preview.ts          # 实时预览
│   └── console.ts          # 控制台
├── examples/
│   ├── debounce/           # v-debounce 示例
│   │   ├── basic.html
│   │   ├── advanced.html
│   │   └── real-world.html
│   ├── throttle/           # v-throttle 示例
│   ├── click-outside/      # v-click-outside 示例
│   └── ...
└── components/
    ├── CodeEditor.vue      # 代码编辑器组件
    ├── LivePreview.vue     # 实时预览组件
    └── ExampleCard.vue     # 示例卡片组件
```

**Playground 实现：**

```vue
<!-- docs/interactive/playground/index.html -->

<template>
  <div class="playground">
    <header>
      <h1>🎯 Directix Playground</h1>
      <div class="toolbar">
        <select v-model="selectedDirective">
          <option v-for="d in directives" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
        <select v-model="selectedExample">
          <option v-for="e in examples" :key="e.id" :value="e.id">
            {{ e.name }}
          </option>
        </select>
        <button @click="run">▶ 运行</button>
        <button @click="reset">🔄 重置</button>
        <button @click="share">📤 分享</button>
      </div>
    </header>

    <main>
      <div class="editor-panel">
        <CodeEditor
          v-model="code"
          :language="language"
          @change="debouncedRun"
        />
      </div>

      <div class="preview-panel">
        <LivePreview
          :code="compiledCode"
          :imports="imports"
          @error="handleError"
        />
      </div>

      <div class="console-panel">
        <Console :messages="consoleMessages" />
      </div>
    </main>

    <aside class="sidebar">
      <h2>📚 文档</h2>
      <DirectiveDocs :directive="selectedDirective" />

      <h2>💡 提示</h2>
      <Tips :directive="selectedDirective" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CodeEditor from '../components/CodeEditor.vue'
import LivePreview from '../components/LivePreview.vue'
import Console from '../components/Console.vue'
import DirectiveDocs from '../components/DirectiveDocs.vue'
import Tips from '../components/Tips.vue'
import { debounce } from 'lodash-es'

const selectedDirective = ref('debounce')
const selectedExample = ref('basic')
const code = ref('')
const language = ref('vue')
const consoleMessages = ref<ConsoleMessage[]>([])

const directives = ['debounce', 'throttle', 'click-outside', 'lazy', 'permission', 'copy', 'loading']

const examples = computed(() => {
  return getExamplesForDirective(selectedDirective.value)
})

const compiledCode = computed(() => {
  return compileVueCode(code.value)
})

const imports = {
  vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
  directix: 'https://unpkg.com/directix@latest/dist/directix.esm.js',
}

const debouncedRun = debounce(() => {
  run()
}, 500)

function run(): void {
  consoleMessages.value = []
  try {
    // 执行编译后的代码
    executeCode(compiledCode.value)
  } catch (error) {
    consoleMessages.value.push({
      type: 'error',
      message: error.message,
      timestamp: Date.now(),
    })
  }
}

function reset(): void {
  code.value = getExampleCode(selectedDirective.value, selectedExample.value)
}

async function share(): Promise<void> {
  const url = generateShareUrl(code.value, selectedDirective.value)
  await navigator.clipboard.writeText(url)
  alert('链接已复制到剪贴板！')
}

function handleError(error: Error): void {
  consoleMessages.value.push({
    type: 'error',
    message: error.message,
    timestamp: Date.now(),
  })
}

// 初始化
watch([selectedDirective, selectedExample], () => {
  reset()
}, { immediate: true })
</script>

<style scoped>
.playground {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr 1fr 300px;
  height: 100vh;
}

header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #1e1e1e;
  border-bottom: 1px solid #333;
}

.toolbar {
  display: flex;
  gap: 12px;
}

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
}

.editor-panel {
  grid-row: 1 / 3;
  background: #1e1e1e;
}

.preview-panel {
  background: white;
}

.console-panel {
  background: #1e1e1e;
  border-top: 1px solid #333;
}

.sidebar {
  grid-row: 2;
  padding: 16px;
  background: #252526;
  overflow-y: auto;
}
</style>
```

**视频教程结构：**

```markdown
# Directix 视频教程大纲

## 基础系列 (10集)

1. **Directix 快速入门** (5min)
   - 安装与配置
   - 第一个指令
   - 基本使用流程

2. **v-debounce 防抖指令** (8min)
   - 防抖原理
   - 参数详解
   - 实战案例

3. **v-throttle 节流指令** (8min)
   - 节流原理
   - 与防抖的区别
   - 最佳实践

4. **v-click-outside 点击外部检测** (6min)
   - 使用场景
   - 配置选项
   - 与弹窗组件配合

5. **v-lazy 图片懒加载** (10min)
   - 懒加载原理
   - 占位图与错误处理
   - 性能优化技巧

6. **v-permission 权限控制** (12min)
   - 权限系统设计
   - 多权限组合
   - 动态权限更新

7. **v-copy 复制功能** (5min)
   - 快速实现复制
   - 自定义提示
   - 兼容性处理

8. **v-loading 加载状态** (8min)
   - 全屏与局部加载
   - 自定义样式
   - 指令组合使用

9. **指令组合与最佳实践** (15min)
   - 多指令协同
   - 性能优化
   - 代码组织

10. **SSR 与 Directix** (10min)
    - SSR 配置
    - 客户端激活
    - 常见问题

## 进阶系列 (5集)

1. **自定义指令开发** (20min)
   - 指令生命周期
   - 参数与修饰符
   - TypeScript 类型

2. **指令性能优化** (15min)
   - 性能分析
   - 优化技巧
   - 监控与调试

3. **Directix 插件开发** (25min)
   - 插件架构
   - 扩展机制
   - 发布流程

4. **测试驱动开发** (15min)
   - 单元测试
   - E2E 测试
   - 覆盖率要求

5. **生产环境最佳实践** (20min)
   - 构建优化
   - 监控告警
   - 故障排查
```

##### 5. 最佳实践指南

```markdown
# Directix 最佳实践指南

## 性能优化

### 1. 按需引入

❌ **不推荐：全量引入**
```typescript
import { createApp } from 'vue'
import Directix from 'directix'

app.use(Directix)  // 引入所有指令
```

✅ **推荐：按需引入**
```typescript
import { createApp } from 'vue'
import { vDebounce, vThrottle } from 'directix'

app.directive('debounce', vDebounce)
app.directive('throttle', vThrottle)
```

### 2. 合理使用修饰符

```vue
<!-- ✅ 使用 .sync 提高响应性 -->
<button v-debounce:click.sync="handler">

<!-- ✅ 使用 .leading 立即执行第一次 -->
<input v-throttle.leading="updateSearch">

<!-- ✅ 组合修饰符 -->
<button v-debounce:click.leading.trailing="handler">
```

### 3. 避免频繁更新

❌ **不推荐：响应式数据直接绑定**
```vue
<button v-debounce="() => handleClick(dynamicParam)">
```

✅ **推荐：使用稳定引用**
```vue
<script setup>
const handleClick = (param) => {
  // 处理逻辑
}

const debouncedHandler = useDebounceFn(handleClick, 300)
</script>

<button v-debounce="debouncedHandler">
```

## 内存管理

### 1. 正确清理副作用

```typescript
// 自定义指令示例
app.directive('my-directive', {
  mounted(el, binding) {
    const timer = setInterval(() => {
      // 定时任务
    }, 1000)

    // ✅ 注册清理函数
    el._cleanup = () => clearInterval(timer)
  },
  unmounted(el) {
    // ✅ 执行清理
    el._cleanup?.()
  }
})
```

### 2. 避免闭包陷阱

❌ **不推荐：闭包持有引用**
```typescript
mounted(el, binding) {
  const largeData = binding.value
  el._handler = () => {
    processLargeData(largeData)  // 持有引用
  }
}
```

✅ **推荐：必要时释放引用**
```typescript
mounted(el, binding) {
  el._handler = () => {
    const data = JSON.parse(JSON.stringify(binding.value))
    processData(data)
    binding.value = null  // 释放
  }
}
```

## TypeScript 支持

### 1. 类型定义

```typescript
// types/directives.d.ts
import { DirectiveBinding, ObjectDirective } from 'vue'

declare module 'directix' {
  export interface DebounceOptions {
    delay?: number
    leading?: boolean
    trailing?: boolean
    maxWait?: number
  }

  export const vDebounce: ObjectDirective<HTMLElement, DebounceOptions>
  export const vThrottle: ObjectDirective<HTMLElement, ThrottleOptions>
  // ...
}
```

### 2. 组件类型扩展

```typescript
// types/components.d.ts
import { vDebounce } from 'directix'

declare module '@vue/runtime-core' {
  interface GlobalDirectives {
    'v-debounce': typeof vDebounce
    'v-throttle': typeof vThrottle
    // ...
  }
}
```

## SSR 兼容

### 1. 条件注册

```typescript
// plugins/directix.ts
import { defineNuxtPlugin } from '#app'
import { vDebounce, vThrottle } from 'directix'

export default defineNuxtPlugin((nuxtApp) => {
  // ✅ 仅在客户端注册
  if (import.meta.client) {
    nuxtApp.vueApp.directive('debounce', vDebounce)
    nuxtApp.vueApp.directive('throttle', vThrottle)
  }
})
```

### 2. 避免服务端副作用

```typescript
app.directive('my-directive', {
  getSSRProps() {
    // ✅ 返回 SSR 安全的属性
    return {}
  },
  mounted() {
    // ✅ 仅客户端执行
  }
})
```

## 测试策略

### 1. 单元测试

```typescript
import { mount } from '@vue/test-utils'
import { vDebounce } from 'directix'

describe('v-debounce', () => {
  it('should debounce handler', async () => {
    const handler = vi.fn()
    const wrapper = mount({
      template: '<button v-debounce="handler"></button>',
      directives: { debounce: vDebounce },
      methods: { handler }
    })

    await wrapper.find('button').trigger('click')
    expect(handler).not.toHaveBeenCalled()

    await new Promise(r => setTimeout(r, 300))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
```

### 2. E2E 测试

```typescript
import { test, expect } from '@playwright/test'

test('debounce should work correctly', async ({ page }) => {
  await page.goto('/examples/debounce')

  const button = page.getByRole('button', { name: /submit/i })
  const counter = page.getByTestId('counter')

  // 快速点击多次
  for (let i = 0; i < 5; i++) {
    await button.click()
    await page.waitForTimeout(50)
  }

  // 等待防抖完成
  await page.waitForTimeout(350)

  // 应该只执行一次
  await expect(counter).toHaveText('1')
})
```
```

#### 开发资源需求表

| 资源类型 | 需求 | 用途 |
|---------|------|------|
| 开发人员 | 2名前端工程师 | VS Code 插件 + 浏览器扩展 |
| UI/UX 设计 | 1名设计师 | 界面设计、图标设计 |
| 视频制作 | 1名内容创作者 | 教程录制、剪辑 |
| 技术写作 | 1名文档工程师 | 文档编写、示例开发 |
| 测试设备 | 多台测试机器 | 跨浏览器、跨系统测试 |
| 云服务 | CDN + 存储服务 | 示例托管、视频存储 |

#### 质量保证检查清单

```markdown
# v2.4.0 发布检查清单

## VS Code 插件

- [ ] 指令智能提示正常工作
- [ ] 参数补全准确
- [ ] 修饰符提示完整
- [ ] 悬停文档显示正确
- [ ] 配置编辑器功能正常
- [ ] 代码片段插入正确
- [ ] 错误诊断准确
- [ ] 多语言支持（中英文）
- [ ] VS Code 1.60+ 兼容性
- [ ] 性能测试（内存 < 50MB）

## 浏览器扩展

- [ ] DevTools 面板正常加载
- [ ] 指令树显示正确
- [ ] 状态检查功能正常
- [ ] 性能分析数据准确
- [ ] 数据导出功能正常
- [ ] Chrome/Edge/Firefox 兼容
- [ ] 权限请求合理
- [ ] 性能影响 < 5ms

## 文档与示例

- [ ] 交互式示例运行正常
- [ ] 所有示例代码正确
- [ ] 视频教程质量达标
- [ ] 最佳实践文档完整
- [ ] 多语言文档同步
- [ ] 搜索功能正常
- [ ] 移动端适配良好

## 测试覆盖

- [ ] 单元测试覆盖率 > 80%
- [ ] E2E 测试通过率 100%
- [ ] 性能测试达标
- [ ] 无障碍测试通过
- [ ] 安全审计通过
```

#### 发布里程碑

| 里程碑 | 日期 | 内容 | 验收标准 |
|--------|------|------|----------|
| M19.1 | Week 27 Day 3 | VS Code 插件 Alpha | 基础功能可用 |
| M19.2 | Week 27 Day 5 | 浏览器扩展 Alpha | DevTools 基本功能 |
| M19.3 | Week 28 Day 2 | 文档与示例完成 | 所有文档就绪 |
| M19.4 | Week 28 Day 4 | 全量测试通过 | 质量检查清单完成 |
| M19 | Week 28 Day 6 | v2.4.0 正式发布 | 发布流程完成 |

**里程碑 M19：v2.4.0 发布** 📋 计划中

---

### v2.5.0 开发计划 - 新指令扩展 (Week 29-30)

#### 核心目标

根据社区反馈，新增高需求指令，扩展指令库覆盖范围。

#### 计划新增指令

| 指令 | 功能 | 优先级 |
|------|------|--------|
| `v-infinite-scroll-v2` | 增强版无限滚动 | P0 |
| `v-lazy-load` | 增强懒加载 | P0 |
| `v-intersection` | 交叉观察器增强 | P0 |
| `v-resize-observer` | 尺寸观察器增强 | P0 |
| `v-mutation-observer` | 变化观察器增强 | P0 |
| `v-focus-trap` | 焦点陷阱增强 | P1 |
| `v-scroll-lock` | 滚动锁定 | P1 |
| `v-portal` | 传送门增强 | P1 |
| `v-click-stream` | 点击流追踪 | P2 |
| `v-gesture` | 手势识别增强 | P2 |

**里程碑 M20：v2.5.0 发布** 📋 计划中

---

### v2.x 版本规划表

| 版本 | 发布时间 | 主要内容 | 状态 |
|------|---------|---------|------|
| v2.0.0 | 2026-05-05 | Web Components 支持、Vue 3 条件优化 | ✅ 已发布 |
| v2.1.0 | 2026-06-07 | Web Components 增强、SSR 支持、生命周期钩子 | ✅ 已发布 |
| v2.2.0 | 2026-06-21 | 性能优化、包体积减小、运行时优化 | ✅ 已发布 |
| v2.3.0 | 2026-06-20 | 国际化扩展、5种新语言（韩/法/德/西/俄）、LocaleDetector、LocaleLoader | ✅ 已发布 |
| v2.4.0 | 2026-07-19 | 开发者体验增强、调试工具、浏览器扩展 | 📋 计划中 |
| v2.5.0 | 2026-08-02 | 新指令扩展（观察器增强版） | 📋 计划中 |
| v3.0.0 | TBD | Vue 3 专属版本（评估中） | 🔮 评估中 |

### 10.11 版本规划

| 版本 | 时间 | 主要内容 | 状态 |
|------|------|---------|------|
| v1.0.0 | 2026-03-27 | 核心指令、基础文档 | ✅ 已完成 |
| v1.1.0 | 2026-03-29 | 增强指令、SSR 优化 | ✅ 已完成 |
| v1.2.0 | 2026-03-29 | 扩展指令（11个新增）、格式化指令、UI指令 | ✅ 已完成 |
| v1.3.0 | 2026-03-30 | 新增9个高价值指令（v-hotkey、v-click-delay、v-virtual-list等） | ✅ 已完成 |
| v1.4.0 | 2026-04-01 | 组合式 API（41个 composables）、完整文档和示例 | ✅ 已完成 |
| v1.5.0 | 2026-04-05 | 新增 17 个指令（v-skeleton、v-context-menu、v-export、v-fullscreen 等），总计 57 个指令 | ✅ 已完成 |
| v1.6.0 | 2026-04-08 | Nuxt 3 模块、自动导入支持 | ✅ 已完成 |
| v1.7.0 | 2026-04-15 | 可视化配置工具、在线 Playground、代码生成器 | ✅ 已完成 |
| v1.8.0 | 2026-04-22 | 测试覆盖率 90%+、性能优化、VS Code 插件、CLI 工具 | ✅ 已完成 |
| v1.9.0 | 2026-04-19 | i18n 国际化、统一警告系统、插件系统、社区插件仓库、DevTools 集成、性能监控 | ✅ 已完成 |
| v1.10.0 | 2026-05-06 | Vue 3 优化预览、移动端优化、无障碍访问、安全增强 | ✅ 已完成 |
| v1.11.0 | 2026-05-13 | 稳定性增强、性能极限优化、企业级功能、v2.0 迁移准备 | ✅ 已发布 |
| v2.0.0 | 2026-05-05 | Web Components 支持、Vue 3 条件优化、保留 Vue 2 兼容 | ✅ 已发布 |
| v2.1.0 | 2026-06-07 | Web Components 增强、SSR 支持、生命周期钩子 | ✅ 已发布 |
| v2.2.0 | 2026-06-21 | 性能极限优化、事件委托、内存管理、批量处理 | ✅ 已发布 |
| v2.3.0 | 2026-06-20 | 国际化扩展、5种新语言、LocaleDetector、LocaleLoader | ✅ 已发布 |

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

### 12.1 v2.1+ 规划

> v2.0.0 已于 2026-05-05 发布，以下为后续版本规划。

1. **Web Components 增强** (v2.1.0)
   - SSR 支持完善
   - 更多自定义元素生命周期支持
   - Shadow DOM 样式隔离增强

2. **性能优化** (v2.2.0)
   - 包体积进一步优化
   - 运行时性能提升
   - 内存占用优化

3. **国际化扩展** (v2.3.0)
   - 更多语言支持
   - 自定义语言包工具
   - 翻译贡献流程

4. **开发者体验** (持续)
   - VS Code 插件增强
   - 在线 Playground 完善
   - 调试工具优化

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

### C. 版本发布记录

#### v1.11.0 (2026-05-13) ✅ 已发布

**重大更新 - 稳定性、性能极限与企业级功能：**

**稳定性与兼容性：**
- ✅ 浏览器兼容性增强（Chrome 80+、Firefox 78+、Safari 14+）
  - 新增 `@directix/core/compatibility` 模块
  - 新增 `@directix/shared/browser` 浏览器检测工具
  - 新增 `@directix/shared/polyfill` polyfill/fallback 策略
  - 支持 IntersectionObserver、ResizeObserver、Clipboard、MutationObserver 等回退实现
- ✅ 旧版本迁移支持
  - 新增 `@directix/core/migration` 迁移助手模块
  - 新增 CLI `directix migrate` 命令
  - 支持 VueUse、v-directives 等库迁移
  - 自动检测已废弃 API 和 Breaking Changes
  - 生成迁移报告（text/json/markdown）
  - 自动修复可迁移的代码
- ✅ 边缘场景修复
  - 新增 `@directix/core/edge-case` 模块
  - SSR 环境检测与回退处理
  - DOM 就绪等待与错误恢复
  - Observer 追踪与内存管理
- ✅ 向后兼容保障测试
  - 新增 backward-compatibility.test.ts 测试套件
  - 覆盖 v1.0.0 ~ v1.10.0 所有版本 API 兼容性
  - 包含回归测试和跨版本兼容测试
- ✅ 兼容性测试矩阵
  - 新增 `@directix/core/compatibility-matrix` 模块
  - 定义支持的浏览器（Chrome 80+、Firefox 78+、Safari 14+、Edge 88+）
  - 定义移动设备兼容性（iOS 14+、Android 8+）
  - 自动生成 browserslist 配置

**性能极限优化：**
- ✅ Bundle 体积极限优化
  - 新增 `scripts/build-optimized.ts` 优化构建脚本
  - 新增 `scripts/bundle-size.ts` 体积监控报告
  - 支持按指令独立构建（tree-shaking）
  - 优化 Vite 配置（treeshake preset: recommended）
- ✅ 运行时性能极致优化
  - 新增 `@directix/core/performance-optimizer` 模块
  - 事件批量处理器 EventBatchProcessor
  - DOM 查询缓存 DOMQueryCache
  - 惰性初始化 LazyInitializer
- ✅ 内存占用优化
  - 对象池 ObjectPool 复用对象
  - WeakCache 弱引用缓存
  - ComputedCache 计算结果缓存
  - MemoryCleanupManager 定期清理
- ✅ 首屏加载优化
  - 新增 `@directix/core/first-screen` 模块
  - 惰性加载器与关键 CSS 提取
  - 延迟任务执行与性能预算
- ✅ 性能基准测试
  - 新增 `@directix/core/benchmark` 模块
  - 统计分析（均值、中位数、标准差、百分位）
  - 基准比较与回归检测

**企业级功能：**
- ✅ 企业级权限管理增强（多数据源、角色继承、审计）
  - 新增 `@directix/core/enterprise-permission` 模块
  - 多数据源支持（static、API、localStorage、sessionStorage、custom）
  - 角色继承与权限继承
  - 审计日志集成
- ✅ 审计日志系统
  - 新增 `@directix/core/audit-log` 模块
  - 多级别日志（debug/info/warn/error/critical）
  - 敏感数据脱敏
  - 多格式导出（JSON/CSV/Markdown/HTML）
- ✅ 配置中心集成（Apollo、Nacos）
  - 新增 `@directix/core/config-center` 模块
  - 多源配置加载（static、API、localStorage、sessionStorage、remote）
  - 合并策略（override/merge/deepMerge）
  - 快照与回滚功能
- ✅ 监控告警集成（性能、错误、行为监控）
  - 新增 `@directix/core/monitoring` 模块
  - 指标收集（counter、gauge、histogram）
  - 告警规则与通道（webhook、slack、custom）
  - 健康检查与 Prometheus 格式导出
- ✅ 企业级文档
  - 更新迁移指南文档
  - 新增企业级功能文档

**v2.0.0 迁移准备：**
- ✅ 迁移工具开发（CLI 命令）
- ✅ Breaking Changes 预警系统
  - 新增 `@directix/core/breaking-changes` 模块
  - 代码检测与警告
  - 迁移时间线
- ✅ 兼容层开发
- 迁移文档编写

#### v1.10.0 (2026-05-06)

**重大更新 - Vue 3 优化、移动端、无障碍与安全：**

**Vue 3 专属优化预览：**
- Composition API 深度优化
- Vue 3 响应式系统优化（shallowRef, markRaw）
- Suspense 支持增强
- Teleport 指令增强

**移动端优化：**
- 触摸手势优化（阈值、优先级、反馈）
- 移动端性能优化
- PWA 支持集成
- 手势库扩展（双指/三指点击、边缘滑动等）

**无障碍访问 (A11y)：**
- ARIA 属性自动生成
- 键盘导航增强（焦点陷阱、循环导航）
- 屏幕阅读器兼容
- 无障碍最佳实践文档

**安全增强：**
- XSS 防护增强
- CSP 兼容性优化
- 安全审计工具
- 依赖漏洞扫描

#### v1.9.0 (2026-04-19) ✅ 已完成

**重大更新 - 文档完善、国际化与开发者体验：**

**文档与示例：**
- ✅ 交互式文档升级，Playground 代码生成器
- ✅ 10+ 实际场景示例（表单验证、权限管理、图片画廊等）
- ✅ 最佳实践指南
- ✅ 视频教程（10集脚本，约1.5小时）

**国际化支持：**
- ✅ 完整 i18n 架构（@directix/i18n 包）
- ✅ 英文/中文/日文文档支持
- ✅ 指令消息国际化
- ✅ 时区/地区适配（getTimezoneInfo、formatDateLocale、formatCurrencyLocale）

**开发者体验：**
- ✅ 统一警告系统（@directix/core/warning）
- ✅ 警告信息分级（debug/info/warn/error）
- ✅ 参数验证断言函数（assert/assertType/assertRange）
- ✅ Vue DevTools 调试集成（@directix/core/devtools）
- ✅ 性能监控面板（@directix/core/performance）

**社区功能：**
- ✅ 插件系统（PluginManager、hooks、directive templates）
- ✅ 社区插件仓库（PluginRegistry、搜索、安装）
- ✅ 自定义指令模板系统（createDirectiveTemplate/createEventDirective）
- ✅ 完善的贡献指南
- ✅ Issue/PR 模板优化

#### v1.8.0 (2026-04-22)

**重大更新 - 测试覆盖、性能优化与生态集成：**

**测试覆盖率提升：**
- 单元测试覆盖率达到 90%+
- 所有 57 个指令完整测试用例
- 所有 57 个 Composables 完整测试用例
- E2E 测试覆盖核心交互场景
- CI/CD 自动化测试流程

**性能优化：**
- 单指令体积 ≤ 1.5KB gzip
- 全量包体积 ≤ 30KB gzip
- Tree-shaking 优化
- 运行时性能优化
- Bundle 大小监控 CI

**VS Code 插件：**
- 指令自动补全
- 悬浮提示文档
- 代码片段 (Snippets)
- 快速跳转文档

**CLI 工具：**
- `directix create directive` - 创建新指令
- `directix create composable` - 创建新 composable
- `directix init` - 初始化项目模板
- `directix doctor` - 诊断配置问题
- `directix migrate` - 配置迁移工具

#### v1.7.0 (2026-04-15)

**重大更新 - 可视化配置工具：**

**Playground 功能：**
- 在线指令配置器，可视化配置指令参数
- 实时预览效果，所见即所得
- 代码生成器，支持 Vue 2/3/Composable/Nuxt
- 配置预设模板，快速上手
- 分享和保存配置

**配置器特性：**
- 参数类型智能识别
- 可视化表单控件（滑块、颜色选择器、开关）
- 参数验证和提示
- TypeScript 类型生成

**技术实现：**
- 基于 @vue/repl 构建实时编辑环境
- Monaco Editor 代码编辑器
- Prettier 代码格式化
- 响应式布局支持

**文档集成：**
- 指令文档页面嵌入 Playground 入口
- 独立 Playground 页面
- 代码片段一键复制

#### v1.6.0 (2026-04-08)

**重大更新 - Nuxt 3 模块：**

**Nuxt 模块功能：**
- 自动注册所有指令为 Vue directives
- 自动导入所有 55 个 composables
- 支持 include/exclude 选择性加载指令
- 支持指令默认配置 (directiveOptions)
- SSR 兼容性自动处理
- 完整的 TypeScript 类型支持

**配置选项：**
- `enabled` - 启用/禁用模块
- `include` - 仅包含指定指令
- `exclude` - 排除指定指令
- `directiveOptions` - 指令默认配置
- `autoImportComposables` - 自动导入 composables

**新增包导出：**
- `directix/nuxt` - Nuxt 模块入口

**Peer Dependencies：**
- `@nuxt/kit` (可选)
- `@nuxt/schema` (可选)

#### v1.5.0 (2026-04-06)

**重大更新 - 17 个新指令：**

**高价值指令：**
- `v-click-wave` - 点击波纹效果
- `v-context-menu` - 右键菜单
- `v-fullscreen` - 全屏切换

**实用工具指令：**
- `v-skeleton` - 骨架屏
- `v-export` - 数据导出（CSV/JSON/HTML/TXT）
- `v-highlight` - 关键词高亮

**移动端手势：**
- `v-emoji` - Emoji 输入过滤
- `v-pan` - 平移手势
- `v-pinch` - 缩放手势
- `v-rotate-gesture` - 旋转手势

**视觉效果：**
- `v-blur` - 背景模糊遮罩
- `v-fade` - 淡入淡出过渡
- `v-parallax` - 视差滚动效果
- `v-lottie` - Lottie 动画播放
- `v-typewriter` - 打字机效果
- `v-progress` - 进度条动画
- `v-counter` - 数字滚动动画

**总计：57 个指令，57 个 composables**

#### v1.4.0 (2026-04-01)

**重大更新 - 组合式 API 完成：**

为所有 41 个指令提供对应的组合式 API (composables)，提供更灵活的使用方式：

**事件类 Composables (6个)：**
- `useClickOutside` - 点击外部检测
- `useDebounce` - 防抖处理
- `useThrottle` - 节流处理
- `useLongPress` - 长按事件
- `useHover` - 悬停状态
- `useHotkey` - 快捷键绑定

**表单类 Composables (10个)：**
- `useCopy` - 复制到剪贴板
- `useFocus` - 自动聚焦
- `useMask` - 输入掩码
- `useTruncate` - 文本截断
- `useUppercase` - 大写转换
- `useLowercase` - 小写转换
- `useCapitalcase` - 首字母大写
- `useNumber` - 数字格式化
- `useMoney` - 金额格式化
- `useTrim` - 去空格

**可见性 Composables (5个)：**
- `useLazy` - 图片懒加载
- `useIntersect` - 交叉检测
- `useVisible` - 可见性控制
- `useLoading` - 加载状态
- `useEllipsis` - 多行文本省略

**滚动 Composables (3个)：**
- `useScroll` - 滚动监听
- `useInfiniteScroll` - 无限滚动
- `useSticky` - 粘性定位

**安全 Composables (2个)：**
- `usePermission` - 权限控制
- `useSanitize` - 安全过滤

**UI Composables (8个)：**
- `useRipple` - 波纹效果
- `useTooltip` - 提示框
- `useDraggable` - 拖拽
- `useTouch` - 手势
- `useImagePreview` - 图片预览
- `useCountdown` - 倒计时显示
- `useWatermark` - 添加水印
- `usePrint` - 打印指定区域

**交互 Composables (4个)：**
- `useClickDelay` - 防重复点击
- `usePullRefresh` - 下拉刷新
- `useSwipe` - 滑动切换
- `useVirtualList` - 虚拟列表

**观察者 Composables (3个)：**
- `useResize` - 尺寸监听
- `useMutation` - DOM 监听
- `useIntersect` - 交叉检测（已在可见性类中）

**文档更新：**
- ✅ 所有指令和 composables 的完整 API 文档
- ✅ 每个指令和 composable 的交互式 Demo
- ✅ Vue 2 和 Vue 3 示例项目更新

**测试更新：**
- ✅ 所有 composables 的单元测试

#### v1.3.0 (2026-03-30)

**新增指令 (9个)：**
- `v-click-delay` - 防重复点击，在指定时间内禁止重复触发
- `v-hotkey` - 快捷键绑定，支持组合键如 `v-hotkey.ctrl.s="save"`
- `v-ellipsis` - 多行文本省略，支持指定行数
- `v-countdown` - 倒计时显示，支持自定义格式和结束回调
- `v-print` - 打印指定区域内容，支持打印前后回调
- `v-watermark` - 添加水印，支持文字和图片水印
- `v-pull-refresh` - 下拉刷新，支持自定义下拉距离和刷新动画
- `v-swipe` - 滑动切换，适用于轮播/Tab 场景
- `v-virtual-list` - 虚拟列表优化，支持大数据量渲染

**功能优化：**
- 所有新增指令支持 Vue 2 和 Vue 3
- 完善类型定义，提升 TypeScript 支持
- 优化打包体积

**文档更新：**
- 新增所有 v1.3.0 指令的完整文档
- 更新示例代码

#### v1.2.0 (2026-03-29)

**新增指令 (11个)：**
- `v-truncate` - 文本截断
- `v-uppercase` - 大写转换
- `v-lowercase` - 小写转换
- `v-capitalcase` - 首字母大写
- `v-number` - 数字格式化
- `v-money` - 金额格式化
- `v-trim` - 去空格
- `v-tooltip` - 提示框
- `v-draggable` - 拖拽
- `v-touch` - 手势
- `v-image-preview` - 图片预览

#### v1.1.0 (2026-03-29)

**功能增强：**
- SSR 优化
- 性能优化
- 类型定义完善

#### v1.0.0 (2026-03-27)

**首次发布：**
- 31 个核心指令
- Vue 2/3 兼容支持
- TypeScript 原生支持
- VitePress 文档站点
- 基础示例项目
