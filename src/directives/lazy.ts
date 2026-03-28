import { defineDirective, supportsIntersectionObserver } from '@directix/core'

/**
 * Lazy loading state
 */
export type LazyState = 'pending' | 'loading' | 'loaded' | 'error'

/**
 * Lazy directive options
 */
export interface LazyOptions {
	/**
	 * Image source URL
	 */
	src?: string

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

	/**
	 * Filter function, return false to skip loading
	 */
	filter?: (src: string) => boolean

	/**
	 * Custom IntersectionObserver
	 */
	observer?: IntersectionObserver

	/**
	 * Whether to disable lazy loading
	 * @default false
	 */
	disabled?: boolean
}

/**
 * Directive binding value type
 */
export type LazyBinding = string | LazyOptions

/**
 * Element state storage
 */
interface LazyElementState {
	options: LazyOptions
	attempt: number
	observer?: IntersectionObserver
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
					load(entry.target as HTMLElement)
					globalObserver?.unobserve(entry.target)
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
 * Set lazy state on element
 */
function setLazyState(el: HTMLElement, state: LazyState): void {
	el.dataset.lazyState = state
}

/**
 * Get lazy state from element
 */
function getLazyState(el: HTMLElement): LazyState {
	return (el.dataset.lazyState as LazyState) || 'pending'
}

/**
 * Load image
 */
function load(el: HTMLElement): void {
	const state: LazyElementState = (el as any).__lazy

	if (!state || !state.options.src) return

	// Filter check
	if (state.options.filter && !state.options.filter(state.options.src)) {
		return
	}

	setLazyState(el, 'loading')
	state.attempt++

	el.classList.add('v-lazy--loading')

	const img = new Image()

	img.onload = () => {
		setSrc(el, state.options.src!)
		setLazyState(el, 'loaded')
		el.classList.remove('v-lazy--loading')
		el.classList.add('v-lazy--loaded')
		state.options.onLoad?.(el)
	}

	img.onerror = () => {
		el.classList.remove('v-lazy--loading')

		// Check if should retry
		if (state.attempt < (state.options.attempt || 1)) {
			setTimeout(() => load(el), 1000 * state.attempt)

			return
		}

		// Show error image
		if (state.options.error) {
			setSrc(el, state.options.error)
		}

		setLazyState(el, 'error')
		el.classList.add('v-lazy--error')
		state.options.onError?.(el, new Error('Failed to load image'))
	}

	img.src = state.options.src
}

/**
 * Observe element
 */
function observe(el: HTMLElement): void {
	const state: LazyElementState = (el as any).__lazy

	if (!state) return

	// Check IntersectionObserver support
	if (!supportsIntersectionObserver()) {
		// Fallback: load directly
		load(el)

		return
	}

	// Use custom observer or global observer
	if (state.options.observer) {
		state.observer = state.options.observer
		state.observer.observe(el)
	} else {
		const observer = getGlobalObserver(state.options.preload || 0)

		state.observer = observer
		observer.observe(el)
	}
}

/**
 * Unobserve element
 */
function unobserve(el: HTMLElement): void {
	const state: LazyElementState = (el as any).__lazy

	if (!state) return

	if (state.observer) {
		state.observer.unobserve(el)
	} else if (globalObserver) {
		globalObserver.unobserve(el)
	}
}

/**
 * Normalize options
 */
function normalizeOptions(binding: LazyBinding | undefined): LazyOptions {
	if (typeof binding === 'string') {
		return { src: binding }
	}

	return binding || {}
}

/**
 * v-lazy directive
 *
 * @example
 * ```vue
 * <template>
 *   <img v-lazy="imageUrl" />
 *   <img v-lazy="{ src: imageUrl, placeholder: 'placeholder.jpg' }" />
 *   <div v-lazy="backgroundImageUrl"></div>
 * </template>
 * ```
 */
export const vLazy = defineDirective<LazyBinding, HTMLElement>({
	name: 'lazy',
	ssr: false,
	defaults: {
		preload: 0,
		attempt: 1,
		disabled: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		if (!options.src) {
			console.warn('[Directix] v-lazy: No source provided')

			return
		}

		// Set initial state
		setLazyState(el, 'pending')

		// Set placeholder
		if (options.placeholder) {
			setSrc(el, options.placeholder)
		}

		// Add class
		el.classList.add('v-lazy')

		// Store state
		const state: LazyElementState = {
			options,
			attempt: 0,
		}

		;(el as any).__lazy = state

		// Start observing
		observe(el)
	},

	updated(el, binding) {
		const state: LazyElementState = (el as any).__lazy

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		if (newOptions.disabled) {
			unobserve(el)

			return
		}

		if (newOptions.src !== state.options.src) {
			state.options = newOptions
			state.attempt = 0

			// If already loaded, reload
			if (getLazyState(el) !== 'pending') {
				setLazyState(el, 'pending')
				el.classList.remove('v-lazy--loaded', 'v-lazy--error')

				if (newOptions.placeholder) {
					setSrc(el, newOptions.placeholder)
				}

				observe(el)
			}
		}
	},

	unmounted(el) {
		unobserve(el)
		delete (el as any).__lazy
	},
})

export default vLazy
