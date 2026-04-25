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

---

## Security Utilities (v1.10.0+)

Directix v1.10.0 introduces comprehensive security utilities for advanced protection.

### HTML Sanitization

#### sanitizeHtml

Advanced HTML sanitizer with configurable options:

```typescript
import { sanitizeHtml } from 'directix'

const clean = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'p', 'a'],
  allowedAttributes: {
    '*': ['class'],
    'a': ['href', 'title'],
  },
  allowedProtocols: ['http', 'https', 'mailto'],
  detectDangerousPatterns: true,
})
```

#### XSSProtectionConfig

```typescript
interface XSSProtectionConfig {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]> | string[]
  allowedProtocols?: string[]
  allowDataUrls?: boolean
  allowInlineStyles?: boolean
  allowClass?: boolean
  allowId?: boolean
  detectDangerousPatterns?: boolean
  customFilters?: ((html: string) => string)[]
}
```

### URL Safety

#### isUrlSafe / sanitizeUrl

Validate and sanitize URLs:

```typescript
import { isUrlSafe, sanitizeUrl } from 'directix'

// Check if URL is safe
if (isUrlSafe(userUrl, ['http', 'https'])) {
  window.location.href = userUrl
}

// Sanitize URL (returns empty string if unsafe)
const safeUrl = sanitizeUrl(userUrl)
```

### HTML Entity Encoding

#### escapeHtml / unescapeHtml

Encode and decode HTML entities:

```typescript
import { escapeHtml, unescapeHtml } from 'directix'

const encoded = escapeHtml('<script>alert("xss")</script>')
// &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;

const decoded = unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;')
// <div>Hello</div>
```

### CSP (Content Security Policy)

#### getCSPNonce

Extract CSP nonce from the page:

```typescript
import { getCSPNonce, injectStylesCSP } from 'directix'

const nonce = getCSPNonce()

// Inject styles with CSP nonce
injectStylesCSP('.tooltip { position: absolute; }', { nonce })
```

#### injectStylesCSP

CSP-safe style injection:

```typescript
import { injectStylesCSP } from 'directix'

// Automatically uses nonce if available
const styleEl = injectStylesCSP(cssContent)
```

### Security Audit

#### SecurityAudit.scanHtml()

Scan HTML for potential XSS vulnerabilities:

```typescript
import { SecurityAudit } from 'directix'

const issues = SecurityAudit.scanHtml(userHtml)
// Returns array of SecurityVulnerability

for (const issue of issues) {
  console.log(`[${issue.severity}] ${issue.type}: ${issue.description}`)
  console.log(`Remediation: ${issue.remediation}`)
}
```

#### SecurityAudit.checkCSP()

Check Content Security Policy configuration:

```typescript
const { policies, warnings, recommendations } = SecurityAudit.checkCSP()

console.log('Current policies:', policies)
console.log('Warnings:', warnings)
console.log('Recommendations:', recommendations)
```

#### SecurityAudit.checkDependencies()

Check for known vulnerabilities in dependencies (Node.js only):

```typescript
const vulnerabilities = await SecurityAudit.checkDependencies()

for (const vuln of vulnerabilities) {
  console.log(`${vuln.name}@${vuln.version}: ${vuln.title}`)
  console.log(`Severity: ${vuln.severity}`)
  if (vuln.url) console.log(`More info: ${vuln.url}`)
}
```

#### SecurityAudit.generateReport()

Generate a comprehensive security report:

```typescript
const report = SecurityAudit.generateReport(userHtml)

// Format as text, JSON, or HTML
console.log(SecurityAudit.formatReport(report, 'text'))
console.log(SecurityAudit.formatReport(report, 'json'))
console.log(SecurityAudit.formatReport(report, 'html'))
```

### Safe Content Handler

Class for directive-level safe content handling:

```typescript
import { createSafeContentHandler } from 'directix'

const handler = createSafeContentHandler({
  allowedTags: ['b', 'i', 'p'],
  allowClass: true,
})

// Sanitize and set HTML
handler.setHtml(element, userContent)

// Get sanitized HTML
const safeHtml = handler.getSanitizedHtml(userContent)
```

## Best Practices

### 1. Always Sanitize User Input

```typescript
import { sanitizeHtml } from 'directix'

// Good - sanitize before rendering
element.innerHTML = sanitizeHtml(userInput)

// Dangerous - direct user input
element.innerHTML = userInput
```

### 2. Validate URLs

```typescript
import { isUrlSafe } from 'directix'

// Good - validate before use
if (isUrlSafe(redirectUrl)) {
  window.location.href = redirectUrl
}
```

### 3. Use CSP

Enable Content Security Policy to add an extra layer of protection:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-xxx';">
```

### 4. Regular Security Audits

Run security audits regularly:

```typescript
import { SecurityAudit } from 'directix'

// Scan HTML content
const issues = SecurityAudit.scanHtml(htmlContent)

// Check CSP
const cspStatus = SecurityAudit.checkCSP()

// Generate full report
const report = SecurityAudit.generateReport(htmlContent)
```

## Security Checklist

- [ ] All user input is sanitized before rendering
- [ ] URLs are validated before use in redirects
- [ ] CSP headers are configured
- [ ] Dependencies are regularly audited for vulnerabilities
- [ ] Sensitive data is not exposed in client-side code
- [ ] HTTPS is enforced for all external resources
