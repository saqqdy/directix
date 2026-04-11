import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
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
				transform: (offset) => `translate3d(0, ${offset}px, 0)`,
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
})
