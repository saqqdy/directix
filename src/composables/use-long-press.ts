import { isBrowser } from '@directix/core'
import { getDistance, getEventPosition } from '@directix/shared'
import { onUnmounted, ref, type Ref, unref } from 'vue'

/**
 * Options for useLongPress composable
 */
export interface UseLongPressOptions {
	/**
	 * Duration in milliseconds to trigger long press
	 * @default 500
	 */
	duration?: number | Ref<number>

	/**
	 * Maximum movement distance before canceling
	 * @default 10
	 */
	distance?: number | Ref<number>

	/**
	 * Callback when long press starts (on mousedown/touchstart)
	 */
	onStart?: (event: MouseEvent | TouchEvent) => void

	/**
	 * Callback when long press is triggered
	 */
	onTrigger?: (event: MouseEvent | TouchEvent) => void

	/**
	 * Callback when long press is canceled
	 */
	onCancel?: (event: MouseEvent | TouchEvent) => void

	/**
	 * Callback on each tick during long press
	 */
	onTick?: (remaining: number) => void

	/**
	 * Interval for onTick callback in milliseconds
	 * @default 100
	 */
	tickInterval?: number

	/**
	 * Whether to prevent default behavior
	 * @default true
	 */
	prevent?: boolean
}

/**
 * Return type for useLongPress composable
 */
export interface UseLongPressReturn {
	/**
	 * Whether a long press is currently in progress
	 */
	isPressing: Readonly<Ref<boolean>>

	/**
	 * Start long press detection
	 */
	start: (event: MouseEvent | TouchEvent) => void

	/**
	 * Stop long press detection
	 */
	stop: (event: MouseEvent | TouchEvent) => void

	/**
	 * Bind events to an element
	 */
	bind: (element: HTMLElement) => () => void
}

/**
 * Composable for detecting long press gestures
 *
 * @param options - Configuration options
 * @returns Long press utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { useLongPress } from 'directix'
 *
 * const { bind, isPressing } = useLongPress({
 *   onTrigger: (event) => {
 *     console.log('Long press triggered!')
 *   },
 *   duration: 800
 * })
 *
 * // Bind to element
 * const buttonRef = ref()
 * onMounted(() => {
 *   const unbind = bind(buttonRef.value)
 *   onUnmounted(unbind)
 * })
 * </script>
 *
 * <template>
 *   <button ref="buttonRef">Long Press Me</button>
 * </template>
 * ```
 */
export function useLongPress(options: UseLongPressOptions = {}): UseLongPressReturn {
	const {
		duration = 500,
		distance = 10,
		onStart,
		onTrigger,
		onCancel,
		onTick,
		tickInterval = 100,
		prevent = true,
	} = options

	const isPressing = ref(false)

	let timerId: ReturnType<typeof setTimeout> | null = null,
		tickTimerId: ReturnType<typeof setInterval> | null = null,
		startPos = { x: 0, y: 0 },
		startPosSet = false

	function start(event: MouseEvent | TouchEvent): void {
		if (!isBrowser()) return

		// Prevent default
		if (prevent) {
			event.preventDefault()
		}

		// Clear any existing timers
		clearTimers()

		// Store start position
		const pos = getEventPosition(event)
		startPos = { x: pos.x, y: pos.y }
		startPosSet = true
		isPressing.value = true

		// Trigger start callback
		onStart?.(event)

		// Start tick timer
		if (onTick) {
			let remaining = unref(duration)
			tickTimerId = setInterval(() => {
				remaining -= tickInterval
				onTick?.(Math.max(0, remaining))
			}, tickInterval)
		}

		// Start long press timer
		timerId = setTimeout(() => {
			clearTimers()
			isPressing.value = false
			onTrigger?.(event)
		}, unref(duration))
	}

	function stop(event: MouseEvent | TouchEvent): void {
		if (!isPressing.value) return

		clearTimers()
		startPosSet = false
		isPressing.value = false
		onCancel?.(event)
	}

	function handleMove(event: MouseEvent | TouchEvent): void {
		if (!isPressing.value || !startPosSet) return

		const pos = getEventPosition(event)
		const dist = getDistance(startPos, { x: pos.x, y: pos.y })

		if (dist > unref(distance)) {
			stop(event)
		}
	}

	function clearTimers(): void {
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
		if (tickTimerId) {
			clearInterval(tickTimerId)
			tickTimerId = null
		}
	}

	function bind(element: HTMLElement): () => void {
		// Mouse events
		element.addEventListener('mousedown', start)
		element.addEventListener('mouseup', stop)
		element.addEventListener('mouseleave', stop)
		element.addEventListener('mousemove', handleMove)

		// Touch events
		element.addEventListener('touchstart', start, { passive: !prevent })
		element.addEventListener('touchend', stop)
		element.addEventListener('touchcancel', stop)
		element.addEventListener('touchmove', handleMove, { passive: true })

		// Return unbind function
		return () => {
			element.removeEventListener('mousedown', start)
			element.removeEventListener('mouseup', stop)
			element.removeEventListener('mouseleave', stop)
			element.removeEventListener('mousemove', handleMove)
			element.removeEventListener('touchstart', start)
			element.removeEventListener('touchend', stop)
			element.removeEventListener('touchcancel', stop)
			element.removeEventListener('touchmove', handleMove)
			clearTimers()
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
		clearTimers()
	})

	return {
		isPressing,
		start,
		stop,
		bind,
	}
}
