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
