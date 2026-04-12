import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useSwipe } from '../../src/composables/use-swipe'

describe('useSwipe', () => {
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
		it('should initialize with correct state', () => {
			const { direction, isSwiping, lengthX, lengthY } = useSwipe()

			expect(direction.value).toBe(null)
			expect(isSwiping.value).toBe(false)
			expect(lengthX.value).toBe(0)
			expect(lengthY.value).toBe(0)
		})

		it('should detect touch start', () => {
			const { isSwiping, bind } = useSwipe()

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			expect(isSwiping.value).toBe(true)
		})

		it('should detect swipe direction', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler })

			bind(element)

			// Touch start
			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			// Touch end with swipe
			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(handler).toHaveBeenCalledWith('right', expect.any(Event))
		})
	})

	describe('direction callbacks', () => {
		it('should call onLeft callback', () => {
			const onLeft = vi.fn()
			const { bind } = useSwipe({ onLeft })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			expect(onLeft).toHaveBeenCalled()
		})

		it('should call onRight callback', () => {
			const onRight = vi.fn()
			const { bind } = useSwipe({ onRight })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(onRight).toHaveBeenCalled()
		})

		it('should call onUp callback', () => {
			const onUp = vi.fn()
			const { bind } = useSwipe({ onUp })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 200 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			expect(onUp).toHaveBeenCalled()
		})

		it('should call onDown callback', () => {
			const onDown = vi.fn()
			const { bind } = useSwipe({ onDown })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 200 } as Touch],
			}))

			expect(onDown).toHaveBeenCalled()
		})
	})

	describe('options', () => {
		it('should use custom threshold', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler, threshold: 100 })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 150, clientY: 100 } as Touch], // 50px - below threshold
			}))

			expect(handler).not.toHaveBeenCalled()
		})

		it('should limit allowed directions', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({
				handler,
				directions: ['left', 'right'],
			})

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100, clientY: 200 } as Touch], // Down
			}))

			expect(handler).not.toHaveBeenCalled()
		})

		it('should support reactive threshold', () => {
			const threshold = ref(30)
			const handler = vi.fn()
			const { bind } = useSwipe({ handler, threshold })

			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 150, clientY: 100 } as Touch],
			}))

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('mouse events', () => {
		it('should detect mouse swipe', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler, mouse: true })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			element.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 100 }))

			expect(handler).toHaveBeenCalled()
		})

		it('should not detect mouse swipe when mouse is false', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler, mouse: false })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			element.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 100 }))

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('unbind', () => {
		it('should remove event listeners on unbind', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler })

			const unbind = bind(element)

			unbind()

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			}))

			element.dispatchEvent(new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			}))

			expect(handler).not.toHaveBeenCalled()
		})
	})
})
