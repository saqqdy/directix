import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useSanitize } from '../../src/composables/use-sanitize'

describe('useSanitize', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('div')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should sanitize HTML', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<b>hello</b>')

			expect(result).toBe('<b>hello</b>')
		})

		it('should remove script tags', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<script>alert("xss")</script><b>hello</b>')

			expect(result).toBe('<b>hello</b>')
		})

		it('should remove dangerous attributes', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<div onclick="alert(1)">hello</div>')

			expect(result).not.toContain('onclick')
		})

		it('should remove javascript: URLs', () => {
			const { sanitize } = useSanitize({ allowedTags: ['a'], allowedAttributes: ['href'] })

			const result = sanitize('<a href="javascript:alert(1)">click</a>')

			expect(result).not.toContain('javascript:')
		})
	})

	describe('allowedTags', () => {
		it('should only allow specified tags', () => {
			const { sanitize } = useSanitize({ allowedTags: ['b'] })

			const result = sanitize('<b>bold</b><i>italic</i>')

			expect(result).toBe('<b>bold</b>italic')
		})

		it('should use default allowed tags', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<p><strong>bold</strong></p>')

			expect(result).toBe('<p><strong>bold</strong></p>')
		})
	})

	describe('allowedAttributes', () => {
		it('should only allow specified attributes', () => {
			const { sanitize } = useSanitize({
				allowedTags: ['a'],
				allowedAttributes: ['href'],
			})

			const result = sanitize('<a href="https://example.com" title="test">link</a>')

			expect(result).toBe('<a href="https://example.com">link</a>')
		})
	})

	describe('allowDataUrls', () => {
		it('should remove data: URLs by default', () => {
			const { sanitize } = useSanitize({
				allowedTags: ['img'],
				allowedAttributes: ['src'],
			})

			const result = sanitize('<img src="data:image/png;base64,abc">')

			expect(result).not.toContain('data:')
		})

		it('should allow data: URLs when enabled', () => {
			const { sanitize } = useSanitize({
				allowedTags: ['img'],
				allowedAttributes: ['src'],
				allowDataUrls: true,
			})

			const result = sanitize('<img src="data:image/png;base64,abc">')

			expect(result).toContain('data:')
		})
	})

	describe('allowStyles', () => {
		it('should remove style attribute by default', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<div style="color:red">text</div>')

			expect(result).not.toContain('style')
		})

		it('should allow style when enabled', () => {
			const { sanitize } = useSanitize({ allowStyles: true })

			const result = sanitize('<div style="color:red">text</div>')

			expect(result).toContain('style')
		})
	})

	describe('allowClass', () => {
		it('should remove class attribute by default', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<div class="test">text</div>')

			expect(result).not.toContain('class')
		})

		it('should allow class when enabled', () => {
			const { sanitize } = useSanitize({ allowClass: true })

			const result = sanitize('<div class="test">text</div>')

			expect(result).toContain('class')
		})
	})

	describe('allowId', () => {
		it('should remove id attribute by default', () => {
			const { sanitize } = useSanitize()

			const result = sanitize('<div id="test">text</div>')

			expect(result).not.toContain('id=')
		})

		it('should allow id when enabled', () => {
			const { sanitize } = useSanitize({ allowId: true })

			const result = sanitize('<div id="test">text</div>')

			expect(result).toContain('id=')
		})
	})

	describe('custom handler', () => {
		it('should use custom handler', () => {
			const { sanitize } = useSanitize({
				handler: html => html.toUpperCase(),
			})

			const result = sanitize('<b>hello</b>')

			expect(result).toBe('<B>HELLO</B>')
		})
	})

	describe('bind', () => {
		it('should sanitize element content', () => {
			const { bind } = useSanitize()

			element.innerHTML = '<script>alert(1)</script><b>hello</b>'
			bind(element)

			expect(element.innerHTML).toBe('<b>hello</b>')
		})

		it('should return unbind function', () => {
			const { bind } = useSanitize()

			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
		})
	})
})
