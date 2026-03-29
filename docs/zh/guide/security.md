# 安全指令

安全指令帮助您管理权限和清理内容。

## v-permission

基于权限的元素控制，用于访问管理。

### 基本用法

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

  <!-- 不同操作 -->
  <button v-permission="{ value: 'admin', action: 'disable' }">
    非管理员禁用
  </button>
</template>
```

### 配置

在应用中配置权限指令：

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => store.getters.permissions,
  getRoles: () => store.getters.roles,
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write'],
    viewer: ['read']
  }
})
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `string \| string[]` | - | 要检查的权限（必填） |
| `mode` | `'some' \| 'every'` | `'some'` | 多个权限的逻辑 |
| `action` | `'remove' \| 'disable' \| 'hide'` | `'remove'` | 拒绝时的操作 |
| `check` | `Function` | - | 自定义检查函数 |

## v-sanitize

清理 HTML 内容以防止 XSS 攻击。

### 基本用法

```vue
<template>
  <!-- 基本清理 -->
  <div v-sanitize v-html="userContent"></div>

  <!-- 指定允许的标签 -->
  <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>
</template>
```

### 默认行为

默认情况下，v-sanitize：
- 允许安全标签：`b`, `i`, `u`, `strong`, `em`, `br`, `p`, `span`, `div`
- 允许安全属性：`title`, `alt`, `href`, `src`
- 移除危险标签：`script`, `iframe`, `object`, `embed`, `form` 等
- 移除危险属性：`onclick`, `onerror`, `onload` 等
- 移除 `javascript:` URL

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `allowedTags` | `string[]` | 安全子集 | 允许的 HTML 标签 |
| `allowedAttributes` | `string[]` | 安全子集 | 允许的 HTML 属性 |
| `allowDataUrls` | `boolean` | `false` | 允许 data: URL |
| `allowStyles` | `boolean` | `false` | 允许 style 属性 |
| `allowClass` | `boolean` | `false` | 允许 class 属性 |
| `allowId` | `boolean` | `false` | 允许 id 属性 |
| `handler` | `Function` | - | 自定义清理函数 |
