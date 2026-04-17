# Directix - Vue Directives IntelliSense

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=saqqdy.directix-vscode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**IntelliSense, code snippets, and hover documentation for [Directix](https://github.com/saqqdy/directix) - the comprehensive Vue directives library.**

## Features

### 🎯 IntelliSense

- **Auto-completion** for all 57 Directix directives
- **Hover documentation** showing directive usage and options
- **Parameter hints** for directive values

### 📝 Code Snippets

Quick code snippets for all directives:

| Prefix | Directive | Description |
|--------|-----------|-------------|
| `vcopy` | `v-copy` | Copy text to clipboard |
| `vdebounce` | `v-debounce` | Debounce event handlers |
| `vthrottle` | `v-throttle` | Throttle event handlers |
| `vclickoutside` | `v-click-outside` | Detect clicks outside element |
| `vlazy` | `v-lazy` | Lazy load images |
| `vpermission` | `v-permission` | Permission-based control |
| `vloading` | `v-loading` | Loading overlay |
| `vtooltip` | `v-tooltip` | Tooltip component |
| `vripple` | `v-ripple` | Material ripple effect |
| `vdraggable` | `v-draggable` | Draggable elements |
| `vscroll` | `v-scroll` | Scroll event handling |
| `vintersect` | `v-intersect` | Intersection observer |
| `vfocus` | `v-focus` | Auto focus element |
| `vmask` | `v-mask` | Input masking |
| `vsanitize` | `v-sanitize` | HTML sanitization |
| ... | ... | And 40+ more! |

### 🔗 Quick Documentation Links

- Open Directix documentation directly from VS Code
- Command: `Directix: Open Documentation`

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
3. Search for "Directix"
4. Click Install

### From Source

```bash
cd packages/vscode-extension
pnpm install
pnpm build
# Then install the .vsix file manually
```

## Configuration

Configure via VS Code settings:

```json
{
  "directix.enableIntelliSense": true,
  "directix.showDocumentation": true
}
```

## Supported Languages

- Vue (`.vue`)
- HTML (`.html`)

## Requirements

- VS Code 1.85.0 or higher
- Vue Language Features (Volar) recommended

## Related

- [Directix Documentation](https://github.com/saqqdy/directix#readme)
- [Directix Playground](https://saqqdy.github.io/directix/playground/)
- [GitHub Repository](https://github.com/saqqdy/directix)

## License

[MIT](LICENSE)
