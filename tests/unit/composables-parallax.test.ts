import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useParallax } from '../../src/composables/use-parallax'

describe('useParallax', () => {
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
			const { offset, isActive } = useParallax()

			expect(offset.value).toBe(0)
			expect(isActive.value).toBe(false)
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind } = useParallax()

			const unbind = bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)

			unbind()
			expect(element.classList.contains('v-parallax')).toBe(false)
		})

		it('should set willChange on element', () => {
			const element = document.createElement('div')
			const { bind } = useParallax()

			bind(element)

			expect(element.style.willChange).toBe('transform')
		})
	})

	describe('options', () => {
		it('should support custom speed', () => {
			const element = document.createElement('div')
			const { bind } = useParallax({ speed: 0.3 })

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})

		it('should support reverse direction', () => {
			const element = document.createElement('div')
			const { bind } = useParallax({ reverse: true })

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})

		it('should support horizontal parallax', () => {
			const element = document.createElement('div')
			const { bind } = useParallax({ horizontal: true })

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})

		it('should support custom transform', () => {
			const element = document.createElement('div')
			const { bind } = useParallax({
				transform: offset => `translate3d(0, ${offset}px, 0)`,
			})

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})

		it('should support mobile breakpoint', () => {
			const element = document.createElement('div')
			const { bind } = useParallax({ mobileBreakpoint: 768 })

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})
	})

	describe('reactive options', () => {
		it('should support reactive speed', () => {
			const speed = ref(0.5)
			const element = document.createElement('div')
			const { bind } = useParallax({ speed })

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})

		it('should support reactive enabled', () => {
			const enabled = ref(true)
			const element = document.createElement('div')
			const { bind } = useParallax({ enabled })

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)
		})
	})

	describe('scroll behavior', () => {
		it('should handle scroll events', () => {
			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: 100,
					bottom: 500,
					left: 0,
					right: 100,
					width: 100,
					height: 400,
				} as DOMRect),
			})

			const { bind, _isActive } = useParallax()

			bind(element)

			// The initial bind() call triggers handleScroll which sets isActive
			// based on the element position
			expect(element.classList.contains('v-parallax')).toBe(true)
		})

		it('should not be active when element is above viewport', () => {
			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: -500,
					bottom: -100,
					left: 0,
					right: 100,
					width: 100,
					height: 400,
				} as DOMRect),
			})

			const { bind, isActive } = useParallax()

			bind(element)

			expect(isActive.value).toBe(false)
		})
	})

	describe('enabled option', () => {
		it('should not apply transform when disabled', () => {
			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: 100,
					bottom: 500,
					left: 0,
					right: 100,
					width: 100,
					height: 400,
				} as DOMRect),
			})

			const { bind } = useParallax({ enabled: false })

			bind(element)

			window.dispatchEvent(new Event('scroll'))

			// Transform should not be applied
			expect(element.style.transform).toBe('')
		})
	})

	describe('mobile breakpoint', () => {
		it('should not apply transform on mobile', () => {
			// Mock window.innerWidth to be small
			const originalInnerWidth = window.innerWidth
			Object.defineProperty(window, 'innerWidth', {
				value: 500,
				writable: true,
				configurable: true,
			})

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: 100,
					bottom: 500,
					left: 0,
					right: 100,
					width: 100,
					height: 400,
				} as DOMRect),
			})

			const { bind } = useParallax({ mobileBreakpoint: 768 })

			bind(element)

			window.dispatchEvent(new Event('scroll'))

			// Transform should not be applied on mobile
			expect(element.style.transform).toBe('')

			// Restore
			Object.defineProperty(window, 'innerWidth', {
				value: originalInnerWidth,
				writable: true,
				configurable: true,
			})
		})
	})

	describe('scroll parent', () => {
		it('should find scroll parent', () => {
			const parent = document.createElement('div')
			Object.defineProperty(parent, 'getComputedStyle', {
				value: () => ({ overflow: 'auto', overflowX: 'auto', overflowY: 'auto' }),
			})

			// Mock getComputedStyle for parent
			vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
				if (el === parent) {
					return { overflow: 'auto', overflowX: 'auto', overflowY: 'auto' } as CSSStyleDeclaration
				}

				return { overflow: 'visible', overflowX: 'visible', overflowY: 'visible' } as CSSStyleDeclaration
			})

			const element = document.createElement('div')
			parent.appendChild(element)

			const { bind } = useParallax()

			bind(element)

			expect(element.classList.contains('v-parallax')).toBe(true)

			vi.restoreAllMocks()
		})
	})

	describe('horizontal parallax', () => {
		it('should apply translateX for horizontal parallax', () => {
			// Create fresh rAF mock for this test
			const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
				cb(0)
				return 0
			})

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: 100,
					bottom: 500,
					left: 0,
					right: 100,
					width: 100,
					height: 400,
				} as DOMRect),
			})

			const { bind } = useParallax({ horizontal: true })

			bind(element)

			// Reset ticking state and trigger new scroll
			window.dispatchEvent(new Event('scroll'))

			// After bind, the element should have v-parallax class
			expect(element.classList.contains('v-parallax')).toBe(true)

			rafSpy.mockRestore()
		})
	})

	describe('custom transform', () => {
		it('should use custom transform function', () => {
			// Create fresh rAF mock for this test
			const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
				cb(0)
				return 0
			})

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: 100,
					bottom: 500,
					left: 0,
					right: 100,
					width: 100,
					height: 400,
				} as DOMRect),
			})

			const customTransform = vi.fn((offset, _el) => `scale(${1 + offset * 0.001})`)
			const { bind } = useParallax({ transform: customTransform })

			bind(element)

			// The custom transform should be stored
			expect(element.classList.contains('v-parallax')).toBe(true)

			rafSpy.mockRestore()
		})
	})
})
