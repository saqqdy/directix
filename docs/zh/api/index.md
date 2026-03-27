# API 参考

本节提供 Directix 所有可用指令的详细 API 文档。

## 可用指令

### 事件指令

| 指令 | 描述 |
| ---- | ---- |
| [v-click-outside](/zh/api/directives/click-outside) | 检测元素外部点击 |
| [v-debounce](/zh/api/directives/debounce) | 防抖事件处理 |
| [v-throttle](/zh/api/directives/throttle) | 节流事件处理 |

### 表单指令

| 指令 | 描述 |
| ---- | ---- |
| [v-copy](/zh/api/directives/copy) | 复制文本到剪贴板 |
| [v-focus](/zh/api/directives/focus) | 自动聚焦元素 |

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
import { vClickOutside, vCopy, vDebounce, vThrottle, vFocus } from 'directix'
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
