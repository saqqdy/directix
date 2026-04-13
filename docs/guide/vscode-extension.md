# VS Code Extension

Directix provides a VS Code extension that enhances your development experience with intelligent code completion, hover documentation, and snippets.

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

- **Directix: Open Documentation** - Open the official documentation website

## Configuration

Configure the extension in VS Code settings:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `directix.enableIntelliSense` | boolean | `true` | Enable IntelliSense |
| `directix.showDocumentation` | boolean | `true` | Show documentation in hover tooltips |

### Via Settings UI

1. Open VS Code settings (`Cmd+,` or `Ctrl+,`)
2. Search for "Directix"
3. Toggle the desired options

### Via settings.json

```json
{
  "directix.enableIntelliSense": true,
  "directix.showDocumentation": true
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
