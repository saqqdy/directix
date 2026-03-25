# Contributing to Directix

First off, thank you for considering contributing to Directix! It's people like you that make Directix such a great tool.

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+

### Clone and Install

```bash
git clone https://github.com/saqqdy/directix.git
cd directix
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Build
pnpm build
```

## Project Structure

```
directix/
├── packages/
│   ├── core/          # Core adapter layer
│   └── shared/        # Shared utilities
├── src/
│   └── directives/    # All directives
├── tests/
│   └── unit/          # Unit tests
└── docs/              # Documentation
```

## Adding a New Directive

1. Create a new file in `src/directives/your-directive.ts`
2. Export the directive from `src/directives/index.ts`
3. Add types in the directive file
4. Add unit tests in `tests/unit/your-directive.test.ts`
5. Add documentation

### Directive Template

```typescript
import { defineDirective, DirectiveBinding } from '@directix/core'
import type { DirectiveHooks } from '@directix/core'

export interface YourDirectiveOptions {
  // Options
}

export type YourDirectiveBinding = YourDirectiveOptions

export const vYourDirective = defineDirective<YourDirectiveBinding, HTMLElement>({
  name: 'your-directive',
  ssr: false, // Set true if SSR compatible

  mounted(el, binding) {
    // Implementation
  },

  updated(el, binding) {
    // Implementation
  },

  unmounted(el) {
    // Cleanup
  },
})

export default vYourDirective
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Tests
- `chore:` Build/tooling

## Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### PR Checklist

- [ ] Code follows the project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commit messages follow convention

## Code Style

- Use TypeScript
- Use Composition API with `<script setup>`
- Follow ESLint rules
- Write meaningful comments

## Questions?

Feel free to open an issue for any questions or discussions.
