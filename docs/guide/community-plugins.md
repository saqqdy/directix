# Community Plugins

Directix provides a community plugin registry for discovering and installing third-party plugins.

## Browsing Plugins

### Online Registry

Visit the [plugin registry](/plugins.json) to browse all available community plugins.

### Programmatic Access

Use the `PluginRegistry` API to search and discover plugins:

```typescript
import { getPluginRegistry } from 'directix'

const registry = getPluginRegistry()

// Get all plugins
const plugins = await registry.getAll()

// Search by keyword
const results = await registry.search('animation')

// Get by category
const formPlugins = await registry.getByCategory('form')

// Get a specific plugin
const plugin = await registry.getByName('directix-animate')

// Get registry metadata
const meta = await registry.getMeta()
console.log(`${meta.count} plugins available (updated: ${meta.updated})`)
```

## Plugin Categories

| Category | Description |
|----------|-------------|
| `event` | Event handling directives |
| `visibility` | Visibility and intersection directives |
| `scroll` | Scroll-related directives |
| `form` | Form and input directives |
| `ui` | UI and visual directives |
| `security` | Security-related directives |
| `observer` | Observer pattern directives |
| `gesture` | Touch and gesture directives |
| `other` | Other directives |

## Installing Plugins

### Step 1: Install the Package

Use your preferred package manager:

```bash
# npm
npm install directix-animate

# yarn
yarn add directix-animate

# pnpm
pnpm add directix-animate
```

### Step 2: Register the Plugin

```typescript
import { getPluginManager } from 'directix'
import animatePlugin from 'directix-animate'

const manager = getPluginManager()
manager.setApp(app)

await manager.register(animatePlugin)
```

### Using the Registry Install Helper

For convenience, you can use the registry to install plugins programmatically:

```typescript
import { getPluginManager } from 'directix'

const manager = getPluginManager()
manager.setApp(app)

// Install from registry (requires the package to be installed first)
await manager.getRegistry().install('directix-animate', manager)
```

::: warning Note
The registry `install()` method requires the npm package to be already installed in your project. It dynamically imports the plugin module. For production use, install the package with your package manager first.
:::

## Submitting a Plugin

To submit your plugin to the community registry:

### 1. Prepare Your Plugin

Ensure your plugin follows the Directix plugin structure:

```typescript
import { definePlugin } from 'directix'

export default definePlugin({
  meta: {
    name: 'directix-my-plugin',
    version: '1.0.0',
    description: 'My awesome plugin',
    author: 'Your Name',
    license: 'MIT',
    repository: 'https://github.com/you/directix-my-plugin',
    keywords: ['animation', 'custom'],
  },

  install(ctx) {
    ctx.registerDirective('my-directive', myDirective)
    ctx.registerComposable('useMyFeature', useMyFeature)
  },

  uninstall(ctx) {
    // Cleanup
  },
})
```

### 2. Package Requirements

- Package name must start with `directix-`
- Must have `directix` and `vue` as peer dependencies
- Must export TypeScript types
- Must include a README with usage documentation
- Must be published to npm

### 3. Submit a PR

Fork the [Directix repository](https://github.com/saqqdy/directix) and add your plugin entry to `docs/public/plugins.json`:

```json
{
  "name": "directix-my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "package": "directix-my-plugin",
  "author": "Your Name",
  "keywords": ["animation", "custom"],
  "category": "ui",
  "license": "MIT",
  "repository": "https://github.com/you/directix-my-plugin"
}
```

## Plugin Quality Standards

Community plugins should meet these standards:

1. **Type Safety** - Full TypeScript support with exported types
2. **Documentation** - Clear API docs and usage examples
3. **Testing** - Unit tests with good coverage
4. **Cleanup** - Proper resource cleanup in `uninstall()`
5. **Error Handling** - Graceful error handling with `ctx.warn()` and `ctx.error()`
6. **Performance** - No unnecessary re-renders or memory leaks
7. **Compatibility** - Support both Vue 2 and Vue 3 where possible
8. **Security** - No XSS vulnerabilities or unsafe DOM operations

## Custom Registry URL

You can configure a custom registry URL:

```typescript
import { getPluginManager } from 'directix'

const manager = getPluginManager({
  registryUrl: 'https://my-company.com/plugins.json',
})

const registry = manager.getRegistry()
const plugins = await registry.getAll()
```

Or create a standalone registry instance:

```typescript
import { PluginRegistry } from 'directix'

const registry = new PluginRegistry('https://my-company.com/plugins.json')
```

## Local Development

For local development or testing, you can set registry data directly:

```typescript
import { getPluginRegistry } from 'directix'
import type { PluginRegistryData } from 'directix'

const registry = getPluginRegistry()

const localData: PluginRegistryData = {
  version: 1,
  updated: '2026-04-19',
  plugins: [
    {
      name: 'my-local-plugin',
      version: '0.0.1',
      description: 'Local test plugin',
      package: 'my-local-plugin',
      author: 'dev',
      keywords: ['test'],
      category: 'other',
    },
  ],
}

registry.setData(localData)
```
