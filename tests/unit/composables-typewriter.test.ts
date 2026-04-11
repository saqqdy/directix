import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useTypewriter } from '../../src/composables/use-typewriter'

describe('useTypewriter', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with empty text', () => {
			const { displayedText, isTyping, isDeleting } = useTypewriter({
				text: 'Hello',
			})

			expect(displayedText.value).toBe('')
			expect(isTyping.value).toBe(false)
			expect(isDeleting.value).toBe(false)
		})

		it('should return start, stop, reset, and bind functions', () => {
			const { start, stop, reset, bind } = useTypewriter({
				text: 'Hello',
			})

			expect(typeof start).toBe('function')
			expect(typeof stop).toBe('function')
			expect(typeof reset).toBe('function')
			expect(typeof bind).toBe('function')
		})
	})

	describe('start typing', () => {
		it('should set isTyping when start() is called', () => {
			const { isTyping, start } = useTypewriter({
				text: 'Hi',
				speed: 100,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const { start } = useTypewriter({
				text: 'Hi',
				onStart,
			})

			start()
			expect(onStart).toHaveBeenCalled()
		})
	})

	describe('stop typing', () => {
		it('should stop typing when stop() is called', () => {
			const { isTyping, start, stop } = useTypewriter({
				text: 'Hello',
				speed: 100,
			})

			start()
			expect(isTyping.value).toBe(true)

			stop()
			expect(isTyping.value).toBe(false)
		})
	})

	describe('reset', () => {
		it('should reset displayed text when reset() is called', () => {
			const { displayedText, reset } = useTypewriter({
				text: 'Hello',
				speed: 100,
			})

			// Set some value
			displayedText.value = 'He'

			reset()
			expect(displayedText.value).toBe('')
		})
	})

	describe('options', () => {
		it('should accept speed option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				speed: 200,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept delay option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				delay: 500,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept cursor option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				cursor: '_',
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept cursor: false', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				cursor: false,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept cursorBlink option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				cursorBlink: false,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept loop option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				loop: true,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept deleteSpeed option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				deleteSpeed: 50,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept deleteDelay option', () => {
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				deleteDelay: 100,
			})

			start()
			expect(isTyping.value).toBe(true)
		})
	})

	describe('callbacks', () => {
		it('should accept onComplete callback', () => {
			const onComplete = vi.fn()
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				onComplete,
			})

			start()
			expect(isTyping.value).toBe(true)
		})

		it('should accept onType callback', () => {
			const onType = vi.fn()
			const { start, isTyping } = useTypewriter({
				text: 'Hi',
				onType,
			})

			start()
			expect(isTyping.value).toBe(true)
		})
	})

	describe('reactive text', () => {
		it('should work with reactive text', () => {
			const text = ref('Hello')
			const { displayedText, start } = useTypewriter({
				text,
				speed: 100,
			})

			start()

			expect(displayedText.value).toBe('')
		})
	})
})

// Additional tests for improved coverage
describe('useTypewriter additional coverage', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('bind', () => {
		it('should bind to element and add class', () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind } = useTypewriter({ text: 'Hi' })
			const unbind = bind(element)

			expect(element.classList.contains('v-typewriter')).toBe(true)

			unbind()
			expect(element.classList.contains('v-typewriter')).toBe(false)

			element.remove()
		})

		it('should create cursor element', () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind } = useTypewriter({ text: 'Hi', cursor: '|' })
			bind(element)

			// Advance timers to allow rendering
			vi.advanceTimersByTime(0)

			const cursor = element.querySelector('.v-typewriter__cursor')
			expect(cursor).not.toBeNull()
			expect(cursor?.textContent).toBe('|')

			element.remove()
		})

		it('should not create cursor when cursor is false', () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind } = useTypewriter({ text: 'Hi', cursor: false })
			bind(element)

			const cursor = element.querySelector('.v-typewriter__cursor')
			expect(cursor).toBeNull()

			element.remove()
		})
	})

	describe('typing animation', () => {
		it('should type characters with speed', async () => {
			const { displayedText, isTyping, start } = useTypewriter({
				text: 'Hi',
				speed: 100,
			})

			start()
			expect(isTyping.value).toBe(true)

			// First character after delay (0) + speed (100)
			vi.advanceTimersByTime(50)
			expect(displayedText.value).toBe('H')

			// Second character
			vi.advanceTimersByTime(100)
			expect(displayedText.value).toBe('Hi')
		})

		it('should call onType for each character', async () => {
			const onType = vi.fn()
			const { start } = useTypewriter({
				text: 'Hi',
				speed: 50,
				onType,
			})

			start()
			vi.advanceTimersByTime(150)

			expect(onType).toHaveBeenCalledTimes(2)
		})

		it('should call onComplete when done', async () => {
			const onComplete = vi.fn()
			const { start } = useTypewriter({
				text: 'Hi',
				speed: 50,
				onComplete,
			})

			start()
			vi.advanceTimersByTime(150)

			expect(onComplete).toHaveBeenCalled()
		})
	})

	describe('loop mode', () => {
		it('should start deleting after complete in loop mode', async () => {
			const { displayedText, isDeleting, start } = useTypewriter({
				text: 'Hi',
				speed: 50,
				deleteSpeed: 30,
				deleteDelay: 50,
				loop: true,
			})

			start()

			// Type characters
			vi.advanceTimersByTime(100)
			expect(displayedText.value).toBe('Hi')

			// Wait for delete delay
			vi.advanceTimersByTime(100)
			expect(isDeleting.value).toBe(true)
		})
	})

	describe('delay option', () => {
		it('should delay before starting', async () => {
			const { displayedText, start } = useTypewriter({
				text: 'Hi',
				speed: 50,
				delay: 100,
			})

			start()
			expect(displayedText.value).toBe('')

			vi.advanceTimersByTime(100)
			expect(displayedText.value).toBe('H')
		})
	})

	describe('reactive text', () => {
		it('should watch reactive text changes', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const text = ref('Hi')
			const { displayedText, bind } = useTypewriter({
				text,
				speed: 50,
			})

			bind(element)

			// Type initial text
			vi.advanceTimersByTime(150)
			expect(displayedText.value).toBe('Hi')

			// Change text
			text.value = 'Bye'
			await nextTick()

			// Should reset and start typing new text
			expect(displayedText.value).toBe('')

			element.remove()
		})
	})
})
