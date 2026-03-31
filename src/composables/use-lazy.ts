import { isBrowser, supportsIntersectionObserver } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Lazy loading state
 */
export type LazyState = 'pending' | 'loading' | 'loaded' | 'error'

/**
 * Options for useLazy composable
 */
export interface UseLazyOptions {
	/**
	 * Image source URL
	 */
	src?: string | Ref<string>

	/**
	 * Placeholder image URL
	 */
	placeholder?: string

	/**
	 * Error image URL (shown when loading fails)
	 */
	error?: string

	/**
	 * Preload distance in pixels
	 * @default 0
	 */
	preload?: number

	/**
	 * Callback when image loads successfully
	 */
	onLoad?: (el: HTMLElement) => void

	/**
	 * Callback when image fails to load
	 */
	onError?: (el: HTMLElement, error: Error) => void

	/**
	 * Number of retry attempts
	 * @default 1
	 */
	attempt?: number
}

/**
 * Return type for useLazy composable
 */
export interface UseLazyReturn {
	/** Current loading state */
	state: Readonly<Ref<LazyState>>

	/** Whether the image is currently loading */
	isLoading: Readonly<Ref<boolean>>

	/** Whether the image has loaded successfully */
	isLoaded: Readonly<Ref<boolean>>

	/** Whether the image failed to load */
	hasError: Readonly<Ref<boolean>>

	/** Bind lazy loading to an element */
	bind: (element: HTMLElement) => () => void

	/** Manually trigger load */
	load: () => void

	/** Reset state */
	reset: () => void
}

// Global observer instance
let globalObserver: IntersectionObserver | null = null

/**
 * Get or create global IntersectionObserver
 */
function getGlobalObserver(preload: number): IntersectionObserver {
	if (globalObserver) return globalObserver

	globalObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const el = entry.target as HTMLElement
					const loadFn = (el as any).__lazyLoad
					if (loadFn) {
						loadFn()
						globalObserver?.unobserve(el)
					}
				}
			})
		},
		{
			rootMargin: `${preload}px`,
		},
	)

	return globalObserver
}

/**
 * Set image source on element
 */
function setSrc(el: HTMLElement, src: string): void {
	if (el.tagName === 'IMG') {
		;(el as HTMLImageElement).src = src
	} else {
		el.style.backgroundImage = `url("${src}")`
	}
}

/**
 * Composable for lazy loading images
 *
 * @param options - Configuration options
 * @returns Lazy loading utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useLazy } from 'directix'
 *
 * const imageRef = ref(null)
 * const { state, isLoading, bind } = useLazy({
 *   src: 'https://example.com/image.jpg',
 *   placeholder: '/placeholder.jpg'
 * })
 *
 * onMounted(() => bind(imageRef.value))
 * </script>
 *
 * <template>
 *   <img ref="imageRef" />
 * </template>
 * ```
 */
export function useLazy(options: UseLazyOptions = {}): UseLazyReturn {
	const {
		src,
		placeholder,
		error,
		preload = 0,
		onLoad,
		onError,
		attempt = 1,
	} = options

	const state = ref<LazyState>('pending')
	const isLoading = ref(false)
	const isLoaded = ref(false)
	const hasError = ref(false)

	let currentElement: HTMLElement | null = null,
		attemptCount = 0,
		observer: IntersectionObserver | null = null

	function loadImage(): void {
		const srcValue = unref(src)
		if (!srcValue || !currentElement) return

		if (state.value === 'loading') return

		state.value = 'loading'
		isLoading.value = true

		const img = new Image()

		img.onload = () => {
			setSrc(currentElement!, srcValue)
			state.value = 'loaded'
			isLoading.value = false
			isLoaded.value = true
			hasError.value = false
			currentElement?.classList.remove('v-lazy--loading')
			currentElement?.classList.add('v-lazy--loaded')
			onLoad?.(currentElement!)
		}

		img.onerror = () => {
			currentElement?.classList.remove('v-lazy--loading')

			// Check if should retry
			attemptCount++
			if (attemptCount < attempt) {
				setTimeout(() => loadImage(), 1000 * attemptCount)
				return
			}

			// Show error image
			if (error && currentElement) {
				setSrc(currentElement, error)
			}

			state.value = 'error'
			isLoading.value = false
			hasError.value = true
			currentElement?.classList.add('v-lazy--error')
			onError?.(currentElement!, new Error('Failed to load image'))
		}

		currentElement.classList.add('v-lazy--loading')
		img.src = srcValue
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element
		attemptCount = 0

		// Set initial state
		state.value = 'pending'
		element.classList.add('v-lazy')

		// Set placeholder
		if (placeholder) {
			setSrc(element, placeholder)
		}

		// Store load function for observer callback
		;(element as any).__lazyLoad = loadImage

		// Check IntersectionObserver support
		if (!supportsIntersectionObserver()) {
			// Fallback: load directly
			loadImage()
			return unbind
		}

		// Start observing
		observer = getGlobalObserver(preload)
		observer.observe(element)

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			if (observer) {
				observer.unobserve(currentElement)
			}
			delete (currentElement as any).__lazyLoad
			currentElement.classList.remove('v-lazy', 'v-lazy--loading', 'v-lazy--loaded', 'v-lazy--error')
		}
		currentElement = null
	}

	function reset(): void {
		state.value = 'pending'
		isLoading.value = false
		isLoaded.value = false
		hasError.value = false
		attemptCount = 0
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		state: readonly(state),
		isLoading: readonly(isLoading),
		isLoaded: readonly(isLoaded),
		hasError: readonly(hasError),
		bind,
		load: loadImage,
		reset,
	}
}
