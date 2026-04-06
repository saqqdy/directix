# 可提取的公共方法分析

> 分析时间：2026/04/06
> 分析范围：src 目录下所有 directives 和 composables
> **更新时间：2026/04/06 - 已完成优化**

---

## 概述

本文档分析了 Directix 代码库中可以提取为公共方法的重复模式，以减少代码重复、提高可维护性。

**已完成优化项已在各章节标注 ✅**

---

## 1. normalizeOptions 模式 - 选项规范化工厂函数

### 出现位置

几乎所有 directive 和 composable 都有类似的 `normalizeOptions` 函数

### 重复模式

```ts
function normalizeOptions(binding: XXXBinding | undefined): XXXOptions {
  // 1. 检查 binding 是否为函数 → 返回默认配置 + handler
  if (typeof binding === 'function') {
    return { handler: binding, ...defaults }
  }
  
  // 2. 检查 binding 是否为字符串/数字/布尔值 → 转换为对象
  if (typeof binding === 'string') {
    return { value: binding, ...defaults }
  }
  
  if (typeof binding === 'boolean') {
    return { disabled: !binding, ...defaults }
  }
  
  // 3. 检查 binding 是否为对象 → 合并默认值
  return { ...defaults, ...binding }
}
```

### 当前状态

已在 `src/utils/directive.ts` 中提供：
- `createNormalizer<T>()` - 通用规范化工厂
- `normalizeHandlerOptions()` - handler 模式专用
- `normalizeTimeOptions()` - 时间参数专用

### 建议

推广使用已有工具函数，统一各 directive 的选项规范化逻辑。

---

## 2. 元素状态存储模式 - Element State Management

### 出现位置

几乎所有 directives

### 重复模式

```ts
// 存储
;(el as any).__xxx = state

// 获取
const state: XXXState = (el as any).__xxx

// 删除
delete (el as any).__xxx
```

### 当前状态

已在 `@directix/shared` 中提供：
- `getState(el, key)`
- `setState(el, key, state)`
- `deleteState(el, key)`
- `hasState(el, key)`

### 建议

统一使用 `@directix/shared` 中的状态管理函数，避免直接操作 `(el as any).__xxx`。

---

## 3. isInputElement 检测 - 输入元素判断 ✅ 已优化

### 出现位置

| 文件 | 行号 | 状态 |
|------|------|------|
| packages/shared/src/dom.ts | - | ✅ 新增 - 统一导出 |
| src/utils/text-transform.ts | 69 | ✅ 从 shared 重新导出 |
| src/directives/mask.ts | - | ✅ 使用 isInputElement |
| src/directives/money.ts | - | ✅ 使用 isInputElement |
| src/directives/number.ts | - | ✅ 使用 isInputElement |
| src/directives/trim.ts | - | ✅ 使用 isInputElement |

### 重复模式

```ts
// text-transform.ts (已提取)
export function isInputElement(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement {
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
}

// mask.ts (重复定义)
function isInput(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement {
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
}

// money.ts / number.ts / trim.ts (内联)
if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { ... }
```

### 建议

统一使用 `src/utils/text-transform.ts` 中的 `isInputElement` 函数，或提取到 `@directix/shared`。

---

## 4. 事件监听清理模式 - Event Listener Cleanup

### 出现位置

- src/directives/hover.ts - 使用 `bindEvents` 返回 cleanup
- src/directives/long-press.ts - 手动管理多个事件
- src/directives/click-outside.ts - 手动管理 Map
- src/directives/ripple.ts - 简单的 on/off
- src/directives/swipe.ts
- src/directives/touch.ts

### 重复模式

```ts
// mounted - 添加多个事件
el.addEventListener('mousedown', startHandler)
el.addEventListener('mouseup', endHandler)
el.addEventListener('mousemove', moveHandler)
el.addEventListener('touchstart', startHandler)
el.addEventListener('touchend', endHandler)
el.addEventListener('touchmove', moveHandler)

// unmounted - 移除多个事件
el.removeEventListener('mousedown', startHandler)
el.removeEventListener('mouseup', endHandler)
el.removeEventListener('mousemove', moveHandler)
el.removeEventListener('touchstart', startHandler)
el.removeEventListener('touchend', endHandler)
el.removeEventListener('touchmove', moveHandler)
```

