import { throttle } from '@directix/shared'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Options for useThrottle composable
 */
export interface UseThrottleOptions<T extends (...args: any[]) => any> {
	/**
	 * Function to throttle
	 */
	handler: T

	/**
	 * Delay time in milliseconds
	 * @default 300
	 */
	wait?: number | Ref<number>

	/**
	 * Whether to invoke immediately before delay starts
	 * @default true
	 */
	leading?: boolean | Ref<boolean>

	/**
	 * Whether to invoke after delay ends
	 * @default true
	 */
	trailing?: boolean | Ref<boolean>
}

/**
 * Throttled function type for composables
 */
export interface ComposableThrottledFunction<T extends (...args: any[]) => any> {
	/**
	 * Call the throttled function
	 */
	(...args: Parameters<T>): void

	/**
	 * Cancel any pending execution
	 */
	cancel: () => void
}

/**
 * Return type for useThrottle composable
 */
export interface UseThrottleReturn<T extends (...args: any[]) => any> {
	/**
	 * Throttled function
	 */
	run: (...args: Parameters<T>) => void

	/**
	 * Cancel any pending execution
	 */
	cancel: () => void
}

/**
 * Composable for throttling function calls
 *
 * @param options - Configuration options
 * @returns Throttled function utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useThrottle } from 'directix'
 *
 * const { run: throttledScroll } = useThrottle({
 *   handler: (event) => {
 *     console.log('Scroll position:', event.target.scrollTop)
 *   },
 *   wait: 100
 * })
 *
 * // Use in template
 * // <div @scroll="throttledScroll($event)">...</div>
 * </script>
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
	options: UseThrottleOptions<T>,
): UseThrottleReturn<T> {
	const {
		handler,
		wait = 300,
		leading = true,
		trailing = true,
	} = options

	// Internal state
	let timerId: ReturnType<typeof setTimeout> | null = null,
		lastArgs: Parameters<T> | null = null,
		lastThis: any = null,
		lastCallTime = 0

	const getWait = (): number => unref(wait)
	const getLeading = (): boolean => unref(leading)
	const getTrailing = (): boolean => unref(trailing)

	const invokeFunc = (): void => {
		if (lastArgs) {
			handler.apply(lastThis, lastArgs)
			lastArgs = null
			lastThis = null
		}
	}

	function run(this: any, ...args: Parameters<T>): void {
		const now = Date.now()
		const currentWait = getWait()

		if (!lastCallTime && !getLeading()) {
			lastCallTime = now
		}

		const remaining = currentWait - (now - lastCallTime)

		lastArgs = args
		// eslint-disable-next-line ts/no-this-alias
		lastThis = this

		if (remaining <= 0 || remaining > currentWait) {
			if (timerId) {
				clearTimeout(timerId)
				timerId = null
			}
			lastCallTime = now
			invokeFunc()
		} else if (!timerId && getTrailing()) {
			timerId = setTimeout(() => {
				lastCallTime = getLeading() ? Date.now() : 0
				timerId = null
				invokeFunc()
			}, remaining)
		}
	}

	function cancel(): void {
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
		lastCallTime = 0
		lastArgs = null
		lastThis = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		cancel()
	})

	return {
		run,
		cancel,
	}
}

/**
 * Simple throttle function wrapper
 *
 * @param fn - Function to throttle
 * @param wait - Delay in milliseconds
 * @returns Throttled function with cancel method
 *
 * @example
 * ```ts
 * import { throttleFn } from 'directix'
 *
 * const throttledUpdate = throttleFn(updateData, 1000)
 *
 * // Call multiple times, only executes once per second
 * throttledUpdate(data)
 * throttledUpdate(newData)
 *
 * // Cancel pending execution
 * throttledUpdate.cancel()
 * ```
 */
export function throttleFn<T extends (...args: any[]) => any>(
	fn: T,
	wait: number = 300,
	options?: {
		leading?: boolean
		trailing?: boolean
	},
): ComposableThrottledFunction<T> {
	return throttle(fn, wait, options) as ComposableThrottledFunction<T>
}
