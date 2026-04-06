import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Rotate gesture event data
 */
export interface RotateGestureEvent {
	/** Original event */
	originalEvent: TouchEvent
	/** Rotation angle in degrees */
	angle: number
	/** Rotation angle in radians */
	radians: number
	/** Current angle relative to start */
	rotation: number
	/** Center point X */
	centerX: number
	/** Center point Y */
	centerY: number
	/** Whether rotation is in progress */
	isRotating: boolean
	/** Whether rotation just started */
	isFirst: boolean
	/** Whether rotation just ended */
	isFinal: boolean
}

/**
 * Rotate directive options
 */
export interface RotateGestureOptions {
	/**
	 * Callback when rotation starts
	 */
	onStart?: (e: RotateGestureEvent) => void

	/**
	 * Callback during rotation
	 */
	onRotate?: (e: RotateGestureEvent) => void

	/**
	 * Callback when rotation ends
	 */
	onEnd?: (e: RotateGestureEvent) => void

	/**
	 * Whether to prevent default behavior
	 * @default true
	 */
	preventDefault?: boolean

	/**
	 * Whether to stop propagation
	 * @default false
	 */
	stopPropagation?: boolean

	/**
	 * Enable rotation transform on element
	 * @default false
	 */
	enableTransform?: boolean

	/**
	 * Transform origin for rotation
	 * @default 'center center'
	 */
	transformOrigin?: string
}

/**
 * Directive binding value type
 */
export type RotateGestureBinding = RotateGestureOptions['onRotate'] | RotateGestureOptions

/**
 * Element state storage
 */
interface RotateGestureState {
	options: RotateGestureOptions
	initialAngle: number
	currentAngle: number
	isRotating: boolean
	touchstartHandler: (e: Event) => void
	touchmoveHandler: (e: Event) => void
	touchendHandler: (e: Event) => void
	baseRotation: number
	savedTransition: string
}

/**
 * Normalize options
 */
function normalizeOptions(binding: RotateGestureBinding): RotateGestureOptions {
	if (typeof binding === 'function') {
		return { onRotate: binding }
	}

	return {
		preventDefault: true,
		stopPropagation: false,
		enableTransform: false,
		transformOrigin: 'center center',
		...binding,
	}
}

/**
 * Get angle between two touch points
 */
function getAngle(touches: TouchList): number {
	if (touches.length < 2) return 0
	const dx = touches[1].clientX - touches[0].clientX
	const dy = touches[1].clientY - touches[0].clientY
	// Return angle in degrees
	return Math.atan2(dy, dx) * (180 / Math.PI)
}

/**
 * Get center point between two touch points
 */
function getCenter(touches: TouchList): { x: number, y: number } {
	if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY }
	return {
		x: (touches[0].clientX + touches[1].clientX) / 2,
		y: (touches[0].clientY + touches[1].clientY) / 2,
	}
}

/**
 * Create rotate event object
 */
function createRotateEvent(
	originalEvent: TouchEvent,
	state: RotateGestureState,
	isFirst: boolean = false,
	isFinal: boolean = false,
): RotateGestureEvent {
	const center = getCenter(originalEvent.touches)
	const radians = state.currentAngle * (Math.PI / 180)

	return {
		originalEvent,
		angle: state.currentAngle,
		radians,
		rotation: state.currentAngle - state.initialAngle,
		centerX: center.x,
		centerY: center.y,
		isRotating: state.isRotating,
		isFirst,
		isFinal,
	}
}

/**
 * v-rotate directive
 * Two-finger rotation gesture
 *
 * @example
 * ```vue
 * <template>
 *   <div v-rotate="handleRotate">Rotate with two fingers</div>
 *
 *   <div v-rotate="{
 *     onRotate: handleRotate,
 *     enableTransform: true
 *   }">
 *     Rotate with transform
 *   </div>
 * </template>
 *
 * <script setup>
 * function handleRotate(e) {
 *   console.log('Rotation:', e.rotation)
 *   console.log('Angle:', e.angle)
 * }
 * </script>
 * ```
 */
