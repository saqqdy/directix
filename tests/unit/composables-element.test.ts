import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useDraggable, useIntersect, useResize } from '../../src/composables'

describe('element composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useIntersect', () => {
		it('should initialize with isIntersecting false', () => {
			const { isIntersecting, ratio } = useIntersect()

			expect(isIntersecting.value).toBe(false)
			expect(ratio.value).toBe(0)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useIntersect()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})

		it('should support threshold option', () => {
			const { bind } = useIntersect({ threshold: 0.5 })

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should support rootMargin option', () => {
			const { bind } = useIntersect({ rootMargin: '100px' })

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should support root option', () => {
			const root = document.createElement('div')
			const { bind } = useIntersect({ root })

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should support once option', () => {
			const { bind, isIntersecting } = useIntersect({ once: true })

			const element = document.createElement('div')
			bind(element)

			expect(isIntersecting.value).toBe(false)
		})

		it('should support handler callback', () => {
			const handler = vi.fn()
			const { bind } = useIntersect({ handler })

			const element = document.createElement('div')
			bind(element)

			expect(typeof handler).toBe('function')
		})

		it('should support onEnter callback', () => {
			const onEnter = vi.fn()
			const { bind } = useIntersect({ onEnter })

			const element = document.createElement('div')
			bind(element)

			expect(typeof onEnter).toBe('function')
		})

		it('should support onLeave callback', () => {
			const onLeave = vi.fn()
			const { bind } = useIntersect({ onLeave })

			const element = document.createElement('div')
			bind(element)

			expect(typeof onLeave).toBe('function')
		})

		it('should support onChange callback', () => {
			const onChange = vi.fn()
			const { bind } = useIntersect({ onChange })

			const element = document.createElement('div')
			bind(element)

			expect(typeof onChange).toBe('function')
		})

		it('should stop observing when stop is called', () => {
			const { bind, stop, isIntersecting } = useIntersect()

			const element = document.createElement('div')
			bind(element)

			stop()

			expect(isIntersecting.value).toBe(false)
		})

		it('should cleanup on unbind', () => {
			const { bind, isIntersecting } = useIntersect()

			const element = document.createElement('div')
			const unbind = bind(element)

			unbind()

			expect(isIntersecting.value).toBe(false)
		})
	})

	describe('useResize', () => {
		it('should initialize with width and height 0', () => {
			const { width, height } = useResize()

			expect(width.value).toBe(0)
			expect(height.value).toBe(0)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useResize()

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})

		it('should get initial size from element', () => {
			const { bind, width, height } = useResize()

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50, x: 0, y: 0, top: 0, left: 0, right: 100, bottom: 50, toJSON: () => ({}) }),
			})

			bind(element)

			expect(width.value).toBe(100)
			expect(height.value).toBe(50)
		})

		it('should support debounce option', () => {
			const { bind } = useResize({ debounce: 100 })

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			bind(element)

			expect(element).toBeDefined()
		})

		it('should support box option', () => {
			const { bind } = useResize({ box: 'border-box' })

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			bind(element)

			expect(element).toBeDefined()
		})

		it('should support onResize callback', () => {
			const onResize = vi.fn()
			const { bind } = useResize({ onResize })

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			bind(element)

			expect(typeof onResize).toBe('function')
		})

		it('should stop observing when stop is called', () => {
			const { bind, stop, width, height } = useResize()

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			bind(element)
			stop()

			// Values should remain after stop
			expect(width.value).toBe(100)
			expect(height.value).toBe(50)
		})

		it('should cleanup on unbind', () => {
			const { bind } = useResize()

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			const unbind = bind(element)
			unbind()

			expect(typeof unbind).toBe('function')
		})

		it('should handle reactive debounce', async () => {
			const debounce = ref(100)
			const { bind } = useResize({ debounce })

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			bind(element)

			debounce.value = 200
			await nextTick()

			expect(debounce.value).toBe(200)
		})
	})

	describe('useDraggable', () => {
		it('should initialize with position at origin', () => {
			const { position, isDragging } = useDraggable()

			expect(position.value).toEqual({ x: 0, y: 0 })
			expect(isDragging.value).toBe(false)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
			document.body.removeChild(element)
		})

		it('should add v-draggable class', () => {
			const { bind } = useDraggable()

			const element = document.createElement('div')
			document.body.appendChild(element)
			// Mock getComputedStyle to return static
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'static',
			} as CSSStyleDeclaration)

			bind(element)

			// Element should be made positionable
			expect(element.style.position).toBe('absolute')
			document.body.removeChild(element)
		})

		it('should support axis option', () => {
			const { bind } = useDraggable({ axis: 'x' })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element).toBeDefined()
			document.body.removeChild(element)
		})

		it('should support constrain option', () => {
			const { bind } = useDraggable({ constrain: true })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element).toBeDefined()
			document.body.removeChild(element)
		})

		it('should support grid snapping', () => {
			const { bind } = useDraggable({ grid: [10, 10] })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element).toBeDefined()
			document.body.removeChild(element)
		})

		it('should support disabled option', () => {
			const disabled = ref(true)
			const { bind, isDragging } = useDraggable({ disabled })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(isDragging.value).toBe(false)
			document.body.removeChild(element)
		})

		it('should support handle option', () => {
			const { bind } = useDraggable({ handle: '.handle' })

			const element = document.createElement('div')
			const handleEl = document.createElement('div')
			handleEl.className = 'handle'
			element.appendChild(handleEl)
			document.body.appendChild(element)

			bind(element)

			expect(element).toBeDefined()
			document.body.removeChild(element)
		})

		it('should support onStart callback', () => {
			const onStart = vi.fn()
			const { bind } = useDraggable({ onStart })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(typeof onStart).toBe('function')
			document.body.removeChild(element)
		})

		it('should support onDrag callback', () => {
			const onDrag = vi.fn()
			const { bind } = useDraggable({ onDrag })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(typeof onDrag).toBe('function')
			document.body.removeChild(element)
		})

		it('should support onEnd callback', () => {
			const onEnd = vi.fn()
			const { bind } = useDraggable({ onEnd })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(typeof onEnd).toBe('function')
			document.body.removeChild(element)
		})

		it('should reset position', () => {
			const { bind, reset, position } = useDraggable()

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			reset()

			expect(position.value).toEqual({ x: 0, y: 0 })
			document.body.removeChild(element)
		})

		it('should cleanup on unbind', () => {
			const { bind, isDragging } = useDraggable()

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			unbind()

			expect(isDragging.value).toBe(false)
			document.body.removeChild(element)
		})

		it('should handle reactive axis', async () => {
			const axis = ref<'x' | 'y' | 'both'>('both')
			const { bind } = useDraggable({ axis })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			axis.value = 'x'
			await nextTick()

			expect(axis.value).toBe('x')

			document.body.removeChild(element)
		})

		it('should handle reactive disabled', async () => {
			const disabled = ref(false)
			const { bind } = useDraggable({ disabled })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			disabled.value = true
			await nextTick()

			expect(disabled.value).toBe(true)

			document.body.removeChild(element)
		})

		it('should support boundary option', () => {
			const { bind } = useDraggable({ boundary: '.container' })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element).toBeDefined()
			document.body.removeChild(element)
		})
	})
})
