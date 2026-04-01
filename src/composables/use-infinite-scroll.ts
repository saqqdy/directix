import { isBrowser, supportsIntersectionObserver } from '@directix/core'
import { getScrollParent } from '@directix/shared'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Options for useInfiniteScroll composable
 */
export interface UseInfiniteScrollOptions {
	/**
	 * Callback to load more items
	 */
	onLoad: () => void | Promise<void>

	/**
	 * Whether loading is in progress
	 */
	loading?: boolean | Ref<boolean>

	/**
	 * Whether all items are loaded
	 */
	finished?: boolean | Ref<boolean>

	/**
	 * Distance from bottom to trigger load (in pixels)
	 * @default 0
	 */
	distance?: number | Ref<number>

	/**
	 * Whether to check immediately on mount
	 * @default true
	 */
	immediate?: boolean

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useInfiniteScroll composable
 */
export interface UseInfiniteScrollReturn {
	/** Whether loading is in progress */
	loading: Readonly<Ref<boolean>>

	/** Whether all items are loaded */
	finished: Readonly<Ref<boolean>>

	/** Manually trigger load */
	load: () => Promise<void>

	/** Bind infinite scroll to an element */
	bind: (element: HTMLElement) => () => void

	/** Stop observing */
	stop: () => void
}

/**
 * Composable for infinite scrolling
 *
 * @param options - Configuration options
 * @returns Infinite scroll utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useInfiniteScroll } from 'directix'
 *
 * const items = ref([])
 * const page = ref(1)
 *
 * const { bind, loading, finished } = useInfiniteScroll({
 *   onLoad: async () => {
 *     const newItems = await fetchItems(page.value++)
 *     items.value.push(...newItems)
 *     if (newItems.length === 0) finished.value = true
 *   }
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef" class="scroll-container">
 *     <div v-for="item in items" :key="item.id">{{ item.name }}</div>
 *     <div v-if="loading">Loading...</div>
 *   </div>
 * </template>
 * ```
 */
export function useInfiniteScroll(options: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
	const {
		onLoad,
		loading: externalLoading,
		finished: externalFinished,
		distance = 0,
		immediate = true,
		disabled = false,
	} = options

	const internalLoading = ref(false)
	const internalFinished = ref(false)

	const loading = externalLoading || internalLoading
	const finished = externalFinished || internalFinished

	let scrollContainer: Element | Window | null = null,
		scrollHandler: (() => void) | null = null,
		observer: IntersectionObserver | null = null,
		sentinel: HTMLDivElement | null = null

	async function load(): Promise<void> {
		if (unref(loading) || unref(finished) || unref(disabled)) return

		internalLoading.value = true
		try {
			await onLoad()
		} finally {
			internalLoading.value = false
		}
	}

	function checkScroll(): void {
		if (!scrollContainer || unref(loading) || unref(finished) || unref(disabled)) return

		const currentDistance = unref(distance)
		let scrollBottom: number,
			containerHeight: number

		if (scrollContainer === window) {
			scrollBottom = document.documentElement.scrollHeight - window.scrollY
			containerHeight = window.innerHeight
		} else {
			const el = scrollContainer as Element
			scrollBottom = el.scrollHeight - el.scrollTop
			containerHeight = el.clientHeight
		}

		if (scrollBottom <= containerHeight + currentDistance) {
			load()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		stop()

		// Store element reference
		// _currentElement is kept for potential future features

		// Check IntersectionObserver support
		if (supportsIntersectionObserver()) {
			// Create sentinel element
			sentinel = document.createElement('div')
			sentinel.style.cssText = 'height: 1px; width: 100%; visibility: hidden;'
			element.appendChild(sentinel)

			// Get scroll parent and validate it's a valid root for IntersectionObserver
			const parent = getScrollParent(element)
			// IntersectionObserver root must be Element or Document, not Window or null
			const root = parent instanceof Window ? null : (parent as Element | null)

			observer = new IntersectionObserver(
				entries => {
					if (entries[0].isIntersecting) {
						load()
					}
				},
				{
					root,
					rootMargin: `${unref(distance)}px`,
				},
			)

			observer.observe(sentinel)
		} else {
			// Fallback to scroll event
			scrollContainer = getScrollParent(element)
			scrollHandler = checkScroll
			scrollContainer.addEventListener('scroll', scrollHandler)
		}

		// Check immediately
		if (immediate) {
			load()
		}

		return stop
	}

	function stop(): void {
		if (observer) {
			observer.disconnect()
			observer = null
		}
		if (sentinel) {
			sentinel.remove()
			sentinel = null
		}
		if (scrollContainer && scrollHandler) {
			scrollContainer.removeEventListener('scroll', scrollHandler)
		}
		scrollContainer = null
		scrollHandler = null
		// element unbound
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
	})

	return {
		loading: readonly(loading as Ref<boolean>),
		finished: readonly(finished as Ref<boolean>),
		load,
		bind,
		stop,
	}
}
