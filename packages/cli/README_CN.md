# directix-cli

[![npm version](https://img.shields.io/npm/v/directix-cli.svg)](https://www.npmjs.com/package/directix-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

[Directix](https://github.com/saqqdy/directix) 的命令行工具 — 快速创建指令/组合式函数、初始化项目、运行诊断、从其他库迁移以及管理 i18n 语言包。

## 特性

- 🏗️ **项目初始化** — 使用 Vue 2、Vue 3 或 Nuxt 模板搭建新的 Directix 项目
- 🎨 **创建指令与组合式函数** — 生成新指令和组合式函数的模板代码
- 🩺 **诊断检查** — 诊断 Directix 配置，发现潜在问题
- 🔄 **迁移** — 从 Directix v1、VueUse 或 v-directives 迁移
- 🌐 **i18n 管理** — 提取、校验和同步翻译消息

## 安装

```bash
# 全局安装
pnpm add -g directix-cli

# 或使用 npx（无需安装）
npx directix-cli --help
```

## 命令

### `directix init`

初始化一个新的 Directix 项目。

```bash
# 交互模式
directix init

# 指定项目名称
directix init my-project

# 指定模板
directix init my-project --template nuxt
```

**选项：**
| 选项 | 默认值 | 说明 |
|------|--------|------|
| `-t, --template <template>` | `vue3` | 项目模板（`vue2`、`vue3`、`nuxt`） |

---

### `directix create`

创建新的指令或组合式函数。

```bash
# 创建指令
directix create directive v-my-directive

# 创建组合式函数
directix create composable useMyFeature

# 覆盖已有文件
directix create directive v-my-directive --force
```

**选项：**
| 选项 | 说明 |
|------|------|
| `-f, --force` | 覆盖已有文件 |

---

### `directix doctor`

检查 Directix 配置是否存在问题。

```bash
directix doctor
```

此命令将检查：
- 包依赖是否正确安装
- Vue 版本兼容性
- 配置文件有效性
- 指令注册状态

---

### `directix migrate`

从旧版本或其他库迁移。

```bash
# 自动检测并迁移
directix migrate

# 从指定库迁移
directix migrate --from vueuse

# 试运行（仅显示变更，不实际修改）
directix migrate --from vueuse --dry-run

# 生成迁移报告
directix migrate --output report.md --format markdown
```

**选项：**
| 选项 | 默认值 | 说明 |
|------|--------|------|
| `-f, --from <library>` | 自动检测 | 来源库（`directix-v1`、`vueuse`、`v-directives`） |
| `-d, --dry-run` | `false` | 仅显示变更，不实际执行 |
| `-v, --verbose` | `false` | 显示详细输出 |
| `-o, --output <file>` | — | 输出报告到文件 |
| `--format <format>` | `text` | 报告格式（`text`、`json`、`markdown`） |

---

### `directix i18n:extract`

从源代码中提取翻译消息。

```bash
directix i18n:extract

# 指定输出文件
directix i18n:extract --output locales/extracted.json
```

**选项：**
| 选项 | 默认值 | 说明 |
|------|--------|------|
| `--output <file>` | `i18n-extracted.json` | 输出文件路径 |

---

### `directix i18n:validate`

校验所有语言包的翻译完整性。

```bash
# 校验所有语言
directix i18n:validate

# 校验指定语言
directix i18n:validate --locale ko-KR

# 设置最低覆盖率阈值
directix i18n:validate --threshold 95
```

**选项：**
| 选项 | 默认值 | 说明 |
|------|--------|------|
| `--locale <code>` | 全部 | 校验指定语言 |
| `--threshold <num>` | `90` | 最低覆盖率阈值（%） |

---

### `directix i18n:sync`

以基础语言包为基准同步各语言的结构。

```bash
# 以 en-US 为基准同步所有语言
directix i18n:sync

# 同步指定目标语言
directix i18n:sync --target ko-KR

# 使用其他基础语言
directix i18n:sync --base zh-CN
```

**选项：**
| 选项 | 默认值 | 说明 |
|------|--------|------|
| `--base <locale>` | `en-US` | 基准语言 |
| `--target <locale>` | 全部 | 目标语言 |

## 全局选项

| 选项 | 说明 |
|------|------|
| `-v, --version` | 显示版本号 |
| `-h, --help` | 显示帮助信息 |

## 示例

```bash
# 创建新的 Vue 3 项目
directix init my-app --template vue3

# 添加自定义指令
directix create directive v-tracking

# 添加自定义组合式函数
directix create composable useAnalytics

# 检查配置
directix doctor

# 从 VueUse 迁移并生成 Markdown 报告
directix migrate --from vueuse --dry-run --output report.md --format markdown

# 确保所有语言覆盖率达 95% 以上
directix i18n:validate --threshold 95
```

## 相关

- [Directix](https://github.com/saqqdy/directix) — 主 Vue 指令库
- [@directix/i18n](https://github.com/saqqdy/directix/tree/master/packages/i18n) — 国际化支持

## 许可证

[MIT](https://opensource.org/licenses/MIT)
