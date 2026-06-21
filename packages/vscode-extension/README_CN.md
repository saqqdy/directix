# Directix - Vue 指令智能提示

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=saqqdy.directix-vscode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

为 [Directix](https://github.com/saqqdy/directix) — 全面的 Vue 指令库提供智能提示、代码片段和悬停文档。

## 特性

### 🎯 智能提示

- **自动补全** — 支持全部 57 个 Directix 指令
- **悬停文档** — 显示指令的用法和选项说明
- **参数提示** — 提供指令值的参数信息

### 📝 代码片段

所有指令的快捷代码片段：

| 前缀 | 指令 | 说明 |
|------|------|------|
| `vcopy` | `v-copy` | 复制文本到剪贴板 |
| `vdebounce` | `v-debounce` | 防抖事件处理 |
| `vthrottle` | `v-throttle` | 节流事件处理 |
| `vclickoutside` | `v-click-outside` | 检测元素外部点击 |
| `vlazy` | `v-lazy` | 图片懒加载 |
| `vpermission` | `v-permission` | 权限控制 |
| `vloading` | `v-loading` | 加载遮罩 |
| `vtooltip` | `v-tooltip` | 工具提示 |
| `vripple` | `v-ripple` | Material 涟漪效果 |
| `vdraggable` | `v-draggable` | 可拖拽元素 |
| `vscroll` | `v-scroll` | 滚动事件处理 |
| `vintersect` | `v-intersect` | 交叉观察器 |
| `vfocus` | `v-focus` | 自动聚焦 |
| `vmask` | `v-mask` | 输入遮罩 |
| `vsanitize` | `v-sanitize` | HTML 消毒 |
| ... | ... | 以及 40+ 更多！ |

### 🔗 快速文档链接

- 从 VS Code 中直接打开 Directix 文档
- 命令：`Directix: Open Documentation`

## 安装

### 从 VS Code 市场安装

1. 打开 VS Code
2. 按 `Ctrl+Shift+X`（Windows/Linux）或 `Cmd+Shift+X`（macOS）
3. 搜索 "Directix"
4. 点击安装

### 从源码构建

```bash
cd packages/vscode-extension
pnpm install
pnpm build
# 然后手动安装 .vsix 文件
```

## 配置

通过 VS Code 设置进行配置：

```json
{
  "directix.enableIntelliSense": true,
  "directix.showDocumentation": true
}
```

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `directix.enableIntelliSense` | `true` | 启用 Directix 智能提示 |
| `directix.showDocumentation` | `true` | 悬停时显示文档 |

## 支持的语言

- Vue（`.vue`）
- HTML（`.html`）

## 要求

- VS Code 1.85.0 或更高版本
- 建议安装 Vue Language Features（Volar）

## 相关

- [Directix 文档](https://github.com/saqqdy/directix#readme)
- [Directix 在线演练场](https://saqqdy.github.io/directix/playground/)
- [GitHub 仓库](https://github.com/saqqdy/directix)

## 许可证

[MIT](LICENSE)
