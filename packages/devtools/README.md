# @directix/devtools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | **[中文文档](README_CN.md)**

Browser DevTools extension for [Directix](https://github.com/saqqdy/directix) — inspect directives, monitor performance, and debug your Vue app's directive usage in real time.

## Features

- 🔍 **Directive Inspector** — See which Directix directives are active on any element
- 📊 **Performance Panel** — Monitor mount time, update time, and memory usage per directive
- 🎯 **Element Selection** — Click any element to view its bound directives and current state
- 📈 **Metrics Dashboard** — Active directive count, element count, mount/update averages, and memory usage

## Installation

### From Source

```bash
cd packages/devtools
pnpm install
pnpm build
```

Then load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `packages/devtools/dist` directory

## Usage

1. Open Chrome DevTools (`F12` or `Ctrl+Shift+I`)
2. Find the **Directix** tab in DevTools
3. Select an element on the page — the panel will show:
   - Active directives on the element with their names, state (Active/Inactive), and current values
   - Internal directive state if available

### Performance Panel

Switch to the **Performance** tab to see:
- Average mount time across all directives
- Average update time across all directives
- Total memory usage
- Per-directive performance breakdown (mount time, update time, memory)

## Architecture

```
┌─────────────┐    messages     ┌──────────────┐
│  DevTools    │ ◄────────────► │ Content      │
│  Panel       │                │ Script       │
│  (panel.ts)  │                │ (injected)   │
└─────────────┘                └──────────────┘
```

- **panel.ts** — DevTools panel UI, receives directive data and renders it
- **devtools.ts** — DevTools page entry, creates the panel
- **panel.html** — Panel markup with tab navigation

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev
```

## Permissions

This extension requires no special permissions. It uses the standard Chrome DevTools API to add a panel.

## Related

- [Directix](https://github.com/saqqdy/directix) — Main Vue directives library
- [@directix/core](https://github.com/saqqdy/directix/tree/master/packages/core) — Core DevTools integration API
- [directix-vscode](https://github.com/saqqdy/directix/tree/master/packages/vscode-extension) — VS Code extension

## License

[MIT](https://opensource.org/licenses/MIT)
