import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useTouch } from '../../src/composables/use-touch'

describe('useTouch', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('div')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with gesture null', () => {
			const { gesture } = useTouch()

			expect(gesture.value).toBe(null)
		})

		it('should bind touch events', () => {
			const { bind } = useTouch()

			bind(element)

			// Events should be bound
			expect(element).toBeDefined()
		})

		it('should return unbind function', () => {
			const { bind } = useTouch()

			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
		})
	})

	describe('swipe detection', () => {
		it('should detect swipe left', () => {
			const onSwipeLeft = vi.fn()
			const { bind } = useTouch({ onSwipeLeft })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			expect(onSwipeLeft).toHaveBeenCalled()
		})

		it('should detect swipe right', () => {
			const onSwipeRight = vi.fn()
			const { bind } = useTouch({ onSwipeRight })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(onSwipeRight).toHaveBeenCalled()
		})

		it('should detect swipe up', () => {
			const onSwipeUp = vi.fn()
			const { bind } = useTouch({ onSwipeUp })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 200 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			expect(onSwipeUp).toHaveBeenCalled()
		})

		it('should detect swipe down', () => {
			const onSwipeDown = vi.fn()
			const { bind } = useTouch({ onSwipeDown })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 200 } as Touch],
			}))

			expect(onSwipeDown).toHaveBeenCalled()
		})

		it('should call onSwipe callback', () => {
			const onSwipe = vi.fn()
			const { bind } = useTouch({ onSwipe })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(onSwipe).toHaveBeenCalledWith(expect.objectContaining({
				type: 'swipe',
				direction: 'right',
			}))
		})
	})

	describe('tap detection', () => {
		it('should detect tap', () => {
			const onTap = vi.fn()
			const { bind } = useTouch({ onTap })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			expect(onTap).toHaveBeenCalled()
		})
	})

	describe('long press detection', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should detect long press', () => {
			const onLongPress = vi.fn()
			const { bind } = useTouch({ onLongPress, longPressDuration: 500 })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			vi.advanceTimersByTime(500)

			expect(onLongPress).toHaveBeenCalled()
		})

		it('should cancel long press on move', () => {
			const onLongPress = vi.fn()
			const { bind } = useTouch({ onLongPress, longPressDuration: 500 })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchmove', {
				touches: [{ clientX: 150, clientY: 100 } as Touch],
			}))

			vi.advanceTimersByTime(500)

			expect(onLongPress).not.toHaveBeenCalled()
		})
	})

	describe('disabled option', () => {
		it('should not detect gestures when disabled', () => {
			const disabled = ref(true)
			const onSwipe = vi.fn()
			const { bind } = useTouch({ onSwipe, disabled })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(onSwipe).not.toHaveBeenCalled()
		})
	})

	describe('unbind', () => {
		it('should remove event listeners on unbind', () => {
			const onSwipe = vi.fn()
			const { bind } = useTouch({ onSwipe })

			const unbind = bind(element)

			unbind()

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(onSwipe).not.toHaveBeenCalled()
		})
	})
})
