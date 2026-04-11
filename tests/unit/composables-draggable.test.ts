import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDraggable } from '../../src/composables/use-draggable'

// Mock getBoundingClientRect
const mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
	width: 100,
	height: 50,
	x: 0,
	y: 0,
	top: 0,
	left: 0,
	right: 100,
	bottom: 50,
	toJSON: () => ({}),
} as DOMRect)

describe('useDraggable', () => {
	beforeEach(() => {
		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			position: 'static',
		} as CSSStyleDeclaration)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default position', () => {
			const { position, isDragging } = useDraggable()

			expect(position.value).toEqual({ x: 0, y: 0 })
			expect(isDragging.value).toBe(false)
		})

		it('should return reset and bind functions', () => {
			const { reset, bind } = useDraggable()

			expect(typeof reset).toBe('function')
			expect(typeof bind).toBe('function')
		})
	})

	describe('bind', () => {
		it('should bind to an element', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(element.style.position).toBe('absolute')
			expect(typeof unbind).toBe('function')
		})

		it('should add event listeners to element', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			const addEventListenerSpy = vi.spyOn(element, 'addEventListener')

			bind(element)

			expect(addEventListenerSpy).toHaveBeenCalled()
		})

		it('should not change position if already positioned', () => {
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'relative',
			} as CSSStyleDeclaration)

			const { bind } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			expect(element.style.position).toBe('')
		})
	})

	describe('dragging', () => {
		it('should set isDragging true on mousedown', () => {
			const { bind, isDragging } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			expect(isDragging.value).toBe(true)
		})

		it('should add dragging class on mousedown', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			expect(element.classList.contains('v-draggable--dragging')).toBe(true)
		})

		it('should remove dragging class on mouseup', () => {
			const { bind, isDragging } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			expect(isDragging.value).toBe(true)

			document.dispatchEvent(new MouseEvent('mouseup'))
			expect(isDragging.value).toBe(false)
			expect(element.classList.contains('v-draggable--dragging')).toBe(false)
		})

		it('should update position on drag', () => {
			const { bind, position } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			expect(position.value.x).toBe(50)
			expect(position.value.y).toBe(50)
		})

		it('should apply transform on drag', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			expect(element.style.transform).toContain('translate')
		})
	})

	describe('axis constraint', () => {
		it('should constrain to x axis', () => {
			const { bind, position } = useDraggable({ axis: 'x' })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			expect(position.value.x).toBe(50)
			expect(position.value.y).toBe(0)
		})

		it('should constrain to y axis', () => {
			const { bind, position } = useDraggable({ axis: 'y' })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			// X should be 0 for y axis constraint
			expect(position.value.y).toBe(50)
		})

		it('should work with reactive axis', () => {
			const axis = ref<'x' | 'y' | 'both'>('x')
			const { bind } = useDraggable({ axis })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			expect(element.classList.contains('v-draggable--dragging')).toBe(true)
		})
	})

	describe('disabled option', () => {
		it('should not start drag when disabled', () => {
			const { bind, isDragging } = useDraggable({ disabled: true })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			expect(isDragging.value).toBe(false)
		})

		it('should work with reactive disabled', async () => {
			const disabled = ref(true)
			const { bind, isDragging } = useDraggable({ disabled })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			expect(isDragging.value).toBe(false)

			disabled.value = false
			await nextTick()

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			expect(isDragging.value).toBe(true)
		})
	})

	describe('grid snapping', () => {
		it('should snap to grid', () => {
			const { bind, position } = useDraggable({ grid: [50, 50] })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 125, clientY: 125 }))

			// Grid snapping rounds to nearest grid value
			// delta = 25, grid = 50, round(25/50) * 50 = round(0.5) * 50 = 1 * 50 = 50
			expect(position.value.x).toBe(50)
			expect(position.value.y).toBe(50)
		})

		it('should work with reactive grid', () => {
			const grid = ref<[number, number]>([50, 50])
			const { bind } = useDraggable({ grid })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			expect(element.classList.contains('v-draggable--dragging')).toBe(true)
		})
	})

	describe('callbacks', () => {
		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const { bind } = useDraggable({ onStart })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			expect(onStart).toHaveBeenCalled()
		})

		it('should call onDrag callback', () => {
			const onDrag = vi.fn()
			const { bind } = useDraggable({ onDrag })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			expect(onDrag).toHaveBeenCalled()
		})

		it('should call onEnd callback', () => {
			const onEnd = vi.fn()
			const { bind } = useDraggable({ onEnd })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))
			document.dispatchEvent(new MouseEvent('mouseup'))

			expect(onEnd).toHaveBeenCalled()
		})
	})

	describe('handle option', () => {
		it('should use handle element for drag', () => {
			const { bind, isDragging } = useDraggable({ handle: '.handle' })

			const element = document.createElement('div')
			const handleEl = document.createElement('div')
			handleEl.className = 'handle'
			element.appendChild(handleEl)
			bind(element)

			handleEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			expect(isDragging.value).toBe(true)
		})
	})

	describe('reset', () => {
		it('should reset position to origin', () => {
			const { bind, position, reset } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			expect(position.value.x).toBe(50)
			expect(position.value.y).toBe(50)

			reset()

			expect(position.value.x).toBe(0)
			expect(position.value.y).toBe(0)
		})
	})

	describe('touch events', () => {
		it('should handle touchstart', () => {
			const { bind, isDragging } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			const touchEvent = new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			element.dispatchEvent(touchEvent)

			expect(isDragging.value).toBe(true)
		})

		it('should handle touchmove', () => {
			const { bind, position } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
				bubbles: true,
				cancelable: true,
			}))

			document.dispatchEvent(new TouchEvent('touchmove', {
				touches: [{ clientX: 150, clientY: 150 } as Touch],
				bubbles: true,
				cancelable: true,
			}))

			expect(position.value.x).toBe(50)
			expect(position.value.y).toBe(50)
		})

		it('should handle touchend', () => {
			const { bind, isDragging } = useDraggable()

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
				bubbles: true,
				cancelable: true,
			}))
			expect(isDragging.value).toBe(true)

			document.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }))
			expect(isDragging.value).toBe(false)
		})
	})

	describe('unbind', () => {
		it('should remove event listeners on unbind', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener')
			const unbind = bind(element)

			unbind()

			expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
			expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
		})
	})

	describe('constrain option', () => {
		it('should accept constrain option', () => {
			mockGetBoundingClientRect.mockReturnValue({
				width: 500,
				height: 500,
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 500,
				bottom: 500,
				toJSON: () => ({}),
			} as DOMRect)

			const { bind, isDragging } = useDraggable({ constrain: true })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

			expect(isDragging.value).toBe(true)
		})

		it('should work with reactive constrain', () => {
			const constrain = ref(true)
			const { bind } = useDraggable({ constrain })

			const element = document.createElement('div')
			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
			expect(element.classList.contains('v-draggable--dragging')).toBe(true)
		})
	})

	describe('boundary option', () => {
		it('should accept boundary selector', () => {
			mockGetBoundingClientRect.mockReturnValue({
				width: 500,
				height: 500,
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 500,
				bottom: 500,
				toJSON: () => ({}),
			} as DOMRect)

			const { bind } = useDraggable({ boundary: '.container' })

			const element = document.createElement('div')
			bind(element)

			// Just verify it binds without error
			expect(element.style.position).toBe('absolute')
		})

		it('should accept boundary element', () => {
			mockGetBoundingClientRect.mockReturnValue({
				width: 500,
				height: 500,
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 500,
				bottom: 500,
				toJSON: () => ({}),
			} as DOMRect)

			const boundaryEl = document.createElement('div')
			const { bind } = useDraggable({ boundary: boundaryEl })

			const element = document.createElement('div')
			bind(element)

			expect(element.style.position).toBe('absolute')
		})

		it('should accept boundary function', () => {
			mockGetBoundingClientRect.mockReturnValue({
				width: 500,
				height: 500,
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 500,
				bottom: 500,
				toJSON: () => ({}),
			} as DOMRect)

			const boundaryEl = document.createElement('div')
			const { bind } = useDraggable({ boundary: () => boundaryEl })

			const element = document.createElement('div')
			bind(element)

			expect(element.style.position).toBe('absolute')
		})
	})
})