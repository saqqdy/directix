# Directix v2.0.0 迁移指南

本指南帮助你从 Directix v1.x 迁移到 v2.0.0。

## 概述

v2.0.0 是一个主要版本，专注于 Vue 3 优化并包含多项破坏性变更。本指南将帮助你理解这些变更并平滑迁移你的代码库。

## 破坏性变更摘要

| 变更 | 严重程度 | 可自动修复 |
|------|----------|------------|
| 移除 Vue 2 支持 | 严重 | 否 |
| 指令命名标准化 | 中等 | 是 |
| 选项结构简化 | 高 | 否 |
| 处理函数签名更新 | 中等 | 是 |
| 移除废弃工具函数 | 低 | 否 |
| 类型导出重新组织 | 中等 | 否 |

## 迁移前检查清单

1. **检查 Vue 版本**
   ```bash
   npm list vue
   ```
   v2.0.0 需要 Vue 3.x。如果你使用的是 Vue 2，请参阅 [Vue 2 迁移](#vue-2-迁移) 章节。

2. **运行迁移检测器**
   ```bash
   npx directix migrate --from directix-v1 --dry-run
   ```

3. **查看破坏性变更报告**
   ```typescript
   import { generateBreakingChangesReport } from 'directix/core'
   
   const report = generateBreakingChangesReport('2.0.0')
   console.log(report)
   ```

## 主要变更

### 1. 移除 Vue 2 支持

**之前 (v1.x):**
```typescript
// 同时支持 Vue 2 和 Vue 3
import { createApp } from 'vue' // 或 'vue2'
import Directix from 'directix'

createApp().use(Directix)
```

**之后 (v2.0.0):**
```typescript
// 仅支持 Vue 3
import { createApp } from 'vue'
import Directix from 'directix'

createApp().use(Directix)
```

**迁移步骤:**
1. 升级到 Vue 3.x
2. 如需要，使用 Vue 3 迁移构建版本
3. 移除 `@vue/composition-api` 依赖

### 2. 指令命名标准化

**之前 (v1.x):**
```html
<!-- CamelCase 名称 -->
<div vClickOutside="handler"></div>
<div vLazyLoad="options"></div>
```

**之后 (v2.0.0):**
```html
<!-- kebab-case 名称 -->
<div v-click-outside="handler"></div>
<div v-lazy-load="options"></div>
```

**自动修复:**
```bash
npx directix migrate --from directix-v1 --auto-fix
```

### 3. 选项结构简化

**之前 (v1.x):**
```typescript
vDebounce({
  handler: () => {},
  delay: 300,
  immediate: true
})
```

**之后 (v2.0.0):**
```typescript
vDebounce="{
  handler: () => {},
  delay: 300,
  immediate: true
}"
// 或
v-debounce:300.immediate="handler"
```

### 4. 处理函数签名更新

**之前 (v1.x):**
```typescript
const handler = (event, binding) => {
  // 旧签名
}
```

**之后 (v2.0.0):**
```typescript
const handler = (value, oldValue, binding) => {
  // 新签名
}
```

### 5. 移除废弃工具函数

**移除的 API:**
- `deepMerge` → 使用 `structuredClone()` 或 `Object.assign()`
- `shallowMerge` → 使用 `Object.assign()`
- `isObjectLike` → 使用 `typeof` 检查

**之前:**
```typescript
import { deepMerge } from 'directix/core'
const merged = deepMerge(obj1, obj2)
```

**之后:**
```typescript
const merged = structuredClone({ ...obj1, ...obj2 })
// 或
const merged = Object.assign({}, obj1, obj2)
```

### 6. 类型导出重新组织

**之前 (v1.x):**
```typescript
import { DirectiveBinding, DirectiveConfig } from 'directix/core'
```

**之后 (v2.0.0):**
```typescript
import type { 
  DirectiveBinding, 
  DirectiveConfig,
  DirectiveSetup 
} from 'directix/core'
```

## v2.0.0 新功能

### 企业级权限管理
```typescript
import { 
  configureEnterprisePermission,
  hasPermission 
} from 'directix/core'

configureEnterprisePermission({
  sources: [{ type: 'api', api: { url: '/api/permissions' } }],
  roles: {
    admin: { permissions: ['read', 'write', 'delete'] }
  }
})

if (await hasPermission('admin')) {
  // 显示管理员功能
}
```

### 审计日志
```typescript
import { 
  configureAuditLog,
  logDirectiveOperation 
} from 'directix/core'

configureAuditLog({
  enabled: true,
  persistToStorage: true
})

// 指令中自动记录日志
logDirectiveOperation('mount', 'v-permission')
```

### 破坏性变更预警系统
```typescript
import { 
  generateBreakingChangesReport,
  detectBreakingChangesInCode 
} from 'directix/core'

// 检查代码中的潜在问题
const detections = detectBreakingChangesInCode(yourCode)
```

## 迁移工具

### CLI 迁移命令
```bash
# 试运行查看变更
npx directix migrate --from directix-v1 --dry-run

# 应用变更
npx directix migrate --from directix-v1

# 尽可能自动修复
npx directix migrate --from directix-v1 --auto-fix
```

### 编程式迁移
```typescript
import { 
  migrate,
  detectLegacyUsage,
  generateMigrationReport 
} from 'directix/core'

const report = detectLegacyUsage(code, 'directix-v1')
const result = migrate(code, { source: 'directix-v1' })
```

## 兼容层

为了渐进式迁移，v2.0.0 提供了兼容层：

```typescript
import { createCompatLayer } from 'directix/compat'

const app = createApp()
app.use(createCompatLayer({
  // 启用特定的兼容特性
  legacyNaming: true,
  legacyOptions: true
}))
```

## 性能提升

v2.0.0 包含显著的性能提升：

- **包体积**: 核心包体积减少 30%
- **Tree-shaking**: 更好的死代码消除
- **运行时**: 优化的指令生命周期
- **内存**: 减少观察者开销

## 时间线

| 阶段 | 日期 | 操作 |
|------|------|------|
| v1.11.0 | 2026-05-13 | 发布迁移工具 |
| v1.12.0 | 待定 | 最终 v1.x 版本 |
| v2.0.0-beta | 待定 | Beta 测试 |
| v2.0.0 | 待定 | 稳定版本发布 |

## 获取帮助

- **文档**: https://directix.dev/docs/migration
- **GitHub Issues**: https://github.com/saqqdy/directix/issues
- **Discord**: https://discord.gg/directix

## 检查清单

- [ ] 升级到 Vue 3.x
- [ ] 运行迁移检测器
- [ ] 查看破坏性变更报告
- [ ] 更新指令名称为 kebab-case
- [ ] 更新指令选项
- [ ] 替换废弃的工具函数
- [ ] 更新类型导入
- [ ] 运行测试
- [ ] 在预发布环境中测试