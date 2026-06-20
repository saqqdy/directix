# Performance Optimization

Directix v2.2.0 introduces extreme performance optimization utilities to reduce bundle size, improve runtime performance, and enhance memory efficiency.

## Overview

| Utility | Description | Since |
|---------|-------------|-------|
| EventDelegationManager | Global event delegation to reduce DOM listeners | 2.2.0 |
| BatchProcessor | Generic batch processor with priority queue | 2.2.0 |
| DOMBatchUpdater | Read/write separated DOM batch updater | 2.2.0 |
| VirtualListOptimizer | Virtual scrolling with dynamic height caching | 2.2.0 |
| MemoryLeakDetector | Automatic memory leak detection and reporting | 2.2.0 |
| ObjectPool | Object pooling with auto-expand and pre-warming | 1.11.0+ |
| WeakCache | WeakMap-based cache with LRU eviction | 1.11.0+ |

## Event Delegation Manager

Reduce the number of DOM event listeners by delegating events to a common ancestor.

### Basic Usage

```typescript
import {
  registerDelegatedHandler,
  unregisterDelegatedHandler,
  configureEventDelegation,
} from 'directix'

// Configure (optional)
configureEventDelegation({
  enabled: true,
  root: document, // or a specific container
  events: ['click', 'touchstart'],
  capture: false,
  maxHandlers: 1000,
})

// Register a delegated handler
const id = registerDelegatedHandler('.dropdown-trigger', 'click', (event, target) => {
  console.log('Dropdown trigger clicked:', target)
})

// Unregister when done
unregisterDelegatedHandler(id)
```

### API

| Function | Description |
|----------|-------------|
| `registerDelegatedHandler(selector, event, handler, options?)` | Register a delegated handler, returns ID |
| `unregisterDelegatedHandler(id)` | Remove a handler by ID |
| `pauseDelegatedHandler(id)` | Pause without removing |
| `resumeDelegatedHandler(id)` | Resume a paused handler |
| `getDelegationStats()` | Get delegation statistics |
| `startDelegation()` | Start delegation |
| `stopDelegation()` | Stop delegation (removes root listeners) |

## Batch Processor & DOM Batch Updater

### DOMBatchUpdater

Separate DOM reads and writes to avoid forced synchronous layouts (layout thrashing).

```typescript
import { domRead, domWrite, getDOMBatchUpdater } from 'directix'

// Schedule a DOM read
domRead(() => {
  const height = element.offsetHeight
  const width = element.offsetWidth

  // Schedule a DOM write based on the read values
  domWrite(() => {
    element.style.transform = `translate(${width}px, ${height}px)`
  })
})
```

### BatchProcessor

Generic batch processor with priority queue for grouping operations.

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

// Add tasks
processor.add(myTask, 'default', 100) // data, type, priority

// Force flush
processor.flush()

// Get stats
processor.getStats()
```

## Virtual List Optimizer

Optimize virtual scrolling lists with dynamic height caching and VNode recycling.

```typescript
import { VirtualListOptimizer } from 'directix'

const optimizer = new VirtualListOptimizer({
  bufferSize: 5,
  estimatedItemHeight: 40,
  dynamicHeight: true,
  recyclePoolSize: 100,
})

// Initialize with total items and container height
optimizer.init(10000, 600)

// Cache known heights
optimizer.cacheItemHeight(0, 48)
optimizer.cacheItemHeight(1, 72)

// Calculate visible range based on scroll position
const range = optimizer.calculateVisibleRange(scrollTop)
// { start: 0, end: 20, total: 10000, startOffset: 0, endOffset: 48000 }

// Handle scroll events
const scrollInfo = optimizer.handleScroll(scrollTop)
// { scrollTop, direction, velocity, isScrolling }

// Recycle and reuse VNodes
optimizer.recycleVNode('item-type', vnode)
const recycled = optimizer.acquireRecycledVNode('item-type')
```

## Memory Leak Detector

Automatically detect and report memory leaks in your application.

### Basic Usage

```typescript
import {
  trackResource,
  cleanupResource,
  startLeakDetection,
  getLeakReports,
} from 'directix'

// Start periodic detection
startLeakDetection()

// Track resources that need cleanup
const listenerId = trackResource(
  'event-listener',
  'Window scroll handler',
  () => window.removeEventListener('scroll', handler),
  { target: window },
)

const observerId = trackResource(
  'observer',
  'IntersectionObserver for lazy loading',
  () => observer.disconnect(),
  { tags: ['lazy', 'observer'] },
)

// When component unmounts, clean up
cleanupResource(listenerId)
cleanupResource(observerId)

// Check for leaks
const reports = getLeakReports()
for (const report of reports) {
  console.log(`[${report.severity}] ${report.description}`)
  for (const suggestion of report.suggestions) {
    console.log(`  → ${suggestion}`)
  }
}
```

### API

| Function | Description |
|----------|-------------|
| `configureMemoryLeakDetector(config)` | Configure detector |
| `trackResource(type, description, cleanup, options?)` | Track a resource |
| `untrackResource(id)` | Stop tracking (without cleanup) |
| `cleanupResource(id)` | Cleanup and untrack |
| `cleanupResourcesByType(type)` | Cleanup all of a type |
| `takeSnapshot()` | Take a memory snapshot |
| `getLeakReports()` | Get detected leak reports |
| `startLeakDetection()` | Start periodic detection |
| `stopLeakDetection()` | Stop detection |

## Enhanced ObjectPool

```typescript
import { ObjectPool } from 'directix'

const pool = new ObjectPool({
  initialSize: 10,
  maxSize: 100,
  autoExpand: true, // NEW: allow growth beyond maxSize
  createFunction: () => ({ x: 0, y: 0 }),
  resetFunction: (obj) => { obj.x = 0; obj.y = 0 },
})

// Pre-warm the pool (NEW)
pool.preWarm(50)

// Use the pool
const obj = pool.acquire()
obj.x = 10
pool.release(obj)

// Enhanced stats (NEW)
const stats = pool.getStats()
// { poolSize, maxSize, createdCount, availableCount, inUseCount, acquireCount, releaseCount, utilizationRate }
```

## Enhanced WeakCache

```typescript
import { WeakCache } from 'directix'

const cache = new WeakCache<HTMLElement, any>(50)

cache.set(element, { computed: true })
cache.get(element)

// NEW: Cache statistics with hit rate
const stats = cache.getStats()
// { hitCount, missCount, hitRate, strongCacheSize, maxStrongSize }
```
