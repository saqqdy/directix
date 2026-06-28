# VS Code Extension

Directix provides a VS Code extension that enhances your development experience with intelligent code completion, hover documentation, diagnostics, performance tracking, and snippets.

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux) to open the Extensions panel
3. Search for "Directix"
4. Click "Install"

### From VSIX File

```bash
cd packages/vscode-extension
pnpm build
code --install-extension directix-vscode-1.0.0.vsix
```

## Features

### Directive Auto-Completion

When you type `v-` in Vue templates, Directix directives appear in the auto-completion list.

**Trigger conditions:**
- Typing `v-` in a tag attribute position
- Typing `v-` after a space following an existing attribute

### Hover Documentation

Hover over any Directix directive to see detailed documentation including:
- Directive description
- Usage examples
- Available options
- Default values

### Code Snippets

Type directive prefixes to quickly insert code snippets:

| Prefix | Generated Code |
|--------|----------------|
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

### Command Palette

Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) to open the command palette:

| Command | Description |
|---------|-------------|
| **Directix: Open Documentation** | Open the official documentation website |
| **Directix: Open Config Editor** | Open visual configuration editor |
| **Directix: Show Performance Report** | Show performance metrics for directives |
| **Directix: Show Bottlenecks** | Detect and show performance bottleneck warnings |
| **Directix: Clear Performance Data** | Clear collected performance metrics |
| **Directix: Inspect State** | Quick pick to inspect directive state |
| **Directix: Open Directive Docs** | Open docs for directive at cursor position |
| **Directix: Search Docs** | Search documentation for directives |
| **Directix: Insert Directive** | Quick pick to insert a directive |

### Performance Bottleneck Detection

The extension can detect performance issues in your directives:

**Bottleneck Types:**
| Type | Threshold | Description |
|------|-----------|-------------|
| Slow mount | > 50ms | Directive mount takes too long |
| Slow update | > 16ms | Directive update exceeds frame budget |
| Excessive updates | > 100 | Too many updates in short period |
| Memory leak pattern | - | Potential memory cleanup issues |

When bottlenecks are detected, a QuickPick UI shows warnings with optimization suggestions.

### Diagnostics

Real-time diagnostics for your Vue templates:

| Diagnostic | Description |
|------------|-------------|
| Missing parameters | Required directive parameters not provided |
| SSR compatibility | Warns about directives incompatible with SSR |
| Deprecated patterns | Warns about deprecated usage patterns |
| Duplicate directives | Multiple same directives on one element |
| Conflicting directives | Conflicting directive pairs (e.g., v-debounce + v-throttle) |
| Modifier combinations | Invalid modifier combinations |
| Memory leak patterns | Patterns that may cause memory leaks |
| SSR hydration issues | Potential SSR hydration mismatches |
| Accessibility concerns | Missing ARIA attributes or accessibility issues |

## Configuration

Configure the extension in VS Code settings:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `directix.enableIntelliSense` | boolean | `true` | Enable IntelliSense (completion & hover) |
| `directix.showDocumentation` | boolean | `true` | Show documentation in hover tooltips |
| `directix.enableDiagnostics` | boolean | `true` | Enable real-time diagnostics |
| `directix.enablePerformanceTracking` | boolean | `false` | Enable performance tracking |
| `directix.diagnostics.debounceMs` | number | `500` | Diagnostics debounce delay |
| `directix.diagnostics.checkDuplicates` | boolean | `true` | Warn about duplicate directives |
| `directix.diagnostics.checkConflicts` | boolean | `true` | Warn about conflicting directive pairs |
| `directix.diagnostics.checkSSRCompatibility` | boolean | `true` | Warn about SSR incompatibility |

### Via Settings UI

1. Open VS Code settings (`Cmd+,` or `Ctrl+,`)
2. Search for "Directix"
3. Toggle the desired options

### Via settings.json

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

## Supported File Types

- `.vue` files
- `.html` files

## Troubleshooting

### Auto-completion not working?

1. Ensure the file type is `.vue` or `.html`
2. Verify `directix.enableIntelliSense` is set to `true`
3. Restart VS Code

### Diagnostics not showing?

1. Check that `directix.enableDiagnostics` is `true`
2. Open a Vue file and wait for the debounce delay
3. Check the Problems panel for warnings

### Performance tracking empty?

1. Enable `directix.enablePerformanceTracking`
2. Interact with your app in the browser
3. Run "Directix: Show Performance Report" command