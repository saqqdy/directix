import { isBrowser, supportsMutationObserver } from '@directix/core'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Mutation change handler
 */
export type MutationHandler = (mutations: MutationRecord[], observer: MutationObserver) => void

/**
 * Options for useMutation composable
 */
export interface UseMutationOptions {
	/**
	 * Callback when mutations occur
	 * @required
	 */
	handler: MutationHandler

	/**
	 * Whether to observe attribute changes
	 * @default false
	 */
	attributes?: boolean

	/**
	 * Specific attributes to observe
	 */
	attributeFilter?: string[]

	/**
	 * Whether to observe child node additions/removals
	 * @default true
	 */
	childList?: boolean

	/**
	 * Whether to observe all descendants, not just direct children
	 * @default false
	 */
	subtree?: boolean

	/**
	 * Whether to observe character data changes
	 * @default false
	 */
	characterData?: boolean

	/**
	 * Whether to record old attribute values
	 * @default false
	 */
	attributeOldValue?: boolean

	/**
	 * Whether to record old character data
	 * @default false
	 */
	characterDataOldValue?: boolean

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useMutation composable
 */
export interface UseMutationReturn {
	/** Bind mutation observer to an element */
	bind: (element: HTMLElement) => () => void

	/** Stop observing */
	stop: () => void

	/** Start observing */
	start: () => void
}

/**
 * Composable for observing DOM mutations
 *
 * @param options - Configuration options
 * @returns Mutation observer utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useMutation } from 'directix'
 *
 * const containerRef = ref(null)
 * const { bind } = useMutation({
 *   handler: (mutations) => {
 *     mutations.forEach(mutation => {
 *       console.log('Type:', mutation.type)
 *       console.log('Target:', mutation.target)
 *     })
 *   },
 *   childList: true,
 *   subtree: true
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     Content to observe
 *   </div>
 * </template>
 * ```
 */
export function useMutation(options: UseMutationOptions): UseMutationReturn {
	const {
		handler,
		attributes = false,
		attributeFilter,
		childList = true,
		subtree = false,
		characterData = false,
		attributeOldValue = false,
		characterDataOldValue = false,
		disabled = false,
	} = options

	let currentElement: HTMLElement | null = null,
		observer: MutationObserver | null = null

	function createObserver(): MutationObserver | null {
		if (!isBrowser() || !supportsMutationObserver()) {
			console.warn('[Directix] useMutation: MutationObserver not supported')
			return null
		}

		return new MutationObserver((mutations, obs) => {
			if (unref(disabled)) return
			handler(mutations, obs)
		})
	}

	function start(): void {
		if (!currentElement || !observer || unref(disabled)) return

		observer.observe(currentElement, {
			attributes,
			attributeFilter,
			childList,
			subtree,
			characterData,
			attributeOldValue,
			characterDataOldValue,
		})
	}

	function stop(): void {
		if (observer) {
			observer.disconnect()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		stop()

		currentElement = element
		observer = createObserver()

		if (observer && !unref(disabled)) {
			start()
		}

		return stop
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
		observer = null
		currentElement = null
	})

	return {
		bind,
		stop,
		start,
	}
}
