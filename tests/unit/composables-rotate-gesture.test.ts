import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useRotateGesture } from '../../src/composables/use-rotate-gesture'

describe('useRotateGesture', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isRotating, angle, bind } = useRotateGesture()

			expect(isRotating.value).toBe(false)
			expect(angle.value).toBe(0)
			expect(bind).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind } = useRotateGesture()

			const unbind = bind(element)

			expect(element.classList.contains('v-rotate-gesture')).toBe(true)

			unbind()
			expect(element.classList.contains('v-rotate-gesture')).toBe(false)
		})
	})

	describe('touch events', () => {
		it('should handle touchstart with two fingers', () => {
			const element = document.createElement('div')
			const { bind, isRotating } = useRotateGesture()

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const touchEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(touchEvent)

			expect(isRotating.value).toBe(false) // Not rotating until move
		})

		it('should handle touchmove with two fingers', () => {
			const element = document.createElement('div')
			const { bind, isRotating, angle } = useRotateGesture()

			bind(element)

			// Start with horizontal fingers
			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
				cancelable: true,
			})
			element.dispatchEvent(startEvent)

			// Rotate fingers to vertical
			const touch1Move = { clientX: 50, clientY: 20 }
			const touch2Move = { clientX: 50, clientY: 80 }
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1Move, touch2Move] as any,
				cancelable: true,
			})
			element.dispatchEvent(moveEvent)

			expect(isRotating.value).toBe(true)
		})

		it('should handle touchend', () => {
			const onStart = vi.fn()
			const onEnd = vi.fn()
			const element = document.createElement('div')
			const { bind, isRotating } = useRotateGesture({ onStart, onEnd })

			bind(element)

			// Start rotation
			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			// End rotation
			const endEvent = new TouchEvent('touchend', {
				touches: [] as any,
			})
			element.dispatchEvent(endEvent)

			expect(isRotating.value).toBe(false)
		})
	})

	describe('callbacks', () => {
		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const element = document.createElement('div')
			const { bind } = useRotateGesture({ onStart })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			expect(onStart).toHaveBeenCalled()
		})

		it('should call onRotate callback', () => {
			const onRotate = vi.fn()
			const element = document.createElement('div')
			const { bind } = useRotateGesture({ onRotate })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			expect(onRotate).toHaveBeenCalled()
		})

		it('should call onEnd callback', () => {
			const onEnd = vi.fn()
			const element = document.createElement('div')
			const { bind } = useRotateGesture({ onEnd })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			const endEvent = new TouchEvent('touchend', {
				touches: [] as any,
			})
			element.dispatchEvent(endEvent)

			expect(onEnd).toHaveBeenCalled()
		})
	})

	describe('options', () => {
		it('should apply transform when enableTransform is true', () => {
			const element = document.createElement('div')
			const { bind } = useRotateGesture({ enableTransform: true })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const touch1Move = { clientX: 50, clientY: 20 }
			const touch2Move = { clientX: 50, clientY: 80 }
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1Move, touch2Move] as any,
			})
			element.dispatchEvent(moveEvent)

			expect(element.style.transform).toContain('rotate')
		})
	})

	describe('rotation event data', () => {
		it('should provide correct event data', () => {
			let eventData: any
			const onRotate = vi.fn((e) => { eventData = e })
			const element = document.createElement('div')
			const { bind } = useRotateGesture({ onRotate })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			expect(eventData).toBeDefined()
			expect(eventData.angle).toBeDefined()
			expect(eventData.radians).toBeDefined()
			expect(eventData.rotation).toBeDefined()
			expect(eventData.centerX).toBeDefined()
			expect(eventData.centerY).toBeDefined()
			expect(eventData.isRotating).toBe(true)
		})
	})

	describe('touchcancel', () => {
		it('should handle touchcancel', () => {
			const element = document.createElement('div')
			const { bind, isRotating } = useRotateGesture()

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			const cancelEvent = new TouchEvent('touchcancel', {
				touches: [] as any,
			})
			element.dispatchEvent(cancelEvent)

			expect(isRotating.value).toBe(false)
		})
	})
})