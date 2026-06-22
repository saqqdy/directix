# Directix Browser Extension

Chrome DevTools extension for inspecting and debugging Directix Vue directives.

## Features

- **Directive Inspector** — See all Directix directive instances on the current page
- **Performance Monitor** — Track mount/update/unmount timing for each directive
- **State Inspector** — Inspect directive bindings, modifiers, and internal state
- **Issue Detection** — Automatic detection of memory leaks, excessive updates, and slow mounts

## Development

```bash
pnpm install
pnpm dev       # Watch mode
pnpm build     # Build
pnpm build:prod # Minified build
```

## Loading the Extension

1. Run `pnpm build`
2. Open Chrome → `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" → select `packages/browser-extension`
5. Open DevTools on a page using Directix → find the "Directix" tab

## Architecture

```
src/
├── background/index.ts     # Service worker — routes messages
├── content/index.ts        # Content script — scans page DOM
└── devtools/
    ├── index.ts            # Creates the DevTools panel
    ├── perfAnalyzer.ts     # Performance metrics
    └── stateInspector.ts   # Directive state inspection
```
