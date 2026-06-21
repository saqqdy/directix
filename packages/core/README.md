# @directix/core

[![npm version](https://img.shields.io/npm/v/@directix/core.svg)](https://www.npmjs.com/package/@directix/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | **[中文文档](README_CN.md)**

Core runtime engine for [Directix](https://github.com/saqqdy/directix) — the comprehensive Vue directives library. Provides environment detection, performance optimization, monitoring, migration, and DevTools integration.

## Features

- 🔍 **Environment Detection** — Detect Vue version, browser capabilities, and SSR environment
- ⚡ **Performance Optimization** — Batch processor, DOM batch updater, object pool, computed cache, lazy initializer, memory cleanup manager
- 📊 **Monitoring & Alerting** — Metrics collection (counter/gauge/histogram), health checks, alert rules, Prometheus export
- 🎯 **Benchmark System** — Performance benchmarking, snapshot comparison, directive benchmark suite
- 🔧 **Event Delegation** — Global event delegation manager to reduce DOM listeners
- 🛡️ **Memory Leak Detector** — Track resources, detect leaks, generate reports
- 📝 **Audit Logging** — Full audit trail for directive operations, permission checks, and security violations
- ⚠️ **Warning System** — i18n-aware warnings, deprecation notices, SSR warnings
- 🔄 **Migration Helpers** — Migrate from v1 or other libraries (VueUse, v-directives)
- 🧩 **DevTools Integration** — Track and inspect directives in Vue DevTools
- 🏗️ **Config Center** — Centralized configuration with snapshots, rollback, and remote sync
- 📋 **Breaking Changes Registry** — Detect and warn about breaking API changes
- 🌐 **Browser Compatibility** — Feature detection, polyfill management, compatibility reports
- 🖥️ **First Screen Optimization** — Lazy loading, critical CSS extraction, deferred tasks, performance budgets
- 📜 **Virtual List Optimizer** — Efficient virtual scrolling with VNode recycling

## Installation

```bash
# pnpm
pnpm add @directix/core

# npm
npm install @directix/core

# yarn
yarn add @directix/core
```

## Usage

### Environment Detection

```typescript
import { isBrowser, isVue3, isSSR, getVueVersion } from '@directix/core'

if (isBrowser() && isVue3()) {
  console.log('Running in browser with Vue 3')
}

if (isSSR()) {
  console.log('Running on server side')
}
```

### Performance Monitoring

```typescript
import {
  enablePerformance,
  startMeasure,
  endMeasure,
  getPerformanceReport,
} from '@directix/core'

enablePerformance()

const mark = startMeasure('v-lazy', 'mount')
// ... directive logic
endMeasure(mark)

const report = getPerformanceReport()
```

### Event Delegation

```typescript
import {
  startDelegation,
  registerDelegatedHandler,
  unregisterDelegatedHandler,
} from '@directix/core'

startDelegation()

const id = registerDelegatedHandler('.btn', 'click', (event, target) => {
  console.log('Button clicked:', target)
})

unregisterDelegatedHandler(id)
```

### Batch Processing

```typescript
import { domRead, domWrite, getDOMBatchUpdater } from '@directix/core'

// Avoid layout thrashing with read/write separation
domRead(() => {
  const height = el.offsetHeight
  domWrite(() => {
    el.style.height = `${height + 20}px`
  })
})
```

### Memory Leak Detection

```typescript
import {
  startLeakDetection,
  trackResource,
  untrackResource,
  getLeakReports,
} from '@directix/core'

startLeakDetection()

const id = trackResource('observer', myObserver, el)
// When cleaned up
untrackResource(id)
```

### Audit Logging

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

### Warning System

```typescript
import {
  warnDeprecated,
  warnMissingParam,
  warnNotSupported,
  setWarningI18n,
} from '@directix/core'

setWarningI18n(myI18nInstance)

warnDeprecated('v-old-directive', 'Use v-new-directive instead')
warnMissingParam('v-copy', 'value')
```

### Migration

```typescript
import { migrate, needsMigration, generateMigrationReport } from '@directix/core'

if (needsMigration(code, 'vueuse')) {
  const result = migrate(code, { from: 'vueuse' })
  console.log(result.output)
  console.log(result.stats)
}
```

### Config Center

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
  console.log('Roles changed:', oldVal, '→', newVal)
})
```

### Define Directive

```typescript
import { defineDirective, defineDirectiveGroup } from '@directix/core'

const vMyDirective = defineDirective({
  name: 'v-my-directive',
  mounted(el, binding) {
    // directive logic
  },
})

const { install, directives } = defineDirectiveGroup([
  vDirective1,
  vDirective2,
])
```

## API Reference

| Module | Key Exports |
|--------|-------------|
| **env** | `isBrowser`, `isSSR`, `isVue2`, `isVue3`, `getVueVersion` |
| **performance** | `enablePerformance`, `measurePerformance`, `getPerformanceReport` |
| **batch-processor** | `BatchProcessor`, `DOMBatchUpdater`, `domRead`, `domWrite` |
| **event-delegation** | `registerDelegatedHandler`, `startDelegation`, `stopDelegation` |
| **memory-leak-detector** | `startLeakDetection`, `trackResource`, `getLeakReports` |
| **audit-log** | `logDirectiveOperation`, `logPermissionCheck`, `exportAuditLogs` |
| **monitoring** | `incrementCounter`, `setGauge`, `recordHistogram`, `triggerAlert` |
| **benchmark** | `runBenchmark`, `compareBenchmarks`, `takePerformanceSnapshot` |
| **migration** | `migrate`, `needsMigration`, `generateMigrationReport` |
| **warning** | `warn`, `warnDeprecated`, `warnMissingParam`, `setWarningI18n` |
| **config-center** | `setConfig`, `getConfig`, `watchConfig`, `rollbackConfig` |
| **breaking-changes** | `warnBreakingChange`, `checkAPIUsage`, `generateBreakingChangesReport` |
| **compatibility** | `isFeatureSupported`, `registerPolyfill`, `generateCompatibilityReport` |
| **first-screen** | `initFirstScreenOptimizer`, `deferNonCriticalDirective`, `prefetchModule` |
| **virtual-list-optimizer** | `VirtualListOptimizer`, `getVirtualListOptimizer` |
| **devtools** | `enableDevtools`, `trackDirective`, `trackPlugin` |
| **define** | `defineDirective`, `defineDirectiveGroup` |

## Related

- [Directix](https://github.com/saqqdy/directix) — Main Vue directives library
- [@directix/shared](https://github.com/saqqdy/directix/tree/master/packages/shared) — Shared utilities
- [@directix/i18n](https://github.com/saqqdy/directix/tree/master/packages/i18n) — Internationalization support

## License

[MIT](https://opensource.org/licenses/MIT)
