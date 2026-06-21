# @directix/core

[![npm version](https://img.shields.io/npm/v/@directix/core.svg)](https://www.npmjs.com/package/@directix/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

[Directix](https://github.com/saqqdy/directix) 的核心运行时引擎 — 全面的 Vue 指令库。提供环境检测、性能优化、监控告警、迁移工具和 DevTools 集成。

## 特性

- 🔍 **环境检测** — 检测 Vue 版本、浏览器能力和 SSR 环境
- ⚡ **性能优化** — 批处理器、DOM 批量更新器、对象池、计算缓存、延迟初始化器、内存清理管理器
- 📊 **监控告警** — 指标采集计数器/仪表盘/直方图、健康检查、告警规则、Prometheus 导出
- 🎯 **基准测试** — 性能基准测试、快照对比、指令基准测试套件
- 🔧 **事件委托** — 全局事件委托管理器，减少 DOM 监听器
- 🛡️ **内存泄漏检测** — 追踪资源、检测泄漏、生成报告
- 📝 **审计日志** — 指令操作、权限检查和违规操作的完整审计追踪
- ⚠️ **警告系统** — 支持国际化的警告、废弃通知、SSR 警告
- 🔄 **迁移工具** — 从 v1 或其他库（VueUse、v-directives）迁移
- 🧩 **DevTools 集成** — 在 Vue DevTools 中追踪和检查指令
- 🏗️ **配置中心** — 集中配置管理，支持快照、回滚和远程同步
- 📋 **破坏性变更注册表** — 检测和警告 API 破坏性变更
- 🌐 **浏览器兼容性** — 功能检测、Polyfill 管理、兼容性报告
- 🖥️ **首屏优化** — 延迟加载、关键 CSS 提取、延迟任务、性能预算
- 📜 **虚拟列表优化** — 支持 VNode 回收的高效虚拟滚动

## 安装

```bash
# pnpm
pnpm add @directix/core

# npm
npm install @directix/core

# yarn
yarn add @directix/core
```

## 使用

### 环境检测

```typescript
import { isBrowser, isVue3, isSSR, getVueVersion } from '@directix/core'

if (isBrowser() && isVue3()) {
  console.log('运行在浏览器的 Vue 3 环境')
}

if (isSSR()) {
  console.log('运行在服务端')
}
```

### 性能监控

```typescript
import {
  enablePerformance,
  startMeasure,
  endMeasure,
  getPerformanceReport,
} from '@directix/core'

enablePerformance()

const mark = startMeasure('v-lazy', 'mount')
// ... 指令逻辑
endMeasure(mark)

const report = getPerformanceReport()
```

### 事件委托

```typescript
import {
  startDelegation,
  registerDelegatedHandler,
  unregisterDelegatedHandler,
} from '@directix/core'

startDelegation()

const id = registerDelegatedHandler('.btn', 'click', (event, target) => {
  console.log('按钮被点击:', target)
})

unregisterDelegatedHandler(id)
```

### 批量处理

```typescript
import { domRead, domWrite, getDOMBatchUpdater } from '@directix/core'

// 通过读写分离避免布局抖动
domRead(() => {
  const height = el.offsetHeight
  domWrite(() => {
    el.style.height = `${height + 20}px`
  })
})
```

### 内存泄漏检测

```typescript
import {
  startLeakDetection,
  trackResource,
  untrackResource,
  getLeakReports,
} from '@directix/core'

startLeakDetection()

const id = trackResource('observer', myObserver, el)
// 清理时
untrackResource(id)
```

### 审计日志

```typescript
import {
  configureAuditLog,
  logDirectiveOperation,
  logPermissionCheck,
  getAuditLogs,
  exportAuditLogs,
} from '@directix/core'

configureAuditLog({ enabled: true, level: 'info' })

logDirectiveOperation('v-permission', 'check', { role: 'admin' })

const logs = getAuditLogs({ limit: 100 })
const csv = exportAuditLogs({ format: 'csv' })
```

### 警告系统

```typescript
import {
  warnDeprecated,
  warnMissingParam,
  warnNotSupported,
  setWarningI18n,
} from '@directix/core'

setWarningI18n(myI18nInstance)

warnDeprecated('v-old-directive', '请使用 v-new-directive')
warnMissingParam('v-copy', 'value')
```

### 迁移

```typescript
import { migrate, needsMigration, generateMigrationReport } from '@directix/core'

if (needsMigration(code, 'vueuse')) {
  const result = migrate(code, { from: 'vueuse' })
  console.log(result.output)
  console.log(result.stats)
}
```

### 配置中心

```typescript
import {
  initConfigCenter,
  setConfig,
  getConfig,
  watchConfig,
  rollbackConfig,
} from '@directix/core'

initConfigCenter()

setConfig('permission.roles', ['admin', 'editor'])
const roles = getConfig('permission.roles')

watchConfig('permission.roles', (newVal, oldVal) => {
  console.log('角色已变更:', oldVal, '→', newVal)
})
```

### 定义指令

```typescript
import { defineDirective, defineDirectiveGroup } from '@directix/core'

const vMyDirective = defineDirective({
  name: 'v-my-directive',
  mounted(el, binding) {
    // 指令逻辑
  },
})

const { install, directives } = defineDirectiveGroup([
  vDirective1,
  vDirective2,
])
```

## API 参考

| 模块 | 关键导出 |
|------|----------|
| **env** | `isBrowser`、`isSSR`、`isVue2`、`isVue3`、`getVueVersion` |
| **performance** | `enablePerformance`、`measurePerformance`、`getPerformanceReport` |
| **batch-processor** | `BatchProcessor`、`DOMBatchUpdater`、`domRead`、`domWrite` |
| **event-delegation** | `registerDelegatedHandler`、`startDelegation`、`stopDelegation` |
| **memory-leak-detector** | `startLeakDetection`、`trackResource`、`getLeakReports` |
| **audit-log** | `logDirectiveOperation`、`logPermissionCheck`、`exportAuditLogs` |
| **monitoring** | `incrementCounter`、`setGauge`、`recordHistogram`、`triggerAlert` |
| **benchmark** | `runBenchmark`、`compareBenchmarks`、`takePerformanceSnapshot` |
| **migration** | `migrate`、`needsMigration`、`generateMigrationReport` |
| **warning** | `warn`、`warnDeprecated`、`warnMissingParam`、`setWarningI18n` |
| **config-center** | `setConfig`、`getConfig`、`watchConfig`、`rollbackConfig` |
| **breaking-changes** | `warnBreakingChange`、`checkAPIUsage`、`generateBreakingChangesReport` |
| **compatibility** | `isFeatureSupported`、`registerPolyfill`、`generateCompatibilityReport` |
| **first-screen** | `initFirstScreenOptimizer`、`deferNonCriticalDirective`、`prefetchModule` |
| **virtual-list-optimizer** | `VirtualListOptimizer`、`getVirtualListOptimizer` |
| **devtools** | `enableDevtools`、`trackDirective`、`trackPlugin` |
| **define** | `defineDirective`、`defineDirectiveGroup` |

## 相关

- [Directix](https://github.com/saqqdy/directix) — 主 Vue 指令库
- [@directix/shared](https://github.com/saqqdy/directix/tree/master/packages/shared) — 共享工具集
- [@directix/i18n](https://github.com/saqqdy/directix/tree/master/packages/i18n) — 国际化支持

## 许可证

[MIT](https://opensource.org/licenses/MIT)
