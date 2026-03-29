# API 参考

本节提供 Directix 所有可用指令的详细 API 文档。

## 可用指令

Directix 提供 **20 个生产就绪的指令**，按以下类别组织：

### 事件指令

| 指令 | 描述 |
| ---- | ---- |
| [v-click-outside](/zh/api/directives/click-outside) | 检测元素外部点击 |
| [v-debounce](/zh/api/directives/debounce) | 防抖事件处理 |
| [v-throttle](/zh/api/directives/throttle) | 节流事件处理 |
| [v-long-press](/zh/api/directives/long-press) | 检测长按手势 |
| [v-hover](/zh/api/directives/hover) | 跟踪悬停状态 |
| [v-ripple](/zh/api/directives/ripple) | Material Design 波纹效果 |

### 可见性指令

| 指令 | 描述 |
| ---- | ---- |
| [v-lazy](/zh/api/directives/lazy) | 图片懒加载 |
| [v-intersect](/zh/api/directives/intersect) | 观察元素交叉 |
| [v-visible](/zh/api/directives/visible) | 切换元素可见性 |
| [v-loading](/zh/api/directives/loading) | 显示加载遮罩 |

### 滚动指令

| 指令 | 描述 |
| ---- | ---- |
| [v-scroll](/zh/api/directives/scroll) | 跟踪滚动位置 |
| [v-infinite-scroll](/zh/api/directives/infinite-scroll) | 无限滚动加载 |
| [v-sticky](/zh/api/directives/sticky) | 粘性定位 |

### 表单指令

| 指令 | 描述 |
| ---- | ---- |
| [v-copy](/zh/api/directives/copy) | 复制文本到剪贴板 |
| [v-focus](/zh/api/directives/focus) | 自动聚焦元素 |
| [v-mask](/zh/api/directives/mask) | 输入掩码格式化 |

### 安全指令

| 指令 | 描述 |
| ---- | ---- |
| [v-permission](/zh/api/directives/permission) | 基于权限的元素控制 |
| [v-sanitize](/zh/api/directives/sanitize) | 清理 HTML 内容 |

### 观察者指令

| 指令 | 描述 |
| ---- | ---- |
| [v-resize](/zh/api/directives/resize) | 观察元素大小变化 |
| [v-mutation](/zh/api/directives/mutation) | 观察 DOM 变化 |

## 安装选项

```typescript
interface DirectiveInstallOptions {
  /** 只注册特定指令 */
  directives?: string[]
  /** 注册所有指令 (默认: true) */
  all?: boolean
  /** 指令全局配置 */
  config?: Record<string, any>
}
```

## 引入方式

### 命名引入

```typescript
import {
  vClickOutside,
  vCopy,
  vDebounce,
  vThrottle,
  vFocus,
  vLazy,
  vIntersect,
  vVisible,
  vLoading,
  vScroll,
  vInfiniteScroll,
  vSticky,
  vLongPress,
  vHover,
  vRipple,
  vMask,
  vPermission,
  vSanitize,
  vResize,
  vMutation
} from 'directix'
```

### 全局注册

```typescript
import Directix from 'directix'

app.use(Directix)
```

### 选择性注册

```typescript
app.use(Directix, {
  directives: ['click-outside', 'copy', 'debounce', 'throttle', 'focus']
})
```

## 工具函数导出

Directix 还导出工具函数：

```typescript
import {
  // 类型守卫
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isEmpty,
  isPromise,

  // 对象工具
  deepClone,
  deepMerge,
  get,
  set,

  // 时间工具
  parseTime,
  generateId,

  // 函数工具（别名，避免与指令冲突）
  debounceFn,
  throttleFn
} from 'directix'
```

## 核心导出

高级用法可以导入核心工具：

```typescript
import {
  // Vue 版本检测
  getVueVersion,
  setVueVersion,
  isVue2,
  isVue3,

  // 环境检测
  isBrowser,
  isSSR,

  // 功能支持检测
  supportsPassive,
  supportsIntersectionObserver,
  supportsResizeObserver,
  supportsClipboard,
  supportsMutationObserver,

  // 指令定义
  defineDirective,
  defineDirectiveGroup
} from 'directix'
```
