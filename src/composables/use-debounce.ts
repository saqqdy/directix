import { debounce } from '@directix/shared'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Options for useDebounce composable
 */
export interface UseDebounceOptions<T extends (...args: any[]) => any> {
	/**
	 * Function to debounce
	 */
	handler: T

	/**
	 * Delay time in milliseconds
	 * @default 300
	 */
	wait?: number | Ref<number>

	/**
	 * Whether to invoke immediately before delay starts
	 * @default false
	 */
	leading?: boolean | Ref<boolean>

	/**
	 * Whether to invoke after delay ends
	 * @default true
	 */
	trailing?: boolean | Ref<boolean>
}

/**
 * Debounced function type for composables
 */
export interface ComposableDebouncedFunction<T extends (...args: any[]) => any> {
	/**
	 * Call the debounced function
	 */
	(...args: Parameters<T>): void

	/**
	 * Cancel any pending execution
	 */
	cancel: () => void

	/**
	 * Immediately invoke if pending
	 */
	flush: () => void

	/**
	 * Check if there is a pending execution
	 */
	pending: () => boolean
}

/**
 * Return type for useDebounce composable
 */
export interface UseDebounceReturn<T extends (...args: any[]) => any> {
	/**
	 * Debounced function
	 */
	run: (...args: Parameters<T>) => void

	/**
	 * Cancel any pending execution
	 */
	cancel: () => void

	/**
	 * Immediately invoke if pending
	 */
	flush: () => void

	/**
	 * Check if there is a pending execution
	 */
	pending: () => boolean
}

/**
 * Composable for debouncing function calls
 *
 * @param options - Configuration options
 * @returns Debounced function utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useDebounce } from 'directix'
 *
 * const searchQuery = ref('')
 *
 * const { run: debouncedSearch } = useDebounce({
 *   handler: (query: string) => {
 *     console.log('Searching:', query)
 *   },
 *   wait: 500
 * })
 *
 * // Watch and debounce
 * watch(searchQuery, (query) => {
 *   debouncedSearch(query)
 * })
 * </script>
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
	options: UseDebounceOptions<T>,
): UseDebounceReturn<T> {
	const {
		handler,
		wait = 300,
		leading = false,
		trailing = true,
	} = options

	// Internal state
	let timerId: ReturnType<typeof setTimeout> | null = null,
		lastArgs: Parameters<T> | null = null,
		lastThis: any = null

	const invokeFunc = (): void => {
		if (lastArgs) {
			handler.apply(lastThis, lastArgs)
			lastArgs = null
			lastThis = null
		}
	}

	const getWait = (): number => unref(wait)
	const getLeading = (): boolean => unref(leading)
	const getTrailing = (): boolean => unref(trailing)

	function run(this: any, ...args: Parameters<T>): void {
		lastArgs = args
		// eslint-disable-next-line ts/no-this-alias
		lastThis = this

		if (timerId) {
			clearTimeout(timerId)
		}

		if (getLeading() && !timerId) {
			invokeFunc()
		}

		timerId = setTimeout(() => {
			if (getTrailing()) {
				invokeFunc()
			}
			timerId = null
		}, getWait())
	}

	function cancel(): void {
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
		lastArgs = null
		lastThis = null
	}

	function flush(): void {
		if (timerId) {
			clearTimeout(timerId)
			invokeFunc()
			timerId = null
		}
	}

	function pending(): boolean {
		return timerId !== null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		cancel()
	})

	return {
		run,
		cancel,
		flush,
		pending,
	}
}

/**
 * Simple debounce function wrapper
 *
 * @param fn - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function with cancel method
 *
 * @example
 * ```ts
 * import { debounceFn } from 'directix'
 *
 * const debouncedSave = debounceFn(saveData, 1000)
 *
 * // Call multiple times, only executes once after 1s
 * debouncedSave(data)
 * debouncedSave(newData)
 *
 * // Cancel pending execution
 * debouncedSave.cancel()
 * ```
 */
export function debounceFn<T extends (...args: any[]) => any>(
	fn: T,
	wait: number = 300,
	options?: {
		leading?: boolean
		trailing?: boolean
	},
): ComposableDebouncedFunction<T> {
	return debounce(fn, wait, options) as ComposableDebouncedFunction<T>
}
