import { defineDirective, isBrowser, supportsResizeObserver } from '@directix/core'

/**
 * Resize event handler
 */
export type ResizeHandler = (entry: ResizeObserverEntry) => void

/**
 * Resize information
 */
export interface ResizeInfo {
	/** New width */
	width: number
	/** New height */
	height: number
	/** Content rect */
	contentRect: DOMRectReadOnly
	/** Border box size */
	borderBoxSize: ReadonlyArray<ResizeObserverSize>
	/** Content box size */
	contentBoxSize: ReadonlyArray<ResizeObserverSize>
	/** Device pixel content box size */
	devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
}

/**
 * Resize directive options
 */
export interface ResizeOptions {
	/**
	 * Resize event handler
	 * @required
	 */
	handler: ResizeHandler

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Whether to use box model
	 * - 'content-box': size of content area
	 * - 'border-box': size of border box
	 * - 'device-pixel-content-box': size in device pixels
	 * @default 'content-box'
	 */
	box?: 'content-box' | 'border-box' | 'device-pixel-content-box'

	/**
	 * Debounce time in milliseconds
	 * @default 0 (no debounce)
	 */
	debounce?: number

	/**
	 * Callback for browsers without ResizeObserver (uses object fallback)
	 */
	onFallback?: (info: ResizeInfo) => void
}

/**
 * Directive binding value type
 */
export type ResizeBinding = ResizeHandler | ResizeOptions

/**
 * Element state storage
 */
interface ResizeState {
	options: ResizeOptions
	observer: ResizeObserver | null
	handler: (entry: ResizeObserverEntry) => void
	debounceTimer: ReturnType<typeof setTimeout> | null
	pendingEntry: ResizeObserverEntry | null
	fallbackIframe: HTMLIFrameElement | null
}

/**
 * Get resize info from entry
 */
function getResizeInfo(entry: ResizeObserverEntry): ResizeInfo {
	return {
		width: entry.contentRect.width,
		height: entry.contentRect.height,
		contentRect: entry.contentRect,
		borderBoxSize: entry.borderBoxSize,
		contentBoxSize: entry.contentBoxSize,
		devicePixelContentBoxSize: entry.devicePixelContentBoxSize,
	}
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ResizeBinding | undefined): ResizeOptions {
	if (typeof binding === 'function') {
		return { handler: binding }
	}

	if (!binding) {
		throw new Error('[Directix] v-resize: handler is required')
	}

	return {
		disabled: false,
		box: 'content-box',
		debounce: 0,
		...binding,
	}
}

/**
 * Create fallback resize detection using object
 */
function createFallbackResize(
	el: HTMLElement,
	callback: () => void,
): { iframe: HTMLIFrameElement; cleanup: () => void } {
	// Create an invisible iframe for resize detection
	const iframe = document.createElement('iframe')

	iframe.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    pointer-events: none;
    opacity: 0;
  `

	el.appendChild(iframe)

	const iWindow = iframe.contentWindow

	if (iWindow) {
		iWindow.addEventListener('resize', callback)
	}

	return {
		iframe,
		cleanup: () => {
			if (iWindow) {
				iWindow.removeEventListener('resize', callback)
			}

			iframe.remove()
		},
	}
}

/**
 * v-resize directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-resize="handleResize">Resize me</div>
 *   <div v-resize="{ handler: handleResize, debounce: 200 }">Debounced resize</div>
 * </template>
 * ```
 */
export const vResize = defineDirective<ResizeBinding, HTMLElement>({
	name: 'resize',
	ssr: false,
	defaults: {
		disabled: false,
		box: 'content-box',
		debounce: 0,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Ensure element has relative or absolute positioning for fallback
		const computedStyle = getComputedStyle(el)

		if (computedStyle.position === 'static') {
			el.style.position = 'relative'
		}

		const state: ResizeState = {
			options,
			observer: null,
			debounceTimer: null,
			pendingEntry: null,
			fallbackIframe: null,
			handler: (entry: ResizeObserverEntry) => {
				// Handle debounce
				if (options.debounce && options.debounce > 0) {
					state.pendingEntry = entry

					if (!state.debounceTimer) {
						state.debounceTimer = setTimeout(() => {
							if (state.pendingEntry) {
								options.handler(state.pendingEntry)
							}
							state.debounceTimer = null
							state.pendingEntry = null
						}, options.debounce)
					}
				} else {
					options.handler(entry)
				}
			},
		}

		// Store state
		;(el as any).__resize = state

		// Use ResizeObserver if available
		if (supportsResizeObserver()) {
			state.observer = new ResizeObserver(entries => {
				for (const entry of entries) {
					state.handler(entry)
				}
			})

			state.observer.observe(el, { box: options.box })
		} else {
			// Fallback using iframe
			console.warn('[Directix] v-resize: ResizeObserver not supported, using fallback')

			const { iframe, cleanup } = createFallbackResize(el, () => {
				const rect = el.getBoundingClientRect()
				const entry = {
					target: el,
					contentRect: rect as DOMRectReadOnly,
					borderBoxSize: [] as any,
					contentBoxSize: [] as any,
					devicePixelContentBoxSize: [] as any,
				}

				state.handler(entry as ResizeObserverEntry)

				if (options.onFallback) {
					options.onFallback(getResizeInfo(entry as ResizeObserverEntry))
				}
			})

			state.fallbackIframe = iframe
			;(el as any).__resizeCleanup = cleanup
		}
	},

	updated(el, binding) {
		const state: ResizeState = (el as any).__resize

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: ResizeState = (el as any).__resize

		if (!state) return

		// Clear debounce timer
		if (state.debounceTimer) {
			clearTimeout(state.debounceTimer)
		}

		// Disconnect observer
		if (state.observer) {
			state.observer.disconnect()
		}

		// Cleanup fallback
		const cleanup = (el as any).__resizeCleanup

		if (cleanup) {
			cleanup()
		}

		delete (el as any).__resize
		delete (el as any).__resizeCleanup
	},
})

export default vResize
