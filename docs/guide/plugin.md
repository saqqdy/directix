# Plugin System

Directix provides an extensible plugin architecture for community contributions and custom directive development.

## Overview

The plugin system allows you to:
- Create and share custom directives
- Extend existing directives with additional functionality
- Register third-party plugins
- Build directive templates for rapid development

## Creating a Plugin

### Basic Plugin Structure

```typescript
import { definePlugin, type DirectixPlugin } from 'directix'
import type { Directive } from 'vue'

// Define your directive
const vMyDirective: Directive = {
  mounted(el, binding) {
    // Your implementation
  },
}

// Create the plugin
const myPlugin = definePlugin({
  meta: {
    name: 'directix-my-plugin',
    version: '1.0.0',
    description: 'My custom directives',
    author: 'Your Name',
    license: 'MIT',
  },
  
  install(ctx) {
    // Register directives
    ctx.registerDirective('my-directive', vMyDirective)
    
    // Register composables
    ctx.registerComposable('useMyFeature', useMyFeature)
  },
  
  uninstall(ctx) {
    // Cleanup when plugin is removed
    console.log('Plugin uninstalled')
  },
  
  // Optional dependencies
  dependencies: ['other-plugin'],
})

export default myPlugin
```

### Plugin Context

The `ctx` object provides:

| Property | Description |
|----------|-------------|
| `app` | Vue app instance |
| `registerDirective(name, directive)` | Register a directive |
| `registerComposable(name, composable)` | Register a composable |
| `getDirective(name)` | Get an existing directive |
| `warn(message)` | Show a warning |
| `error(message)` | Show an error |
| `meta` | Plugin metadata |

## Using Plugins

```typescript
import { getPluginManager } from 'directix'
import myPlugin from 'directix-my-plugin'

const manager = getPluginManager()

// Set the Vue app instance
manager.setApp(app)

// Register the plugin
await manager.register(myPlugin)

// Check if plugin is registered
if (manager.has('directix-my-plugin')) {
  console.log('Plugin installed!')
}

// Get all registered plugins
const plugins = manager.getAll()

// Unregister when needed
await manager.unregister('directix-my-plugin')
```

## Plugin Hooks

Listen to plugin lifecycle events:

```typescript
import { getPluginManager, type PluginHook } from 'directix'

const manager = getPluginManager()

// Register hooks
manager.onHook('beforeInstall', (plugin, ctx) => {
  console.log(`Installing ${plugin.meta.name}...`)
})

manager.onHook('afterInstall', (plugin, ctx) => {
  console.log(`${plugin.meta.name} installed successfully!`)
})

manager.onHook('beforeUninstall', (plugin, ctx) => {
  console.log(`Uninstalling ${plugin.meta.name}...`)
})

manager.onHook('afterUninstall', (plugin, ctx) => {
  console.log(`${plugin.meta.name} uninstalled`)
})
```

## Extending Directives

Add custom behavior to existing directives:

```typescript
import { getPluginManager, type DirectiveExtension } from 'directix'

const manager = getPluginManager()

// Extend v-debounce with logging
const extension: DirectiveExtension = {
  target: 'debounce',
  hook: 'mounted',
  handler(el, binding) {
    console.log('v-debounce mounted on:', el)
  },
}

manager.extendDirective(extension)
```

## Directive Templates

Simplify directive creation with templates:

### Basic Template

```typescript
import { createDirectiveTemplate } from 'directix'

const vHighlight = createDirectiveTemplate({
  name: 'highlight',
  
  onMount(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },
  
  onUpdate(el, options) {
    el.style.backgroundColor = options.color || 'yellow'
  },
  
  onUnmount(el) {
    el.style.backgroundColor = ''
  },
  
  validate(options) {
    if (options.color && !isValidColor(options.color)) {
      return 'Invalid color value'
    }
    return null
  },
})
```

### Event Directive Template

```typescript
import { createEventDirective } from 'directix'

const vTrack = createEventDirective({
  name: 'track',
  eventName: 'click',
  handler(el, binding, event) {
    analytics.track(binding.value, {
      element: el.tagName,
      timestamp: Date.now(),
    })
  },
})
```

### Style Directive Template

```typescript
import { createStyleDirective } from 'directix'

const vOpacity = createStyleDirective({
  name: 'opacity',
  cssProperty: 'opacity',
  defaultUnit: '',
  validate(value) {
    return typeof value === 'number' && value >= 0 && value <= 1
  },
})
```

## Publishing Plugins

### Package Structure

```
directix-my-plugin/
├── src/
│   ├── index.ts          # Main entry
│   ├── directives/       # Your directives
│   └── composables/      # Your composables
├── package.json
├── README.md
└── LICENSE
```

### package.json

```json
{
  "name": "directix-my-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "directix": "^1.0.0",
    "vue": "^2.0.0 || ^3.0.0"
  },
  "keywords": [
    "vue",
    "directix",
    "directive",
    "plugin"
  ]
}
```

## Best Practices

1. **Use semantic versioning** - Follow semver for plugin versions
2. **Document your API** - Provide clear documentation
3. **Type everything** - Export TypeScript types
4. **Handle errors gracefully** - Use `ctx.warn()` and `ctx.error()`
5. **Clean up on uninstall** - Remove event listeners, observers, etc.
6. **Test thoroughly** - Write tests for your directives