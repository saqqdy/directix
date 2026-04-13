# Directix VS Code 插件使用指南

## 概述

Directix VS Code 插件为 Vue 开发者提供智能代码补全、悬浮文档、代码片段等功能，提升开发效率。

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

### 1. 指令自动补全

在 Vue 模板中输入 `v-` 时，自动显示 Directix 指令补全列表。

**触发条件：**
- 在标签属性位置输入 `v-`
- 在已有属性后输入空格后再输入 `v-`

**支持的指令：**

| 指令 | 描述 |
|------|------|
| `v-copy` | 点击复制文本到剪贴板 |
| `v-debounce` | 防抖事件处理 |
| `v-throttle` | 节流事件处理 |
| `v-click-outside` | 检测元素外部点击 |
| `v-long-press` | 长按手势检测 |
| `v-hover` | 悬停状态检测 |
| `v-focus` | 自动聚焦元素 |
| `v-lazy` | 图片懒加载 |
| `v-loading` | 加载状态显示 |
| `v-ripple` | Material Design 波纹效果 |
| `v-intersect` | Intersection Observer |
| `v-resize` | Resize Observer |
| `v-scroll` | 滚动事件处理 |
| `v-watermark` | 水印遮罩 |
| `v-tooltip` | 工具提示 |
| `v-permission` | 权限控制 |
| `v-hotkey` | 键盘快捷键 |
| `v-mask` | 输入掩码 |
| `v-money` | 货币格式 |
| `v-number` | 数字格式 |
| `v-infinite-scroll` | 无限滚动 |
| `v-draggable` | 可拖拽元素 |
| `v-visible` | 可见性控制 |
| `v-sanitize` | HTML 消毒 |
| `v-skeleton` | 骨架屏 |
| `v-ellipsis` | 文本省略 |
| `v-truncate` | 文本截断 |

### 2. 悬浮文档

将鼠标悬停在任意 Directix 指令上，显示详细的文档信息：

- 指令描述
- 使用示例
- 参数选项
- 默认值

**示例悬浮文档：**

```markdown
**v-debounce** - Debounce Event Handler

Delays event handler execution until after wait time has elapsed.

**Usage:**
```vue
<input v-debounce="{ handler: handleInput, wait: 300 }" />
<button v-debounce="{ handler: handleClick, wait: 500 }">Click</button>
```

**Options:**
- `handler` - Event handler function
- `wait` - Wait time in ms (default: 300)
- `leading` - Trigger on leading edge
- `trailing` - Trigger on trailing edge
```

### 3. 代码片段

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

### 4. 快速跳转文档

将光标放在指令上，按 `F12` 或右键选择 "Go to Definition"，自动在浏览器中打开对应的官方文档页面。

### 5. 命令面板

按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux) 打开命令面板，输入 "Directix"：

- **Directix: Open Documentation** - 打开官方文档网站

## 配置选项

在 VS Code 设置中搜索 "Directix" 进行配置：

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `directix.enableIntelliSense` | boolean | `true` | 启用智能感知 |
| `directix.showDocumentation` | boolean | `true` | 在悬浮提示中显示文档 |

### 配置方式

**方式一：设置界面**

1. 打开 VS Code 设置 (`Cmd+,` 或 `Ctrl+,`)
2. 搜索 "Directix"
3. 勾选/取消勾选相关选项

**方式二：settings.json**

```json
{
  "directix.enableIntelliSense": true,
  "directix.showDocumentation": true
}
```

## 开发指南

### 本地构建

```bash
cd packages/vscode-extension
pnpm build
```

### 调试

1. 在 VS Code 中打开 `packages/vscode-extension` 目录
2. 按 `F5` 启动调试
3. 在新打开的 VS Code 窗口中测试插件

### 项目结构

```
packages/vscode-extension/
├── src/
│   └── extension.ts    # 插件主入口
├── snippets/
│   └── snippets.json   # 代码片段定义
├── package.json        # 插件配置
└── tsconfig.json
```

### 添加新指令支持

在 `src/extension.ts` 中的 `directives` 数组添加新指令：

```typescript
const directives = [
  // ... 现有指令
  {
    name: 'v-new-directive',
    description: '新指令描述',
    detail: '详细说明',
    documentation: `**v-new-directive** - 新指令
...
`,
    snippet: 'v-new-directive="$1"',
  },
]
```

同时在 `snippets/snippets.json` 中添加代码片段：

```json
{
  "Directix v-new-directive": {
    "prefix": "vnewdirective",
    "body": "v-new-directive=\"${1:value}\"",
    "description": "新指令描述"
  }
}
```

## 发布

```bash
# 安装 vsce
npm install -g @vscode/vsce

# 打包
vsce package

# 发布
vsce publish
```

## 常见问题

### Q: 补全不生效？

A: 确保：
1. 文件类型是 `.vue` 或 `.html`
2. `directix.enableIntelliSense` 设置为 `true`
3. 重启 VS Code

### Q: 如何禁用某个功能？

A: 在 settings.json 中设置：

```json
{
  "directix.enableIntelliSense": false,  // 禁用智能感知
  "directix.showDocumentation": false    // 禁用悬浮文档
}
```

### Q: 支持哪些文件类型？

A: 目前支持：
- `.vue` 文件
- `.html` 文件
