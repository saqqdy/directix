# Directix v2.0.0 升级指南

本指南帮助你升级到 Directix v2.0.0 并了解新功能。

## 概述

v2.0.0 是一个主要版本，新增了 **Web Components 支持**，同时保持 **Vue 2 和 Vue 3 的完全兼容性**。对于现有用户来说，这是一个**无破坏性升级** - 所有 v1.x 代码无需修改即可继续使用。

## 主要功能摘要

| 功能 | 影响 | 需要的操作 |
|------|------|------------|
| Web Components 支持 | 主要新功能 | 可选 - 探索新功能 |
| Vue 3 条件优化 | 性能提升 | 无 - 使用 Vue 3 时自动启用 |
| Vue 2 兼容性保持 | 稳定性 | 无 - 继续正常使用 |
| 包体积优化 | 性能 | 无 - 自动优化 |
| 增强的类型定义 | 开发体验 | 可选 - 更新导入 |

## 升级前检查清单

1. **检查当前版本**
   ```bash
   npm list directix
   ```

2. **了解新功能**
   - Web Components 支持（新增）
   - Vue 3 性能优化（自动）
   - 增强的 TypeScript 定义

3. **可选：测试 Web Components**
   ```typescript
   import { defineCustomElementDirective, vLazy } from 'directix'

   defineCustomElementDirective({
     name: 'lazy-img',
     directive: vLazy,
   })
   ```

## 主要新功能

### 1. Web Components 支持

v2.0.0 引入了全面的 Web Components 支持，允许你在自定义元素中使用 Directix 指令。

**基本用法：**
```typescript
import { defineCustomElementDirective, vLazy, vClickOutside } from 'directix'

// 从指令定义自定义元素
defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
  shadow: true,
  shadowMode: 'open'
})

// 现在可以在 HTML 中使用
// <lazy-img src="image.jpg" value="{ threshold: 0.5 }"></lazy-img>
```

**注册多个指令：**
```typescript
import { registerDirectiveElements, vLazy, vClickOutside } from 'directix'

registerDirectiveElements({
  'lazy-image': vLazy,
  'click-outside': vClickOutside,
})
```

**应用到现有自定义元素：**
```typescript
import { applyDirectiveToCustomElement, vLazy } from 'directix'

const myElement = document.querySelector('my-component')
const cleanup = applyDirectiveToCustomElement(myElement, vLazy, { threshold: 0.5 })

// 之后需要清理时
cleanup()
```

### 2. Vue 3 条件优化

使用 Vue 3 时，Directix 会自动应用性能优化：

- **DOM 元素使用 markRaw** - 避免不必要的响应式开销
- **状态使用 shallowReactive** - 优化大对象性能
- **减少运行时检查** - 简化 Vue 3 适配器

这些优化是**自动的**，无需修改代码。

### 3. 包体积改进

- 比 v1.11.0 **减小约 10-15%**
- 对未使用的指令**更好的 tree-shaking**
- Web Components 工具的**优化导入**

### 4. 增强的类型定义

改进的 TypeScript 支持和更好的类型推断：

```typescript
// 更好的指令选项类型推断
import { vDebounce } from 'directix'

vDebounce({
  handler: () => console.log('debounced'),
  delay: 300,
  immediate: true // 完全类型化
})

// Web Components 类型
import type { CustomElementDirectiveOptions } from 'directix'

const options: CustomElementDirectiveOptions = {
  name: 'my-element',
  directive: vLazy,
  shadow: true
}
```

## 可选优化

### Vue 3 性能功能

如果你使用 Vue 3，可以可选地利用增强功能：

```typescript
// 使用 Vue 3 时自动启用
import { useLazyOptimized } from 'directix'

// 内部使用 markRaw 和 shallowReactive 以获得更好的性能
const { state, observe, unobserve } = useLazyOptimized({
  threshold: 0.5,
  rootMargin: '50px'
})
```

### Web Components 集成

对于在 Vue 旁边使用 Web Components 的项目：

```typescript
import { 
  isCustomElement, 
  createDirectiveElement 
} from 'directix'

// 检查元素是否为自定义元素
if (isCustomElement(myElement)) {
  // 应用指令特定逻辑
}

// 创建可复用的自定义元素类
const LazyImage = createDirectiveElement('lazy-img', vLazy)
customElements.define('lazy-img', LazyImage)
```

## 升级指南

### 简单升级（推荐）

对于大多数用户，升级非常简单：

```bash
npm install directix@2.0.0
# 或
pnpm add directix@2.0.0
# 或
yarn add directix@2.0.0
```

**无需修改代码** - 你现有的 v1.x 代码将继续正常工作。

### 探索新功能

升级后，你可以选择性地探索新功能：

**1. 尝试 Web Components：**
```typescript
import { defineCustomElementDirective, vLazy } from 'directix'

defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
})
```

**2. 使用 Vue 3 优化（自动）：**
```typescript
// 无需更改 - 使用 Vue 3 时优化自动启用
import { vLazy } from 'directix'
```

**3. 检查包体积：**
```bash
# 分析你的包体积
npx vite-bundle-visualizer
```

## 性能提升

v2.0.0 包含显著的性能提升：

- **包体积**: 比 v1.11.0 减小约 10-15%
- **Tree-shaking**: 更好的死代码消除
- **运行时**: 优化的指令生命周期（Vue 3）
- **内存**: 减少观察者开销
- **Web Components**: 未使用时零开销

## 时间线

| 阶段 | 日期 | 状态 |
|------|------|------|
| v1.11.0 | 2026-05-13 | ✅ 已发布 - 迁移工具和企业级功能 |
| v2.0.0 | 2026-04-26 | ✅ 已发布 - Web Components 支持 |
| v2.1.0 | 待定 | 📋 计划中 - 增强 Web Components |

## 获取帮助

- **文档**: https://directix.dev/docs
- **Web Components 指南**: https://directix.dev/docs/web-components
- **GitHub Issues**: https://github.com/saqqdy/directix/issues
- **Discord**: https://discord.gg/directix

## 升级检查清单

- [x] 安装 directix@2.0.0
- [ ] 验证现有代码正常工作（无需修改）
- [ ] 可选：探索 Web Components 支持
- [ ] 可选：测试 Vue 3 性能优化
- [ ] 运行测试确保兼容性
- [ ] 查看包体积改进

## 下一步

### 对于 Vue 2 用户
- 继续像以前一样使用 Directix
- 无需迁移
- 考虑为未来项目探索 Web Components

### 对于 Vue 3 用户
- 享受自动的性能优化
- 尝试 Web Components 实现框架无关的指令
- 从更小的包体积中受益

### 对于所有用户
- Web Components 开启了新的使用场景
- 更好的 TypeScript 支持
- 改进的文档和示例