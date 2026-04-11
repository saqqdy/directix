import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePinch } from '../../src/composables/use-pinch'

describe('usePinch', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isPinching, scale, bind } = usePinch()

			expect(isPinching.value).toBe(false)
			expect(scale.value).toBe(1)
			expect(bind).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind } = usePinch()

			const unbind = bind(element)

			expect(element.classList.contains('v-pinch')).toBe(true)

			unbind()
			expect(element.classList.contains('v-pinch')).toBe(false)
		})
	})

	describe('touch events', () => {
		it('should handle touchstart with two fingers', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind, isPinching } = usePinch()

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const touchEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(touchEvent)

			expect(isPinching.value).toBe(false) // Not pinching until move
		})

		it('should handle touchmove with two fingers', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind, isPinching, scale } = usePinch()

			bind(element)

			// Start with initial distance
			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
				cancelable: true,
			})
			element.dispatchEvent(startEvent)

			// Move fingers apart (zoom in)
			const touch1Move = { clientX: 10, clientY: 50 }
			const touch2Move = { clientX: 90, clientY: 50 }
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1Move, touch2Move] as any,
				cancelable: true,
			})
			element.dispatchEvent(moveEvent)

			expect(isPinching.value).toBe(true)
		})

		it('should handle touchend', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const onStart = vi.fn()
			const onEnd = vi.fn()
			const { bind, isPinching } = usePinch({ onStart, onEnd })

			bind(element)

			// Start pinch
			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			// Move
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(moveEvent)

			// End
			const endEvent = new TouchEvent('touchend', {
				touches: [] as any,
			})
			element.dispatchEvent(endEvent)

			expect(isPinching.value).toBe(false)
		})
	})

	describe('callbacks', () => {
		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind } = usePinch({ onStart })

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

		it('should call onPinch callback', () => {
			const onPinch = vi.fn()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind } = usePinch({ onPinch })

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

			expect(onPinch).toHaveBeenCalled()
		})

		it('should call onEnd callback', () => {
			const onEnd = vi.fn()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind } = usePinch({ onEnd })

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
		it('should respect minScale constraint', () => {
			const onPinch = vi.fn()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind } = usePinch({ minScale: 0.5, onPinch })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			// Try to pinch smaller than minScale
			const touch1Move = { clientX: 40, clientY: 50 }
			const touch2Move = { clientX: 60, clientY: 50 }
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1Move, touch2Move] as any,
			})
			element.dispatchEvent(moveEvent)

			// onPinch should not be called due to constraint
			expect(onPinch).not.toHaveBeenCalled()
		})

		it('should respect maxScale constraint', () => {
			const onPinch = vi.fn()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind } = usePinch({ maxScale: 2, onPinch })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			// Try to pinch larger than maxScale
			const touch1Move = { clientX: 0, clientY: 50 }
			const touch2Move = { clientX: 200, clientY: 50 }
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1Move, touch2Move] as any,
			})
			element.dispatchEvent(moveEvent)

			// onPinch should not be called due to constraint
			expect(onPinch).not.toHaveBeenCalled()
		})

		it('should apply transform when enableTransform is true', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind } = usePinch({ enableTransform: true })

			bind(element)

			const touch1 = { clientX: 20, clientY: 50 }
			const touch2 = { clientX: 80, clientY: 50 }
			const startEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2] as any,
			})
			element.dispatchEvent(startEvent)

			const touch1Move = { clientX: 10, clientY: 50 }
			const touch2Move = { clientX: 90, clientY: 50 }
			const moveEvent = new TouchEvent('touchmove', {
				touches: [touch1Move, touch2Move] as any,
			})
			element.dispatchEvent(moveEvent)

			expect(element.style.transform).toContain('scale')
		})
	})

	describe('touchcancel', () => {
		it('should handle touchcancel', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind, isPinching } = usePinch()

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

			expect(isPinching.value).toBe(false)
		})
	})
})
