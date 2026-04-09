# Nuxt 模块

Directix 提供官方的 Nuxt 3 模块，可无缝集成到 Nuxt 应用程序中。

## 特性

- **自动导入组合式函数** - 所有组合式函数在 Nuxt 应用中自动导入
- **指令自动注册** - 指令自动注册为 Vue 指令
- **选择性引入** - 通过配置选择包含或排除特定指令
- **SSR 兼容** - 正确处理仅客户端的指令

## 安装

```bash
# npm
npm install directix

# yarn
yarn add directix

# pnpm
pnpm add directix
```

## 使用方法

### 1. 添加到 Nuxt 配置

在 `nuxt.config.ts` 中添加 `directix/nuxt`：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
})
```

### 2. 在组件中使用

指令会自动注册，因此可以直接使用：

```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">复制</button>
  </div>
</template>

<script setup>
// 组合式函数自动导入！
const { copy, copied } = useCopy({ source: text })
const { isHovering } = useHover({ onEnter: handleEnter })
</script>
```

## 配置选项

你可以在 `nuxt.config.ts` 中配置模块：

```typescript
export default defineNuxtConfig({
  modules: ['directix/nuxt'],

  directix: {
    // 启用/禁用模块
    enabled: true,

    // 自动导入组合式函数（默认：true）
    autoImportComposables: true,

    // 仅包含特定指令
    include: ['v-click-outside', 'v-copy', 'v-debounce'],

    // 或排除特定指令
    exclude: ['v-ripple'],

    // 指令的默认选项
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => ['read', 'write']
        }
      }
    }
  }
})
```

## 配置选项说明

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | `boolean` | `true` | 启用/禁用模块 |
| `autoImportComposables` | `boolean` | `true` | 自动导入组合式函数 |
| `include` | `string[]` | - | 要包含的指令（如未指定，则包含所有指令） |
| `exclude` | `string[]` | `[]` | 要排除的指令 |
| `directiveOptions` | `Record<string, any>` | `{}` | 特定指令的默认选项 |

## SSR 兼容性

Directix 能优雅地处理 SSR。需要 DOM API 的指令在服务端将不会执行任何操作，并在客户端挂载后正常工作。

构建时你会看到这样的警告（这是预期行为）：

```
WARN [Directix] Directive "click-outside" is not compatible with SSR. It will be a no-op on the server side.
```

## 自动导入的组合式函数

使用 Nuxt 模块时，Directix 的所有组合式函数都会自动导入。以下是一些常用的：

### 事件组合式函数
- `useClickOutside`
- `useClickDelay`
- `useDebounce`
- `useThrottle`
- `useLongPress`
- `useHover`
- `useHotkey`

### UI 组合式函数
- `useCopy`
- `useFocus`
- `useDraggable`
- `useTooltip`
- `useLoading`

### 滚动组合式函数
- `useScroll`
- `useInfiniteScroll`
- `useSticky`
- `useVirtualList`

### 观察者组合式函数
- `useIntersect`
- `useResize`
- `useMutation`

### 表单组合式函数
- `useMask`
- `useTrim`
- `useCapitalcase`
- `useLowercase`
- `useUppercase`
- `useMoney`
- `useNumber`

## 示例：权限指令与 Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],

  directix: {
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => {
            // 访问你的认证 store 或 API
            const { permissions } = useAuthStore()
            return permissions
          }
        }
      }
    }
  }
})
```

```vue
<template>
  <button v-permission="'admin'">仅管理员可见按钮</button>
</template>
```

## TypeScript 支持

Nuxt 模块提供完整的 TypeScript 支持，包含自动生成的类型声明。所有组合式函数都有正确的类型定义，可以直接在 TypeScript 中使用。