# VS Code 插件

Directix 提供了 VS Code 插件，通过智能代码补全、悬浮文档和代码片段提升开发体验。

## 安装

### 从 VS Code 市场安装

1. 打开 VS Code
2. 按 `Cmd+Shift+X` (Mac) 或 `Ctrl+Shift+X` (Windows/Linux) 打开扩展面板
3. 搜索 "Directix"
4. 点击 "Install" 安装

### 从 VSIX 文件安装

```bash
cd packages/vscode-extension
pnpm build
code --install-extension directix-vscode-1.0.0.vsix
```

## 功能特性

### 指令自动补全

在 Vue 模板中输入 `v-` 时，自动显示 Directix 指令补全列表。

**触发条件：**
- 在标签属性位置输入 `v-`
- 在已有属性后输入空格后再输入 `v-`

### 悬浮文档

将鼠标悬停在任意 Directix 指令上，显示详细的文档信息：
- 指令描述
- 使用示例
- 参数选项
- 默认值

### 代码片段

输入指令前缀快速插入代码片段：

| 前缀 | 生成的代码 |
|------|-----------|
| `vcopy` | `v-copy="'text to copy'"` |
| `vdebounce` | `v-debounce="{ handler: handleInput, wait: 300 }"` |
| `vthrottle` | `v-throttle="{ handler: handleClick, limit: 300 }"` |
| `vclickoutside` | `v-click-outside="handleClickOutside"` |
| `vlongpress` | `v-long-press="{ handler: handleLongPress, duration: 500 }"` |
| `vhover` | `v-hover="{ onEnter: handleEnter, onLeave: handleLeave }"` |
| `vfocus` | `v-focus` |
| `vlazy` | `v-lazy="imageUrl"` |
| `vloading` | `v-loading="isLoading"` |
| `vripple` | `v-ripple` |
| `vintersect` | `v-intersect="handleIntersect"` |
| `vresize` | `v-resize="handleResize"` |
| `vscroll` | `v-scroll="handleScroll"` |
| `vwatermark` | `v-watermark="'Confidential'"` |
| `vtooltip` | `v-tooltip="'Tooltip text'"` |
| `vpermission` | `v-permission="'admin'"` |
| `vhotkey` | `v-hotkey="{ 'ctrl+s': handleSave }"` |
| `vmask` | `v-mask="'###-##-####'"` |
| `vmoney` | `v-money` |
| `vnumber` | `v-number` |
| `vinfinitescroll` | `v-infinite-scroll="loadMore"` |
| `vdraggable` | `v-draggable` |
| `vvisible` | `v-visible="isVisible"` |
| `vsanitize` | `v-sanitize` |
| `vskeleton` | `v-skeleton="isLoading"` |
| `vellipsis` | `v-ellipsis="1"` |
| `vtruncate` | `v-truncate="50"` |

### 命令面板

按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux) 打开命令面板：

- **Directix: Open Documentation** - 打开官方文档网站

## 配置选项

在 VS Code 设置中配置插件：

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `directix.enableIntelliSense` | boolean | `true` | 启用智能感知 |
| `directix.showDocumentation` | boolean | `true` | 在悬浮提示中显示文档 |

### 通过设置界面

1. 打开 VS Code 设置 (`Cmd+,` 或 `Ctrl+,`)
2. 搜索 "Directix"
3. 勾选/取消勾选相关选项

### 通过 settings.json

```json
{
  "directix.enableIntelliSense": true,
  "directix.showDocumentation": true
}
```

## 支持的文件类型

- `.vue` 文件
- `.html` 文件

## 常见问题

### 补全不生效？

1. 确保文件类型是 `.vue` 或 `.html`
2. 确认 `directix.enableIntelliSense` 设置为 `true`
3. 重启 VS Code
