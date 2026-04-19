# 插件系统

Directix 提供可扩展的插件架构，支持社区贡献和自定义指令开发。

## 概述

插件系统允许您：
- 创建和分享自定义指令
- 扩展现有指令的功能
- 注册第三方插件
- 构建指令模板以快速开发

## 创建插件

### 基本插件结构

```typescript
import { definePlugin, type DirectixPlugin } from 'directix'
import type { Directive } from 'vue'

// 定义您的指令
const vMyDirective: Directive = {
  mounted(el, binding) {
    // 您的实现
  },
}

// 创建插件
const myPlugin = definePlugin({
  meta: {
    name: 'directix-my-plugin',
    version: '1.0.0',
    description: '我的自定义指令',
    author: '您的名字',
    license: 'MIT',
  },
  
  install(ctx) {
    // 注册指令
    ctx.registerDirective('my-directive', vMyDirective)
    
    // 注册组合式函数
    ctx.registerComposable('useMyFeature', useMyFeature)
  },
  
  uninstall(ctx) {
    // 插件移除时清理
    console.log('插件已卸载')
  },
  
  // 可选依赖
  dependencies: ['other-plugin'],
})

export default myPlugin
```

### 插件上下文

`ctx` 对象提供：

| 属性 | 描述 |
|------|------|
| `app` | Vue 应用实例 |
| `registerDirective(name, directive)` | 注册指令 |
| `registerComposable(name, composable)` | 注册组合式函数 |
| `getDirective(name)` | 获取现有指令 |
| `warn(message)` | 显示警告 |
| `error(message)` | 显示错误 |
| `meta` | 插件元数据 |

## 使用插件

```typescript
import { getPluginManager } from 'directix'
import myPlugin from 'directix-my-plugin'

const manager = getPluginManager()

// 设置 Vue 应用实例
manager.setApp(app)

// 注册插件
await manager.register(myPlugin)

// 检查插件是否已注册
if (manager.has('directix-my-plugin')) {
  console.log('插件已安装！')
}

// 获取所有已注册插件
const plugins = manager.getAll()

// 需要时卸载
await manager.unregister('directix-my-plugin')
```

## 插件钩子

监听插件生命周期事件：

```typescript
import { getPluginManager, type PluginHook } from 'directix'

const manager = getPluginManager()

// 注册钩子
manager.onHook('beforeInstall', (plugin, ctx) => {
  console.log(`正在安装 ${plugin.meta.name}...`)
})

manager.onHook('afterInstall', (plugin, ctx) => {
  console.log(`${plugin.meta.name} 安装成功！`)
})

manager.onHook('beforeUninstall', (plugin, ctx) => {
  console.log(`正在卸载 ${plugin.meta.name}...`)
})

manager.onHook('afterUninstall', (plugin, ctx) => {
  console.log(`${plugin.meta.name} 已卸载`)
})
```

## 扩展指令

为现有指令添加自定义行为：

```typescript
import { getPluginManager, type DirectiveExtension } from 'directix'

const manager = getPluginManager()

// 为 v-debounce 添加日志功能
const extension: DirectiveExtension = {
  target: 'debounce',
  hook: 'mounted',
  handler(el, binding) {
    console.log('v-debounce 已挂载到:', el)
  },
}

manager.extendDirective(extension)
```

## 指令模板

使用模板简化指令创建：

### 基本模板

```typescript
import { createDirectiveTemplate } from 'directix'

const vHighlight = createDirectiveTemplate({
  name: 'highlight',
  
  onMount(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },
  
  onUpdate(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },
  
  onUnmount(el) {
    el.style.backgroundColor = ''
  },
  
  validate(options) {
    if (options.color && !isValidColor(options.color)) {
      return '无效的颜色值'
    }
    return null
  },
})
```

### 事件指令模板

```typescript
import { createEventDirective } from 'directix'

const vTrack = createEventDirective({
  name: 'track',
  eventName: 'click',
  handler(el, binding, event) {
    analytics.track(binding.value, {
      element: el.tagName,
      timestamp: Date.now(),
    })
  },
})
```

### 样式指令模板

```typescript
import { createStyleDirective } from 'directix'

const vOpacity = createStyleDirective({
  name: 'opacity',
  cssProperty: 'opacity',
  defaultUnit: '',
  validate(value) {
    return typeof value === 'number' && value >= 0 && value <= 1
  },
})
```

## 发布插件

### 包结构

```
directix-my-plugin/
├── src/
│   ├── index.ts          # 主入口
│   ├── directives/       # 您的指令
│   └── composables/      # 您的组合式函数
├── package.json
├── README.md
└── LICENSE
```

### package.json

```json
{
  "name": "directix-my-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "directix": "^1.0.0",
    "vue": "^2.0.0 || ^3.0.0"
  },
  "keywords": [
    "vue",
    "directix",
    "directive",
    "plugin"
  ]
}
```

## 最佳实践

1. **使用语义化版本** - 遵循 semver 规范
2. **文档完善** - 提供清晰的文档
3. **类型定义** - 导出 TypeScript 类型
4. **优雅处理错误** - 使用 `ctx.warn()` 和 `ctx.error()`
5. **卸载时清理** - 移除事件监听器、观察器等
6. **充分测试** - 为指令编写测试