import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref } from 'vue'

/**
 * Rotate gesture event data
 */
export interface RotateGestureEvent {
	angle: number
	radians: number
	rotation: number
	centerX: number
	centerY: number
	isRotating: boolean
	isFirst: boolean
	isFinal: boolean
}

/**
 * Options for useRotateGesture composable
 */
export interface UseRotateGestureOptions {
	/** Callback when rotation starts */
	onStart?: (e: RotateGestureEvent) => void

	/** Callback during rotation */
	onRotate?: (e: RotateGestureEvent) => void

	/** Callback when rotation ends */
	onEnd?: (e: RotateGestureEvent) => void

	/** Enable transform */
	enableTransform?: boolean
}

/**
 * Return type for useRotateGesture composable
 */
export interface UseRotateGestureReturn {
	/** Whether rotation is in progress */
	isRotating: Ref<boolean>

	/** Current rotation angle */
	angle: Ref<number>

	/** Bind rotation to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Get angle between two touch points
 */
function getAngle(touches: TouchList): number {
	if (touches.length < 2) return 0
	const dx = touches[1].clientX - touches[0].clientX
	const dy = touches[1].clientY - touches[0].clientY
	return Math.atan2(dy, dx) * (180 / Math.PI)
}

/**
 * Get center point
 */
function getCenter(touches: TouchList): { x: number, y: number } {
	if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY }
	return {
		x: (touches[0].clientX + touches[1].clientX) / 2,
		y: (touches[0].clientY + touches[1].clientY) / 2,
	}
}

/**
 * Composable for rotate gesture
 *
 * @param options - Configuration options
 * @returns Rotate gesture utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useRotateGesture } from 'directix'
 *
 * const containerRef = ref(null)
 * const { angle, bind } = useRotateGesture({
 *   onRotate: (e) => console.log('Rotation:', e.rotation)
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">Rotate with two fingers</div>
 * </template>
 * ```
 */
export function useRotateGesture(options: UseRotateGestureOptions = {}): UseRotateGestureReturn {
	const { onStart, onRotate, onEnd, enableTransform = false } = options

	const isRotating = ref(false)
	const angle = ref(0)

	let currentElement: HTMLElement | null = null,
		initialAngle = 0,
		currentAngle = 0,
		baseRotation = 0,
		savedTransition = '',
		handlers: { [key: string]: (e: Event) => void } = {}

	function createRotateEvent(e: TouchEvent, isFirst: boolean = false, isFinal: boolean = false): RotateGestureEvent {
		const center = getCenter(e.touches)
		const radians = currentAngle * (Math.PI / 180)

		return {
			angle: currentAngle,
			radians,
			rotation: currentAngle - initialAngle,
			centerX: center.x,
			centerY: center.y,
			isRotating: isRotating.value,
			isFirst,
			isFinal,
		}
	}

	function handleStart(e: Event): void {
		const event = e as TouchEvent
		if (event.touches.length !== 2) return

		initialAngle = getAngle(event.touches)
		currentAngle = initialAngle
		isRotating.value = false

		if (enableTransform && currentElement) {
			const transform = getComputedStyle(currentElement).transform
			const matrix = new DOMMatrix(transform)
			baseRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)
			// Disable transition during rotation for smooth response
			savedTransition = currentElement.style.transition
			currentElement.style.transition = 'none'
		}

		e.preventDefault()
	}

	function handleMove(e: Event): void {
		const event = e as TouchEvent
		if (event.touches.length !== 2) return

		currentAngle = getAngle(event.touches)

		e.preventDefault()

		const wasRotating = isRotating.value
		isRotating.value = true
		angle.value = currentAngle

		const rotateEvent = createRotateEvent(event, !wasRotating)

		if (!wasRotating) {
			onStart?.(rotateEvent)
		}

		if (enableTransform && currentElement) {
			const rotation = currentAngle - initialAngle
			currentElement.style.transform = `rotate(${baseRotation + rotation}deg)`
		}

		onRotate?.(rotateEvent)
	}

	function handleEnd(_e: Event): void {
		if (!isRotating.value) return

		// Restore transition
		if (enableTransform && currentElement) {
			currentElement.style.transition = savedTransition
		}

		const emptyTouchList = { length: 0, item: () => null } as unknown as TouchList
		const rotateEvent = createRotateEvent({ touches: emptyTouchList } as TouchEvent, false, true)
		onEnd?.(rotateEvent)

		isRotating.value = false
		initialAngle = 0
		currentAngle = 0
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

		element.classList.add('v-rotate-gesture')

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			Object.entries(handlers).forEach(([event, handler]) => {
				currentElement?.removeEventListener(event, handler)
			})
			currentElement.classList.remove('v-rotate-gesture')
		}
		currentElement = null
		handlers = {}
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		isRotating,
		angle,
		bind,
	}
}
