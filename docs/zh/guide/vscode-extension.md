# VS Code 插件

Directix 提供了 VS Code 插件，通过智能代码补全、悬浮文档、诊断、性能追踪和代码片段提升开发体验。

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

| 命令 | 描述 |
|------|------|
| **Directix: Open Documentation** | 打开官方文档网站 |
| **Directix: Open Config Editor** | 打开可视化配置编辑器 |
| **Directix: Show Performance Report** | 显示指令性能指标 |
| **Directix: Show Bottlenecks** | 检测并显示性能瓶颈警告 |
| **Directix: Clear Performance Data** | 清除已收集的性能数据 |
| **Directix: Inspect State** | 快速选择检查指令状态 |
| **Directix: Open Directive Docs** | 打开光标位置指令的文档 |
| **Directix: Search Docs** | 搜索指令文档 |
| **Directix: Insert Directive** | 快速选择插入指令 |

### 性能瓶颈检测

插件可以检测指令中的性能问题：

**瓶颈类型：**
| 类型 | 阈值 | 描述 |
|------|------|------|
| 慢挂载 | > 50ms | 指令挂载时间过长 |
| 慢更新 | > 16ms | 指令更新超过帧预算 |
| 过多更新 | > 100 | 短时间内更新次数过多 |
| 内存泄漏模式 | - | 潜在的内存清理问题 |

检测到瓶颈时，QuickPick UI 会显示警告和优化建议。

### 诊断

Vue 模板的实时诊断：

| 诊断 | 描述 |
|------|------|
| 缺少参数 | 未提供必需的指令参数 |
| SSR 兼容性 | 警告与 SSR 不兼容的指令 |
| 废弃模式 | 警告已废弃的使用模式 |
| 重复指令 | 同一元素上有多个相同指令 |
| 冲突指令 | 冲突的指令对（如 v-debounce + v-throttle） |
| 修饰符组合 | 无效的修饰符组合 |
| 内存泄漏模式 | 可能导致内存泄漏的模式 |
| SSR 水合问题 | 潜在的 SSR 水合不匹配 |
| 无障碍问题 | 缺少 ARIA 属性或无障碍问题 |

## 配置选项

在 VS Code 设置中配置插件：

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `directix.enableIntelliSense` | boolean | `true` | 启用智能感知（补全和悬浮） |
| `directix.showDocumentation` | boolean | `true` | 在悬浮提示中显示文档 |
| `directix.enableDiagnostics` | boolean | `true` | 启用实时诊断 |
| `directix.enablePerformanceTracking` | boolean | `false` | 启用性能追踪 |
| `directix.diagnostics.debounceMs` | number | `500` | 诊断防抖延迟 |
| `directix.diagnostics.checkDuplicates` | boolean | `true` | 警告重复指令 |
| `directix.diagnostics.checkConflicts` | boolean | `true` | 警告冲突的指令对 |
| `directix.diagnostics.checkSSRCompatibility` | boolean | `true` | 警告 SSR 不兼容 |

### 通过设置界面

1. 打开 VS Code 设置 (`Cmd+,` 或 `Ctrl+,`)
2. 搜索 "Directix"
3. 勾选/取消勾选相关选项

### 通过 settings.json

```json
{
  "directix.enableIntelliSense": true,
  "directix.showDocumentation": true,
  "directix.enableDiagnostics": true,
  "directix.enablePerformanceTracking": false,
  "directix.diagnostics.debounceMs": 500,
  "directix.diagnostics.checkDuplicates": true,
  "directix.diagnostics.checkConflicts": true,
  "directix.diagnostics.checkSSRCompatibility": true
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

### 诊断不显示？

1. 检查 `directix.enableDiagnostics` 是否为 `true`
2. 打开 Vue 文件并等待防抖延迟
3. 检查问题面板中的警告

### 性能追踪为空？

1. 启用 `directix.enablePerformanceTracking`
2. 在浏览器中与应用交互
3. 运行 "Directix: Show Performance Report" 命令