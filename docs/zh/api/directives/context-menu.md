# v-context-menu

为元素添加右键上下文菜单。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <div v-context-menu="menuItems">右键点击此处</div>
</template>

<script setup>
const menuItems = [
  { label: '复制', handler: () => console.log('复制') },
  { label: '粘贴', handler: () => console.log('粘贴') },
  { divider: true, label: '' },
  { label: '删除', handler: () => console.log('删除') }
]
</script>
```

### 带选项

```vue
<template>
  <div v-context-menu="{ items: menuItems, width: 200 }">
    自定义宽度菜单
  </div>
</template>
```

### 带图标

```vue
<template>
  <div v-context-menu="[
    { label: '编辑', icon: '✏️', handler: handleEdit },
    { label: '删除', icon: '🗑️', handler: handleDelete, disabled: true }
  ]">
    带图标的菜单
  </div>
</template>
```

## API

### 菜单项选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `label` | `string` | - | 菜单项文本 |
| `handler` | `() => void` | - | 点击回调 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `divider` | `boolean` | `false` | 是否显示分隔线 |
| `icon` | `string` | - | 图标（HTML字符串） |
| `class` | `string` | - | 自定义类名 |

### 指令选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `items` | `ContextMenuItem[]` | - | 菜单项列表 |
| `class` | `string` | - | 菜单容器自定义类名 |
| `width` | `number \| string` | `'150px'` | 菜单宽度 |
| `disabled` | `boolean` | `false` | 是否禁用菜单 |
| `renderItem` | `(item, index) => HTMLElement` | - | 自定义渲染函数 |
| `onBeforeShow` | `(e: MouseEvent) => boolean \| void` | - | 显示前回调，返回 false 阻止显示 |
| `onAfterShow` | `() => void` | - | 显示后回调 |
| `onHide` | `() => void` | - | 隐藏时回调 |

### 绑定值类型

```ts
type ContextMenuBinding = ContextMenuItem[] | ContextMenuOptions
```

## Composable 用法

你也可以使用 `useContextMenu` composable 来实现相同功能：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useContextMenu } from 'directix'

const containerRef = ref(null)
const items = [
  { label: '复制', handler: () => console.log('复制') },
  { label: '粘贴', handler: () => console.log('粘贴') },
  { divider: true, label: '' },
  { label: '删除', handler: () => console.log('删除') }
]

const { bind, show, hide } = useContextMenu({ items, width: 200 })

onMounted(() => bind(containerRef.value))
</script>

<template>
  <div ref="containerRef">右键点击此处</div>
</template>
```

### API

```typescript
interface ContextMenuItem {
  label: string
  handler?: () => void
  disabled?: boolean
  divider?: boolean
  icon?: string
  class?: string
}

interface UseContextMenuOptions {
  /** 菜单项列表 */
  items: ContextMenuItem[] | Ref<ContextMenuItem[]>
  /** 菜单容器自定义类名 */
  class?: string
  /** 菜单宽度 */
  width?: number | string
  /** 是否禁用 */
  disabled?: boolean | Ref<boolean>
}

interface UseContextMenuReturn {
  /** 绑定上下文菜单到元素 */
  bind: (element: HTMLElement) => () => void
  /** 在指定位置显示菜单 */
  show: (x: number, y: number) => void
  /** 隐藏菜单 */
  hide: () => void
}
```
