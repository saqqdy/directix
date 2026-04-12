import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLazy } from '../../src/composables/use-lazy'

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
	observe: mockObserve,
	unobserve: mockUnobserve,
	disconnect: mockDisconnect,
})))

describe('useLazy', () => {
	let element: HTMLImageElement

	beforeEach(() => {
		vi.clearAllMocks()
		element = document.createElement('img')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with correct state', () => {
			const { state, isLoading, isLoaded, hasError } = useLazy()

			expect(state.value).toBe('pending')
			expect(isLoading.value).toBe(false)
			expect(isLoaded.value).toBe(false)
			expect(hasError.value).toBe(false)
		})

		it('should add lazy class on bind', () => {
			const { bind } = useLazy()

			bind(element)

			expect(element.classList.contains('v-lazy')).toBe(true)
		})

		it('should set placeholder on bind', () => {
			const { bind } = useLazy({ placeholder: '/placeholder.jpg' })

			bind(element)

			// The src attribute might be converted to absolute URL
			expect(element.src).toContain('placeholder.jpg')
		})

		it('should observe element for intersection', () => {
			const { bind } = useLazy()

			bind(element)

			expect(mockObserve).toHaveBeenCalledWith(element)
		})
	})

	describe('loading', () => {
		it('should load image on manual trigger', () => {
			const { bind, load } = useLazy({ src: '/image.jpg' })

			bind(element)
			load()

			expect(element.classList.contains('v-lazy--loading')).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should handle load error', async () => {
			const onError = vi.fn()
			const { bind, load, hasError, state } = useLazy({
				src: '/nonexistent.jpg',
				onError,
				attempt: 1, // Only try once
			})

			bind(element)

			// Mock failed image load
			const img = new Image()
			const originalImage = globalThis.Image
			globalThis.Image = vi.fn(() => img) as unknown as typeof Image

			load()

			// Simulate image error
			img.onerror?.({} as Event)

			expect(hasError.value).toBe(true)
			expect(state.value).toBe('error')
			expect(onError).toHaveBeenCalled()

			globalThis.Image = originalImage
		})

		it('should show error image on failure', () => {
			const errorSrc = '/error.jpg'
			const { bind, load } = useLazy({
				src: '/nonexistent.jpg',
				error: errorSrc,
				attempt: 1,
			})

			bind(element)

			const img = new Image()
			const originalImage = globalThis.Image
			globalThis.Image = vi.fn(() => img) as unknown as typeof Image

			load()
			img.onerror?.({} as Event)

			// The src attribute might be converted to absolute URL
			expect(element.src).toContain('error.jpg')

			globalThis.Image = originalImage
		})
	})

	describe('reset', () => {
		it('should reset state', () => {
			const { state, isLoaded, hasError, reset } = useLazy()

			reset()

			expect(state.value).toBe('pending')
			expect(isLoaded.value).toBe(false)
			expect(hasError.value).toBe(false)
		})
	})

	describe('unbind', () => {
		it('should unobserve element on unbind', () => {
			const { bind } = useLazy()

			const unbind = bind(element)
			unbind()

			expect(mockUnobserve).toHaveBeenCalled()
		})

		it('should remove classes on unbind', () => {
			const { bind } = useLazy()

			const unbind = bind(element)
			unbind()

			expect(element.classList.contains('v-lazy')).toBe(false)
		})
	})

	describe('background image', () => {
		it('should set background image on non-img elements', () => {
			const div = document.createElement('div')
			document.body.appendChild(div)

			const { bind, load } = useLazy({ src: '/image.jpg' })

			bind(div)

			const img = new Image()
			const originalImage = globalThis.Image
			globalThis.Image = vi.fn(() => img) as unknown as typeof Image

			load()
			img.onload?.({} as Event)

			expect(div.style.backgroundImage).toContain('image.jpg')

			globalThis.Image = originalImage
		})
	})
})
