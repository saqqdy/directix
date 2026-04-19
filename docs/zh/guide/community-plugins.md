# 社区插件

Directix 提供社区插件仓库，用于发现和安装第三方插件。

## 浏览插件

### 在线仓库

访问[插件仓库](/plugins.json)浏览所有可用的社区插件。

### 编程式访问

使用 `PluginRegistry` API 搜索和发现插件：

```typescript
import { getPluginRegistry } from 'directix'

const registry = getPluginRegistry()

// 获取所有插件
const plugins = await registry.getAll()

// 按关键词搜索
const results = await registry.search('动画')

// 按分类获取
const formPlugins = await registry.getByCategory('form')

// 获取指定插件
const plugin = await registry.getByName('directix-animate')

// 获取仓库元数据
const meta = await registry.getMeta()
console.log(`共 ${meta.count} 个插件可用（更新于：${meta.updated}）`)
```

## 插件分类

| 分类 | 描述 |
|------|------|
| `event` | 事件处理指令 |
| `visibility` | 可见性和交叉观察指令 |
| `scroll` | 滚动相关指令 |
| `form` | 表单和输入指令 |
| `ui` | UI 和视觉指令 |
| `security` | 安全相关指令 |
| `observer` | 观察者模式指令 |
| `gesture` | 触摸和手势指令 |
| `other` | 其他指令 |

## 安装插件

### 第一步：安装包

使用你喜欢的包管理器：

```bash
# npm
npm install directix-animate

# yarn
yarn add directix-animate

# pnpm
pnpm add directix-animate
```

### 第二步：注册插件

```typescript
import { getPluginManager } from 'directix'
import animatePlugin from 'directix-animate'

const manager = getPluginManager()
manager.setApp(app)

await manager.register(animatePlugin)
```

### 使用仓库安装助手

为方便起见，你可以使用仓库以编程方式安装插件：

```typescript
import { getPluginManager } from 'directix'

const manager = getPluginManager()
manager.setApp(app)

// 从仓库安装（需要先安装 npm 包）
await manager.getRegistry().install('directix-animate', manager)
```

::: warning 注意
仓库的 `install()` 方法要求 npm 包已安装在你的项目中。它会动态导入插件模块。生产环境请先使用包管理器安装。
:::

## 提交插件

将你的插件提交到社区仓库：

### 1. 准备你的插件

确保插件遵循 Directix 插件结构：

```typescript
import { definePlugin } from 'directix'

export default definePlugin({
  meta: {
    name: 'directix-my-plugin',
    version: '1.0.0',
    description: '我的插件',
    author: '你的名字',
    license: 'MIT',
    repository: 'https://github.com/you/directix-my-plugin',
    keywords: ['动画', '自定义'],
  },

  install(ctx) {
    ctx.registerDirective('my-directive', myDirective)
    ctx.registerComposable('useMyFeature', useMyFeature)
  },

  uninstall(ctx) {
    // 清理
  },
})
```

### 2. 包要求

- 包名必须以 `directix-` 开头
- 必须将 `directix` 和 `vue` 声明为 peer dependencies
- 必须导出 TypeScript 类型
- 必须包含 README 使用文档
- 必须发布到 npm

### 3. 提交 PR

Fork [Directix 仓库](https://github.com/saqqdy/directix)，在 `docs/public/plugins.json` 中添加你的插件条目：

```json
{
  "name": "directix-my-plugin",
  "version": "1.0.0",
  "description": "我的插件",
  "package": "directix-my-plugin",
  "author": "你的名字",
  "keywords": ["动画", "自定义"],
  "category": "ui",
  "license": "MIT",
  "repository": "https://github.com/you/directix-my-plugin"
}
```

## 插件质量标准

社区插件应满足以下标准：

1. **类型安全** - 完整的 TypeScript 支持，导出类型定义
2. **文档完善** - 清晰的 API 文档和使用示例
3. **测试覆盖** - 良好的单元测试覆盖率
4. **清理资源** - 在 `uninstall()` 中正确清理资源
5. **错误处理** - 使用 `ctx.warn()` 和 `ctx.error()` 优雅处理错误
6. **性能优良** - 避免不必要的重渲染和内存泄漏
7. **兼容性** - 尽可能同时支持 Vue 2 和 Vue 3
8. **安全性** - 无 XSS 漏洞或不安全的 DOM 操作

## 自定义仓库地址

你可以配置自定义仓库地址：

```typescript
import { getPluginManager } from 'directix'

const manager = getPluginManager({
  registryUrl: 'https://my-company.com/plugins.json',
})

const registry = manager.getRegistry()
const plugins = await registry.getAll()
```

或创建独立的仓库实例：

```typescript
import { PluginRegistry } from 'directix'

const registry = new PluginRegistry('https://my-company.com/plugins.json')
```

## 本地开发

本地开发或测试时，可以直接设置仓库数据：

```typescript
import { getPluginRegistry } from 'directix'
import type { PluginRegistryData } from 'directix'

const registry = getPluginRegistry()

const localData: PluginRegistryData = {
  version: 1,
  updated: '2026-04-19',
  plugins: [
    {
      name: 'my-local-plugin',
      version: '0.0.1',
      description: '本地测试插件',
      package: 'my-local-plugin',
      author: 'dev',
      keywords: ['test'],
      category: 'other',
    },
  ],
}

registry.setData(localData)
```
