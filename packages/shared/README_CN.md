# @directix/shared

[![npm version](https://img.shields.io/npm/v/@directix/shared.svg)](https://www.npmjs.com/package/@directix/shared)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

[Directix](https://github.com/saqqdy/directix) 的共享工具集 — 浏览器检测、DOM 操作、事件处理、指令状态管理和常用工具函数。零 Vue 依赖，可在任何 JavaScript 项目中使用。

## 特性

- 🌐 **浏览器检测** — 检测浏览器厂商、操作系统、设备类型和功能支持
- 🖥️ **DOM 操作** — 元素查询、类名操作、样式辅助、视口检测
- ⚡ **事件处理** — 添加/移除事件、事件委托、键盘匹配器、位置提取
- 🎹 **事件修饰符** — Vue 风格的事件修饰符（`.stop`、`.prevent`、`.capture` 等）
- 📦 **指令状态** — 在 DOM 元素上获取/设置/删除指令状态
- 🔧 **工具函数** — 类型检查、深克隆/合并、防抖/节流、时间解析、生成 ID

## 安装

```bash
# pnpm
pnpm add @directix/shared

# npm
npm install @directix/shared

# yarn
yarn add @directix/shared
```

## 使用

### 浏览器检测

```typescript
import { detectBrowser, isChrome, isMobile, isWeChat } from '@directix/shared'

const info = detectBrowser()
// { vendor: 'chrome', version: '125', os: 'macos', device: 'desktop', isMobile: false, ... }

if (isMobile()) {
  console.log('运行在移动设备上')
}

if (isWeChat()) {
  console.log('运行在微信浏览器中')
}
```

### 功能检测

```typescript
import {
  supportsIntersectionObserver,
  supportsResizeObserver,
  supportsPassiveEvents,
  supportsClipboardAPI,
  supportsCSSGrid,
} from '@directix/shared'

if (supportsIntersectionObserver()) {
  // 使用 IntersectionObserver
}
```

### DOM 操作

```typescript
import {
  getElement,
  addClass,
  removeClass,
  setStyle,
  setStyles,
  isInViewport,
  getScrollParent,
  ensurePosition,
  ensureOverflowHidden,
} from '@directix/shared'

const el = getElement('#app')
addClass(el!, 'active')
setStyles(el as HTMLElement, { opacity: 0.5, transform: 'scale(1.1)' })
```

### 事件处理

```typescript
import { on, off, delegate, bindEvents } from '@directix/shared'

// 单个事件
on(el, 'click', handler)

// 事件委托
const cleanup = delegate(container, '.item', 'click', (target, e) => {
  console.log('条目被点击:', target)
})

// 批量绑定
const unbind = bindEvents(el, {
  touchstart: handleStart,
  touchmove: handleMove,
  touchend: handleEnd,
})

// 清理
unbind()
```

### 事件修饰符

```typescript
import { withModifiers } from '@directix/shared'

// 应用 Vue 风格的事件修饰符
const handler = withModifiers((e) => {
  console.log('已点击！')
}, ['prevent', 'stop'])

on(button, 'click', handler)
```

### 指令状态管理

```typescript
import { setState, getState, deleteState, hasState } from '@directix/shared'

// 在元素上存储指令状态
setState(el, 'tooltip', { visible: true, content: '你好' })

// 读取状态
const state = getState<TooltipState>(el, 'tooltip')

// 检查是否存在
if (hasState(el, 'tooltip')) {
  deleteState(el, 'tooltip')
}
```

### 工具函数

```typescript
import {
  isString,
  isNumber,
  isObject,
  deepClone,
  deepMerge,
  debounce,
  throttle,
  parseTime,
  generateId,
  clamp,
  getDistance,
} from '@directix/shared'

// 防抖
const debouncedSearch = debounce(search, 300)
debouncedSearch('查询')

// 节流
const throttledScroll = throttle(handleScroll, 100)

// 时间解析
parseTime('300ms') // 300
parseTime('1s')    // 1000

// 值裁剪
clamp(150, 0, 100) // 100
```

## API 参考

### 浏览器检测

| 函数 | 说明 |
|------|------|
| `detectBrowser()` | 获取完整浏览器检测结果 |
| `isBrowserEnv()` | 检测是否运行在浏览器中 |
| `detectBrowserVendor()` | 检测浏览器厂商 |
| `detectOS()` | 检测操作系统 |
| `detectDeviceType()` | 检测设备类型 |
| `isMobile()` / `isTablet()` / `isDesktop()` | 设备类型判断 |
| `isChrome()` / `isFirefox()` / `isSafari()` / `isEdge()` | 浏览器判断 |
| `isWeChat()` / `isQQBrowser()` / `isUCBrowser()` | 国内浏览器判断 |
| `supportsPassiveEvents()` / `supportsIntersectionObserver()` | 功能检测 |

### DOM 操作

| 函数 | 说明 |
|------|------|
| `getElement(target)` | 通过选择器获取元素或返回元素本身 |
| `getAllElements(selector)` | 获取所有匹配的元素 |
| `addClass` / `removeClass` / `toggleClass` / `hasClass` | 类名操作 |
| `getStyle` / `setStyle` / `setStyles` | 样式辅助 |
| `getOffset` / `getSize` / `isInViewport` | 位置与尺寸 |
| `getScrollParent` | 查找最近的可滚动父元素 |
| `matches` / `closest` | 选择器匹配 |
| `isInputElement` | 检查元素是否为 input/textarea |
| `ensurePosition` / `ensureOverflowHidden` | CSS 安全辅助 |

### 事件处理

| 函数 | 说明 |
|------|------|
| `on(target, event, handler, options)` | 添加事件监听 |
| `off(target, event, handler, options)` | 移除事件监听 |
| `emit(target, event, detail)` | 触发自定义事件 |
| `delegate(container, selector, event, handler)` | 事件委托 |
| `bindEvents(target, events, options)` | 批量事件绑定 |
| `stopPropagation` / `preventDefault` / `stopEvent` | 事件修饰 |
| `getEventPosition(e)` | 提取鼠标/触摸位置 |
| `createKeyMatcher(key, modifiers)` | 键盘事件匹配器 |

### 指令状态

| 函数 | 说明 |
|------|------|
| `setState(el, key, state)` | 存储指令状态 |
| `getState(el, key)` | 读取指令状态 |
| `deleteState(el, key)` | 删除指令状态 |
| `hasState(el, key)` | 检查状态是否存在 |

### 工具函数

| 函数 | 说明 |
|------|------|
| `isString` / `isNumber` / `isBoolean` / `isFunction` / `isObject` / `isArray` / `isPromise` / `isEmpty` | 类型检查 |
| `deepClone(obj)` | 深克隆对象 |
| `deepMerge(target, ...sources)` | 深度合并对象 |
| `get(obj, path, default?)` | 按路径获取嵌套属性 |
| `set(obj, path, value)` | 按路径设置嵌套属性 |
| `debounce(func, wait, options?)` | 防抖函数 |
| `throttle(func, wait, options?)` | 节流函数 |
| `parseTime(arg)` | 解析时间字符串（`'300ms'`、`'1s'`） |
| `generateId(prefix?)` | 生成唯一 ID |
| `getDistance(p1, p2)` | 计算两点距离 |
| `clamp(value, min?, max?)` | 将值裁剪到指定范围 |
| `escapeRegex(str)` | 转义正则特殊字符 |

## 相关

- [Directix](https://github.com/saqqdy/directix) — 主 Vue 指令库
- [@directix/core](https://github.com/saqqdy/directix/tree/master/packages/core) — 核心运行时引擎

## 许可证

[MIT](https://opensource.org/licenses/MIT)