export const vRotateGesture = defineDirective<RotateGestureBinding, HTMLElement>({
	name: 'rotate-gesture',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)
		const state: RotateGestureState = {
			options,
			initialAngle: 0,
			currentAngle: 0,
			isRotating: false,
			baseRotation: 0,
			savedTransition: '',
			touchstartHandler: (e: Event) => handleStart(e as TouchEvent, state, el),
			touchmoveHandler: (e: Event) => handleMove(e as TouchEvent, state, el),
			touchendHandler: (e: Event) => handleEnd(e as TouchEvent, state, el),
		}

		;(el as any).__rotateGesture = state

		on(el, 'touchstart', state.touchstartHandler, { passive: false })
		on(el, 'touchmove', state.touchmoveHandler, { passive: false })
		on(el, 'touchend', state.touchendHandler)
		on(el, 'touchcancel', state.touchendHandler)

		el.classList.add('v-rotate-gesture')
	},

	updated(el, binding) {
		const state: RotateGestureState = (el as any).__rotateGesture
		if (!state) return
		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: RotateGestureState = (el as any).__rotateGesture
		if (!state) return

		off(el, 'touchstart', state.touchstartHandler)
		off(el, 'touchmove', state.touchmoveHandler)
		off(el, 'touchend', state.touchendHandler)
		off(el, 'touchcancel', state.touchendHandler)

		el.classList.remove('v-rotate-gesture')
		delete (el as any).__rotateGesture
	},
})

/**
 * Handle rotation start
 */
function handleStart(e: TouchEvent, state: RotateGestureState, el: HTMLElement): void {
	if (e.touches.length !== 2) return

	state.initialAngle = getAngle(e.touches)
	state.currentAngle = state.initialAngle
	state.isRotating = false

	if (state.options.enableTransform) {
		// Get current rotation from transform
		const transform = getComputedStyle(el).transform
		const matrix = new DOMMatrix(transform)
		// Extract rotation angle from matrix
		state.baseRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)
		// Disable transition during rotation for smooth response
		state.savedTransition = el.style.transition
		el.style.transition = 'none'
	}

	if (state.options.preventDefault) {
		e.preventDefault()
	}
	if (state.options.stopPropagation) {
		e.stopPropagation()
	}
}

/**
 * Handle rotation move
 */
function handleMove(e: TouchEvent, state: RotateGestureState, el: HTMLElement): void {
	if (e.touches.length !== 2) return

	state.currentAngle = getAngle(e.touches)

	if (state.options.preventDefault) {
		e.preventDefault()
	}

	const wasRotating = state.isRotating
	state.isRotating = true

	const rotateEvent = createRotateEvent(e, state, !wasRotating)

	if (!wasRotating) {
		state.options.onStart?.(rotateEvent)
	}

	// Apply transform if enabled
	if (state.options.enableTransform) {
		const rotation = state.currentAngle - state.initialAngle
		const transformOrigin = state.options.transformOrigin || 'center center'
		el.style.transformOrigin = transformOrigin
		el.style.transform = `rotate(${state.baseRotation + rotation}deg)`
	}

	state.options.onRotate?.(rotateEvent)
}

/**
 * Handle rotation end
 */
function handleEnd(e: TouchEvent, state: RotateGestureState, el: HTMLElement): void {
	if (!state.isRotating) return

	// Restore transition
	if (state.options.enableTransform) {
		el.style.transition = state.savedTransition
	}

	// Create final event
	const finalEvent = {
		...e,
		touches: e.touches.length >= 2 ? e.touches : ([] as any),
	} as TouchEvent

	const rotateEvent = createRotateEvent(finalEvent, state, false, true)
	state.options.onEnd?.(rotateEvent)

	state.isRotating = false
	state.initialAngle = 0
	state.currentAngle = 0
}

export default vRotateGesture
