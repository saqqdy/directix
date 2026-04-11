import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { useEmoji } from '../../src/composables/use-emoji'

describe('useEmoji', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { value, stripEmojis, hasEmoji } = useEmoji()

			expect(value.value).toBe('')
			expect(typeof stripEmojis).toBe('function')
			expect(typeof hasEmoji).toBe('function')
		})

		it('should strip emojis from text', () => {
			const { stripEmojis } = useEmoji()

			expect(stripEmojis('Hello 😊 World')).toBe('Hello  World')
			expect(stripEmojis('Test 🎉🎉')).toBe('Test ')
		})

		it('should detect emojis in text', () => {
			const { hasEmoji } = useEmoji()

			expect(hasEmoji('Hello 😊')).toBe(true)
			expect(hasEmoji('Hello World')).toBe(false)
		})

		it('should not strip emojis when strip is false', () => {
			const { stripEmojis } = useEmoji({ strip: false })

			expect(stripEmojis('Hello 😊')).toBe('Hello 😊')
		})
	})

	describe('options', () => {
		it('should use custom replacement', () => {
			const { stripEmojis } = useEmoji({ replacement: '*' })

			expect(stripEmojis('Hello 😊')).toBe('Hello *')
		})

		it('should respect allowList', () => {
			const { stripEmojis } = useEmoji({ allowList: ['😊'] })

			expect(stripEmojis('Hello 😊 👎')).toBe('Hello 😊 ')
		})

		it('should respect blockList', () => {
			const { stripEmojis } = useEmoji({ blockList: ['👎'] })

			expect(stripEmojis('Hello 😊 👎')).toBe('Hello 😊 ')
		})
	})

	describe('callbacks', () => {
		it('should call onEmoji callback', () => {
			const onEmoji = vi.fn()
			const { stripEmojis } = useEmoji({ onEmoji })

			stripEmojis('Hello 😊')

			expect(onEmoji).toHaveBeenCalled()
		})
	})

	describe('bind', () => {
		it('should bind to input element', () => {
			const input = document.createElement('input')
			input.type = 'text'
			const { bind, value } = useEmoji()

			const unbind = bind(input)

			expect(input.classList.contains('v-emoji')).toBe(true)

			unbind()
			expect(input.classList.contains('v-emoji')).toBe(false)
		})

		it('should bind to textarea element', () => {
			const textarea = document.createElement('textarea')
			const { bind } = useEmoji()

			const unbind = bind(textarea)

			expect(textarea.classList.contains('v-emoji')).toBe(true)

			unbind()
		})

		it('should process initial value', () => {
			const input = document.createElement('input')
			input.type = 'text'
			input.value = 'Hello 😊 World'

			const { bind, value } = useEmoji()

			bind(input)

			expect(input.value).toBe('Hello  World')
			expect(value.value).toBe('Hello  World')
		})
	})

	describe('reactive options', () => {
		it('should support reactive strip option', () => {
			const strip = ref(true)
			const { stripEmojis } = useEmoji({ strip })

			expect(stripEmojis('Hello 😊')).toBe('Hello ')
		})
	})
})