### 当前状态

已在 `@directix/shared` 中提供 `bindEvents`：
```ts
const cleanup = bindEvents(el, {
  mousedown: startHandler,
  mouseup: endHandler,
  mousemove: moveHandler,
  touchstart: startHandler,
  touchend: endHandler,
  touchmove: moveHandler,
})
// unmounted 时调用 cleanup()
```

### 建议

推广使用 `bindEvents` 统一管理事件监听。

---

## 5. getEventPosition - 获取事件坐标 ✅ 已优化

### 出现位置

| 文件 | 行号 | 状态 |
|------|------|------|
| packages/shared/src/event.ts | 128 | ✅ 已存在 |
| src/directives/long-press.ts | - | ✅ 从 shared 导入使用 |
| src/composables/use-long-press.ts | - | ✅ 已移除重复定义，使用 shared |

### 建议

~~统一使用 `@directix/shared` 中的 `getEventPosition`。~~ 已完成

---

## 6. getDistance - 计算两点距离 ✅ 已优化

### 出现位置

| 文件 | 行号 | 状态 |
|------|------|------|
| packages/shared/src/utils.ts | - | ✅ 新增 |
| src/directives/long-press.ts | - | ✅ 从 shared 导入使用 |
| src/composables/use-long-press.ts | - | ✅ 已移除重复定义，使用 shared |

### 建议

~~提取到 `@directix/shared`，供 long-press 相关功能复用。~~ 已完成

---

## 7. 内置节流逻辑 - Built-in Throttle

### 出现位置

- src/directives/scroll.ts (行 59) - 内置 throttle 逻辑
- src/directives/infinite-scroll.ts (行 47) - 内置 throttle 逻辑

### 重复模式

```ts
// scroll.ts
let throttleTimer: ReturnType<typeof setTimeout> | null = null

const scrollHandler = (e: Event) => {
  if (throttleTimer) return
  
  throttleTimer = setTimeout(() => {
    throttleTimer = null
  }, options.throttle)
  
  // 执行逻辑...
}

// unmounted
if (throttleTimer) clearTimeout(throttleTimer)
```

### 建议

创建 `useThrottleHandler` 工具函数，或直接使用 `@directix/shared` 中的 `throttle`。

---

## 8. escapeRegex - 正则转义 ✅ 已优化

### 出现位置

| 文件 | 状态 |
|------|------|
| packages/shared/src/utils.ts | ✅ 新增 |
| src/directives/trim.ts | ✅ 使用 shared 中的函数 |

### 建议

~~提取到 `@directix/shared`，可能在其他需要正则的地方复用（如 mask、sanitize 等）。~~ 已完成

---

## 9. ensurePositionRelative - 确保 relative 定位 ✅ 已优化

### 出现位置

| 文件 | 状态 |
|------|------|
| packages/shared/src/dom.ts | ✅ 新增 ensurePosition, ensureOverflowHidden |
| src/directives/ripple.ts | ✅ 使用 ensurePosition, ensureOverflowHidden |
| src/directives/loading.ts | ✅ 使用 ensurePosition |
| src/directives/resize.ts | ✅ 使用 ensurePosition |

### 已提取

```ts
/**
 * 确保元素具有指定的定位类型
 * 如果当前是 static，则设置为指定的定位
 */
export function ensurePosition(
  el: HTMLElement, 
  position: 'relative' | 'absolute' = 'relative'
): void

/**
 * 确保元素有 overflow: hidden（用于包含子元素如 ripple）
 */
export function ensureOverflowHidden(el: HTMLElement): void
```

---

## 10. Observer 模式封装 - Observer Managers

### 出现位置

| 文件 | Observer 类型 |
|------|---------------|
| src/directives/intersect.ts | IntersectionObserver |
| src/directives/resize.ts | ResizeObserver |
| src/directives/mutation.ts | MutationObserver |
| src/directives/lazy.ts | IntersectionObserver (全局单例) |
| src/directives/infinite-scroll.ts | IntersectionObserver |

### 重复模式

