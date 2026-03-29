# v-sanitize

Sanitize HTML content to prevent XSS attacks.

> **Since:** `1.0.0`

## Usage

### Basic

```vue
<template>
  <div v-sanitize v-html="userContent"></div>
</template>

<script setup>
const userContent = '<p>Safe content</p><script>alert("xss")<\/script>'
</script>
```

### With Allowed Tags

```vue
<template>
  <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>
</template>
```

### Custom Handler

```vue
<template>
  <div v-sanitize="{ handler: customSanitizer }" v-html="userContent"></div>
</template>

<script setup>
function customSanitizer(html) {
  // Custom sanitization logic
  return html.replace(/<script.*?>.*?<\/script>/gi, '')
}
</script>
```

## API

### Types

```typescript
type SanitizeHandler = (value: string) => string

interface SanitizeOptions {
  /** Tags to allow (whitelist) */
  allowedTags?: string[]
  /** Attributes to allow (whitelist) */
  allowedAttributes?: string[]
  /** Allow data URLs */
  allowDataUrls?: boolean
  /** Allow inline styles */
  allowStyles?: boolean
  /** Allow class attribute */
  allowClass?: boolean
  /** Allow id attribute */
  allowId?: boolean
  /** Custom sanitize function */
  handler?: SanitizeHandler
  /** Disable sanitization */
  disabled?: boolean
  /** Sanitize on update */
  sanitizeOnUpdate?: boolean
}

type SanitizeBinding = boolean | SanitizeOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `allowedTags` | `string[]` | `['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span', 'div']` | Allowed HTML tags |
| `allowedAttributes` | `string[]` | `['title', 'alt', 'href', 'src']` | Allowed HTML attributes |
| `allowDataUrls` | `boolean` | `false` | Allow data: URLs |
| `allowStyles` | `boolean` | `false` | Allow style attribute |
| `allowClass` | `boolean` | `false` | Allow class attribute |
| `allowId` | `boolean` | `false` | Allow id attribute |
| `handler` | `Function` | - | Custom sanitize function |
| `disabled` | `boolean` | `false` | Disable sanitization |
| `sanitizeOnUpdate` | `boolean` | `true` | Sanitize on update |

## Examples

### Rich Text Editor

```vue
<template>
  <div
    v-sanitize="{
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: ['href'],
      allowClass: true
    }"
    v-html="editorContent"
    class="rich-text"
  ></div>
</template>
```

### User Comments

```vue
<template>
  <div v-for="comment in comments" :key="comment.id">
    <div v-sanitize v-html="comment.body"></div>
  </div>
</template>
```

### Blog Post

```vue
<template>
  <article v-sanitize="{
    allowedTags: ['h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code'],
    allowedAttributes: ['href', 'src', 'alt', 'title'],
    allowDataUrls: false,
    allowClass: true
  }" v-html="post.content">
  </article>
</template>
```

### Disable for Trusted Content

```vue
<template>
  <div v-sanitize="{ disabled: isTrusted }" v-html="content"></div>
</template>

<script setup>
const isTrusted = true // Only set true for trusted admin content
</script>
```
