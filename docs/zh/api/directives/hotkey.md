# v-hotkey

为元素绑定键盘快捷键。支持修饰键和多种快捷键格式。

> **起始版本：** `1.3.0`

## 用法

### 使用参数语法

```vue
<template>
  <!-- Ctrl+S 保存 -->
  <input v-hotkey:ctrl.s="save" placeholder="按 Ctrl+S 保存" />

  <!-- Escape 取消 -->
  <div v-hotkey:escape="cancel">按 Escape 取消</div>

  <!-- 多个修饰键 -->
  <div v-hotkey:ctrl.shift.s="saveAs">Ctrl+Shift+S</div>
</template>
```

### 使用对象语法

```vue
<template>
  <div
    v-hotkey="{
      'ctrl+s': save,
      'escape': cancel,
      'ctrl+z': undo
    }"
    tabindex="0"
  >
    按 Ctrl+S 保存，Escape 取消
  </div>
</template>
```

### 使用数组语法

```vue
<template>
  <div v-hotkey="[
    { key: 's', modifiers: ['ctrl'], handler: save },
    { key: 'escape', handler: cancel }
  ]">
    多个快捷键
  </div>
</template>
```

## API

### 类型

```typescript
type HotkeyHandler = (event: KeyboardEvent) => void

type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'

interface HotkeyDefinition {
  key: string
  modifiers?: ModifierKey[]
  handler: HotkeyHandler
  prevent?: boolean // 默认: true
  stop?: boolean // 默认: true
  disabled?: boolean // 默认: false
}

type HotkeyBinding =
  | HotkeyHandler
  | HotkeyDefinition
  | HotkeyDefinition[]
  | Record<string, HotkeyHandler | HotkeyDefinition>
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `key` | `string` | - | 要监听的键（如 's', 'enter', 'escape'） |
| `modifiers` | `ModifierKey[]` | `[]` | 必需的修饰键 |
| `handler` | `(event: KeyboardEvent) => void` | - | 处理函数（必填） |
| `prevent` | `boolean` | `true` | 是否阻止默认行为 |
| `stop` | `boolean` | `true` | 是否阻止事件冒泡 |
| `disabled` | `boolean` | `false` | 是否禁用此快捷键 |

### 按键别名

| 别名 | 按键 |
| ---- | ---- |
| `esc` | `escape` |
| `space` | ` ` (空格) |
| `up` | `arrowup` |
| `down` | `arrowdown` |
| `left` | `arrowleft` |
| `right` | `arrowright` |
| `enter` | `enter` |
| `tab` | `tab` |
| `delete` | `delete` |
| `backspace` | `backspace` |
| `f1`-`f12` | 功能键 |

## Composable 用法

你也可以使用 `useHotkey` composable：

```vue
<script setup>
import { useHotkey } from 'directix'

const { enable, disable, add, remove } = useHotkey({
  hotkeys: [
    { key: 'ctrl+s', handler: (e) => save() },
    { key: 'ctrl+z', handler: (e) => undo() },
  ]
})

// 添加动态快捷键
add({ key: 'esc', handler: (e) => closeModal() })

// 移除快捷键
remove('ctrl+z')
</script>
```

### API

```typescript
interface HotkeyDefinition {
  /** 按键组合（如 'ctrl+s', 'alt+shift+a'） */
  key: string
  /** 处理函数 */
  handler: (event: KeyboardEvent) => void
  /** 是否阻止默认行为 */
  prevent?: boolean
  /** 是否阻止事件冒泡 */
  stop?: boolean
  /** 是否在 keyup 而非 keydown 时触发 */
  keyup?: boolean
  /** 是否禁用快捷键 */
  disabled?: boolean | Ref<boolean>
}

interface UseHotkeyOptions {
  /** 单个快捷键定义 */
  hotkey?: HotkeyDefinition
  /** 多个快捷键定义 */
  hotkeys?: HotkeyDefinition[]
  /** 绑定事件的目标元素（默认为 document） */
  target?: HTMLElement | Ref<HTMLElement | null>
  /** 是否启用快捷键 */
  enabled?: boolean | Ref<boolean>
}

interface UseHotkeyReturn {
  /** 快捷键当前是否启用 */
  enabled: Ref<boolean>
  /** 启用快捷键 */
  enable: () => void
  /** 禁用快捷键 */
  disable: () => void
  /** 切换快捷键状态 */
  toggle: () => void
  /** 添加快捷键 */
  add: (hotkey: HotkeyDefinition) => void
  /** 按键移除快捷键 */
  remove: (key: string) => void
  /** 移除所有快捷键 */
  clear: () => void
}
```

## 示例

### 编辑器快捷键

```vue
<template>
  <div
    v-hotkey="{
      'ctrl+s': save,
      'ctrl+z': undo,
      'ctrl+y': redo,
      'ctrl+b': bold,
      'ctrl+i': italic
    }"
    class="editor"
    tabindex="0"
  >
    <textarea v-model="content"></textarea>
  </div>
</template>
```

### 动态快捷键

```vue
<template>
  <div v-hotkey="hotkeys" tabindex="0">
    快捷键: {{ enabled ? '已启用' : '已禁用' }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const enabled = ref(true)

const hotkeys = computed(() => ({
  'ctrl+e': () => enabled.value = !enabled.value,
  'ctrl+d': enabled.value ? debug : null
}))
</script>
```
