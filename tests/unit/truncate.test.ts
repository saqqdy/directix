import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ObjectDirective } from 'vue'
import { vTruncate } from '../../src/directives/truncate'

// Cast to ObjectDirective to access hooks
const truncateDirective = vTruncate as ObjectDirective

describe('vTruncate', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vTruncate).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect(truncateDirective.mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect(truncateDirective.updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect(truncateDirective.unmounted).toBeDefined()
		})
	})

	describe('mounted', () => {
		it('should truncate text to specified length', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text that needs to be truncated'

			truncateDirective.mounted!(el, { value: 20, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			// Length 20 with ellipsis "..." (3 chars) means 17 chars of text + "..."
			expect(el.textContent?.length).toBe(20)
			expect(el.textContent?.endsWith('...')).toBe(true)
		})

		it('should not truncate short text', () => {
			const el = document.createElement('p')
			el.textContent = 'Short text'

			truncateDirective.mounted!(el, { value: 100, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect(el.textContent).toBe('Short text')
		})

		it('should store original text', () => {
			const el = document.createElement('p')
			el.textContent = 'Original text'

			truncateDirective.mounted!(el, { value: 5, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect((el as any).__truncate.originalText).toBe('Original text')
		})

		it('should set title attribute', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text that needs to be truncated'

			truncateDirective.mounted!(el, { value: 20, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect(el.getAttribute('title')).toBe('This is a very long text that needs to be truncated')
		})

		it('should not set title when showTitle is false', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text that needs to be truncated'

			truncateDirective.mounted!(el, {
				value: { length: 20, showTitle: false },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			expect(el.getAttribute('title')).toBeNull()
		})
	})

	describe('truncate positions', () => {
		it('should truncate from end (default)', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, { value: { length: 15 }, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			// Length 15: 12 chars text + "..."
			expect(el.textContent?.length).toBe(15)
			expect(el.textContent?.endsWith('...')).toBe(true)
		})

		it('should truncate from start', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, {
				value: { length: 15, position: 'start' },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			// Length 15: "..." + 12 chars from end
			expect(el.textContent?.length).toBe(15)
			expect(el.textContent?.startsWith('...')).toBe(true)
		})

		it('should truncate from middle', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, {
				value: { length: 15, position: 'middle' },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			// Length 15: 6 chars + "..." + 6 chars
			expect(el.textContent?.length).toBe(15)
			expect(el.textContent?.includes('...')).toBe(true)
		})
	})

	describe('options', () => {
		it('should use custom ellipsis', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, {
				value: { length: 15, ellipsis: '…' },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			// Custom ellipsis is 1 char, so 14 chars of text + "…"
			expect(el.textContent?.length).toBe(15)
			expect(el.textContent?.endsWith('…')).toBe(true)
		})

		it('should use CSS truncation', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, {
				value: { useCss: true },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			expect(el.style.overflow).toBe('hidden')
			expect(el.style.textOverflow).toBe('ellipsis')
			expect(el.style.whiteSpace).toBe('nowrap')
		})

		it('should set title when using CSS truncation', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, {
				value: { useCss: true },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			expect(el.getAttribute('title')).toBe('This is a very long text')
		})

		it('should not set title for CSS truncation when showTitle is false', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, {
				value: { useCss: true, showTitle: false },
				modifiers: {},
				dir: vTruncate,
				instance: null,
			} as any, null as any, null as any)

			expect(el.getAttribute('title')).toBeNull()
		})
	})

	describe('updated', () => {
		it('should update truncation when options change', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, { value: 10, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)
			expect(el.textContent?.length).toBe(10)

			truncateDirective.updated!(el, { value: 20, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)
			expect(el.textContent?.length).toBe(20)
		})

		it('should not update if options unchanged', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, { value: 15, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)
			const textContent = el.textContent

			truncateDirective.updated!(el, { value: 15, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect(el.textContent).toBe(textContent)
		})

		it('should handle missing state', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.updated!(el, { value: 10, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect(el.textContent?.length).toBe(10)
		})
	})

	describe('unmounted', () => {
		it('should clean up state', () => {
			const el = document.createElement('p')
			el.textContent = 'This is a very long text'

			truncateDirective.mounted!(el, { value: 10, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)
			truncateDirective.unmounted!(el, { value: 10, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect((el as any).__truncate).toBeUndefined()
		})
	})

	describe('edge cases', () => {
		it('should handle empty text', () => {
			const el = document.createElement('p')
			el.textContent = ''

			truncateDirective.mounted!(el, { value: 10, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect(el.textContent).toBe('')
		})

		it('should handle null textContent', () => {
			const el = document.createElement('p')

			truncateDirective.mounted!(el, { value: 10, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			expect(el.textContent).toBe('')
		})

		it('should handle text shorter than ellipsis length', () => {
			const el = document.createElement('p')
			el.textContent = 'Hi'

			truncateDirective.mounted!(el, { value: 5, modifiers: {}, dir: vTruncate, instance: null } as any, null as any, null as any)

			// Text is shorter than the truncation length
			expect(el.textContent).toBe('Hi')
		})
	})
})
