# Permission Control Example

Control element visibility and interactivity based on user permissions.

## Basic Permission Check

```vue
<template>
  <div class="permission-demo">
    <button v-permission="'admin'" class="btn btn-danger">Delete User</button>
    <button v-permission="'editor'" class="btn btn-primary">Edit Article</button>
    <button v-permission="'viewer'" class="btn btn-outline">View Report</button>
  </div>
</template>

<script setup>
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => ['viewer', 'editor'],
})
</script>

<style scoped>
.permission-demo { display: flex; gap: 12px; }
.btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; }
.btn-danger { background: #e74c3c; color: white; }
.btn-primary { background: #42b883; color: white; }
.btn-outline { background: transparent; border: 1px solid #ddd; }
</style>
```

## Permission Actions (Remove vs Disable vs Hide)

```vue
<template>
  <!-- Remove: element is removed from DOM (default) -->
  <button v-permission="{ value: 'admin', action: 'remove' }">Admin Only (Removed)</button>

  <!-- Disable: element stays in DOM but is disabled -->
  <button v-permission="{ value: 'admin', action: 'disable' }">Admin Only (Disabled)</button>

  <!-- Hide: element stays in DOM but is hidden -->
  <button v-permission="{ value: 'admin', action: 'hide' }">Admin Only (Hidden)</button>
</template>
```

## Multiple Permissions (OR/AND Logic)

```vue
<template>
  <!-- OR: user needs at least one of the permissions -->
  <div v-permission="{ value: ['editor', 'admin'], mode: 'some' }">
    Editor or Admin content
  </div>

  <!-- AND: user needs all the permissions -->
  <div v-permission="{ value: ['read', 'write'], mode: 'every' }">
    Read + Write content
  </div>
</template>
```

## Role-Based Access

```vue
<template>
  <button v-permission="'delete:user'">Delete User</button>
</template>

<script setup>
import { configurePermission } from 'directix'

configurePermission({
  getPermissions: () => ['read', 'write'],
  getRoles: () => ['editor'],
  roleMap: {
    admin: ['*'],
    editor: ['read', 'write', 'publish'],
    viewer: ['read'],
  },
})
</script>
```

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3)
