import { onUnmounted, ref, type Ref, unref } from 'vue'

/**
 * Pull refresh handler
 */
export type PullRefreshHandler = () => Promise<void> | void

/**
 * Pull refresh state
 */
export type PullRefreshState = 'idle' | 'pulling' | 'ready' | 'loading' | 'success' | 'error'

/**
 * Options for usePullRefresh composable
 */
export interface UsePullRefreshOptions {
	/**
	 * Refresh handler
	 * @required
	 */
	handler: PullRefreshHandler

	/**
	 * Distance threshold to trigger refresh
	 * @default 60
	 */
	distance?: number | Ref<number>

	/**
	 * Maximum pull distance
	 * @default 100
	 */
	maxDistance?: number | Ref<number>

	/**
	 * Whether to disable pull to refresh
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>

	/**
	 * Duration to show success indicator
	 * @default 500
	 */
	successDuration?: number | Ref<number>

	/**
	 * Duration to show error indicator
	 * @default 1000
	 */
	errorDuration?: number | Ref<number>
}

/**
 * Return type for usePullRefresh composable
 */
export interface UsePullRefreshReturn {
	/**
	 * Current pull refresh state
	 */
	state: Ref<PullRefreshState>

	/**
	 * Current pull distance
	 */
	distance: Ref<number>

	/**
	 * Whether pull to refresh is currently active
	 */
	isPulling: Ref<boolean>

	/**
	 * Event handlers to bind to the container element
	 */
	events: {
		touchstart: (e: TouchEvent) => void
		touchmove: (e: TouchEvent) => void
		touchend: () => void
	}

	/**
	 * Container ref to bind to the scroll container
	 */
	containerRef: Ref<HTMLElement | null>

	/**
	 * Manually trigger refresh
	 */
	refresh: () => Promise<void>
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Composable for pull to refresh functionality
 *
 * @param options - Configuration options
 * @returns Pull refresh utilities and state
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePullRefresh } from 'directix'
 *
 * const { state, distance, events, containerRef } = usePullRefresh({
 *   handler: async () => {
 *     await fetchData()
 *   },
 *   distance: 80
 * })
 * </script>
 *
 * <template>
 *   <div
 *     ref="containerRef"
 *     @touchstart="events.touchstart"
 *     @touchmove="events.touchmove"
 *     @touchend="events.touchend"
 *   >
 *     <div class="indicator" :style="{ transform: `translateY(${distance}px)` }">
 *       {{ state }}
 *     </div>
 *     <slot></slot>
 *   </div>
 * </template>
 * ```
 */
export function usePullRefresh(options: UsePullRefreshOptions): UsePullRefreshReturn {
	const {
		handler,
		distance = 60,
		maxDistance = 100,
		disabled = false,
		successDuration = 500,
		errorDuration = 1000,
	} = options

	// State
	const state = ref<PullRefreshState>('idle')
	const distanceValue = ref(0)
	const isPulling = ref(false)
	const containerRef = ref<HTMLElement | null>(null)

	// Internal state
	let startY = 0,
		currentY = 0

	const getDistance = (): number => unref(distance)
	const getMaxDistance = (): number => unref(maxDistance)
	const getDisabled = (): boolean => unref(disabled)
	const getSuccessDuration = (): number => unref(successDuration)
	const getErrorDuration = (): number => unref(errorDuration)

	/**
	 * Reset state
	 */
	function reset(): void {
		state.value = 'idle'
		distanceValue.value = 0
		isPulling.value = false
	}

	/**
	 * Trigger refresh
	 */
	async function refresh(): Promise<void> {
		state.value = 'loading'

		try {
			await handler()
			state.value = 'success'
			await sleep(getSuccessDuration())
		} catch {
			state.value = 'error'
			await sleep(getErrorDuration())
		} finally {
			reset()
		}
	}

	/**
	 * Handle touch start
	 */
	function touchstart(e: TouchEvent): void {
		if (getDisabled() || state.value === 'loading') return

		const container = containerRef.value
		if (container && container.scrollTop > 0) return

		isPulling.value = true
		startY = e.touches[0].clientY
		currentY = startY
		state.value = 'idle'
	}

	/**
	 * Handle touch move
	 */
	function touchmove(e: TouchEvent): void {
		if (!isPulling.value || getDisabled() || state.value === 'loading') return

		currentY = e.touches[0].clientY
		const diff = currentY - startY

		// Handle upward swipe - reset
		if (diff <= 0) {
			distanceValue.value = 0
			state.value = 'idle'
			return
		}

		// Prevent page scroll
		e.preventDefault()

		const calculatedDistance = Math.min(diff * 0.5, getMaxDistance())
		distanceValue.value = calculatedDistance

		const progress = calculatedDistance / getDistance()
		state.value = progress >= 1 ? 'ready' : 'pulling'
	}

	/**
	 * Handle touch end
	 */
	function touchend(): void {
		if (!isPulling.value || getDisabled()) return

		isPulling.value = false

		if (state.value === 'ready' && distanceValue.value >= getDistance()) {
			refresh()
		} else {
			distanceValue.value = 0
			reset()
		}
	}

	// Cleanup
	onUnmounted(() => {
		reset()
	})

	return {
		state,
		distance: distanceValue,
		isPulling,
		events: {
			touchstart,
			touchmove,
			touchend,
		},
		containerRef,
		refresh,
	}
}
