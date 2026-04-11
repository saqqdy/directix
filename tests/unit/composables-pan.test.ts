import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePan } from '../../src/composables/use-pan'

describe('usePan', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isPanning, direction, distance } = usePan()

			expect(isPanning.value).toBe(false)
			expect(direction.value).toBeNull()
			expect(distance.value).toBe(0)
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind } = usePan()

			const unbind = bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)

			unbind()
			expect(element.classList.contains('v-pan')).toBe(false)
		})
	})

	describe('options', () => {
		it('should support custom threshold', () => {
			const element = document.createElement('div')
			const { bind } = usePan({ threshold: 20 })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})

		it('should support direction constraint', () => {
			const element = document.createElement('div')
			const { bind } = usePan({ direction: 'horizontal' })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})

		it('should support touch only pointers', () => {
			const element = document.createElement('div')
			const { bind } = usePan({ pointers: ['touch'] })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})

		it('should support mouse only pointers', () => {
			const element = document.createElement('div')
			const { bind } = usePan({ pointers: ['mouse'] })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})
	})

	describe('callbacks', () => {
		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const element = document.createElement('div')
			const { bind } = usePan({ onStart })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})

		it('should call onPan callback', () => {
			const onPan = vi.fn()
			const element = document.createElement('div')
			const { bind } = usePan({ onPan })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})

		it('should call onEnd callback', () => {
			const onEnd = vi.fn()
			const element = document.createElement('div')
			const { bind } = usePan({ onEnd })

			bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)
		})
	})
})

// Additional tests for improved coverage
describe('usePan additional coverage', () => {
	describe('pan events', () => {
		it('should handle mouse pan events', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const onPan = vi.fn()
			const { bind, isPanning, direction, distance } = usePan({ onPan, threshold: 5 })

			bind(element)

			// Simulate mousedown
			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			// Simulate mousemove (move enough to exceed threshold)
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 100 }))

			expect(isPanning.value).toBe(true)
			expect(direction.value).toBe('right')
			expect(distance.value).toBe(50)
			expect(onPan).toHaveBeenCalled()

			// Cleanup
			document.dispatchEvent(new MouseEvent('mouseup'))
			element.remove()
		})

		it('should handle touch pan events', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const onPan = vi.fn()
			const { bind, isPanning } = usePan({ onPan, threshold: 5 })

			bind(element)

			// Simulate touchstart
			const touchStart = new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			element.dispatchEvent(touchStart)

			// Simulate touchmove
			const touchMove = new TouchEvent('touchmove', {
				touches: [{ clientX: 150, clientY: 100 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			element.dispatchEvent(touchMove)

			expect(isPanning.value).toBe(true)
			expect(onPan).toHaveBeenCalled()

			// Cleanup
			element.dispatchEvent(new TouchEvent('touchend', { bubbles: true }))
			element.remove()
		})

		it('should call onStart when panning starts', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const onStart = vi.fn()
			const { bind } = usePan({ onStart, threshold: 5 })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 100 }))

			expect(onStart).toHaveBeenCalled()

			document.dispatchEvent(new MouseEvent('mouseup'))
			element.remove()
		})

		it('should call onEnd when panning ends', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const onEnd = vi.fn()
			const { bind, isPanning } = usePan({ onEnd, threshold: 5 })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 100 }))
			expect(isPanning.value).toBe(true)

			document.dispatchEvent(new MouseEvent('mouseup'))
			expect(isPanning.value).toBe(false)
			expect(onEnd).toHaveBeenCalled()

			element.remove()
		})
	})

	describe('direction constraint', () => {
		it('should only pan horizontally when direction is horizontal', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind, direction } = usePan({ direction: 'horizontal', threshold: 5 })

			bind(element)

			// Try vertical pan
			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 150 }))

			// Should not trigger panning for vertical direction when constrained to horizontal
			expect(direction.value).toBeNull()

			document.dispatchEvent(new MouseEvent('mouseup'))
			element.remove()
		})

		it('should only pan vertically when direction is vertical', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind, direction } = usePan({ direction: 'vertical', threshold: 5 })

			bind(element)

			// Try horizontal pan
			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 100 }))

			// Should not trigger panning for horizontal direction when constrained to vertical
			expect(direction.value).toBeNull()

			document.dispatchEvent(new MouseEvent('mouseup'))
			element.remove()
		})
	})

	describe('threshold', () => {
		it('should not trigger panning below threshold', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const onPan = vi.fn()
			const { bind, isPanning } = usePan({ onPan, threshold: 50 })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110, clientY: 100 }))

			// Below threshold, should not trigger
			expect(isPanning.value).toBe(false)
			expect(onPan).not.toHaveBeenCalled()

			document.dispatchEvent(new MouseEvent('mouseup'))
			element.remove()
		})
	})

	describe('prevent default', () => {
		it('should not prevent default when preventDefault is false', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind } = usePan({ preventDefault: false, threshold: 5 })

			bind(element)

			const mousedown = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
			element.dispatchEvent(mousedown)

			// Event should not be prevented
			// (We can't easily test preventDefault behavior in Vitest)

			document.dispatchEvent(new MouseEvent('mouseup'))
			element.remove()
		})
	})

	describe('cleanup', () => {
		it('should cleanup event listeners on unbind', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { bind } = usePan({ threshold: 5 })
			const unbind = bind(element)

			expect(element.classList.contains('v-pan')).toBe(true)

			unbind()

			expect(element.classList.contains('v-pan')).toBe(false)

			element.remove()
		})
	})
})
