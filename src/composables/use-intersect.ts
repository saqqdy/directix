import { isBrowser, supportsIntersectionObserver } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Intersect event handler
 */
export type IntersectHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void

/**
 * Options for useIntersect composable
 */
export interface UseIntersectOptions {
	/**
	 * Callback when element intersects
	 */
	handler?: IntersectHandler

	/**
	 * Callback when element enters viewport
	 */
	onEnter?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void

	/**
	 * Callback when element leaves viewport
	 */
	onLeave?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void

	/**
	 * Callback when element changes intersection
	 */
	onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void

	/**
	 * Root element for intersection
	 * @default null (viewport)
	 */
	root?: Element | null | Ref<Element | null>

	/**
	 * Margin around the root
	 * @default '0px'
	 */
	rootMargin?: string

	/**
	 * Threshold(s) at which to trigger callback
	 * @default 0
	 */
	threshold?: number | number[]

	/**
	 * Whether to trigger only once
	 * @default false
	 */
	once?: boolean
}

/**
 * Return type for useIntersect composable
 */
export interface UseIntersectReturn {
	/**
	 * Whether the element is currently intersecting
	 */
	isIntersecting: Readonly<Ref<boolean>>

	/**
	 * Current intersection ratio
	 */
	ratio: Readonly<Ref<number>>

	/**
	 * Bind intersection observer to an element
	 */
	bind: (element: HTMLElement) => () => void

	/**
	 * Stop observing
	 */
	stop: () => void
}

/**
 * Composable for detecting element intersection with viewport
 *
 * @param options - Configuration options
 * @returns Intersection utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useIntersect } from 'directix'
 *
 * const target = ref(null)
 * const { isIntersecting, bind } = useIntersect({
 *   threshold: 0.5,
 *   onEnter: () => console.log('Entered'),
 *   onLeave: () => console.log('Left')
 * })
 *
 * onMounted(() => bind(target.value))
 * </script>
 *
 * <template>
 *   <div ref="target" :class="{ visible: isIntersecting }">
 *     I'm visible!
 *   </div>
 * </template>
 * ```
 */
export function useIntersect(options: UseIntersectOptions = {}): UseIntersectReturn {
	const {
		handler,
		onEnter,
		onLeave,
		onChange,
		root = null,
		rootMargin = '0px',
		threshold = 0,
		once = false,
	} = options

	const isIntersecting = ref(false)
	const ratio = ref(0)

	let observer: IntersectionObserver | null = null,
		hasTriggeredOnce = false

	function createObserver(): IntersectionObserver | null {
		if (!isBrowser() || !supportsIntersectionObserver()) {
			console.warn('[Directix] useIntersect: IntersectionObserver not supported')
			return null
		}

		return new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (once && hasTriggeredOnce) continue

					const intersecting = entry.isIntersecting

					isIntersecting.value = intersecting
					ratio.value = entry.intersectionRatio

					handler?.(entry, observer!)
					onChange?.(intersecting, entry)

					if (intersecting) {
						onEnter?.(entry, observer!)
						if (once) hasTriggeredOnce = true
					} else {
						onLeave?.(entry, observer!)
					}
				}
			},
			{
				root: unref(root),
				rootMargin,
				threshold,
			},
		)
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		stop()

		observer = createObserver()

		if (observer) {
			observer.observe(element)
		}

		return stop
	}

	function stop(): void {
		if (observer) {
			observer.disconnect()
			observer = null
		}
		isIntersecting.value = false
		ratio.value = 0
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
	})

	return {
		isIntersecting: readonly(isIntersecting),
		ratio: readonly(ratio),
		bind,
		stop,
	}
}
