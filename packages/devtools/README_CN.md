# @directix/devtools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

[Directix](https://github.com/saqqdy/directix) 的浏览器 DevTools 扩展 — 检查指令、监控性能，实时调试 Vue 应用中的指令使用情况。

## 特性

- 🔍 **指令检查器** — 查看任意元素上激活的 Directix 指令
- 📊 **性能面板** — 监控每个指令的挂载时间、更新时间和内存使用
- 🎯 **元素选择** — 点击任意元素查看其绑定的指令和当前状态
- 📈 **指标仪表盘** — 活跃指令数量、元素数量、挂载/更新平均时间和内存使用

## 安装

### 从源码构建

```bash
cd packages/devtools
pnpm install
pnpm build
```

然后在 Chrome 中加载扩展：

1. 打开 `chrome://extensions/`
2. 启用**开发者模式**
3. 点击**加载已解压的扩展程序**
4. 选择 `packages/devtools/dist` 目录

## 使用

1. 打开 Chrome DevTools（`F12` 或 `Ctrl+Shift+I`）
2. 在 DevTools 中找到 **Directix** 标签页
3. 选择页面上的元素 — 面板将显示：
   - 元素上的活跃指令，包括名称、状态（Active/Inactive）和当前值
   - 可用的指令内部状态

### 性能面板

切换到 **Performance** 标签页查看：
- 所有指令的平均挂载时间
- 所有指令的平均更新时间
- 总内存使用量
- 各指令的性能明细（挂载时间、更新时间、内存）

## 架构

```
┌─────────────┐    messages     ┌──────────────┐
│  DevTools    │ ◄────────────► │ Content      │
│  Panel       │                │ Script       │
│  (panel.ts)  │                │ (injected)   │
└─────────────┘                └──────────────┘
```

- **panel.ts** — DevTools 面板 UI，接收指令数据并渲染
- **devtools.ts** — DevTools 页面入口，创建面板
- **panel.html** — 面板模板，含标签页导航

## 开发

```bash
# 构建
pnpm build

# 监听模式
pnpm dev
```

## 权限

此扩展不需要特殊权限。它使用标准 Chrome DevTools API 添加面板。

## 相关

- [Directix](https://github.com/saqqdy/directix) — 主 Vue 指令库
- [@directix/core](https://github.com/saqqdy/directix/tree/master/packages/core) — 核心 DevTools 集成 API
- [directix-vscode](https://github.com/saqqdy/directix/tree/master/packages/vscode-extension) — VS Code 扩展

## 许可证

[MIT](https://opensource.org/licenses/MIT)
