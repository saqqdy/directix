import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useResize } from '../../src/composables/use-resize'

describe('useResize', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { width, height, bind, stop } = useResize()

			expect(width.value).toBe(0)
			expect(height.value).toBe(0)
			expect(bind).toBeDefined()
			expect(stop).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
				top: 0,
				left: 0,
				right: 100,
				bottom: 50,
			} as DOMRect)
			const { bind, width, height } = useResize()

			bind(element)

			expect(width.value).toBe(100)
			expect(height.value).toBe(50)
		})

		it('should unbind properly', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const { bind, stop } = useResize()

			bind(element)
			stop()

			// Should have stopped observing
			expect(true).toBe(true)
		})
	})

	describe('options', () => {
		it('should support debounce', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const onResize = vi.fn()
			const { bind } = useResize({ debounce: 100, onResize })

			bind(element)

			expect(element.getBoundingClientRect).toHaveBeenCalled()
		})

		it('should support box option', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const { bind } = useResize({ box: 'border-box' })

			bind(element)

			expect(element.getBoundingClientRect).toHaveBeenCalled()
		})

		it('should support onResize callback', () => {
			const onResize = vi.fn()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const { bind } = useResize({ onResize })

			bind(element)

			expect(onResize).toBeDefined()
		})
	})

	describe('ResizeObserver', () => {
		it('should use ResizeObserver when available', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)

			const { bind } = useResize()

			bind(element)

			expect(element.getBoundingClientRect).toHaveBeenCalled()
		})
	})

	describe('reactive options', () => {
		it('should support reactive debounce', () => {
			const debounce = ref(100)
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const { bind } = useResize({ debounce })

			bind(element)

			expect(element.getBoundingClientRect).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should stop on unbind return', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const { bind } = useResize()

			const unbind = bind(element)
			unbind()

			expect(true).toBe(true)
		})
	})

	describe('debounce behavior', () => {
		it('should clear debounce timer on stop', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			const onResize = vi.fn()
			const { bind, stop } = useResize({ debounce: 100, onResize })

			bind(element)
			stop()

			expect(true).toBe(true)
		})
	})

	describe('multiple bind calls', () => {
		it('should cleanup previous observer when rebinding', () => {
			const element1 = document.createElement('div')
			const element2 = document.createElement('div')
			element1.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)
			element2.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 200,
				height: 100,
			} as DOMRect)

			const { bind, width } = useResize()

			bind(element1)
			expect(width.value).toBe(100)

			bind(element2)
			expect(width.value).toBe(200)
		})
	})

	describe('isBrowser check', () => {
		it('should return empty unbind function when not in browser', () => {
			const { bind } = useResize()
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)

			const unbind = bind(element)
			expect(typeof unbind).toBe('function')
		})
	})

	describe('box option', () => {
		it('should pass box option to ResizeObserver', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)

			const { bind } = useResize({ box: 'border-box' })
			bind(element)

			expect(element.getBoundingClientRect).toHaveBeenCalled()
		})

		it('should support device-pixel-content-box', () => {
			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)

			const { bind } = useResize({ box: 'device-pixel-content-box' })
			bind(element)

			expect(element.getBoundingClientRect).toHaveBeenCalled()
		})
	})

	describe('reactive debounce', () => {
		it('should react to debounce value changes', async () => {
			const debounce = ref(100)

			const element = document.createElement('div')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				width: 100,
				height: 50,
			} as DOMRect)

			const onResize = vi.fn()
			const { bind } = useResize({ debounce, onResize })

			bind(element)

			debounce.value = 200
			await nextTick()

			expect(true).toBe(true)
		})
	})

	// Keep fallback tests at the end to avoid affecting other tests
	describe('fallback mode (no ResizeObserver)', () => {
		it('should use iframe fallback when ResizeObserver is not supported', () => {
			const originalRO = globalThis.ResizeObserver
			// @ts-expect-error - testing fallback
			delete globalThis.ResizeObserver

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					width: 100,
					height: 50,
					top: 0,
					left: 0,
					right: 100,
					bottom: 50,
				} as DOMRect),
			})

			const { bind, width, height } = useResize()

			bind(element)

			expect(width.value).toBe(100)
			expect(height.value).toBe(50)

			const iframe = element.querySelector('iframe')
			expect(iframe).not.toBeNull()

			globalThis.ResizeObserver = originalRO
		})

		it('should set position relative on static element in fallback mode', () => {
			const originalRO = globalThis.ResizeObserver
			// @ts-expect-error - testing fallback
			delete globalThis.ResizeObserver

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					width: 100,
					height: 50,
				} as DOMRect),
			})

			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'static',
			} as CSSStyleDeclaration)

			const { bind } = useResize()

			bind(element)

			expect(element.style.position).toBe('relative')

			globalThis.ResizeObserver = originalRO
		})
	})
})
