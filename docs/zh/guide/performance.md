# 性能优化

Directix v2.2.0 引入了极致性能优化工具，用于减小包体积、提升运行时性能和增强内存效率。

## 概览

| 工具 | 描述 | 版本 |
|------|------|------|
| 事件委托管理器 | 全局事件委托减少 DOM 监听器 | 2.2.0 |
| 批处理器 | 通用批处理器，支持优先级队列 | 2.2.0 |
| DOM 批量更新器 | 读写分离的 DOM 批量更新 | 2.2.0 |
| 虚拟列表优化器 | 动态高度缓存和 VNode 回收 | 2.2.0 |
| 内存泄漏检测器 | 自动检测和报告内存泄漏 | 2.2.0 |
| 对象池 | 对象池化，支持自动扩容和预热 | 1.11.0+ |
| 弱引用缓存 | 基于 WeakMap 的缓存，支持 LRU 淘汰 | 1.11.0+ |

## 事件委托管理器

通过将事件委托到公共祖先元素，减少 DOM 事件监听器数量。

### 基本用法

```typescript
import {
  registerDelegatedHandler,
  unregisterDelegatedHandler,
  configureEventDelegation,
} from 'directix'

// 配置（可选）
configureEventDelegation({
  enabled: true,
  root: document, // 或指定容器
  events: ['click', 'touchstart'],
  capture: false,
  maxHandlers: 1000,
})

// 注册委托处理器
const id = registerDelegatedHandler('.dropdown-trigger', 'click', (event, target) => {
  console.log('下拉触发器被点击:', target)
})

// 用完后注销
unregisterDelegatedHandler(id)
```

### API

| 函数 | 描述 |
|------|------|
| `registerDelegatedHandler(selector, event, handler, options?)` | 注册委托处理器，返回 ID |
| `unregisterDelegatedHandler(id)` | 通过 ID 移除处理器 |
| `pauseDelegatedHandler(id)` | 暂停但不移除 |
| `resumeDelegatedHandler(id)` | 恢复暂停的处理器 |
| `getDelegationStats()` | 获取委托统计信息 |
| `startDelegation()` | 启动委托 |
| `stopDelegation()` | 停止委托（移除根监听器） |

## 批处理器 & DOM 批量更新器

### DOMBatchUpdater

分离 DOM 读写操作，避免强制同步布局（布局抖动）。

```typescript
import { domRead, domWrite } from 'directix'

// 安排 DOM 读取
domRead(() => {
  const height = element.offsetHeight
  const width = element.offsetWidth

  // 基于读取值安排 DOM 写入
  domWrite(() => {
    element.style.transform = `translate(${width}px, ${height}px)`
  })
})
```

### BatchProcessor

通用批处理器，支持优先级队列，用于分组操作。

```typescript
import { BatchProcessor } from 'directix'

const processor = new BatchProcessor<Task, Result>(
  (tasks) => {
    return tasks.map(task => ({
      id: task.id,
      success: true,
      data: processTask(task.data),
      duration: 0,
    }))
  },
  { maxBatchSize: 50, flushInterval: 16, useRAF: true },
)

// 添加任务
processor.add(myTask, 'default', 100)

// 强制刷新
processor.flush()

// 获取统计
processor.getStats()
```

## 虚拟列表优化器

通过动态高度缓存和 VNode 回收优化虚拟滚动。

```typescript
import { VirtualListOptimizer } from 'directix'

const optimizer = new VirtualListOptimizer({
  bufferSize: 5,
  estimatedItemHeight: 40,
  dynamicHeight: true,
  recyclePoolSize: 100,
})

// 初始化总项目数和容器高度
optimizer.init(10000, 600)

// 缓存已知高度
optimizer.cacheItemHeight(0, 48)
optimizer.cacheItemHeight(1, 72)

// 根据滚动位置计算可见范围
const range = optimizer.calculateVisibleRange(scrollTop)

// 处理滚动事件
const scrollInfo = optimizer.handleScroll(scrollTop)

// 回收和复用 VNode
optimizer.recycleVNode('item-type', vnode)
const recycled = optimizer.acquireRecycledVNode('item-type')
```

## 内存泄漏检测器

自动检测和报告应用中的内存泄漏。

### 基本用法

```typescript
import {
  trackResource,
  cleanupResource,
  startLeakDetection,
  getLeakReports,
} from 'directix'

// 启动定期检测
startLeakDetection()

// 跟踪需要清理的资源
const listenerId = trackResource(
  'event-listener',
  'Window 滚动处理器',
  () => window.removeEventListener('scroll', handler),
  { target: window },
)

// 组件卸载时清理
cleanupResource(listenerId)

// 检查泄漏报告
const reports = getLeakReports()
for (const report of reports) {
  console.log(`[${report.severity}] ${report.description}`)
  for (const suggestion of report.suggestions) {
    console.log(`  → ${suggestion}`)
  }
}
```

## 增强的对象池

```typescript
import { ObjectPool } from 'directix'

const pool = new ObjectPool({
  initialSize: 10,
  maxSize: 100,
  autoExpand: true, // 新增：允许超出 maxSize 扩展
  createFunction: () => ({ x: 0, y: 0 }),
  resetFunction: (obj) => { obj.x = 0; obj.y = 0 },
})

// 预热池（新增）
pool.preWarm(50)

// 增强的统计（新增）
const stats = pool.getStats()
// { poolSize, maxSize, createdCount, availableCount, inUseCount, acquireCount, releaseCount, utilizationRate }
```

## 增强的弱引用缓存

```typescript
import { WeakCache } from 'directix'

const cache = new WeakCache<HTMLElement, any>(50)

cache.set(element, { computed: true })
cache.get(element)

// 新增：带命中率的缓存统计
const stats = cache.getStats()
// { hitCount, missCount, hitRate, strongCacheSize, maxStrongSize }
```
