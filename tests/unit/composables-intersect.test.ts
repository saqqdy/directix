import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIntersect } from '../../src/composables/use-intersect'

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
const mockUnobserve = vi.fn()
const mockIntersectionObserver = vi.fn(() => ({
	observe: mockObserve,
	disconnect: mockDisconnect,
	unobserve: mockUnobserve,
}))

window.IntersectionObserver = mockIntersectionObserver

describe('useIntersect', () => {
	let element: HTMLElement

	beforeEach(() => {
		vi.clearAllMocks()
		element = document.createElement('div')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with correct state', () => {
			const { isIntersecting, ratio } = useIntersect()

			expect(isIntersecting.value).toBe(false)
			expect(ratio.value).toBe(0)
		})

		it('should create observer on bind', () => {
			const { bind } = useIntersect()

			bind(element)

			expect(mockIntersectionObserver).toHaveBeenCalled()
			expect(mockObserve).toHaveBeenCalledWith(element)
		})

		it('should disconnect observer on unbind', () => {
			const { bind } = useIntersect()

			const unbind = bind(element)
			unbind()

			expect(mockDisconnect).toHaveBeenCalled()
		})
	})

	describe('callbacks', () => {
		it('should call handler on intersection', () => {
			const handler = vi.fn()
			const { bind } = useIntersect({ handler })

			bind(element)

			// Get the callback passed to IntersectionObserver
			const callback = mockIntersectionObserver.mock.calls[0][0]

			// Simulate intersection
			const entry = { isIntersecting: true, intersectionRatio: 0.5 }
			callback([entry])

			expect(handler).toHaveBeenCalledWith(entry, expect.any(Object))
		})

		it('should call onEnter when intersecting', () => {
			const onEnter = vi.fn()
			const { bind } = useIntersect({ onEnter })

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]
			const entry = { isIntersecting: true, intersectionRatio: 0.5 }
			callback([entry])

			expect(onEnter).toHaveBeenCalled()
		})

		it('should call onLeave when not intersecting', () => {
			const onLeave = vi.fn()
			const { bind } = useIntersect({ onLeave })

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]
			const entry = { isIntersecting: false, intersectionRatio: 0 }
			callback([entry])

			expect(onLeave).toHaveBeenCalled()
		})

		it('should call onChange with isIntersecting value', () => {
			const onChange = vi.fn()
			const { bind } = useIntersect({ onChange })

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]
			const entry = { isIntersecting: true, intersectionRatio: 0.5 }
			callback([entry])

			expect(onChange).toHaveBeenCalledWith(true, entry)
		})
	})

	describe('state updates', () => {
		it('should update isIntersecting', () => {
			const { isIntersecting, bind } = useIntersect()

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]
			callback([{ isIntersecting: true, intersectionRatio: 0.5 }])

			expect(isIntersecting.value).toBe(true)
		})

		it('should update ratio', () => {
			const { ratio, bind } = useIntersect()

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]
			callback([{ isIntersecting: true, intersectionRatio: 0.75 }])

			expect(ratio.value).toBe(0.75)
		})
	})

	describe('observer options', () => {
		it('should pass threshold to observer', () => {
			const { bind } = useIntersect({ threshold: 0.5 })

			bind(element)

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ threshold: 0.5 }),
			)
		})

		it('should pass rootMargin to observer', () => {
			const { bind } = useIntersect({ rootMargin: '10px' })

			bind(element)

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ rootMargin: '10px' }),
			)
		})

		it('should pass root to observer', () => {
			const root = document.createElement('div')
			const { bind } = useIntersect({ root })

			bind(element)

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ root }),
			)
		})
	})

	describe('once option', () => {
		it('should only trigger once when once is true', () => {
			const onEnter = vi.fn()
			const { bind } = useIntersect({ onEnter, once: true })

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]

			// First trigger
			callback([{ isIntersecting: true, intersectionRatio: 0.5 }])
			expect(onEnter).toHaveBeenCalledTimes(1)

			// Second trigger should be ignored
			callback([{ isIntersecting: false, intersectionRatio: 0 }])
			callback([{ isIntersecting: true, intersectionRatio: 0.5 }])
			expect(onEnter).toHaveBeenCalledTimes(1)
		})
	})

	describe('stop', () => {
		it('should stop observing', () => {
			const { bind, stop } = useIntersect()

			bind(element)
			stop()

			expect(mockDisconnect).toHaveBeenCalled()
		})

		it('should reset state on stop', () => {
			const { isIntersecting, ratio, bind, stop } = useIntersect()

			bind(element)

			const callback = mockIntersectionObserver.mock.calls[0][0]
			callback([{ isIntersecting: true, intersectionRatio: 0.5 }])

			expect(isIntersecting.value).toBe(true)

			stop()

			expect(isIntersecting.value).toBe(false)
			expect(ratio.value).toBe(0)
		})
	})
})
