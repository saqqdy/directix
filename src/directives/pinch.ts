import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Pinch gesture event data
 */
export interface PinchEvent {
	/** Original event */
	originalEvent: TouchEvent
	/** Scale factor (relative to start) */
	scale: number
	/** Current distance between two fingers */
	distance: number
	/** Initial distance */
	initialDistance: number
	/** Center point X */
	centerX: number
	/** Center point Y */
	centerY: number
	/** Whether pinch is in progress */
	isPinching: boolean
	/** Whether pinch just started */
	isFirst: boolean
	/** Whether pinch just ended */
	isFinal: boolean
}

/**
 * Pinch directive options
 */
export interface PinchOptions {
	/**
	 * Callback when pinch starts
	 */
	onStart?: (e: PinchEvent) => void

	/**
	 * Callback during pinch
	 */
	onPinch?: (e: PinchEvent) => void

	/**
	 * Callback when pinch ends
	 */
	onEnd?: (e: PinchEvent) => void

	/**
	 * Minimum scale to trigger callback
	 */
	minScale?: number

	/**
	 * Maximum scale to trigger callback
	 */
	maxScale?: number

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
	 * Enable scale transform on element
	 * @default false
	 */
	enableTransform?: boolean

	/**
	 * Transform origin for scaling
	 * @default 'center center'
	 */
	transformOrigin?: string
}

/**
 * Directive binding value type
 */
export type PinchBinding = PinchOptions['onPinch'] | PinchOptions

/**
 * Element state storage
 */
interface PinchState {
	options: PinchOptions
	initialDistance: number
	currentDistance: number
	isPinching: boolean
	touchstartHandler: (e: Event) => void
	touchmoveHandler: (e: Event) => void
	touchendHandler: (e: Event) => void
	initialScale: number
}

/**
 * Normalize options
 */
function normalizeOptions(binding: PinchBinding): PinchOptions {
	if (typeof binding === 'function') {
		return { onPinch: binding }
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
 * Get distance between two touch points
 */
function getDistance(touches: TouchList): number {
	if (touches.length < 2) return 0
	const dx = touches[0].clientX - touches[1].clientX
	const dy = touches[0].clientY - touches[1].clientY
	return Math.sqrt(dx * dx + dy * dy)
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
 * Create pinch event object
 */
function createPinchEvent(originalEvent: TouchEvent, state: PinchState, isFirst: boolean = false, isFinal: boolean = false): PinchEvent {
	const center = getCenter(originalEvent.touches)
	const scale = state.initialDistance > 0 ? state.currentDistance / state.initialDistance : 1

	return {
		originalEvent,
		scale,
		distance: state.currentDistance,
		initialDistance: state.initialDistance,
		centerX: center.x,
		centerY: center.y,
		isPinching: state.isPinching,
		isFirst,
		isFinal,
	}
}

/**
 * v-pinch directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-pinch="handlePinch">Pinch to zoom</div>
 *
 *   <div v-pinch="{
 *     onPinch: handlePinch,
 *     enableTransform: true,
 *     minScale: 0.5,
 *     maxScale: 3
 *   }">
 *     Pinch to scale
 *   </div>
 * </template>
 *
 * <script setup>
 * function handlePinch(e) {
 *   console.log('Scale:', e.scale)
 *   console.log('Center:', e.centerX, e.centerY)
 * }
 * </script>
 * ```
 */
export const vPinch = defineDirective<PinchBinding, HTMLElement>({
	name: 'pinch',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)
		const state: PinchState = {
			options,
			initialDistance: 0,
			currentDistance: 0,
			isPinching: false,
			initialScale: 1,
			touchstartHandler: (e: Event) => handleStart(e as TouchEvent, state, el),
			touchmoveHandler: (e: Event) => handleMove(e as TouchEvent, state, el),
			touchendHandler: (e: Event) => handleEnd(e as TouchEvent, state),
		}

		;(el as any).__pinch = state

		on(el, 'touchstart', state.touchstartHandler, { passive: false })
		on(el, 'touchmove', state.touchmoveHandler, { passive: false })
		on(el, 'touchend', state.touchendHandler)
		on(el, 'touchcancel', state.touchendHandler)

		el.classList.add('v-pinch')
	},

	updated(el, binding) {
		const state: PinchState = (el as any).__pinch
		if (!state) return
		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: PinchState = (el as any).__pinch
		if (!state) return

		off(el, 'touchstart', state.touchstartHandler)
		off(el, 'touchmove', state.touchmoveHandler)
		off(el, 'touchend', state.touchendHandler)
		off(el, 'touchcancel', state.touchendHandler)

		el.classList.remove('v-pinch')
		delete (el as any).__pinch
	},
})

/**
 * Handle pinch start
 */
function handleStart(e: TouchEvent, state: PinchState, el: HTMLElement): void {
	if (e.touches.length !== 2) return

	state.initialDistance = getDistance(e.touches)
	state.currentDistance = state.initialDistance
	state.isPinching = false

	if (state.options.enableTransform) {
		// Get current scale from transform
		const transform = getComputedStyle(el).transform
		const matrix = new DOMMatrix(transform)
		state.initialScale = matrix.a // Get scale from matrix
	}

	if (state.options.preventDefault) {
		e.preventDefault()
	}
	if (state.options.stopPropagation) {
		e.stopPropagation()
	}
}

/**
 * Handle pinch move
 */
function handleMove(e: TouchEvent, state: PinchState, el: HTMLElement): void {
	if (e.touches.length !== 2) return

	state.currentDistance = getDistance(e.touches)

	if (state.initialDistance <= 0) return

	const scale = state.currentDistance / state.initialDistance

	// Check scale constraints
	if (state.options.minScale !== undefined && scale < state.options.minScale) return
	if (state.options.maxScale !== undefined && scale > state.options.maxScale) return

	if (state.options.preventDefault) {
		e.preventDefault()
	}

	const wasPinching = state.isPinching
	state.isPinching = true

	const pinchEvent = createPinchEvent(e, state, !wasPinching)

	if (!wasPinching) {
		state.options.onStart?.(pinchEvent)
	}

	// Apply transform if enabled
	if (state.options.enableTransform) {
		const transformOrigin = state.options.transformOrigin || 'center center'
		el.style.transformOrigin = transformOrigin
		el.style.transform = `scale(${state.initialScale * scale})`
	}

	state.options.onPinch?.(pinchEvent)
}

/**
 * Handle pinch end
 */
function handleEnd(e: TouchEvent, state: PinchState): void {
	if (!state.isPinching) return

	// Create final event with 0 touches
	const finalEvent = {
		...e,
		touches: e.touches.length >= 2 ? e.touches : ([] as any),
	} as TouchEvent

	const pinchEvent = createPinchEvent(finalEvent, state, false, true)
	state.options.onEnd?.(pinchEvent)

	state.isPinching = false
	state.initialDistance = 0
	state.currentDistance = 0
}

export default vPinch
