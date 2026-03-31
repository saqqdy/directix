import { onUnmounted, ref, type Ref, unref } from 'vue'

/**
 * Click delay handler
 */
export type ClickDelayHandler = (event: MouseEvent | TouchEvent) => void

/**
 * Options for useClickDelay composable
 */
export interface UseClickDelayOptions {
	/**
	 * Click handler
	 * @required
	 */
	handler: ClickDelayHandler

	/**
	 * Delay time in milliseconds
	 * @default 300
	 */
	delay?: number | Ref<number>

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useClickDelay composable
 */
export interface UseClickDelayReturn {
	/**
	 * Whether a click is pending
	 */
	isPending: Ref<boolean>

	/**
	 * Trigger the click handler with delay protection
	 */
	click: (event: MouseEvent | TouchEvent) => void

	/**
	 * Manually reset the pending state
	 */
	reset: () => void

	/**
	 * Cancel any pending timeout
	 */
	cancel: () => void
}

/**
 * Composable for preventing repeated clicks within a delay period
 *
 * @param options - Configuration options
 * @returns Click delay utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { useClickDelay } from 'directix'
 *
 * const { click, isPending } = useClickDelay({
 *   handler: async (event) => {
 *     await submitForm()
 *   },
 *   delay: 500
 * })
 * </script>
 *
 * <template>
 *   <button @click="click" :disabled="isPending">
 *     {{ isPending ? 'Processing...' : 'Submit' }}
 *   </button>
 * </template>
 * ```
 */
export function useClickDelay(options: UseClickDelayOptions): UseClickDelayReturn {
	const {
		handler,
		delay = 300,
		disabled = false,
	} = options

	// State
	const isPending = ref(false)

	// Internal state
	let timeoutId: ReturnType<typeof setTimeout> | null = null

	const getDelay = (): number => unref(delay)
	const getDisabled = (): boolean => unref(disabled)

	/**
	 * Trigger the click handler
	 */
	function click(event: MouseEvent | TouchEvent): void {
		if (getDisabled() || isPending.value) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		// Mark as pending
		isPending.value = true

		// Call handler
		handler(event)

		// Set timeout to reset pending state
		timeoutId = setTimeout(() => {
			isPending.value = false
			timeoutId = null
		}, getDelay())
	}

	/**
	 * Reset the pending state immediately
	 */
	function reset(): void {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		isPending.value = false
	}

	/**
	 * Cancel any pending timeout without resetting state
	 */
	function cancel(): void {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
		cancel()
	})

	return {
		isPending,
		click,
		reset,
		cancel,
	}
}

/**
 * Create a debounced click handler
 *
 * @param handler - Click handler
 * @param delay - Delay in milliseconds
 * @returns Debounced click handler
 *
 * @example
 * ```ts
 * import { createDelayedClick } from 'directix'
 *
 * const delayedSubmit = createDelayedClick(submitForm, 1000)
 *
 * // Use in event handler
 * button.onclick = delayedSubmit
 * ```
 */
export function createDelayedClick(
	handler: ClickDelayHandler,
	delay: number = 300,
): (event: MouseEvent | TouchEvent) => void {
	let isPending = false

	return (event: MouseEvent | TouchEvent) => {
		if (isPending) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		isPending = true
		handler(event)

		setTimeout(() => {
			isPending = false
		}, delay)
	}
}
