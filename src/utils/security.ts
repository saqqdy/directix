import { isBrowser } from '@directix/core'

/**
 * Security Utilities for Directix
 *
 * Provides comprehensive security features including:
 * - XSS protection and sanitization
 * - CSP (Content Security Policy) compatibility
 * - Security audit tools
 * - Safe HTML handling
 */

/**
 * XSS Protection Configuration
 */
export interface XSSProtectionConfig {
	/** Allowed HTML tags */
	allowedTags?: string[]
	/** Allowed attributes per tag or globally */
	allowedAttributes?: Record<string, string[]> | string[]
	/** Allowed URL protocols */
	allowedProtocols?: string[]
	/** Allow data URLs */
	allowDataUrls?: boolean
	/** Allow inline styles */
	allowInlineStyles?: boolean
	/** Allow class attribute */
	allowClass?: boolean
	/** Allow id attribute */
	allowId?: boolean
	/** Detect and remove dangerous patterns */
	detectDangerousPatterns?: boolean
	/** Custom filter functions */
	customFilters?: ((html: string) => string)[]
}

/**
 * Default safe configuration
 */
const DEFAULT_ALLOWED_TAGS = [
	'b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span', 'div',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
	'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
]

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
	'*': ['title', 'alt', 'class', 'id'],
	a: ['href', 'target', 'rel', 'title'],
	img: ['src', 'alt', 'title', 'width', 'height'],
}

const DEFAULT_ALLOWED_PROTOCOLS = ['http', 'https', 'mailto', 'tel']

/**
 * Dangerous tags that should always be removed
 */
const DANGEROUS_TAGS = [
	'script', 'iframe', 'object', 'embed', 'applet',
	'form', 'input', 'button', 'select', 'textarea',
	'style', 'link', 'meta', 'base', 'frame', 'frameset',
	'svg', 'math', 'template',
]

/**
 * Dangerous attributes that should always be removed
 */
const DANGEROUS_ATTRIBUTES = [
	'onclick', 'onerror', 'onload', 'onmouseover', 'onmouseout',
	'onmousedown', 'onmouseup', 'onmousemove', 'onfocus', 'onblur',
	'onchange', 'onsubmit', 'onreset', 'onkeydown', 'onkeyup',
	'onkeypress', 'oninput', 'onscroll', 'onresize', 'onunload',
	'onbeforeunload', 'onabort', 'oncanplay', 'oncanplaythrough',
	'ondurationchange', 'onemptied', 'onended', 'onloadeddata',
	'onloadedmetadata', 'onloadstart', 'onpause', 'onplay',
	'onplaying', 'onprogress', 'onratechange', 'onseeked',
	'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate',
	'onvolumechange', 'onwaiting', 'onafterprint', 'onbeforeprint',
	'oncontextmenu', 'oncopy', 'oncut', 'onpaste', 'ondblclick',
	'ondrag', 'ondragend', 'ondragenter', 'ondragleave',
	'ondragover', 'ondragstart', 'ondrop',
	// Form-related
	'formaction', 'action', 'method', 'enctype',
]

/**
 * Dangerous URL patterns
 */
const DANGEROUS_URL_PATTERNS = [
	/^javascript:/i,
	/^data:/i,
	/^vbscript:/i,
	/^file:/i,
]

/**
 * Check if URL is safe
 */
export function isUrlSafe(url: string, allowedProtocols: string[] = DEFAULT_ALLOWED_PROTOCOLS): boolean {
	if (!url) return true

	const trimmed = url.trim()

	// Check for dangerous patterns
	for (const pattern of DANGEROUS_URL_PATTERNS) {
		if (pattern.test(trimmed)) {
			return false
		}
	}

	// Check protocol
	const protocolMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/)
	if (protocolMatch) {
		return allowedProtocols.includes(protocolMatch[1].toLowerCase())
	}

	// Relative URLs are safe
	return true
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string, allowedProtocols: string[] = DEFAULT_ALLOWED_PROTOCOLS): string {
	if (!url) return ''

	const trimmed = url.trim()

	if (!isUrlSafe(trimmed, allowedProtocols)) {
		return ''
	}

	return trimmed
}

/**
 * Escape HTML entities
 */
