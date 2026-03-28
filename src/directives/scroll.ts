import { defineDirective, isBrowser } from '@directix/core'
import { getScrollParent, off, on } from '@directix/shared'

/**
 * Scroll event handler
 */
export type ScrollHandler = (event: Event, info: ScrollInfo) => void

/**
 * Scroll information
 */
export interface ScrollInfo {
	/** Current scroll left position */
	scrollLeft: number
	/** Current scroll top position */
	scrollTop: number
	/** Maximum scroll left */
	scrollLeftMax: number
	/** Maximum scroll top */
	scrollTopMax: number
	/** Horizontal scroll progress (0-1) */
	progressX: number
	/** Vertical scroll progress (0-1) */
	progressY: number
	/** Direction of horizontal scroll (-1: left, 1: right, 0: none) */
	directionX: -1 | 0 | 1
	/** Direction of vertical scroll (-1: up, 1: down, 0: none) */
	directionY: -1 | 0 | 1
	/** Scroll container element or window */
	container: Element | Window
}

/**
 * Scroll directive options
 */
export interface ScrollOptions {
	/**
	 * Scroll event handler
	 * @required
	 */
	handler: ScrollHandler

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Whether to use passive event listener
	 * @default true
	 */
	passive?: boolean

	/**
	 * Throttle time in milliseconds
	 * @default 0 (no throttle)
	 */
	throttle?: number

	/**
	 * Custom scroll container selector or element
	 */
	container?: string | Element | Window | null
}

/**
 * Directive binding value type
 */
export type ScrollBinding = ScrollHandler | ScrollOptions

/**
 * Element state storage
 */
interface ScrollState {
	options: ScrollOptions
	scrollHandler: (e: Event) => void
	container: Element | Window
	lastScrollLeft: number
	lastScrollTop: number
	throttleTimer: ReturnType<typeof setTimeout> | null
	pendingEvent: Event | null
}

/**
 * Get scroll info
 */
function getScrollInfo(container: Element | Window, lastScrollLeft: number, lastScrollTop: number): ScrollInfo {
	let scrollLeft = 0,
		scrollTop = 0,
		scrollLeftMax = 0,
		scrollTopMax = 0

	if (container === window) {
		scrollLeft = window.scrollX || document.documentElement.scrollLeft
		scrollTop = window.scrollY || document.documentElement.scrollTop
		scrollLeftMax = document.documentElement.scrollWidth - window.innerWidth
		scrollTopMax = document.documentElement.scrollHeight - window.innerHeight
	} else {
		const el = container as Element

		scrollLeft = el.scrollLeft
		scrollTop = el.scrollTop
		scrollLeftMax = el.scrollWidth - el.clientWidth
		scrollTopMax = el.scrollHeight - el.clientHeight
	}

	const progressX = scrollLeftMax > 0 ? scrollLeft / scrollLeftMax : 0
	const progressY = scrollTopMax > 0 ? scrollTop / scrollTopMax : 0

	// Calculate direction
	const directionX: -1 | 0 | 1 = scrollLeft !== lastScrollLeft ? (scrollLeft > lastScrollLeft ? 1 : -1) : 0
	const directionY: -1 | 0 | 1 = scrollTop !== lastScrollTop ? (scrollTop > lastScrollTop ? 1 : -1) : 0

	return {
		scrollLeft,
		scrollTop,
		scrollLeftMax,
		scrollTopMax,
		progressX,
		progressY,
		directionX,
		directionY,
		container,
	}
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ScrollBinding | undefined): ScrollOptions {
	if (typeof binding === 'function') {
		return { handler: binding, passive: true }
	}

	if (!binding) {
		throw new Error('[Directix] v-scroll: handler is required')
	}

	return {
		passive: true,
		throttle: 0,
		disabled: false,
		...binding,
	}
}

/**
 * v-scroll directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-scroll="handleScroll">Scroll container</div>
 *   <div v-scroll="{ handler: handleScroll, throttle: 100 }">Throttled scroll</div>
 * </template>
 * ```
 */
export const vScroll = defineDirective<ScrollBinding, HTMLElement>({
	name: 'scroll',
	ssr: false,
	defaults: {
		passive: true,
		throttle: 0,
		disabled: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Determine scroll container
		let container: Element | Window

		if (options.container) {
			if (options.container === window) {
				container = window
			} else if (typeof options.container === 'string') {
				const found = document.querySelector(options.container)

				container = found || getScrollParent(el)
			} else {
				container = options.container
			}
		} else {
			// Check if element itself is scrollable
			const { overflow, overflowX, overflowY } = getComputedStyle(el)
			const isSelfScrollable = /(auto|scroll)/.test(overflow + overflowX + overflowY)

			container = isSelfScrollable ? el : getScrollParent(el)
		}

		const state: ScrollState = {
			options,
			container,
			lastScrollLeft: 0,
			lastScrollTop: 0,
			throttleTimer: null,
			pendingEvent: null,
			scrollHandler: (e: Event) => {
				// Handle throttle
				if (options.throttle && options.throttle > 0) {
					state.pendingEvent = e

					if (!state.throttleTimer) {
						state.throttleTimer = setTimeout(() => {
							if (state.pendingEvent) {
								const info = getScrollInfo(container, state.lastScrollLeft, state.lastScrollTop)

								state.lastScrollLeft = info.scrollLeft
								state.lastScrollTop = info.scrollTop
								options.handler(state.pendingEvent, info)
							}
							state.throttleTimer = null
							state.pendingEvent = null
						}, options.throttle)
					}
				} else {
					const info = getScrollInfo(container, state.lastScrollLeft, state.lastScrollTop)

					state.lastScrollLeft = info.scrollLeft
					state.lastScrollTop = info.scrollTop
					options.handler(e, info)
				}
			},
		}

		// Initialize last scroll position
		const initialInfo = getScrollInfo(container, 0, 0)

		state.lastScrollLeft = initialInfo.scrollLeft
		state.lastScrollTop = initialInfo.scrollTop

		// Store state
		;(el as any).__scroll = state

		// Bind scroll event
		on(container, 'scroll', state.scrollHandler, { passive: options.passive })
	},

	updated(el, binding) {
		const state: ScrollState = (el as any).__scroll

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: ScrollState = (el as any).__scroll

		if (!state) return

		// Clear throttle timer
		if (state.throttleTimer) {
			clearTimeout(state.throttleTimer)
		}

		// Unbind scroll event
		off(state.container, 'scroll', state.scrollHandler)

		delete (el as any).__scroll
	},
})

export default vScroll