```ts
// 检查支持
if (!supportsIntersectionObserver()) {
  console.warn('[Directix] v-xxx: IntersectionObserver not supported')
  return
}

// 创建 observer
const observer = new IntersectionObserver(callback, {
  root: options.root,
  rootMargin: options.rootMargin,
  threshold: options.threshold,
})

observer.observe(el)

// unmounted 时
observer.disconnect()
delete (el as any).__xxx
```

### 建议提取

```ts
interface ObserverManager<T extends Observer> {
  observe(el: HTMLElement): void
  unobserve(el: HTMLElement): void
  disconnect(): void
}

function createObserverManager<T extends Observer>(
  ObserverClass: new (...args: any[]) => T,
  options: ObserverOptions,
  callback: (entries: any[], observer: T) => void
): ObserverManager<T>
```

---

## 优先级建议

| 优先级 | 方法 | 影响文件数 | 当前状态 | 建议 |
|--------|------|------------|----------|------|
| 🔴 高 | `isInputElement` | 5+ | ✅ 已优化 | 统一使用已有函数 |
| 🔴 高 | `getEventPosition` / `getDistance` | 4 | ✅ 已优化 | 提取到 shared |
| 🔴 高 | `normalizeOptions` 工厂 | 20+ | ✅ 已有工具 | 推广使用 |
| 🟡 中 | `ensurePositionRelative` | 3 | ✅ 已优化 | 已提取 |
| 🟡 中 | `bindEvents` 清理模式 | 10+ | ✅ 已有工具 | 推广使用 |
| 🟡 中 | Observer 管理器 | 5 | 未抽象 | 可抽象 |
| 🟢 低 | `escapeRegex` | 1 | ✅ 已优化 | 已提取 |
| 🟢 低 | 内置 throttle | 2 | 重复实现 | 可统一 |

---

## 已良好提取的模块

以下模块已正确提取为公共工具，结构良好：

| 模块 | 位置 | 使用情况 |
|------|------|----------|
| 数字格式化工具 | `src/utils/number.ts` | ✅ 被 money/number directive 使用，使用 shared 的 clamp |
| 文本转换工具 | `src/utils/text-transform.ts` | ✅ 被 uppercase/lowercase/capitalcase 使用，重新导出 isInputElement |
| Directive 工具 | `src/utils/directive.ts` | ✅ 提供 createNormalizer, useTimer 等 |
| 时间解析 | `@directix/shared` | ✅ parseTime 广泛使用 |
| 事件工具 | `@directix/shared` | ✅ on/off/bindEvents/getEventPosition 使用 |
| 滚动工具 | `@directix/shared` | ✅ getScrollParent 使用 |
| 几何计算 | `@directix/shared` | ✅ 新增 getDistance, clamp |
| DOM 工具 | `@directix/shared` | ✅ 新增 isInputElement, ensurePosition, ensureOverflowHidden |
| 字符串工具 | `@directix/shared` | ✅ 新增 escapeRegex |

---

## 执行计划

### Phase 1: 统一现有工具使用 ✅ 已完成

1. ✅ 将 `mask.ts`、`money.ts`、`number.ts`、`trim.ts` 中的输入元素判断改为使用 `isInputElement`
2. ✅ 将 `use-long-press.ts` 中的 `getEventPosition` 和 `getDistance` 改为从 `@directix/shared` 导入
3. 推广 `createNormalizer` 在新 directive 中的使用

### Phase 2: 提取新工具 ✅ 已完成

1. ✅ 在 `@directix/shared` 中添加：
   - `getDistance(p1, p2)`
   - `escapeRegex(str)`
   - `clamp(value, min, max)`

2. ✅ 在 `packages/shared/src/dom.ts` 中添加：
   - `isInputElement(el)`
   - `ensurePosition(el, position)`
   - `ensureOverflowHidden(el)`

### Phase 3: 重构现有代码 ✅ 已完成

1. ✅ 更新 `use-long-press.ts` 使用 shared 工具
2. ✅ 更新 `ripple.ts`、`loading.ts`、`resize.ts` 使用 ensurePosition
3. ✅ 更新 `trim.ts` 使用 escapeRegex

### 待完成项

- [ ] 考虑创建 Observer 管理器简化 observer 相关 directive
- [ ] 统一 scroll/infinite-scroll 中的内置 throttle 逻辑