export function escapeHtml(str: string): string {
	const escapeMap: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;',
	}

	return str.replace(/[&<>"'`=/]/g, char => escapeMap[char] || char)
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(str: string): string {
	const unescapeMap: Record<string, string> = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#x27;': '\'',
		'&#x2F;': '/',
		'&#x60;': '`',
		'&#x3D;': '=',
		'&#39;': '\'',
	}

	return str
		.replace(/&[^;]+;/g, entity => unescapeMap[entity] || entity)
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
}

/**
 * Strip all HTML tags
 */
export function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '')
}

/**
 * Advanced HTML sanitizer
 */
export function sanitizeHtml(html: string, config: XSSProtectionConfig = {}): string {
	if (!html) return ''
	if (!isBrowser()) return html

	const {
		allowedTags = DEFAULT_ALLOWED_TAGS,
		allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
		allowedProtocols = DEFAULT_ALLOWED_PROTOCOLS,
		allowDataUrls = false,
		allowInlineStyles = false,
		allowClass = true,
		allowId = false,
		detectDangerousPatterns = true,
		customFilters = [],
	} = config

	// Apply custom filters first
	let result = html
	for (const filter of customFilters) {
		result = filter(result)
	}

	// Detect dangerous patterns
	if (detectDangerousPatterns) {
		const dangerousPatterns = [
			/<script[\s\S]*?>[\s\S]*?<\/script>/gi,
			/javascript:/gi,
			/on\w+\s*=/gi,
			/data:\s*text\/html/gi,
			/vbscript:/gi,
			/expression\s*\(/gi,
			/url\s*\(\s*["']?javascript:/gi,
		]

		for (const pattern of dangerousPatterns) {
			if (pattern.test(result)) {
				// Remove the dangerous content
				result = result.replace(pattern, '')
			}
		}
	}

	// Create a temporary element for parsing
	const temp = document.createElement('div')
	temp.innerHTML = result

	// Remove dangerous tags
	for (const tag of DANGEROUS_TAGS) {
		const elements = temp.getElementsByTagName(tag)
		while (elements.length > 0) {
			elements[0].parentNode?.removeChild(elements[0])
		}
	}

	// Process all elements
	function processElement(el: Element): void {
		const tagName = el.tagName.toLowerCase()

		// Remove element if tag not allowed
		if (!allowedTags.includes(tagName)) {
			const text = document.createTextNode(el.textContent || '')
			el.parentNode?.replaceChild(text, el)
			return
		}

		// Remove dangerous attributes
		for (const attr of DANGEROUS_ATTRIBUTES) {
			el.removeAttribute(attr)
		}

		// Filter allowed attributes
		const attrs = Array.from(el.attributes)
		for (const attr of attrs) {
			const attrName = attr.name.toLowerCase()

			// Skip event handlers
			if (attrName.startsWith('on')) {
				el.removeAttribute(attr.name)
				continue
			}

			// Check if attribute is allowed
			let isAllowed = false

			if (Array.isArray(allowedAttributes)) {
				isAllowed = allowedAttributes.includes(attrName)
			} else {
				const globalAttrs = allowedAttributes['*'] || []
				const tagAttrs = allowedAttributes[tagName] || []
				isAllowed = globalAttrs.includes(attrName) || tagAttrs.includes(attrName)
			}

			// Special attributes
			if (attrName === 'class' && !allowClass) {
				el.removeAttribute(attr.name)
				continue
			}
			if (attrName === 'id' && !allowId) {
				el.removeAttribute(attr.name)
				continue
			}
			if (attrName === 'style' && !allowInlineStyles) {
				el.removeAttribute(attr.name)
				continue
			}

			// Validate URLs
			if (attrName === 'href' || attrName === 'src') {
				const url = attr.value
				if (!isUrlSafe(url, allowDataUrls ? [...allowedProtocols, 'data'] : allowedProtocols)) {
					el.removeAttribute(attr.name)
					continue
				}
			}

			// Remove if not allowed
			if (!isAllowed && attrName !== 'class' && attrName !== 'id' && attrName !== 'style') {
				el.removeAttribute(attr.name)
			}
		}

		// Process children
		for (const child of Array.from(el.children)) {
			processElement(child)
		}
	}

	// Process all child elements
	for (const child of Array.from(temp.children)) {
		processElement(child)
	}

	return temp.innerHTML
}

/**
 * CSP Configuration
 */
export interface CSPConfig {
	/** Disable inline scripts */
	noInlineScripts?: boolean
	/** Disable inline styles */
	noInlineStyles?: boolean
	/** Disable eval */
	noEval?: boolean
	/** Nonce for inline scripts/styles */
	nonce?: string
}

/**
 * Get CSP nonce from meta tag
 */
export function getCSPNonce(): string | null {
	if (!isBrowser()) return null

	const meta = document.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Security-Policy"]')
	if (meta) {
		const content = meta.content
		const match = content.match(/nonce-([a-zA-Z0-9+/=]+)/)
		if (match) {
			return match[1]
		}
	}

	// Try to get from script tags
	const scripts = document.querySelectorAll<HTMLScriptElement>('script[nonce]')
	if (scripts.length > 0) {
		return scripts[0].nonce || null
	}

	return null
}

/**
 * CSP-safe style injection
 */
export function injectStylesCSP(css: string, options: CSPConfig = {}): HTMLStyleElement | HTMLLinkElement | null {
	if (!isBrowser()) return null

	const { nonce } = options

	// If we have a nonce, use inline style
	if (nonce || getCSPNonce()) {
		const style = document.createElement('style')
		style.setAttribute('nonce', nonce || getCSPNonce() || '')
		style.textContent = css
		document.head.appendChild(style)
		return style
	}

	// Otherwise, we should use external stylesheet
	// This is a placeholder - in production, you'd create a blob URL or external file
	const style = document.createElement('style')
	style.textContent = css
	document.head.appendChild(style)
	return style
}

/**
 * CSP-safe script injection
 */
export function injectScriptCSP(src: string, options: CSPConfig = {}): HTMLScriptElement | null {
	if (!isBrowser()) return null

	const { nonce } = options
	const script = document.createElement('script')
	script.src = src

	if (nonce || getCSPNonce()) {
		script.setAttribute('nonce', nonce || getCSPNonce() || '')
	}

	document.head.appendChild(script)
	return script
}

/**
 * Security vulnerability
 */
export interface SecurityVulnerability {
	/** Severity level */
	severity: 'critical' | 'high' | 'medium' | 'low'
	/** Issue type */
	type: string
	/** Description */
	description: string
	/** Location */
	location?: string
	/** Remediation suggestion */
	remediation?: string
}

/**
 * Security scan result
 */
export interface SecurityReport {
	/** Found vulnerabilities */
	vulnerabilities: SecurityVulnerability[]
	/** Warnings */
	warnings: SecurityVulnerability[]
	/** Recommendations */
	recommendations: string[]
	/** Scan timestamp */
	timestamp: Date
}

/**
 * Dependency vulnerability info
 */
export interface DependencyVulnerability {
	/** Package name */
	name: string
	/** Installed version */
	version: string
	/** Vulnerability ID (e.g., CVE, GHSA) */
	id?: string
	/** Severity level */
	severity: 'critical' | 'high' | 'medium' | 'low'
	/** Vulnerability title */
	title: string
	/** URL for more info */
	url?: string
	/** Patched versions */
	patchedVersions?: string
}

/**
 * Security audit utilities
 */
export const SecurityAudit = {
	/**
	 * Scan for potential security issues in HTML
	 */
	scanHtml(html: string): SecurityVulnerability[] {
		const issues: SecurityVulnerability[] = []

		// Check for script tags
		if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(html)) {
			issues.push({
				type: 'script-injection',
				severity: 'critical',
				description: 'HTML contains script tags which could lead to XSS attacks',
				remediation: 'Remove script tags or use a sanitization library',
			})
		}

		// Check for event handlers
		const eventHandlerMatch = html.match(/on\w+\s*=/gi)
		if (eventHandlerMatch) {
			issues.push({
				type: 'event-handler',
				severity: 'high',
				description: `Found ${eventHandlerMatch.length} event handler(s) which could be exploited`,
				remediation: 'Remove inline event handlers and use addEventListener instead',
			})
		}

		// Check for javascript: URLs
		if (/javascript:/gi.test(html)) {
			issues.push({
				type: 'javascript-url',
				severity: 'high',
				description: 'HTML contains javascript: URLs which could lead to XSS attacks',
				remediation: 'Remove javascript: URLs or validate/sanitize them',
			})
		}

		// Check for data: URLs
		if (/data:\s*text\/html/gi.test(html)) {
			issues.push({
				type: 'data-url',
				severity: 'high',
				description: 'HTML contains data:text/html URLs which could execute scripts',
				remediation: 'Remove or sanitize data: URLs',
			})
		}

		// Check for iframe with srcdoc
		if (/<iframe[\s\S]*?srcdoc=/gi.test(html)) {
			issues.push({
				type: 'iframe-srcdoc',
				severity: 'high',
				description: 'HTML contains iframe with srcdoc attribute',
				remediation: 'Avoid using srcdoc or sanitize its content',
			})
		}

		// Check for form actions
		if (/<form[\s\S]*?action\s*=/gi.test(html)) {
			issues.push({
				type: 'form-action',
				severity: 'medium',
				description: 'HTML contains form with action attribute',
				remediation: 'Validate form actions or use CSRF protection',
			})
		}

		return issues
	},

	/**
	 * Check CSP configuration
	 */
	checkCSP(): {
		policies: Record<string, string[]>
		warnings: string[]
		recommendations: string[]
	} {
		const result = {
			policies: {} as Record<string, string[]>,
			warnings: [] as string[],
			recommendations: [] as string[],
		}

		if (!isBrowser()) {
			result.warnings.push('CSP check requires browser environment')
			return result
		}

		// Check for CSP meta tag
		const meta = document.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Security-Policy"]')
		if (meta) {
			const content = meta.content
			const directives = content.split(';').map(d => d.trim())

			for (const directive of directives) {
				const [name, ...values] = directive.split(/\s+/)
				if (name) {
					result.policies[name.toLowerCase()] = values
				}
			}

			// Check for unsafe directives
			if (result.policies['script-src']?.includes('\'unsafe-inline\'')) {
				result.warnings.push('CSP allows unsafe-inline scripts - this reduces XSS protection')
			}
			if (result.policies['script-src']?.includes('\'unsafe-eval\'')) {
				result.warnings.push('CSP allows unsafe-eval - this reduces XSS protection')
			}

			// Check for missing directives
			const recommendedDirectives = ['default-src', 'script-src', 'style-src', 'img-src', 'connect-src']
			for (const directive of recommendedDirectives) {
				if (!result.policies[directive]) {
					result.recommendations.push(`Consider adding ${directive} directive to CSP`)
				}
			}
		} else {
			result.warnings.push('No CSP meta tag found - consider adding Content Security Policy')
			result.recommendations.push('Add a Content-Security-Policy meta tag or header')
		}

		return result
	},

	/**
	 * Check for known dependency vulnerabilities (Node.js environment only)
	 * Note: This is a client-side check that uses npm audit API when available.
	 * For production use, run `npm audit` or `pnpm audit` in CI/CD.
	 */
	async checkDependencies(): Promise<DependencyVulnerability[]> {
		const vulnerabilities: DependencyVulnerability[] = []

		// This method is primarily for Node.js environment
		if (typeof process === 'undefined' || !process.versions?.node) {
			console.warn('[Directix] checkDependencies() is only available in Node.js environment')
			return vulnerabilities
		}

		try {
			// Try to use npm audit API
			const { execSync } = await import('node:child_process')

			try {
				const result = execSync('npm audit --json', {
					encoding: 'utf-8',
					timeout: 30000,
				})

				const audit = JSON.parse(result)

				if (audit.vulnerabilities) {
					for (const [name, info] of Object.entries(audit.vulnerabilities as Record<string, any>)) {
						if (info.via && Array.isArray(info.via)) {
							for (const via of info.via) {
								if (typeof via === 'object' && via.title) {
									vulnerabilities.push({
										name,
										id: via.url?.match(/(CVE-\d+-\d+|GHSA-[a-zA-Z0-9-]+)/)?.[0],
										version: info.version || 'unknown',
										severity: via.severity || info.severity || 'medium',
										title: via.title,
										url: via.url,
										patchedVersions: info.fixAvailable ? 'Available' : undefined,
									})
								}
							}
						}
					}
				}
			} catch (execError: any) {
				// npm audit returns non-zero exit code when vulnerabilities found
				if (execError.stdout) {
					try {
						const audit = JSON.parse(execError.stdout)
						if (audit.vulnerabilities) {
							for (const [name, info] of Object.entries(audit.vulnerabilities as Record<string, any>)) {
								if (info.via && Array.isArray(info.via)) {
									for (const via of info.via) {
										if (typeof via === 'object' && via.title) {
											vulnerabilities.push({
												name,
												id: via.url?.match(/(CVE-\d+-\d+|GHSA-[a-zA-Z0-9-]+)/)?.[0],
												version: info.version || 'unknown',
												severity: via.severity || info.severity || 'medium',
												title: via.title,
												url: via.url,
												patchedVersions: info.fixAvailable ? 'Available' : undefined,
											})
										}
									}
								}
							}
						}
					} catch {
						// JSON parsing failed, return empty
					}
				}
			}
		} catch (error) {
			console.warn('[Directix] Failed to check dependencies:', error)
		}

		return vulnerabilities
	},

	/**
	 * Generate security report
	 */
	generateReport(html?: string): SecurityReport {
		const report: SecurityReport = {
			vulnerabilities: [],
			warnings: [],
			recommendations: [],
			timestamp: new Date(),
		}

		// Scan HTML if provided
		if (html) {
			report.vulnerabilities = this.scanHtml(html)
		}

		// Check CSP
		const cspResult = this.checkCSP()
		for (const warning of cspResult.warnings) {
			report.warnings.push({
				type: 'csp-warning',
				severity: 'medium',
				description: warning,
			})
		}
		report.recommendations.push(...cspResult.recommendations)

		return report
	},

	/**
	 * Format security report
	 */
	formatReport(report: SecurityReport, format: 'text' | 'json' | 'html' = 'text'): string {
		if (format === 'json') {
			return JSON.stringify(report, null, 2)
		}

		if (format === 'html') {
			let html = '<div class="security-report">'
			html += `<h2>Security Report</h2>`
			html += `<p>Generated: ${report.timestamp.toISOString()}</p>`

			if (report.vulnerabilities.length > 0) {
				html += '<h3>Vulnerabilities</h3><ul>'
				for (const vuln of report.vulnerabilities) {
					html += `<li class="severity-${vuln.severity}"><strong>${vuln.type}</strong>: ${vuln.description}</li>`
				}
				html += '</ul>'
			}

			if (report.warnings.length > 0) {
				html += '<h3>Warnings</h3><ul>'
				for (const warning of report.warnings) {
					html += `<li class="severity-${warning.severity}"><strong>${warning.type}</strong>: ${warning.description}</li>`
				}
				html += '</ul>'
			}

			if (report.recommendations.length > 0) {
				html += '<h3>Recommendations</h3><ul>'
				for (const rec of report.recommendations) {
					html += `<li>${rec}</li>`
				}
				html += '</ul>'
			}

			html += '</div>'
			return html
		}

		// Text format
		let text = 'Security Report\n'
		text += `Generated: ${report.timestamp.toISOString()}\n\n`

		if (report.vulnerabilities.length > 0) {
			text += 'Vulnerabilities:\n'
			for (const vuln of report.vulnerabilities) {
				text += `  [${vuln.severity.toUpperCase()}] ${vuln.type}: ${vuln.description}\n`
			}
			text += '\n'
		}

		if (report.warnings.length > 0) {
			text += 'Warnings:\n'
			for (const warning of report.warnings) {
				text += `  [${warning.severity.toUpperCase()}] ${warning.type}: ${warning.description}\n`
			}
			text += '\n'
		}

		if (report.recommendations.length > 0) {
			text += 'Recommendations:\n'
			for (const rec of report.recommendations) {
				text += `  - ${rec}\n`
			}
		}

		return text
	},
}

/**
 * Safe content handler for directives
 */
export class SafeContentHandler {
	private config: XSSProtectionConfig

	constructor(config: XSSProtectionConfig = {}) {
		this.config = config
	}

	/**
	 * Sanitize and set HTML content
	 */
	setHtml(element: HTMLElement, content: string): void {
		element.innerHTML = sanitizeHtml(content, this.config)
	}

	/**
	 * Sanitize and set text content
	 */
	setText(element: HTMLElement, content: string): void {
		element.textContent = content
	}

	/**
	 * Set attribute with URL validation
	 */
	setAttribute(element: HTMLElement, name: string, value: string): void {
		if (name.toLowerCase().startsWith('on')) {
			return // Block event handlers
		}

		if (name.toLowerCase() === 'href' || name.toLowerCase() === 'src') {
			value = sanitizeUrl(value, this.config.allowedProtocols)
		}

		element.setAttribute(name, value)
	}

	/**
	 * Get sanitized HTML
	 */
	getSanitizedHtml(content: string): string {
		return sanitizeHtml(content, this.config)
	}
}

/**
 * Create safe content handler
 */
export function createSafeContentHandler(config?: XSSProtectionConfig): SafeContentHandler {
	return new SafeContentHandler(config)
}
