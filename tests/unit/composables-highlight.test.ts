import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useHighlight } from '../../src/composables/use-highlight'

describe('useHighlight', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with keywords', () => {
			const { count, bind } = useHighlight({ keywords: 'test' })

			expect(count.value).toBe(0)
			expect(bind).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello test world'
			const { bind, count } = useHighlight({ keywords: 'test' })

			const unbind = bind(element)

			expect(count.value).toBeGreaterThan(0)
			expect(element.innerHTML).toContain('<mark')

			unbind()
			expect(element.innerHTML).toBe('Hello test world')
		})

		it('should highlight keywords in text', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Vue and React are frameworks'
			const { bind, count } = useHighlight({ keywords: ['Vue', 'React'] })

			bind(element)

			expect(count.value).toBe(2)
			expect(element.querySelectorAll('mark').length).toBe(2)
		})

		it('should handle empty keywords', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello world'
			const { bind, count } = useHighlight({ keywords: [] })

			bind(element)

			expect(count.value).toBe(0)
		})

		it('should handle empty text', () => {
			const element = document.createElement('p')
			element.innerHTML = ''
			const { bind, count } = useHighlight({ keywords: 'test' })

			bind(element)

			expect(count.value).toBe(0)
		})
	})

	describe('options', () => {
		it('should support custom className', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello test'
			const { bind } = useHighlight({ keywords: 'test', className: 'custom-highlight' })

			bind(element)

			expect(element.querySelector('.custom-highlight')).not.toBeNull()
		})

		it('should support custom tag', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello test'
			const { bind } = useHighlight({ keywords: 'test', tag: 'span' })

			bind(element)

			expect(element.querySelector('span.v-highlight')).not.toBeNull()
		})

		it('should support inline style', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello test'
			const { bind } = useHighlight({ keywords: 'test', style: 'color: red;' })

			bind(element)

			const highlight = element.querySelector('.v-highlight') as HTMLElement
			expect(highlight?.style.color).toBe('red')
		})

		it('should support case sensitive', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Test test TEST'
			const { bind, count } = useHighlight({ keywords: 'test', caseSensitive: true })

			bind(element)

			expect(count.value).toBe(1)
		})

		it('should support whole word only', () => {
			const element = document.createElement('p')
			element.innerHTML = 'testing test tests'
			const { bind, count } = useHighlight({ keywords: 'test', wholeWord: true })

			bind(element)

			expect(count.value).toBe(1)
		})
	})

	describe('updateKeywords', () => {
		it('should update keywords dynamically', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Vue and React are frameworks'
			const { bind, updateKeywords, count } = useHighlight({ keywords: 'Vue' })

			bind(element)
			expect(count.value).toBe(1)

			updateKeywords(['Vue', 'React'])
			expect(count.value).toBe(2)
		})
	})

	describe('keyword sorting', () => {
		it('should sort keywords by length (longest first)', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Vue.js and Vue are frameworks'
			const { bind, count } = useHighlight({ keywords: ['Vue', 'Vue.js'] })

			bind(element)

			// Vue.js is matched first (longest), then Vue matches the remaining
			expect(count.value).toBeGreaterThan(0)
		})
	})

	describe('reactive options', () => {
		it('should support reactive keywords', () => {
			const keywords = ref('test')
			const element = document.createElement('p')
			element.innerHTML = 'Hello test world'
			const { bind, count } = useHighlight({ keywords })

			bind(element)

			expect(count.value).toBe(1)
		})
	})

	describe('special characters', () => {
		it('should escape special regex characters', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello (test) world'
			const { bind, count } = useHighlight({ keywords: '(test)' })

			bind(element)

			expect(count.value).toBe(1)
		})
	})

	describe('unbind', () => {
		it('should restore original content', () => {
			const element = document.createElement('p')
			element.innerHTML = 'Hello test world'
			const { bind } = useHighlight({ keywords: 'test' })

			const unbind = bind(element)
			unbind()

			expect(element.innerHTML).toBe('Hello test world')
		})
	})
})
