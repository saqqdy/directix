import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useInfiniteScroll } from '../../src/composables/use-infinite-scroll'

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

describe('useInfiniteScroll', () => {
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
			const onLoad = vi.fn()
			const { loading, finished } = useInfiniteScroll({ onLoad })

			expect(loading.value).toBe(false)
			expect(finished.value).toBe(false)
		})

		it('should not call onLoad when immediate is false', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({ onLoad, immediate: false })

			bind(element)

			expect(onLoad).not.toHaveBeenCalled()
		})

		it('should create sentinel element', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({ onLoad })

			bind(element)

			const sentinel = element.querySelector('div')
			expect(sentinel).not.toBeNull()
		})
	})

	describe('finished state', () => {
		it('should not load when finished', async () => {
			const onLoad = vi.fn()
			const finished = ref(true)
			const { bind, load } = useInfiniteScroll({ onLoad, finished, immediate: false })

			bind(element)
			await load()

			expect(onLoad).not.toHaveBeenCalled()
		})
	})

	describe('disabled option', () => {
		it('should not load when disabled', async () => {
			const onLoad = vi.fn()
			const disabled = ref(true)
			const { bind, load } = useInfiniteScroll({ onLoad, disabled, immediate: false })

			bind(element)
			await load()

			expect(onLoad).not.toHaveBeenCalled()
		})
	})

	describe('manual load', () => {
		it('should manually trigger load', async () => {
			const onLoad = vi.fn()
			const { bind, load } = useInfiniteScroll({ onLoad, immediate: false })

			bind(element)
			await load()

			expect(onLoad).toHaveBeenCalled()
		})
	})

	describe('stop', () => {
		it('should stop observing', () => {
			const onLoad = vi.fn()
			const { bind, stop } = useInfiniteScroll({ onLoad })

			bind(element)
			stop()

			expect(mockDisconnect).toHaveBeenCalled()
		})

		it('should return unbind function', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({ onLoad })

			const unbind = bind(element)
			unbind()

			expect(mockDisconnect).toHaveBeenCalled()
		})
	})

	describe('IntersectionObserver', () => {
		it('should create observer with correct options', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({
				onLoad,
				distance: 100,
			})

			bind(element)

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({
					rootMargin: '100px',
				}),
			)
		})
	})
})
