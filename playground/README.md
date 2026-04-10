# Directix Playground

Interactive code generator for Directix Vue directives.

## Features

- **44+ Directive Configurations** - Full parameter support with smart defaults
- **Multi-format Code Generation** - Vue 2, Vue 3, Composables, Nuxt, TypeScript types
- **Live Preview** - Real-time code preview with syntax highlighting
- **Visual Configuration** - Parameter editors with sliders, toggles, dropdowns
- **One-click Copy/Download** - Export generated code instantly

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
playground/
├── src/
│   ├── components/
│   │   ├── DirectiveSelector.vue  # Directive list with search
│   │   ├── ConfigPanel.vue        # Parameter configuration
│   │   └── CodePreview.vue        # Code output & preview
│   ├── utils/
│   │   ├── directive-configs.ts   # Directive definitions
│   │   └── code-generator.ts      # Code generation logic
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── App.vue                    # Main layout
│   ├── main.ts                    # Entry point
│   └── style.css                  # Styles
├── package.json
└── vite.config.ts
```

## Adding New Directives

1. Add directive configuration to `src/utils/directive-configs.ts`:

```typescript
{
  name: 'directive-name',
  displayName: 'v-directive-name',
  description: 'Directive description',
  category: 'Event', // Event | Form | Format | Visibility | Scroll | Security | UI | Data | Utility
  supportsVue2: true,
  supportsVue3: true,
  hasComposable: true,
  parameters: [
    {
      name: 'paramName',
      type: 'string', // string | number | boolean | object | array | function | select
      description: 'Parameter description',
      required: true,
      default: 'default value'
    }
  ],
  examples: [
    {
      title: 'Basic Usage',
      description: 'Example description',
      code: '<div v-directive="value">Content</div>'
    }
  ]
}
```

2. Add composable return values to `code-generator.ts` if needed.

## Integration with Docs

The Playground is embedded in the documentation site via:

- `docs/.vitepress/components/Playground.vue` - Full playground widget
- `docs/.vitepress/components/DirectiveConfigurator.vue` - Quick code generator

## Deployment

```bash
# Deploy to docs
./scripts/deploy.sh docs

# Build and deploy with main library
pnpm --filter directix build && pnpm --filter @directix/playground build
```

## License

MIT
