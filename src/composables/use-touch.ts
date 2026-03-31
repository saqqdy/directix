import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Touch gesture type
 */
export type TouchGesture = 'swipe' | 'pinch' | 'rotate' | 'tap' | 'longPress'

/**
 * Touch gesture event
 */
export interface TouchGestureEvent {
	type: TouchGesture
	direction?: 'left' | 'right' | 'up' | 'down'
	distance?: number
	angle?: number
	scale?: number
	rotation?: number
	center?: { x: number, y: number }
	event: TouchEvent
}

/**
 * Options for useTouch composable
 */
export interface UseTouchOptions {
	/**
	 * Callback for swipe gesture
	 */
	onSwipe?: (event: TouchGestureEvent) => void

	/**
	 * Callback for swipe left
	 */
	onSwipeLeft?: (event: TouchGestureEvent) => void

	/**
	 * Callback for swipe right
	 */
	onSwipeRight?: (event: TouchGestureEvent) => void

	/**
	 * Callback for swipe up
	 */
	onSwipeUp?: (event: TouchGestureEvent) => void

	/**
	 * Callback for swipe down
	 */
	onSwipeDown?: (event: TouchGestureEvent) => void

	/**
	 * Callback for pinch gesture
	 */
	onPinch?: (event: TouchGestureEvent) => void

	/**
	 * Callback for rotate gesture
	 */
	onRotate?: (event: TouchGestureEvent) => void

	/**
	 * Callback for tap gesture
	 */
	onTap?: (event: TouchGestureEvent) => void

	/**
	 * Callback for long press gesture
	 */
	onLongPress?: (event: TouchGestureEvent) => void

	/**
	 * Swipe threshold distance in pixels
	 * @default 30
	 */
	swipeThreshold?: number

	/**
	 * Long press duration in milliseconds
	 * @default 500
	 */
	longPressDuration?: number

	/**
	 * Tap max duration in milliseconds
	 * @default 250
	 */
	tapDuration?: number

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useTouch composable
 */
export interface UseTouchReturn {
	/** Current gesture being performed */
	gesture: Readonly<Ref<TouchGesture | null>>

