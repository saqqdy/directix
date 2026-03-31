import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Swipe direction
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

/**
 * Swipe handler type
 */
export type SwipeHandler = (direction: SwipeDirection, event: Event) => void

/**
 * Options for useSwipe composable
 */
export interface UseSwipeOptions {
	/**
	 * Swipe handler
	 */
	handler?: SwipeHandler

	/**
	 * Minimum distance to trigger swipe
	 * @default 30
	 */
	threshold?: number | Ref<number>

	/**
	 * Maximum time for swipe
	 * @default 500
	 */
	maxTime?: number | Ref<number>

	/**
	 * Allowed directions
	 * @default ['left', 'right', 'up', 'down']
	 */
	directions?: SwipeDirection[]

	/**
	 * Whether to prevent scroll on swipe
	 * @default true
	 */
	preventScrollOnSwipe?: boolean

	/**
	 * Whether to enable mouse events
	 * @default true
	 */
	mouse?: boolean

	/**
	 * Callback for left swipe
	 */
	onLeft?: () => void

	/**
	 * Callback for right swipe
	 */
	onRight?: () => void

	/**
	 * Callback for up swipe
	 */
	onUp?: () => void

	/**
	 * Callback for down swipe
	 */
	onDown?: () => void
}

/**
 * Return type for useSwipe composable
 */
export interface UseSwipeReturn {
	/** Current swipe direction */
	direction: Readonly<Ref<SwipeDirection | null>>

	/** Length of the swipe */
	lengthX: Readonly<Ref<number>>

	/** Length of the swipe */
	lengthY: Readonly<Ref<number>>

	/** Whether a swipe is being performed */
	isSwiping: Readonly<Ref<boolean>>

	/** Bind swipe detection to an element */
	bind: (element: HTMLElement) => () => void
}

const DEFAULT_DIRECTIONS: SwipeDirection[] = ['left', 'right', 'up', 'down']

/**
 * Get swipe direction from delta
 */
function getSwipeDirection(
	deltaX: number,
	deltaY: number,
	allowedDirections: SwipeDirection[],
): SwipeDirection | null {
	const absX = Math.abs(deltaX)
	const absY = Math.abs(deltaY)

	if (absX > absY) {
		const direction = deltaX > 0 ? 'right' : 'left'
		return allowedDirections.includes(direction) ? direction : null
	} else {
		const direction = deltaY > 0 ? 'down' : 'up'
		return allowedDirections.includes(direction) ? direction : null
	}
}

/**
 * Composable for detecting swipe gestures
 *
 * @param options - Configuration options
 * @returns Swipe utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useSwipe } from 'directix'
 *
 * const container = ref(null)
 * const { direction, bind } = useSwipe({
 *   onLeft: () => nextSlide(),
 *   onRight: () => prevSlide()
 * })
 *
 * onMounted(() => bind(container.value))
 * </script>
 *
 * <template>
 *   <div ref="container">
 *     Swipe me!
 *   </div>
 * </template>
 * ```
 */
export function useSwipe(options: UseSwipeOptions = {}): UseSwipeReturn {
	const {
		handler,
		threshold = 30,
		maxTime = 500,
		directions = DEFAULT_DIRECTIONS,
		preventScrollOnSwipe = true,
		mouse = true,
		onLeft,
		onRight,
		onUp,
		onDown,
	} = options

	const direction = ref<SwipeDirection | null>(null)
	const lengthX = ref(0)
	const lengthY = ref(0)
	const isSwiping = ref(false)

	let currentElement: HTMLElement | null = null,
		startX = 0,
		startY = 0,
		startTime = 0

	function triggerSwipe(deltaX: number, deltaY: number, deltaTime: number, event: Event): void {
		const currentThreshold = unref(threshold)
		const currentMaxTime = unref(maxTime)

		// Check time
		if (deltaTime > currentMaxTime) return

		// Check distance
		const distance = Math.max(Math.abs(deltaX), Math.abs(deltaY))
		if (distance < currentThreshold) return

		// Get direction
		const swipeDirection = getSwipeDirection(deltaX, deltaY, directions)
		if (!swipeDirection) return

		direction.value = swipeDirection
		lengthX.value = deltaX
		lengthY.value = deltaY

		// Prevent scroll
		if (preventScrollOnSwipe && event.cancelable) {
			event.preventDefault()
		}

		// Call handler
		handler?.(swipeDirection, event)

		// Direction-specific callbacks
		const callbacks: Record<SwipeDirection, (() => void) | undefined> = {
			left: onLeft,
			right: onRight,
			up: onUp,
			down: onDown,
		}
		callbacks[swipeDirection]?.()

		// Dispatch custom event
		currentElement?.dispatchEvent(new CustomEvent('swipe', {
			detail: { direction: swipeDirection, deltaX, deltaY, deltaTime },
		}))
	}

	function handleStart(clientX: number, clientY: number): void {
		startX = clientX
		startY = clientY
		startTime = Date.now()
		isSwiping.value = true
		direction.value = null
		lengthX.value = 0
		lengthY.value = 0
	}

	function handleEnd(clientX: number, clientY: number, event: Event): void {
		if (!isSwiping.value) return

		isSwiping.value = false
		const deltaX = clientX - startX
		const deltaY = clientY - startY
		const deltaTime = Date.now() - startTime

		triggerSwipe(deltaX, deltaY, deltaTime, event)
	}

	function touchStart(e: TouchEvent): void {
		handleStart(e.touches[0].clientX, e.touches[0].clientY)
	}

	function touchMove(e: TouchEvent): void {
		if (!isSwiping.value || !preventScrollOnSwipe) return
		e.preventDefault()
	}

	function touchEnd(e: TouchEvent): void {
		const touch = e.changedTouches[0]
		handleEnd(touch.clientX, touch.clientY, e)
	}

	function mouseDown(e: MouseEvent): void {
		handleStart(e.clientX, e.clientY)
	}

	function mouseUp(e: MouseEvent): void {
		handleEnd(e.clientX, e.clientY, e)
	}

	function mouseLeave(e: MouseEvent): void {
		if (isSwiping.value) {
			handleEnd(e.clientX, e.clientY, e)
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		element.style.touchAction = 'none'
		element.style.userSelect = 'none'

		element.addEventListener('touchstart', touchStart, { passive: true })
		element.addEventListener('touchmove', touchMove, { passive: false })
		element.addEventListener('touchend', touchEnd)
		element.addEventListener('touchcancel', touchEnd)

		if (unref(mouse)) {
			element.addEventListener('mousedown', mouseDown)
			element.addEventListener('mouseup', mouseUp)
			element.addEventListener('mouseleave', mouseLeave)
		}

		return unbind
	}

	function unbind(): void {
		if (!currentElement) return

		currentElement.removeEventListener('touchstart', touchStart)
		currentElement.removeEventListener('touchmove', touchMove)
		currentElement.removeEventListener('touchend', touchEnd)
		currentElement.removeEventListener('touchcancel', touchEnd)

		if (unref(mouse)) {
			currentElement.removeEventListener('mousedown', mouseDown)
			currentElement.removeEventListener('mouseup', mouseUp)
			currentElement.removeEventListener('mouseleave', mouseLeave)
		}

		currentElement = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		direction: readonly(direction),
		lengthX: readonly(lengthX),
		lengthY: readonly(lengthY),
		isSwiping: readonly(isSwiping),
		bind,
	}
}
