# 安全指令

安全指令帮助您管理权限和清理内容。

## v-permission

基于权限的元素控制，用于访问管理。

### 基本用法

```vue
<template>
  <!-- 单个权限 -->
  <button v-permission="'admin'">仅管理员</button>

  <!-- 多个权限（默认 OR 逻辑） -->
  <button v-permission="['admin', 'editor']">管理员或编辑者</button>

  <!-- AND 逻辑 -->
  <button v-permission="{ value: ['read', 'write'], mode: 'every' }">
    需要读写权限
  </button>

  <!-- 不同操作 -->
  <button v-permission="{ value: 'admin', action: 'disable' }">
    非管理员禁用
  </button>
</template>
```

### 配置

在应用中配置权限指令：

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

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `value` | `string \| string[]` | - | 要检查的权限（必填） |
| `mode` | `'some' \| 'every'` | `'some'` | 多个权限的逻辑 |
| `action` | `'remove' \| 'disable' \| 'hide'` | `'remove'` | 拒绝时的操作 |
| `check` | `Function` | - | 自定义检查函数 |

## v-sanitize

清理 HTML 内容以防止 XSS 攻击。

### 基本用法

```vue
<template>
  <!-- 基本清理 -->
  <div v-sanitize v-html="userContent"></div>

  <!-- 指定允许的标签 -->
  <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>
</template>
```

### 默认行为

默认情况下，v-sanitize：
- 允许安全标签：`b`, `i`, `u`, `strong`, `em`, `br`, `p`, `span`, `div`
- 允许安全属性：`title`, `alt`, `href`, `src`
- 移除危险标签：`script`, `iframe`, `object`, `embed`, `form` 等
- 移除危险属性：`onclick`, `onerror`, `onload` 等
- 移除 `javascript:` URL

### API

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `allowedTags` | `string[]` | 安全子集 | 允许的 HTML 标签 |
| `allowedAttributes` | `string[]` | 安全子集 | 允许的 HTML 属性 |
| `allowDataUrls` | `boolean` | `false` | 允许 data: URL |
| `allowStyles` | `boolean` | `false` | 允许 style 属性 |
| `allowClass` | `boolean` | `false` | 允许 class 属性 |
| `allowId` | `boolean` | `false` | 允许 id 属性 |
| `handler` | `Function` | - | 自定义清理函数 |

---

## 安全工具 (v1.10.0+)

Directix v1.10.0 引入全面的安全工具，提供高级保护。

### HTML 清理

#### sanitizeHtml

可配置的高级 HTML 清理器：

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

### URL 安全

#### isUrlSafe / sanitizeUrl

验证和清理 URL：

```typescript
import { isUrlSafe, sanitizeUrl } from 'directix'

// 检查 URL 是否安全
if (isUrlSafe(userUrl, ['http', 'https'])) {
  window.location.href = userUrl
}

// 清理 URL（不安全时返回空字符串）
const safeUrl = sanitizeUrl(userUrl)
```

### HTML 实体编码

#### escapeHtml / unescapeHtml

编码和解码 HTML 实体：

```typescript
import { escapeHtml, unescapeHtml } from 'directix'

const encoded = escapeHtml('<script>alert("xss")</script>')
// &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;

const decoded = unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;')
// <div>Hello</div>
```

### CSP（内容安全策略）

#### getCSPNonce

从页面提取 CSP nonce：

```typescript
import { getCSPNonce, injectStylesCSP } from 'directix'

const nonce = getCSPNonce()

// 使用 CSP nonce 注入样式
injectStylesCSP('.tooltip { position: absolute; }', { nonce })
```

#### injectStylesCSP

CSP 安全的样式注入：

```typescript
import { injectStylesCSP } from 'directix'

// 如果可用则自动使用 nonce
const styleEl = injectStylesCSP(cssContent)
```

### 安全审计

#### SecurityAudit.scanHtml()

扫描 HTML 中潜在的 XSS 漏洞：

```typescript
import { SecurityAudit } from 'directix'

const issues = SecurityAudit.scanHtml(userHtml)
// 返回 SecurityVulnerability 数组

for (const issue of issues) {
  console.log(`[${issue.severity}] ${issue.type}: ${issue.description}`)
  console.log(`修复建议: ${issue.remediation}`)
}
```

#### SecurityAudit.checkCSP()

检查内容安全策略配置：

```typescript
const { policies, warnings, recommendations } = SecurityAudit.checkCSP()

console.log('当前策略:', policies)
console.log('警告:', warnings)
console.log('建议:', recommendations)
```

#### SecurityAudit.checkDependencies()

检查依赖中的已知漏洞（仅 Node.js 环境）：

```typescript
const vulnerabilities = await SecurityAudit.checkDependencies()

for (const vuln of vulnerabilities) {
  console.log(`${vuln.name}@${vuln.version}: ${vuln.title}`)
  console.log(`严重程度: ${vuln.severity}`)
  if (vuln.url) console.log(`更多信息: ${vuln.url}`)
}
```

#### SecurityAudit.generateReport()

生成全面的安全报告：

```typescript
const report = SecurityAudit.generateReport(userHtml)

// 格式化为文本、JSON 或 HTML
console.log(SecurityAudit.formatReport(report, 'text'))
console.log(SecurityAudit.formatReport(report, 'json'))
console.log(SecurityAudit.formatReport(report, 'html'))
```

### 安全内容处理器

用于指令级别安全内容处理的类：

```typescript
import { createSafeContentHandler } from 'directix'

const handler = createSafeContentHandler({
  allowedTags: ['b', 'i', 'p'],
  allowClass: true,
})

// 清理并设置 HTML
handler.setHtml(element, userContent)

// 获取清理后的 HTML
const safeHtml = handler.getSanitizedHtml(userContent)
```

## 最佳实践

### 1. 始终清理用户输入

```typescript
import { sanitizeHtml } from 'directix'

// 好的做法 - 渲染前清理
element.innerHTML = sanitizeHtml(userInput)

// 危险 - 直接使用用户输入
element.innerHTML = userInput
```

### 2. 验证 URL

```typescript
import { isUrlSafe } from 'directix'

// 好的做法 - 使用前验证
if (isUrlSafe(redirectUrl)) {
  window.location.href = redirectUrl
}
```

### 3. 使用 CSP

启用内容安全策略添加额外保护层：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-xxx';">
```

### 4. 定期安全审计

定期运行安全审计：

```typescript
import { SecurityAudit } from 'directix'

// 扫描 HTML 内容
const issues = SecurityAudit.scanHtml(htmlContent)

// 检查 CSP
const cspStatus = SecurityAudit.checkCSP()

// 生成完整报告
const report = SecurityAudit.generateReport(htmlContent)
```

## 安全检查清单

- [ ] 所有用户输入在渲染前都已清理
- [ ] URL 在用于重定向前都已验证
- [ ] CSP 头已配置
- [ ] 依赖定期审计漏洞
- [ ] 敏感数据不在客户端代码中暴露
- [ ] 所有外部资源强制使用 HTTPS