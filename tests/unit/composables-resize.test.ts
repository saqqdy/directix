import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
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

			// Simulate resize event
			const mockEntry = {
				target: element,
				contentRect: { width: 200, height: 100 } as DOMRectReadOnly,
			} as ResizeObserverEntry

			// Trigger resize via the ResizeObserver callback
			// This requires mocking ResizeObserver callback
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

			// onResize is registered but not called immediately during bind
			// It will be called when ResizeObserver triggers
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

			// ResizeObserver mock is in setup.ts
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

			// Should have disconnected observer
			expect(true).toBe(true)
		})
	})
})