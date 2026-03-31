import { isBrowser } from '@directix/core'
import { computed, onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Scroll direction
 */
export type ScrollDirection = -1 | 0 | 1

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
	directionX: ScrollDirection
	/** Direction of vertical scroll (-1: up, 1: down, 0: none) */
	directionY: ScrollDirection
}

/**
 * Options for useScroll composable
 */
export interface UseScrollOptions {
	/**
	 * Throttle time in milliseconds
	 * @default 0 (no throttle)
	 */
	throttle?: number | Ref<number>

	/**
	 * Whether to use passive event listener
	 * @default true
	 */
	passive?: boolean
}

/**
 * Return type for useScroll composable
 */
export interface UseScrollReturn {
	/** Current scroll left position */
	scrollLeft: Readonly<Ref<number>>

	/** Current scroll top position */
	scrollTop: Readonly<Ref<number>>

	/** Horizontal scroll progress (0-1) */
	progressX: Readonly<Ref<number>>

	/** Vertical scroll progress (0-1) */
	progressY: Readonly<Ref<number>>

	/** Direction of horizontal scroll */
	directionX: Readonly<Ref<ScrollDirection>>

	/** Direction of vertical scroll */
	directionY: Readonly<Ref<ScrollDirection>>

	/** Whether the user is scrolling */
	isScrolling: Readonly<Ref<boolean>>

	/** Scroll info object (reactive) */
	info: Readonly<Ref<ScrollInfo>>

	/** Bind scroll listener to an element */
	bind: (element?: HTMLElement | Window) => () => void

	/** Stop listening */
	stop: () => void

	/** Scroll to a position */
	scrollTo: (options: { top?: number, left?: number, behavior?: 'auto' | 'smooth' }) => void
}

/**
 * Get scroll info from container
 */
function getScrollInfoFromContainer(
	container: Element | Window,
	lastScrollLeft: number,
	lastScrollTop: number,
): ScrollInfo {
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

	const directionX: ScrollDirection = scrollLeft !== lastScrollLeft ? (scrollLeft > lastScrollLeft ? 1 : -1) : 0
	const directionY: ScrollDirection = scrollTop !== lastScrollTop ? (scrollTop > lastScrollTop ? 1 : -1) : 0

	return {
		scrollLeft,
		scrollTop,
		scrollLeftMax,
		scrollTopMax,
		progressX,
		progressY,
		directionX,
		directionY,
	}
}

/**
 * Composable for tracking scroll position
 *
 * @param options - Configuration options
 * @returns Scroll utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useScroll } from 'directix'
 *
 * const container = ref(null)
 * const { scrollTop, progressY, directionY, bind } = useScroll()
 *
 * onMounted(() => bind(container.value))
 * </script>
 *
 * <template>
 *   <div ref="container" class="scroll-container">
 *     <div class="progress" :style="{ width: `${progressY * 100}%` }" />
 *   </div>
 * </template>
 * ```
 */
export function useScroll(options: UseScrollOptions = {}): UseScrollReturn {
	const { throttle = 0, passive = true } = options

	const scrollLeft = ref(0)
	const scrollTop = ref(0)
	const progressX = ref(0)
	const progressY = ref(0)
	const directionX = ref<ScrollDirection>(0)
	const directionY = ref<ScrollDirection>(0)
	const isScrolling = ref(false)

	let container: Element | Window | null = null,
		lastScrollLeft = 0,
		lastScrollTop = 0,
		scrollHandler: ((e: Event) => void) | null = null,
		throttleTimer: ReturnType<typeof setTimeout> | null = null,
		scrollTimeout: ReturnType<typeof setTimeout> | null = null

	const info = computed<ScrollInfo>(() => ({
		scrollLeft: scrollLeft.value,
		scrollTop: scrollTop.value,
		scrollLeftMax: 0,
		scrollTopMax: 0,
		progressX: progressX.value,
		progressY: progressY.value,
		directionX: directionX.value,
		directionY: directionY.value,
	}))

	function updateScrollInfo(_e: Event): void {
		if (!container) return

		const currentThrottle = unref(throttle)

		function doUpdate(): void {
			const scrollInfo = getScrollInfoFromContainer(container!, lastScrollLeft, lastScrollTop)

			scrollLeft.value = scrollInfo.scrollLeft
			scrollTop.value = scrollInfo.scrollTop
			progressX.value = scrollInfo.progressX
			progressY.value = scrollInfo.progressY
			directionX.value = scrollInfo.directionX
			directionY.value = scrollInfo.directionY

			lastScrollLeft = scrollInfo.scrollLeft
			lastScrollTop = scrollInfo.scrollTop

			isScrolling.value = true

			// Reset isScrolling after 150ms
			if (scrollTimeout) {
				clearTimeout(scrollTimeout)
			}
			scrollTimeout = setTimeout(() => {
				isScrolling.value = false
			}, 150)
		}

		if (currentThrottle && currentThrottle > 0) {
			if (!throttleTimer) {
				throttleTimer = setTimeout(() => {
					doUpdate()
					throttleTimer = null
				}, currentThrottle)
			}
		} else {
			doUpdate()
		}
	}

	function bind(element?: HTMLElement | Window): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		stop()

		if (element) {
			container = element
		} else {
			container = window
		}

		// Initialize values
		const initialInfo = getScrollInfoFromContainer(container, 0, 0)
		scrollLeft.value = initialInfo.scrollLeft
		scrollTop.value = initialInfo.scrollTop
		progressX.value = initialInfo.progressX
		progressY.value = initialInfo.progressY
		lastScrollLeft = initialInfo.scrollLeft
		lastScrollTop = initialInfo.scrollTop

		scrollHandler = updateScrollInfo
		container.addEventListener('scroll', scrollHandler, { passive })

		return stop
	}

	function stop(): void {
		if (container && scrollHandler) {
			container.removeEventListener('scroll', scrollHandler)
		}
		if (throttleTimer) {
			clearTimeout(throttleTimer)
			throttleTimer = null
		}
		if (scrollTimeout) {
			clearTimeout(scrollTimeout)
			scrollTimeout = null
		}
		container = null
		scrollHandler = null
	}

	function scrollTo(opts: { top?: number, left?: number, behavior?: 'auto' | 'smooth' }): void {
		if (!container) return

		const { top, left, behavior = 'smooth' } = opts

		if (container === window) {
			window.scrollTo({
				top,
				left,
				behavior,
			})
		} else {
			const el = container as Element
			if (top !== undefined) el.scrollTop = top
			if (left !== undefined) el.scrollLeft = left
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
	})

	return {
		scrollLeft: readonly(scrollLeft),
		scrollTop: readonly(scrollTop),
		progressX: readonly(progressX),
		progressY: readonly(progressY),
		directionX: readonly(directionX),
		directionY: readonly(directionY),
		isScrolling: readonly(isScrolling),
		info: readonly(info),
		bind,
		stop,
		scrollTo,
	}
}
