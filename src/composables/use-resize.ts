import { isBrowser, supportsResizeObserver } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

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
}

/**
 * Options for useResize composable
 */
export interface UseResizeOptions {
	/**
	 * Debounce time in milliseconds
	 * @default 0 (no debounce)
	 */
	debounce?: number | Ref<number>

	/**
	 * Box model to observe
	 * @default 'content-box'
	 */
	box?: 'content-box' | 'border-box' | 'device-pixel-content-box'

	/**
	 * Callback when resize occurs
	 */
	onResize?: (info: ResizeInfo) => void
}

/**
 * Return type for useResize composable
 */
export interface UseResizeReturn {
	/** Current width */
	width: Readonly<Ref<number>>

	/** Current height */
	height: Readonly<Ref<number>>

	/** Bind resize observer to an element */
	bind: (element: HTMLElement) => () => void

	/** Stop observing */
	stop: () => void
}

/**
 * Composable for tracking element resize
 *
 * @param options - Configuration options
 * @returns Resize utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useResize } from 'directix'
 *
 * const target = ref(null)
 * const { width, height, bind } = useResize({
 *   debounce: 100,
 *   onResize: (info) => console.log('Resized:', info.width, info.height)
 * })
 *
 * onMounted(() => bind(target.value))
 * </script>
 *
 * <template>
 *   <div ref="target">
 *     Size: {{ width }} x {{ height }}
 *   </div>
 * </template>
 * ```
 */
export function useResize(options: UseResizeOptions = {}): UseResizeReturn {
	const {
		debounce = 0,
		box = 'content-box',
		onResize,
	} = options

	const width = ref(0)
	const height = ref(0)

	let observer: ResizeObserver | null = null,
		debounceTimer: ReturnType<typeof setTimeout> | null = null,
		fallbackIframe: HTMLIFrameElement | null = null

	function handleResize(entry: ResizeObserverEntry): void {
		const currentDebounce = unref(debounce)

		function doUpdate(): void {
			width.value = entry.contentRect.width
			height.value = entry.contentRect.height
			onResize?.({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
				contentRect: entry.contentRect,
			})
		}

		if (currentDebounce && currentDebounce > 0) {
			if (debounceTimer) {
				clearTimeout(debounceTimer)
			}
			debounceTimer = setTimeout(doUpdate, currentDebounce)
		} else {
			doUpdate()
		}
	}

	function createObserver(): void {
		if (!isBrowser()) return

		if (supportsResizeObserver()) {
			observer = new ResizeObserver(entries => {
				for (const entry of entries) {
					handleResize(entry)
				}
			})
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		stop()

		// Initialize with current size
		const rect = element.getBoundingClientRect()
		width.value = rect.width
		height.value = rect.height

		if (supportsResizeObserver()) {
			createObserver()
			observer?.observe(element, { box })
		} else {
			// Fallback using iframe
			fallbackIframe = document.createElement('iframe')
			fallbackIframe.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        pointer-events: none;
        opacity: 0;
      `

			// Ensure parent has position
			const computedStyle = getComputedStyle(element)
			if (computedStyle.position === 'static') {
				element.style.position = 'relative'
			}

			element.appendChild(fallbackIframe)

			const iWindow = fallbackIframe.contentWindow
			if (iWindow) {
				iWindow.addEventListener('resize', () => {
					const rect = element.getBoundingClientRect()
					handleResize({
						target: element,
						contentRect: rect as DOMRectReadOnly,
						borderBoxSize: [] as any,
						contentBoxSize: [] as any,
						devicePixelContentBoxSize: [] as any,
					} as ResizeObserverEntry)
				})
			}
		}

		return stop
	}

	function stop(): void {
		if (observer) {
			observer.disconnect()
			observer = null
		}
		if (fallbackIframe) {
			fallbackIframe.remove()
			fallbackIframe = null
		}
		if (debounceTimer) {
			clearTimeout(debounceTimer)
			debounceTimer = null
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
	})

	return {
		width: readonly(width),
		height: readonly(height),
		bind,
		stop,
	}
}
