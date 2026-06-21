# directix-cli

[![npm version](https://img.shields.io/npm/v/directix-cli.svg)](https://www.npmjs.com/package/directix-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | **[中文文档](README_CN.md)**

Command-line tool for [Directix](https://github.com/saqqdy/directix) — scaffold directives/composables, initialize projects, run diagnostics, migrate from other libraries, and manage i18n locales.

## Features

- 🏗️ **Initialize Projects** — Scaffold a new Directix project with Vue 2, Vue 3, or Nuxt templates
- 🎨 **Create Directives & Composables** — Generate boilerplate for new directives and composables
- 🩺 **Doctor Check** — Diagnose your Directix setup and find configuration issues
- 🔄 **Migration** — Migrate from Directix v1, VueUse, or v-directives
- 🌐 **i18n Management** — Extract, validate, and sync translation messages

## Installation

```bash
# Install globally
pnpm add -g directix-cli

# Or use with npx (no install needed)
npx directix-cli --help
```

## Commands

### `directix init`

Initialize a new Directix project.

```bash
# Interactive mode
directix init

# With project name
directix init my-project

# Specify template
directix init my-project --template nuxt
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `-t, --template <template>` | `vue3` | Project template (`vue2`, `vue3`, `nuxt`) |

---

### `directix create`

Create a new directive or composable.

```bash
# Create a directive
directix create directive v-my-directive

# Create a composable
directix create composable useMyFeature

# Overwrite existing files
directix create directive v-my-directive --force
```

**Options:**
| Option | Description |
|--------|-------------|
| `-f, --force` | Overwrite existing files |

---

### `directix doctor`

Check your Directix setup for issues.

```bash
directix doctor
```

This command verifies:
- Package dependencies are installed correctly
- Vue version compatibility
- Configuration file validity
- Directive registration status

---

### `directix migrate`

Migrate from older versions or other libraries.

```bash
# Auto-detect and migrate
directix migrate

# Migrate from a specific library
directix migrate --from vueuse

# Dry run (show changes without applying)
directix migrate --from vueuse --dry-run

# Generate a migration report
directix migrate --output report.md --format markdown
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `-f, --from <library>` | Auto-detect | Source library (`directix-v1`, `vueuse`, `v-directives`) |
| `-d, --dry-run` | `false` | Show changes without applying them |
| `-v, --verbose` | `false` | Show detailed output |
| `-o, --output <file>` | — | Output report to file |
| `--format <format>` | `text` | Report format (`text`, `json`, `markdown`) |

---

### `directix i18n:extract`

Extract translation messages from source code.

```bash
directix i18n:extract

# Specify output file
directix i18n:extract --output locales/extracted.json
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `--output <file>` | `i18n-extracted.json` | Output file path |

---

### `directix i18n:validate`

Validate locale completeness across all translations.

```bash
# Validate all locales
directix i18n:validate

# Validate a specific locale
directix i18n:validate --locale ko-KR

# Set minimum coverage threshold
directix i18n:validate --threshold 95
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `--locale <code>` | All | Validate specific locale |
| `--threshold <num>` | `90` | Minimum coverage threshold (%) |

---

### `directix i18n:sync`

Sync locale structure with the base locale.

```bash
# Sync all locales with en-US as base
directix i18n:sync

# Sync a specific target locale
directix i18n:sync --target ko-KR

# Use a different base locale
directix i18n:sync --base zh-CN
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `--base <locale>` | `en-US` | Base locale to sync from |
| `--target <locale>` | All | Target locale to sync |

## Global Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Display version number |
| `-h, --help` | Display help message |

## Examples

```bash
# Create a new Vue 3 project
directix init my-app --template vue3

# Add a custom directive
directix create directive v-tracking

# Add a custom composable
directix create composable useAnalytics

# Check your setup
directix doctor

# Migrate from VueUse with a markdown report
directix migrate --from vueuse --dry-run --output report.md --format markdown

# Ensure all locales have 95%+ coverage
directix i18n:validate --threshold 95
```

## Related

- [Directix](https://github.com/saqqdy/directix) — Main Vue directives library
- [@directix/i18n](https://github.com/saqqdy/directix/tree/master/packages/i18n) — Internationalization support

## License

[MIT](https://opensource.org/licenses/MIT)
