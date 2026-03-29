# Security Directives

Security directives help you manage permissions and sanitize content.

## v-permission

Permission-based element control for access management.

### Basic Usage

```vue
<template>
  <!-- Single permission -->
  <button v-permission="'admin'">Admin Only</button>

  <!-- Multiple permissions (OR logic by default) -->
  <button v-permission="['admin', 'editor']">Admin or Editor</button>

  <!-- AND logic with mode option -->
  <button v-permission="{ value: ['read', 'write'], mode: 'every' }">
    Requires Read & Write
  </button>

  <!-- Different actions -->
  <button v-permission="{ value: 'admin', action: 'disable' }">
    Disabled for non-admin
  </button>
</template>
```

### Configuration

Configure the permission directive in your app:

```typescript
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => store.getters.permissions,
  getRoles: () => store.getters.roles,
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write'],
    viewer: ['read']
  }
})
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `string \| string[]` | - | Permission(s) to check (required) |
| `mode` | `'some' \| 'every'` | `'some'` | Logic for multiple permissions |
| `action` | `'remove' \| 'disable' \| 'hide'` | `'remove'` | Action when denied |
| `check` | `Function` | - | Custom check function |

## v-sanitize

Sanitize HTML content to prevent XSS attacks.

### Basic Usage

```vue
<template>
  <!-- Basic sanitization -->
  <div v-sanitize v-html="userContent"></div>

  <!-- With allowed tags -->
  <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>
</template>
```

### Default Behavior

By default, v-sanitize:
- Allows safe tags: `b`, `i`, `u`, `strong`, `em`, `br`, `p`, `span`, `div`
- Allows safe attributes: `title`, `alt`, `href`, `src`
- Removes dangerous tags: `script`, `iframe`, `object`, `embed`, `form`, etc.
- Removes dangerous attributes: `onclick`, `onerror`, `onload`, etc.
- Removes `javascript:` URLs

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `allowedTags` | `string[]` | Safe subset | Allowed HTML tags |
| `allowedAttributes` | `string[]` | Safe subset | Allowed HTML attributes |
| `allowDataUrls` | `boolean` | `false` | Allow data: URLs |
| `allowStyles` | `boolean` | `false` | Allow style attribute |
| `allowClass` | `boolean` | `false` | Allow class attribute |
| `allowId` | `boolean` | `false` | Allow id attribute |
| `handler` | `Function` | - | Custom sanitize function |
