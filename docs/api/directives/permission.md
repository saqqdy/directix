# v-permission

Permission-based element control for access management.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <!-- Single permission -->
  <button v-permission="'admin'">Admin Only</button>

  <!-- Multiple permissions (OR logic by default) -->
  <button v-permission="['admin', 'editor']">Admin or Editor</button>
</template>
```

### With Options

```vue
<template>
  <!-- AND logic -->
  <button v-permission="{ value: ['read', 'write'], mode: 'every' }">
    Requires Read & Write
  </button>

  <!-- Different actions -->
  <button v-permission="{ value: 'admin', action: 'disable' }">
    Disabled for non-admin
  </button>

  <button v-permission="{ value: 'admin', action: 'hide' }">
    Hidden for non-admin
  </button>
</template>
```

## Configuration

Configure the permission directive in your app:

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => store.getters.permissions,
  getRoles: () => store.getters.roles,
  roleMap: {
    admin: ['*'],           // Wildcard: all permissions
    editor: ['read', 'write'],
    viewer: ['read']
  }
})
```

## API

### Types

```typescript
type PermissionAction = 'remove' | 'disable' | 'hide'
type PermissionMode = 'some' | 'every'

interface PermissionOptions {
  /** Permission value(s) to check */
  value: string | string[]
  /** Logic for multiple permissions: 'some' (OR) or 'every' (AND) */
  mode?: PermissionMode
  /** Action when permission denied */
  action?: PermissionAction
  /** Custom permission check function */
  check?: (permission: string | string[], mode: PermissionMode) => boolean
  /** Callback when permission state changes */
  onChange?: (hasPermission: boolean) => void
}

interface PermissionConfig {
  /** Get current user's permissions */
  getPermissions: () => string[]
  /** Get current user's roles */
  getRoles?: () => string[]
  /** Role to permission mapping */
  roleMap?: Record<string, string[]>
}

type PermissionBinding = string | string[] | PermissionOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `string \| string[]` | - | Permission(s) to check (required) |
| `mode` | `'some' \| 'every'` | `'some'` | Logic for multiple permissions |
| `action` | `'remove' \| 'disable' \| 'hide'` | `'remove'` | Action when denied |
| `check` | `Function` | - | Custom check function |
| `onChange` | `Function` | - | Callback on permission change |

## Examples

### Role-Based Access

```vue
<template>
  <nav>
    <a href="/">Home</a>
    <a v-permission="'admin'" href="/admin">Admin Panel</a>
    <a v-permission="['admin', 'editor']" href="/content">Content</a>
  </nav>
</template>

<script setup>
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => ['read', 'write'],
  getRoles: () => ['editor'],
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write']
  }
})
</script>
```

### Button Actions

```vue
<template>
  <div>
    <!-- Remove from DOM if no permission -->
    <button v-permission="'delete'">Delete</button>

    <!-- Disable button if no permission -->
    <button v-permission="{ value: 'edit', action: 'disable' }">
      Edit
    </button>

    <!-- Hide but keep in DOM -->
    <button v-permission="{ value: 'create', action: 'hide' }">
      Create New
    </button>
  </div>
</template>
```

### Custom Check Function

```vue
<template>
  <button v-permission="{
    value: 'premium',
    check: customCheck
  }">
    Premium Feature
  </button>
</template>

<script setup>
function customCheck(permission, mode) {
  // Custom logic, e.g., check subscription
  return userStore.hasPremiumAccess
}
</script>
```

### Reactive Permission

```vue
<template>
  <button v-permission="{
    value: requiredPermission,
    onChange: handlePermissionChange
  }">
    Action
  </button>
</template>

<script setup>
import { ref } from 'vue'

const requiredPermission = ref('read')

function handlePermissionChange(hasPermission) {
  console.log('Permission state:', hasPermission)
}
</script>
```
