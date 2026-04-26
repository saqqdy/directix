# Directix v2.0.0 Migration Guide

This guide helps you migrate from Directix v1.x to v2.0.0.

## Overview

v2.0.0 is a major release that focuses on Vue 3 optimization and includes several breaking changes. This guide will help you understand the changes and migrate your codebase smoothly.

## Breaking Changes Summary

| Change | Severity | Auto-fixable |
|--------|----------|--------------|
| Vue 2 support removed | Critical | No |
| Directive naming standardized | Medium | Yes |
| Option structure simplified | High | No |
| Handler signatures updated | Medium | Yes |
| Deprecated utils removed | Low | No |
| Type exports reorganized | Medium | No |

## Pre-Migration Checklist

1. **Check Vue Version**
   ```bash
   npm list vue
   ```
   v2.0.0 requires Vue 3.x. If you're using Vue 2, see the [Vue 2 Migration](#vue-2-migration) section.

2. **Run Migration Detector**
   ```bash
   npx directix migrate --from directix-v1 --dry-run
   ```

3. **Review Breaking Changes Report**
   ```typescript
   import { generateBreakingChangesReport } from 'directix/core'
   
   const report = generateBreakingChangesReport('2.0.0')
   console.log(report)
   ```

## Major Changes

### 1. Vue 2 Support Removed

**Before (v1.x):**
```typescript
// Works with both Vue 2 and Vue 3
import { createApp } from 'vue' // or 'vue2'
import Directix from 'directix'

createApp().use(Directix)
```

**After (v2.0.0):**
```typescript
// Vue 3 only
import { createApp } from 'vue'
import Directix from 'directix'

createApp().use(Directix)
```

**Migration Steps:**
1. Upgrade to Vue 3.x
2. Use Vue 3 migration build if needed
3. Remove `@vue/composition-api` dependency

### 2. Directive Naming Standardized

**Before (v1.x):**
```html
<!-- CamelCase names -->
<div vClickOutside="handler"></div>
<div vLazyLoad="options"></div>
```

**After (v2.0.0):**
```html
<!-- kebab-case names -->
<div v-click-outside="handler"></div>
<div v-lazy-load="options"></div>
```

**Auto-fix:**
```bash
npx directix migrate --from directix-v1 --auto-fix
```

### 3. Option Structure Simplified

**Before (v1.x):**
```typescript
vDebounce({
  handler: () => {},
  delay: 300,
  immediate: true
})
```

**After (v2.0.0):**
```typescript
vDebounce="{
  handler: () => {},
  delay: 300,
  immediate: true
}"
// or
v-debounce:300.immediate="handler"
```

### 4. Handler Signature Updated

**Before (v1.x):**
```typescript
const handler = (event, binding) => {
  // old signature
}
```

**After (v2.0.0):**
```typescript
const handler = (value, oldValue, binding) => {
  // new signature
}
```

### 5. Deprecated Utilities Removed

**Removed APIs:**
- `deepMerge` → Use `structuredClone()` or `Object.assign()`
- `shallowMerge` → Use `Object.assign()`
- `isObjectLike` → Use `typeof` checks

**Before:**
```typescript
import { deepMerge } from 'directix/core'
const merged = deepMerge(obj1, obj2)
```

**After:**
```typescript
const merged = structuredClone({ ...obj1, ...obj2 })
// or
const merged = Object.assign({}, obj1, obj2)
```

### 6. Type Exports Reorganized

**Before (v1.x):**
```typescript
import { DirectiveBinding, DirectiveConfig } from 'directix/core'
```

**After (v2.0.0):**
```typescript
import type { 
  DirectiveBinding, 
  DirectiveConfig,
  DirectiveSetup 
} from 'directix/core'
```

## New Features in v2.0.0

### Enterprise Permission Management
```typescript
import { 
  configureEnterprisePermission,
  hasPermission 
} from 'directix/core'

configureEnterprisePermission({
  sources: [{ type: 'api', api: { url: '/api/permissions' } }],
  roles: {
    admin: { permissions: ['read', 'write', 'delete'] }
  }
})

if (await hasPermission('admin')) {
  // Show admin features
}
```

### Audit Logging
```typescript
import { 
  configureAuditLog,
  logDirectiveOperation 
} from 'directix/core'

configureAuditLog({
  enabled: true,
  persistToStorage: true
})

// Automatic logging in directives
logDirectiveOperation('mount', 'v-permission')
```

### Breaking Changes Warning System
```typescript
import { 
  generateBreakingChangesReport,
  detectBreakingChangesInCode 
} from 'directix/core'

// Check code for potential issues
const detections = detectBreakingChangesInCode(yourCode)
```

## Migration Tools

### CLI Migration Command
```bash
# Dry run to see changes
npx directix migrate --from directix-v1 --dry-run

# Apply changes
npx directix migrate --from directix-v1

# Auto-fix where possible
npx directix migrate --from directix-v1 --auto-fix
```

### Programmatic Migration
```typescript
import { 
  migrate,
  detectLegacyUsage,
  generateMigrationReport 
} from 'directix/core'

const report = detectLegacyUsage(code, 'directix-v1')
const result = migrate(code, { source: 'directix-v1' })
```

## Compatibility Layer

For gradual migration, v2.0.0 provides a compatibility layer:

```typescript
import { createCompatLayer } from 'directix/compat'

const app = createApp()
app.use(createCompatLayer({
  // Enable specific compat features
  legacyNaming: true,
  legacyOptions: true
}))
```

## Performance Improvements

v2.0.0 includes significant performance improvements:

- **Bundle Size**: 30% smaller core bundle
- **Tree-shaking**: Better dead code elimination
- **Runtime**: Optimized directive lifecycle
- **Memory**: Reduced observer overhead

## Timeline

| Phase | Date | Action |
|-------|------|--------|
| v1.11.0 | 2026-05-13 | Migration tools released |
| v1.12.0 | TBD | Final v1.x release |
| v2.0.0-beta | TBD | Beta testing |
| v2.0.0 | TBD | Stable release |

## Getting Help

- **Documentation**: https://directix.dev/docs/migration
- **GitHub Issues**: https://github.com/saqqdy/directix/issues
- **Discord**: https://discord.gg/directix

## Checklist

- [ ] Upgrade to Vue 3.x
- [ ] Run migration detector
- [ ] Review breaking changes report
- [ ] Update directive names to kebab-case
- [ ] Update directive options
- [ ] Replace deprecated utilities
- [ ] Update type imports
- [ ] Run tests
- [ ] Test in staging environment