	/** Bind touch events to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Composable for touch gesture detection
 *
 * @param options - Configuration options
 * @returns Touch gesture utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useTouch } from 'directix'
 *
 * const containerRef = ref(null)
 * const { gesture, bind } = useTouch({
 *   onSwipeLeft: () => nextSlide(),
 *   onSwipeRight: () => prevSlide()
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     Swipe me!
 *   </div>
 * </template>
 * ```
 */
export function useTouch(options: UseTouchOptions = {}): UseTouchReturn {
	const {
		onSwipe,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp,
		onSwipeDown,
		onPinch,
		onRotate,
		onTap,
		onLongPress,
		swipeThreshold = 30,
		longPressDuration = 500,
		tapDuration = 250,
		disabled = false,
	} = options

	const gesture = ref<TouchGesture | null>(null)

	let currentElement: HTMLElement | null = null,
		startX = 0,
		startY = 0,
		startTime = 0,
		longPressTimer: ReturnType<typeof setTimeout> | null = null,
		initialPinchDistance = 0,
		initialAngle = 0

	function getTouchCenter(touches: TouchList): { x: number, y: number } {
		let x = 0,
			y = 0
		for (let i = 0; i < touches.length; i++) {
			x += touches[i].clientX
			y += touches[i].clientY
		}
		return { x: x / touches.length, y: y / touches.length }
	}

	function getDistance(touch1: Touch, touch2: Touch): number {
		const dx = touch1.clientX - touch2.clientX
		const dy = touch1.clientY - touch2.clientY
		return Math.sqrt(dx * dx + dy * dy)
	}

	function getAngle(touch1: Touch, touch2: Touch): number {
		return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * (180 / Math.PI)
	}

	function handleTouchStart(e: TouchEvent): void {
		if (unref(disabled)) return

		startTime = Date.now()
		gesture.value = null

		if (e.touches.length === 1) {
			startX = e.touches[0].clientX
			startY = e.touches[0].clientY

			// Start long press timer
			if (onLongPress) {
				longPressTimer = setTimeout(() => {
					gesture.value = 'longPress'
					onLongPress({
						type: 'longPress',
						center: { x: startX, y: startY },
						event: e,
					})
				}, longPressDuration)
			}
		} else if (e.touches.length === 2) {
			// Pinch/Rotate gesture start
			initialPinchDistance = getDistance(e.touches[0], e.touches[1])
			initialAngle = getAngle(e.touches[0], e.touches[1])
		}
	}

	function handleTouchMove(e: TouchEvent): void {
		if (unref(disabled)) return

		// Cancel long press if moved
		if (longPressTimer) {
			clearTimeout(longPressTimer)
			longPressTimer = null
		}

		if (e.touches.length === 2 && (onPinch || onRotate)) {
			const currentDistance = getDistance(e.touches[0], e.touches[1])
			const currentAngle = getAngle(e.touches[0], e.touches[1])

			if (onPinch && initialPinchDistance > 0) {
				const scale = currentDistance / initialPinchDistance
				gesture.value = 'pinch'
				onPinch({
					type: 'pinch',
					scale,
					center: getTouchCenter(e.touches),
					event: e,
				})
			}

			if (onRotate) {
				const rotation = currentAngle - initialAngle
				gesture.value = 'rotate'
				onRotate({
					type: 'rotate',
					rotation,
					center: getTouchCenter(e.touches),
					event: e,
				})
			}
		}
	}

	function handleTouchEnd(e: TouchEvent): void {
		if (unref(disabled)) return

		// Cancel long press timer
		if (longPressTimer) {
			clearTimeout(longPressTimer)
			longPressTimer = null
		}

		const duration = Date.now() - startTime

		if (e.changedTouches.length === 1) {
			const endX = e.changedTouches[0].clientX
			const endY = e.changedTouches[0].clientY
			const deltaX = endX - startX
			const deltaY = endY - startY
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

			// Check for swipe
			if (distance >= swipeThreshold) {
				gesture.value = 'swipe'
				let direction: 'left' | 'right' | 'up' | 'down'

				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					direction = deltaX > 0 ? 'right' : 'left'
				} else {
					direction = deltaY > 0 ? 'down' : 'up'
				}

				const event: TouchGestureEvent = {
					type: 'swipe',
					direction,
					distance,
					angle: Math.atan2(deltaY, deltaX) * (180 / Math.PI),
					center: { x: endX, y: endY },
					event: e,
				}

				onSwipe?.(event)

				switch (direction) {
					case 'left':
						onSwipeLeft?.(event)
						break
					case 'right':
						onSwipeRight?.(event)
						break
					case 'up':
						onSwipeUp?.(event)
						break
					case 'down':
						onSwipeDown?.(event)
						break
				}
			} else if (distance < 10 && duration < tapDuration && onTap) {
				gesture.value = 'tap'
				onTap({
					type: 'tap',
					center: { x: endX, y: endY },
					event: e,
				})
			}
		}

		gesture.value = null
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		element.addEventListener('touchstart', handleTouchStart, { passive: true })
		element.addEventListener('touchmove', handleTouchMove, { passive: true })
		element.addEventListener('touchend', handleTouchEnd)
		element.addEventListener('touchcancel', handleTouchEnd)

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			currentElement.removeEventListener('touchstart', handleTouchStart)
			currentElement.removeEventListener('touchmove', handleTouchMove)
			currentElement.removeEventListener('touchend', handleTouchEnd)
			currentElement.removeEventListener('touchcancel', handleTouchEnd)
		}

		if (longPressTimer) {
			clearTimeout(longPressTimer)
			longPressTimer = null
		}

		currentElement = null
		gesture.value = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		gesture: readonly(gesture),
		bind,
	}
}
