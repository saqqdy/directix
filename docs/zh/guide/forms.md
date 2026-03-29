# 表单指令

表单指令帮助您增强表单交互。

## v-copy

复制文本到剪贴板。

### 基本用法

```vue
<template>
  <!-- 简单用法 -->
  <button v-copy="textToCopy">复制到剪贴板</button>

  <!-- 带回调 -->
  <button v-copy="{ value: text, onSuccess: handleSuccess, onError: handleError }">
    带回调复制
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('已复制:', text)
}

function handleError(error) {
  console.error('复制失败:', error)
}
</script>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `string` | - | 要复制的文本（必填） |
| `onSuccess` | `Function` | - | 复制成功时的回调 |
| `onError` | `Function` | - | 复制失败时的回调 |
| `title` | `string` | - | 按钮的提示文本 |
| `disabled` | `boolean` | `false` | 禁用复制功能 |

## v-focus

挂载时自动聚焦元素。

### 基本用法

```vue
<template>
  <!-- 简单用法 -->
  <input v-focus />

  <!-- 带选项 -->
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `focus` | `boolean` | `true` | 挂载时聚焦元素 |
| `refocus` | `boolean` | `false` | 绑定值变化时重新聚焦 |
| `onFocus` | `Function` | - | 聚焦时的回调 |
| `onBlur` | `Function` | - | 失焦时的回调 |

## v-mask

输入掩码格式化，用于结构化输入。

### 基本用法

```vue
<template>
  <!-- 电话号码 -->
  <input v-mask="'(###) ###-####'" placeholder="电话" />

  <!-- SSN -->
  <input v-mask="'###-##-####'" placeholder="SSN" />

  <!-- 日期 -->
  <input v-mask="'##/##/####'" placeholder="日期" />
</template>
```

### 掩码标记

| 标记 | 模式 | 描述 |
| ---- | ---- | ---- |
| `#` | `[0-9]` | 数字 (0-9) |
| `A` | `[A-Za-z]` | 字母 (a-z, A-Z) |
| `N` | `[A-Za-z0-9]` | 字母数字 (a-z, A-Z, 0-9) |
| `X` | `.` | 任意字符 |

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `mask` | `string` | - | 掩码模式（必填） |
| `placeholder` | `string` | `'_'` | 占位符字符 |
| `showPlaceholder` | `boolean` | `true` | 聚焦时显示占位符 |
| `clearIncomplete` | `boolean` | `false` | 失焦时清除不完整的值 |
| `onChange` | `Function` | - | 值改变时的回调 |
| `onComplete` | `Function` | - | 掩码完成时的回调 |

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

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `allowedTags` | `string[]` | 安全子集 | 允许的 HTML 标签 |
| `allowedAttributes` | `string[]` | 安全子集 | 允许的 HTML 属性 |
| `allowDataUrls` | `boolean` | `false` | 允许 data: URL |
| `allowStyles` | `boolean` | `false` | 允许 style 属性 |
| `allowClass` | `boolean` | `false` | 允许 class 属性 |
| `handler` | `Function` | - | 自定义清理函数 |
