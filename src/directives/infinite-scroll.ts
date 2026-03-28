import { defineDirective, isBrowser, supportsIntersectionObserver } from '@directix/core'
import { getScrollParent, off, on } from '@directix/shared'

/**
 * Infinite scroll handler
 */
export type InfiniteScrollHandler = () => void | Promise<void>

/**
 * Infinite scroll directive options
 */
export interface InfiniteScrollOptions {
	/**
	 * Handler to call when scrolling to bottom
	 * @required
	 */
	handler: InfiniteScrollHandler

	/**
	 * Distance from bottom to trigger load (in pixels)
	 * @default 0
	 */
	distance?: number

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Whether currently loading
	 * @default false
	 */
	loading?: boolean

	/**
	 * Whether to use IntersectionObserver (more efficient)
	 * @default true
	 */
	useIntersection?: boolean

	/**
	 * Throttle time in milliseconds
	 * @default 200
	 */
	throttle?: number

	/**
	 * Custom scroll container
	 */
	container?: string | Element | null

	/**
	 * Callback when load starts
	 */
	onLoadStart?: () => void

	/**
	 * Callback when load completes
	 */
	onLoadEnd?: () => void

	/**
	 * Callback on error
	 */
	onError?: (error: Error) => void
}

/**
 * Directive binding value type
 */
export type InfiniteScrollBinding = InfiniteScrollHandler | InfiniteScrollOptions

/**
 * Element state storage
 */
interface InfiniteScrollState {
	options: InfiniteScrollOptions
	scrollHandler: (e: Event) => void
	container: Element | Window
	sentinel: HTMLDivElement | null
	observer: IntersectionObserver | null
	throttleTimer: ReturnType<typeof setTimeout> | null
	isLoading: boolean
}

/**
 * Normalize options
 */
function normalizeOptions(binding: InfiniteScrollBinding | undefined): InfiniteScrollOptions {
	if (typeof binding === 'function') {
		return { handler: binding, distance: 0, throttle: 200, useIntersection: true }
	}

	if (!binding) {
		throw new Error('[Directix] v-infinite-scroll: handler is required')
	}

	return {
		distance: 0,
		disabled: false,
		loading: false,
		useIntersection: true,
		throttle: 200,
		...binding,
	}
}

/**
 * v-infinite-scroll directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-infinite-scroll="loadMore" class="scroll-container">
 *     <div v-for="item in items" :key="item.id">{{ item.name }}</div>
 *   </div>
 *
 *   <div v-infinite-scroll="{ handler: loadMore, distance: 100, disabled: isLoading }">
 *     <div v-for="item in items" :key="item.id">{{ item.name }}</div>
 *   </div>
 * </template>
 * ```
 */
export const vInfiniteScroll = defineDirective<InfiniteScrollBinding, HTMLElement>({
	name: 'infinite-scroll',
	ssr: false,
	defaults: {
		distance: 0,
		disabled: false,
		loading: false,
		useIntersection: true,
		throttle: 200,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Determine scroll container
		let container: Element | Window

		if (options.container) {
			if (typeof options.container === 'string') {
				const found = document.querySelector(options.container)

				container = found || getScrollParent(el)
			} else {
				container = options.container
			}
		} else {
			container = getScrollParent(el)
		}

		const state: InfiniteScrollState = {
			options,
			container,
			sentinel: null,
			observer: null,
			throttleTimer: null,
			isLoading: false,
			scrollHandler: async (_e: Event) => {
				if (state.isLoading || state.options.disabled || state.options.loading) {
					return
				}

				// Throttle
				if (state.throttleTimer) {
					return
				}

				state.throttleTimer = setTimeout(() => {
					state.throttleTimer = null
				}, options.throttle)

				// Check scroll position
				const shouldLoad = checkShouldLoad(container, el, options.distance || 0)

				if (shouldLoad) {
					await triggerLoad(state, el)
				}
			},
		}

		// Store state
		;(el as any).__infiniteScroll = state

		// Use IntersectionObserver if available and enabled
		if (options.useIntersection && supportsIntersectionObserver()) {
			setupIntersectionObserver(el, state)
		} else {
			// Use scroll event listener
			on(container, 'scroll', state.scrollHandler, { passive: true })
		}
	},

	updated(el, binding) {
		const state: InfiniteScrollState = (el as any).__infiniteScroll

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: InfiniteScrollState = (el as any).__infiniteScroll

		if (!state) return

		// Clear throttle timer
		if (state.throttleTimer) {
			clearTimeout(state.throttleTimer)
		}

		// Disconnect observer
		if (state.observer) {
			state.observer.disconnect()
		}

		// Remove sentinel
		if (state.sentinel && state.sentinel.parentNode) {
			state.sentinel.parentNode.removeChild(state.sentinel)
		}

		// Remove scroll listener
		off(state.container, 'scroll', state.scrollHandler)

		delete (el as any).__infiniteScroll
	},
})

/**
 * Check if should load more
 */
function checkShouldLoad(container: Element | Window, _el: HTMLElement, distance: number): boolean {
	if (container === window) {
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const scrollHeight = document.documentElement.scrollHeight
		const clientHeight = window.innerHeight

		return scrollTop + clientHeight >= scrollHeight - distance
	}

	const el = container as Element
	const scrollTop = el.scrollTop
	const scrollHeight = el.scrollHeight
	const clientHeight = el.clientHeight

	return scrollTop + clientHeight >= scrollHeight - distance
}

/**
 * Trigger load handler
 */
async function triggerLoad(state: InfiniteScrollState, el: HTMLElement): Promise<void> {
	state.isLoading = true
	state.options.onLoadStart?.()

	el.classList.add('v-infinite-scroll--loading')

	try {
		await state.options.handler()
	} catch (err) {
		state.options.onError?.(err as Error)
	} finally {
		state.isLoading = false
		state.options.onLoadEnd?.()
		el.classList.remove('v-infinite-scroll--loading')
	}
}

/**
 * Setup IntersectionObserver
 */
function setupIntersectionObserver(el: HTMLElement, state: InfiniteScrollState): void {
	// Create sentinel element
	const sentinel = document.createElement('div')

	sentinel.className = 'v-infinite-scroll__sentinel'
	sentinel.style.cssText = `
    height: 1px;
    width: 100%;
    clear: both;
  `

	el.appendChild(sentinel)
	state.sentinel = sentinel

	// Create observer
	state.observer = new IntersectionObserver(
		async entries => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					if (!state.isLoading && !state.options.disabled && !state.options.loading) {
						await triggerLoad(state, el)
					}
				}
			}
		},
		{
			root: state.container === window ? null : (state.container as Element),
			rootMargin: `${state.options.distance || 0}px`,
			threshold: 0,
		},
	)

	state.observer.observe(sentinel)
}

export default vInfiniteScroll
