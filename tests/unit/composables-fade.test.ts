import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { useFade } from '../../src/composables/use-fade'

describe('useFade', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isVisible } = useFade()

			expect(isVisible.value).toBe(true)
		})

		it('should initialize with custom visible state', () => {
			const { isVisible } = useFade({ visible: false })

			expect(isVisible.value).toBe(false)
		})
	})

	describe('bind', () => {
		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind, isVisible } = useFade()

			const unbind = bind(element)

			expect(element.classList.contains('v-fade')).toBe(true)

			unbind()
			expect(element.classList.contains('v-fade')).toBe(false)
		})

		it('should set initial opacity to 1 when visible', () => {
			const element = document.createElement('div')
			const { bind } = useFade({ visible: true })

			bind(element)

			expect(element.style.opacity).toBe('1')
		})

		it('should set display none when not visible', () => {
			const element = document.createElement('div')
			const { bind } = useFade({ visible: false })

			bind(element)

			expect(element.style.display).toBe('none')
		})
	})

	describe('fadeIn', () => {
		it('should fade in element', () => {
			const element = document.createElement('div')
			const { bind, fadeIn, isVisible } = useFade({ visible: false })

			bind(element)
			fadeIn()

			expect(element.style.display).toBe('')
			expect(element.style.opacity).toBe('1')
		})

		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const element = document.createElement('div')
			const { bind, fadeIn } = useFade({ visible: false, onStart })

			bind(element)
			fadeIn()

			expect(onStart).toHaveBeenCalledWith('in')
		})

		it('should call onComplete callback', () => {
			const onComplete = vi.fn()
			const element = document.createElement('div')
			const { bind, fadeIn } = useFade({ visible: false, onComplete, duration: 100 })

			bind(element)
			fadeIn()

			vi.advanceTimersByTime(100)

			expect(onComplete).toHaveBeenCalledWith('in')
		})
	})

	describe('fadeOut', () => {
		it('should fade out element', () => {
			const element = document.createElement('div')
			const { bind, fadeOut } = useFade({ visible: true })

			bind(element)
			fadeOut()

			expect(element.style.opacity).toBe('0')
		})

		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const element = document.createElement('div')
			const { bind, fadeOut } = useFade({ visible: true, onStart })

			bind(element)
			fadeOut()

			expect(onStart).toHaveBeenCalledWith('out')
		})

		it('should call onComplete callback', () => {
			const onComplete = vi.fn()
			const element = document.createElement('div')
			const { bind, fadeOut } = useFade({ visible: true, onComplete, duration: 100 })

			bind(element)
			fadeOut()

			vi.advanceTimersByTime(100)

			expect(onComplete).toHaveBeenCalledWith('out')
		})
	})

	describe('toggle', () => {
		it('should toggle visibility', () => {
			const element = document.createElement('div')
			const { bind, toggle, isVisible } = useFade({ visible: true, duration: 100 })

			bind(element)

			toggle()
			// After toggle (fadeOut), isVisible should still be true until animation completes
			vi.advanceTimersByTime(100)
			expect(isVisible.value).toBe(false)

			toggle()
			vi.advanceTimersByTime(100)
			expect(isVisible.value).toBe(true)
		})
	})

	describe('options', () => {
		it('should use custom duration', () => {
			const element = document.createElement('div')
			const { bind } = useFade({ duration: 500 })

			bind(element)

			expect(element.style.transition).toContain('500ms')
		})

		it('should use custom easing', () => {
			const element = document.createElement('div')
			const { bind } = useFade({ easing: 'ease-in-out' })

			bind(element)

			expect(element.style.transition).toContain('ease-in-out')
		})

		it('should use custom delay', () => {
			const element = document.createElement('div')
			const { bind } = useFade({ delay: 100 })

			bind(element)

			expect(element.style.transition).toContain('100ms')
		})

		it('should use custom opacity values', () => {
			const element = document.createElement('div')
			const { bind, fadeIn } = useFade({ minOpacity: 0.2, maxOpacity: 0.8, visible: false })

			bind(element)
			fadeIn()

			expect(element.style.opacity).toBe('0.8')
		})
	})

	describe('reactive options', () => {
		it('should support reactive visible', () => {
			const visible = ref(false)
			const { isVisible } = useFade({ visible })

			expect(isVisible.value).toBe(false)
		})
	})
})
