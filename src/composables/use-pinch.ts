import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref } from 'vue'

/**
 * Pinch gesture event data
 */
export interface PinchEvent {
	scale: number
	distance: number
	initialDistance: number
	centerX: number
	centerY: number
	isPinching: boolean
	isFirst: boolean
	isFinal: boolean
}

/**
 * Options for usePinch composable
 */
export interface UsePinchOptions {
	/** Callback when pinch starts */
	onStart?: (e: PinchEvent) => void

	/** Callback during pinch */
	onPinch?: (e: PinchEvent) => void

	/** Callback when pinch ends */
	onEnd?: (e: PinchEvent) => void

	/** Minimum scale */
	minScale?: number

	/** Maximum scale */
	maxScale?: number

	/** Enable transform */
	enableTransform?: boolean
}

/**
 * Return type for usePinch composable
 */
export interface UsePinchReturn {
	/** Whether pinch is in progress */
	isPinching: Ref<boolean>

	/** Current scale */
	scale: Ref<number>

	/** Bind pinch to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Get distance between two touch points
 */
function getDistance(touches: TouchList): number {
	if (touches.length < 2) return 0
	const dx = touches[0].clientX - touches[1].clientX
	const dy = touches[0].clientY - touches[1].clientY
	return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Get center point
 */
function getCenter(touches: TouchList): { x: number, y: number } {
	if (touches.length === 0) return { x: 0, y: 0 }
	if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY }
	return {
		x: (touches[0].clientX + touches[1].clientX) / 2,
		y: (touches[0].clientY + touches[1].clientY) / 2,
	}
}

/**
 * Composable for pinch gesture
 *
 * @param options - Configuration options
 * @returns Pinch gesture utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { usePinch } from 'directix'
 *
 * const containerRef = ref(null)
 * const { scale, bind } = usePinch({
 *   onPinch: (e) => console.log('Scale:', e.scale)
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">Pinch to zoom</div>
 * </template>
 * ```
 */
export function usePinch(options: UsePinchOptions = {}): UsePinchReturn {
	const { onStart, onPinch, onEnd, minScale, maxScale, enableTransform = false } = options

	const isPinching = ref(false)
	const scale = ref(1)

	let currentElement: HTMLElement | null = null,
		initialDistance = 0,
		currentDistance = 0,
		baseScale = 1,
		savedTransition = '',
		handlers: { [key: string]: (e: Event) => void } = {}

	function createPinchEvent(e: TouchEvent, isFirst: boolean = false, isFinal: boolean = false): PinchEvent {
		const center = getCenter(e.touches)
		const s = initialDistance > 0 ? currentDistance / initialDistance : 1

		return {
			scale: s,
			distance: currentDistance,
			initialDistance,
			centerX: center.x,
			centerY: center.y,
			isPinching: isPinching.value,
			isFirst,
			isFinal,
		}
	}

	function handleStart(e: Event): void {
		const event = e as TouchEvent
		if (event.touches.length !== 2) return

		initialDistance = getDistance(event.touches)
		currentDistance = initialDistance
		isPinching.value = false

		if (enableTransform && currentElement) {
			const transform = getComputedStyle(currentElement).transform
			const matrix = new DOMMatrix(transform)
			baseScale = matrix.a
			// Disable transition during pinch for smooth response
			savedTransition = currentElement.style.transition
			currentElement.style.transition = 'none'
		}

		e.preventDefault()
	}

	function handleMove(e: Event): void {
		const event = e as TouchEvent
		if (event.touches.length !== 2) return

		currentDistance = getDistance(event.touches)

		if (initialDistance <= 0) return

		const s = currentDistance / initialDistance

		// Check constraints
		if (minScale !== undefined && s < minScale) return
		if (maxScale !== undefined && s > maxScale) return

		e.preventDefault()

		const wasPinching = isPinching.value
		isPinching.value = true
		scale.value = s

		const pinchEvent = createPinchEvent(event, !wasPinching)

		if (!wasPinching) {
			onStart?.(pinchEvent)
		}

		if (enableTransform && currentElement) {
			currentElement.style.transform = `scale(${baseScale * s})`
		}

		onPinch?.(pinchEvent)
	}

	function handleEnd(_e: Event): void {
		if (!isPinching.value) return

		// Restore transition
		if (enableTransform && currentElement) {
			currentElement.style.transition = savedTransition
		}

		const emptyTouchList = { length: 0, item: () => null } as unknown as TouchList
		const pinchEvent = createPinchEvent({ touches: emptyTouchList } as TouchEvent, false, true)
		onEnd?.(pinchEvent)

		isPinching.value = false
		initialDistance = 0
		currentDistance = 0
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element

		handlers = {
			touchstart: handleStart,
			touchmove: handleMove,
			touchend: handleEnd,
			touchcancel: handleEnd,
		}

		element.addEventListener('touchstart', handlers.touchstart, { passive: false })
		element.addEventListener('touchmove', handlers.touchmove, { passive: false })
		element.addEventListener('touchend', handlers.touchend)
		element.addEventListener('touchcancel', handlers.touchcancel)

		element.classList.add('v-pinch')

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			Object.entries(handlers).forEach(([event, handler]) => {
				currentElement?.removeEventListener(event, handler)
			})
			currentElement.classList.remove('v-pinch')
		}
		currentElement = null
		handlers = {}
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		isPinching,
		scale,
		bind,
	}
}
