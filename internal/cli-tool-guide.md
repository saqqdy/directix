# Directix CLI 工具使用指南

## 概述

Directix CLI 是一个命令行工具，用于快速创建指令、组合式函数和初始化项目。

## 安装

```bash
# 全局安装
npm install -g directix-cli

# 或使用 npx 直接运行
npx directix --help
```

## 命令列表

### `directix create <type> <name>`

创建新的指令或组合式函数。

#### 创建指令

```bash
# 创建新指令
directix create directive v-my-directive

# 创建指令（不带 v- 前缀）
directix create directive my-directive

# 强制覆盖已存在的文件
directix create directive v-my-directive --force
```

生成的文件位于 `src/directives/my-directive.ts`，包含：

- 完整的 TypeScript 类型定义
- `defineDirective` 工厂函数调用
- `mounted`、`updated`、`unmounted` 生命周期钩子
- JSDoc 文档注释和使用示例

#### 创建组合式函数

```bash
# 创建新 composable
directix create composable useMyFeature

# 创建 composable（不带 use 前缀）
directix create composable MyFeature

# 强制覆盖已存在的文件
directix create composable useMyFeature --force
```

生成的文件位于 `src/composables/use-my-feature.ts`，包含：

- 完整的 TypeScript 类型定义（Options 和 Return）
- `onMounted` 和 `onUnmounted` 生命周期钩子
- JSDoc 文档注释和使用示例

### `directix init [name]`

初始化一个新的 Directix 项目。

```bash
# 交互式创建项目
directix init

# 指定项目名称
directix init my-project

# 使用 Nuxt 模板
directix init my-project --template nuxt

# 使用 Vue 3 模板（默认）
directix init my-project --template vue3
```

#### 模板选项

| 模板 | 说明 |
|------|------|
| `vue3` | Vue 3 + Vite 项目（默认） |
| `nuxt` | Nuxt 3 项目 |

#### 生成的项目结构

**Vue 3 项目：**

```
my-project/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.js
    └── App.vue
```

**Nuxt 项目：**

```
my-project/
├── package.json
├── nuxt.config.ts
└── app.vue
```

### `directix doctor`

检查项目环境配置。

```bash
directix doctor
```

检查项目：

- Node.js 版本（推荐 18+）
- package.json 是否存在
- Vue 是否已安装
- Directix 是否已安装
- src 目录是否存在
- directives 目录是否存在

输出示例：

```
Directix Doctor
Checking your Directix setup...

✓ Node.js version: v20.10.0 (recommended: 18+)
✓ package.json: Found
✓ Vue: ^3.4.0
✓ Directix: ^1.7.0
✓ src directory: Found
✓ src/directives: Found

All checks passed!
```

### `directix migrate`

迁移工具（即将推出）。

```bash
# 从 VueUse 迁移
directix migrate --from vueuse

# 从 v-directives 迁移
directix migrate --from v-directives
```

## 选项

### 全局选项

| 选项 | 说明 |
|------|------|
| `-v, --version` | 显示版本号 |
| `-h, --help` | 显示帮助信息 |

### `create` 命令选项

| 选项 | 说明 |
|------|------|
| `-f, --force` | 覆盖已存在的文件 |

### `init` 命令选项

| 选项 | 说明 |
|------|------|
| `-t, --template <template>` | 项目模板 (vue3, nuxt) |

### `migrate` 命令选项

| 选项 | 说明 |
|------|------|
| `-f, --from <library>` | 源库 (vueuse, v-directives) |

## 开发指南

### 本地构建

```bash
cd packages/cli
pnpm build
```

### 开发模式

```bash
cd packages/cli
pnpm dev
```

### 项目结构

```
packages/cli/
├── src/
│   ├── index.ts              # CLI 入口
│   └── commands/
│       ├── create-directive.ts   # 创建指令命令
│       ├── create-composable.ts  # 创建 composable 命令
│       ├── init.ts              # 初始化项目命令
│       └── doctor.ts            # 环境检查命令
├── package.json
└── tsconfig.json
```

## 常见问题

### Q: 创建指令后如何注册？

A: 在 `src/directives/index.ts` 中导出：

```typescript
export * from './my-directive'
```

### Q: 如何自定义模板？

A: 目前不支持自定义模板，可以通过修改 `src/commands/create-directive.ts` 中的 `DIRECTIVE_TEMPLATE` 常量来自定义。

### Q: `doctor` 命令报错怎么办？

A: 确保在项目根目录下运行命令，并且项目中有 `package.json` 文件。
