import { describe, expect, it, vi } from 'vitest'
import {
	isUrlSafe,
	sanitizeUrl,
	escapeHtml,
	unescapeHtml,
	stripHtml,
	sanitizeHtml,
	SecurityAudit,
	SafeContentHandler,
	createSafeContentHandler,
} from '../../src/utils/security'

describe('Security Utilities', () => {
	describe('isUrlSafe', () => {
		it('should return true for http URLs', () => {
			expect(isUrlSafe('http://example.com')).toBe(true)
		})

		it('should return true for https URLs', () => {
			expect(isUrlSafe('https://example.com')).toBe(true)
		})

		it('should return true for mailto URLs', () => {
			expect(isUrlSafe('mailto:test@example.com')).toBe(true)
		})

		it('should return true for tel URLs', () => {
			expect(isUrlSafe('tel:+1234567890')).toBe(true)
		})

		it('should return false for javascript URLs', () => {
			expect(isUrlSafe('javascript:alert(1)')).toBe(false)
		})

		it('should return false for data URLs', () => {
			expect(isUrlSafe('data:text/html,<script>alert(1)</script>')).toBe(false)
		})

		it('should return false for vbscript URLs', () => {
			expect(isUrlSafe('vbscript:msgbox(1)')).toBe(false)
		})

		it('should return false for file URLs', () => {
			expect(isUrlSafe('file:///etc/passwd')).toBe(false)
		})

		it('should allow custom protocols', () => {
			expect(isUrlSafe('custom://app', ['custom'])).toBe(true)
		})
	})

	describe('sanitizeUrl', () => {
		it('should return safe URLs unchanged', () => {
			expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
		})

		it('should return empty string for unsafe URLs', () => {
			expect(sanitizeUrl('javascript:alert(1)')).toBe('')
		})

		it('should sanitize dangerous URLs', () => {
			expect(sanitizeUrl('data:text/html,test')).toBe('')
		})
	})

	describe('escapeHtml', () => {
		it('should escape special characters', () => {
			expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
		})

		it('should escape ampersand', () => {
			expect(escapeHtml('a & b')).toBe('a &amp; b')
		})

		it('should handle empty string', () => {
			expect(escapeHtml('')).toBe('')
		})

		it('should handle plain text unchanged', () => {
			expect(escapeHtml('Hello World')).toBe('Hello World')
		})
	})

	describe('unescapeHtml', () => {
		it('should unescape HTML entities', () => {
			expect(unescapeHtml('&lt;script&gt;')).toBe('<script>')
		})

		it('should unescape ampersand', () => {
			expect(unescapeHtml('a &amp; b')).toBe('a & b')
		})

		it('should handle empty string', () => {
			expect(unescapeHtml('')).toBe('')
		})
	})

	describe('stripHtml', () => {
		it('should strip all HTML tags', () => {
			expect(stripHtml('<p>Hello</p>')).toBe('Hello')
		})

		it('should strip nested tags', () => {
			expect(stripHtml('<div><span>Test</span></div>')).toBe('Test')
		})

		it('should handle text without tags', () => {
			expect(stripHtml('Plain text')).toBe('Plain text')
		})

		it('should handle empty string', () => {
			expect(stripHtml('')).toBe('')
		})
	})

	describe('sanitizeHtml', () => {
		it('should preserve safe tags', () => {
			const result = sanitizeHtml('<b>Hello</b>')
			expect(result).toContain('Hello')
		})

		it('should remove script tags', () => {
			const result = sanitizeHtml('<script>alert(1)</script>')
			expect(result).not.toContain('script')
		})

		it('should remove dangerous attributes', () => {
			const result = sanitizeHtml('<div onclick="alert(1)">Test</div>')
			expect(result).not.toContain('onclick')
		})

		it('should allow custom allowed tags', () => {
			const result = sanitizeHtml('<custom>test</custom>', {
				allowedTags: ['custom'],
			})
			expect(result).toContain('test')
		})

		it('should handle empty string', () => {
			expect(sanitizeHtml('')).toBe('')
		})
	})

	describe('SecurityAudit', () => {
		describe('scanHtml', () => {
			it('should detect script injection', () => {
				const result = SecurityAudit.scanHtml('<script>alert(1)</script>')
				expect(result.length).toBeGreaterThan(0)
				expect(result[0].type).toBe('script-injection')
			})

			it('should detect onclick handlers', () => {
				const result = SecurityAudit.scanHtml('<div onclick="alert(1)">')
				expect(result.length).toBeGreaterThan(0)
				expect(result[0].type).toBe('event-handler')
			})

			it('should return empty array for clean HTML', () => {
				const result = SecurityAudit.scanHtml('<p>Hello World</p>')
				expect(result.length).toBe(0)
			})
		})

		describe('checkCSP', () => {
			it('should return a result', () => {
				const result = SecurityAudit.checkCSP()
				expect(result).toBeDefined()
			})
		})

		describe('generateReport', () => {
			it('should generate a report', () => {
				const result = SecurityAudit.generateReport('<script>alert(1)</script>')
				expect(result).toBeDefined()
				expect(result.vulnerabilities).toBeDefined()
				expect(result.timestamp).toBeDefined()
			})
		})

		describe('formatReport', () => {
			it('should format report as text', () => {
				const report = SecurityAudit.generateReport('<script>alert(1)</script>')
				const text = SecurityAudit.formatReport(report, 'text')
				expect(typeof text).toBe('string')
			})

			it('should format report as JSON', () => {
				const report = SecurityAudit.generateReport('<script>alert(1)</script>')
				const json = SecurityAudit.formatReport(report, 'json')
				expect(json).toBeDefined()
			})
		})
	})

	describe('SafeContentHandler', () => {
		it('should create handler with default config', () => {
			const handler = new SafeContentHandler()
			expect(handler).toBeDefined()
		})

		it('should set HTML content', () => {
			const handler = new SafeContentHandler()
			const element = document.createElement('div')
			handler.setHtml(element, '<b>Test</b>')
			expect(element.innerHTML).toContain('Test')
		})

		it('should set text content', () => {
			const handler = new SafeContentHandler()
			const element = document.createElement('div')
			handler.setText(element, 'Test text')
			expect(element.textContent).toBe('Test text')
		})

		it('should set safe attributes', () => {
			const handler = new SafeContentHandler()
			const element = document.createElement('div')
			handler.setAttribute(element, 'data-test', 'value')
			expect(element.getAttribute('data-test')).toBe('value')
		})

		it('should block event handlers', () => {
			const handler = new SafeContentHandler()
			const element = document.createElement('div')
			handler.setAttribute(element, 'onclick', 'alert(1)')
			expect(element.getAttribute('onclick')).toBeNull()
		})

		it('should sanitize URLs in href', () => {
			const handler = new SafeContentHandler()
			const element = document.createElement('a')
			handler.setAttribute(element, 'href', 'javascript:alert(1)')
			expect(element.getAttribute('href')).toBe('')
		})

		it('should get sanitized HTML', () => {
			const handler = new SafeContentHandler()
			const result = handler.getSanitizedHtml('<script>alert(1)</script>')
			expect(result).not.toContain('script')
		})

		it('should handle custom config', () => {
			const handler = new SafeContentHandler({
				allowedTags: ['b', 'i'],
			})
			// Test with just allowed tags
			const result = handler.getSanitizedHtml('<b>Test</b>')
			expect(result).toContain('Test')
		})
	})

	describe('createSafeContentHandler', () => {
		it('should create SafeContentHandler instance', () => {
			const handler = createSafeContentHandler()
			expect(handler).toBeInstanceOf(SafeContentHandler)
		})

		it('should accept config options', () => {
			const handler = createSafeContentHandler({ allowedTags: ['p'] })
			expect(handler).toBeInstanceOf(SafeContentHandler)
		})
	})
})