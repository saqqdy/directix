# Form Directives

Form directives help you enhance form interactions.

## v-copy

Copy text to clipboard with a simple directive.

### Basic Usage

```vue
<template>
  <!-- Simple usage -->
  <button v-copy="textToCopy">Copy to clipboard</button>

  <!-- With callbacks -->
  <button v-copy="{ value: text, onSuccess: handleSuccess, onError: handleError }">
    Copy with callback
  </button>
</template>

<script setup>
const textToCopy = 'Hello, World!'

function handleSuccess(text) {
  console.log('Copied:', text)
}

function handleError(error) {
  console.error('Copy failed:', error)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `value` | `string` | - | Text to copy (required) |
| `onSuccess` | `(text: string) => void` | - | Callback on successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy failure |
| `title` | `string` | - | Tooltip text for the button |
| `disabled` | `boolean` | `false` | Disable copy functionality |

## v-focus

Auto focus an element when mounted.

### Basic Usage

```vue
<template>
  <!-- Simple usage -->
  <input v-focus />

  <!-- With options -->
  <input v-focus="{ focus: true, refocus: true }" />
</template>
```

### With Options

```vue
<template>
  <!-- Focus when component mounts -->
  <input v-focus="{ focus: true }" />

  <!-- Refocus when element is shown -->
  <input v-if="show" v-focus="{ focus: true, refocus: true }" />

  <!-- With callbacks -->
  <input v-focus="{ onFocus: handleFocus, onBlur: handleBlur }" />
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function handleFocus(el) {
  console.log('Focused:', el)
}

function handleBlur(el) {
  console.log('Blurred:', el)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `focus` | `boolean` | `true` | Focus element on mount |
| `refocus` | `boolean` | `false` | Refocus when binding value changes |
| `onFocus` | `(el: HTMLElement) => void` | - | Callback when focused |
| `onBlur` | `(el: HTMLElement) => void` | - | Callback when blurred |

## v-mask

Input mask formatting for structured input.

### Basic Usage

```vue
<template>
  <!-- Phone number -->
  <input v-mask="'(###) ###-####'" placeholder="Phone" />

  <!-- SSN -->
  <input v-mask="'###-##-####'" placeholder="SSN" />

  <!-- Date -->
  <input v-mask="'##/##/####'" placeholder="Date" />

  <!-- With options -->
  <input v-mask="{ mask: '##/##/####', placeholder: '_' }" placeholder="Date" />
</template>
```

### Mask Tokens

| Token | Pattern | Description |
| ----- | ------- | ----------- |
| `#` | `[0-9]` | Digit (0-9) |
| `A` | `[A-Za-z]` | Letter (a-z, A-Z) |
| `N` | `[A-Za-z0-9]` | Alphanumeric (a-z, A-Z, 0-9) |
| `X` | `.` | Any character |

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mask` | `string` | - | Mask pattern (required) |
| `placeholder` | `string` | `'_'` | Placeholder character |
| `showPlaceholder` | `boolean` | `true` | Show placeholder on focus |
| `showMaskOnBlur` | `boolean` | `false` | Show mask on blur |
| `clearIncomplete` | `boolean` | `false` | Clear incomplete value on blur |
| `disabled` | `boolean` | `false` | Disable the mask |
| `onChange` | `(value: string, rawValue: string) => void` | - | Callback on value change |
| `onComplete` | `(value: string) => void` | - | Callback when mask is complete |

### Examples

```vue
<template>
  <div>
    <label>Phone:</label>
    <input v-mask="'(###) ###-####'" type="tel" />
  </div>

  <div>
    <label>Credit Card:</label>
    <input v-mask="'#### #### #### ####'" type="text" />
  </div>

  <div>
    <label>Date:</label>
    <input v-mask="'##/##/####'" type="text" />
  </div>

  <div>
    <label>Time:</label>
    <input v-mask="'##:##'" type="text" />
  </div>
</template>
```

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
    Read & Write Required
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
| `check` | `(permission: string \| string[], mode: string) => boolean` | - | Custom check function |
| `onChange` | `(hasPermission: boolean) => void` | - | Callback on permission change |

## v-sanitize

Sanitize HTML content to prevent XSS attacks.

### Basic Usage

```vue
<template>
  <!-- Basic sanitization -->
  <div v-sanitize v-html="userContent"></div>

  <!-- With allowed tags -->
  <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>

  <!-- Custom handler -->
  <div v-sanitize="{ handler: customSanitizer }" v-html="userContent"></div>
</template>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `allowedTags` | `string[]` | `['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span', 'div']` | Allowed HTML tags |
| `allowedAttributes` | `string[]` | `['title', 'alt', 'href', 'src']` | Allowed HTML attributes |
| `allowDataUrls` | `boolean` | `false` | Allow data: URLs |
| `allowStyles` | `boolean` | `false` | Allow style attribute |
| `allowClass` | `boolean` | `false` | Allow class attribute |
| `allowId` | `boolean` | `false` | Allow id attribute |
| `handler` | `(value: string) => string` | - | Custom sanitize function |
| `disabled` | `boolean` | `false` | Disable sanitization |
| `sanitizeOnUpdate` | `boolean` | `true` | Sanitize on update |
