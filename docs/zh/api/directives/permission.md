# v-permission

基于权限的元素控制，用于访问管理。

> **起始版本：** `1.1.0`

## 用法

### 基本

```vue
<template>
  <!-- 单个权限 -->
  <button v-permission="'admin'">仅管理员</button>

  <!-- 多个权限（默认 OR 逻辑） -->
  <button v-permission="['admin', 'editor']">管理员或编辑者</button>

  <!-- AND 逻辑 -->
  <button v-permission="{ value: ['read', 'write'], mode: 'every' }">
    需要读写权限
  </button>
</template>
```

### 配置

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => store.getters.permissions,
  getRoles: () => store.getters.roles,
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write']
  }
})
```

## API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `string \| string[]` | - | 要检查的权限（必填） |
| `mode` | `'some' \| 'every'` | `'some'` | 多个权限的逻辑 |
| `action` | `'remove' \| 'disable' \| 'hide'` | `'remove'` | 拒绝时的操作 |
| `check` | `Function` | - | 自定义检查函数 |

## Composable 用法

你也可以使用 `usePermission` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { usePermission } from 'directix'

const { granted, recheck } = usePermission({
  value: 'admin',
  getPermissions: () => store.getters.permissions,
  getRoles: () => store.getters.roles,
  roleMap: { admin: ['*'], editor: ['read', 'write'] }
})
</script>

<template>
  <button v-if="granted">仅管理员可见</button>
</template>
```

### API

```typescript
type PermissionMode = 'some' | 'every'

interface UsePermissionOptions {
  /** 要检查的权限值 */
  value: string | string[] | Ref<string | string[]>
  /** 多个权限的逻辑：'some'（OR）或 'every'（AND） @default 'some' */
  mode?: PermissionMode | Ref<PermissionMode>
  /** 自定义权限检查函数 */
  check?: (permission: string | string[], mode: PermissionMode) => boolean
  /** 获取当前用户权限 */
  getPermissions?: () => string[]
  /** 获取当前用户角色 */
  getRoles?: () => string[]
  /** 角色到权限的映射 */
  roleMap?: Record<string, string[]>
}

interface UsePermissionReturn {
  /** 权限是否已授予 */
  granted: Readonly<Ref<boolean>>
  /** 重新检查权限 */
  recheck: () => void
}
```
