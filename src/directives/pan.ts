import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Pan gesture event data
 */
export interface PanEvent {
	/** Original event */
	originalEvent: TouchEvent | MouseEvent
	/** Pan direction */
	direction: 'left' | 'right' | 'up' | 'down'
	/** Delta X from start */
	deltaX: number
	/** Delta Y from start */
	deltaY: number
	/** Distance from start */
	distance: number
	/** Current X position */
	x: number
	/** Current Y position */
	y: number
	/** Start X position */
	startX: number
	/** Start Y position */
	startY: number
	/** Whether pan is in progress */
	isPanning: boolean
	/** Whether pan just started */
	isFirst: boolean
	/** Whether pan just ended */
	isFinal: boolean
	/** Velocity */
	velocity: number
}

/**
 * Pan directive options
 */
export interface PanOptions {
	/**
	 * Callback when pan starts
	 */
	onStart?: (e: PanEvent) => void

	/**
	 * Callback during pan
	 */
	onPan?: (e: PanEvent) => void

	/**
	 * Callback when pan ends
	 */
	onEnd?: (e: PanEvent) => void

	/**
	 * Minimum distance to trigger pan
	 * @default 10
	 */
	threshold?: number

	/**
	 * Direction constraint
	 */
	direction?: 'horizontal' | 'vertical' | 'all'

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
	 * Pointer types to listen to
	 * @default ['touch', 'mouse']
	 */
	pointers?: ('touch' | 'mouse')[]
}

/**
 * Directive binding value type
 */
export type PanBinding = PanOptions['onPan'] | PanOptions

/**
 * Element state storage
 */
interface PanState {
	options: PanOptions
	startX: number
	startY: number
	currentX: number
	currentY: number
	isPanning: boolean
	startTime: number
	touchstartHandler: (e: Event) => void
	touchmoveHandler: (e: Event) => void
	touchendHandler: (e: Event) => void
	mousedownHandler: (e: Event) => void
	mousemoveHandler: (e: Event) => void
	mouseupHandler: (e: Event) => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: PanBinding): PanOptions {
	if (typeof binding === 'function') {
		return { onPan: binding }
	}

	return {
		threshold: 10,
		direction: 'all',
		preventDefault: true,
		stopPropagation: false,
		pointers: ['touch', 'mouse'],
		...binding,
	}
}

/**
 * Get direction from delta
 */
function getDirection(deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' {
	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		return deltaX > 0 ? 'right' : 'left'
	}
	return deltaY > 0 ? 'down' : 'up'
}

/**
 * Create pan event object
 */
function createPanEvent(
	originalEvent: TouchEvent | MouseEvent,
	state: PanState,
	isFirst: boolean = false,
	isFinal: boolean = false,
): PanEvent {
	const deltaX = state.currentX - state.startX
	const deltaY = state.currentY - state.startY
	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
	const duration = Date.now() - state.startTime

	return {
		originalEvent,
		direction: getDirection(deltaX, deltaY),
		deltaX,
		deltaY,
		distance,
		x: state.currentX,
		y: state.currentY,
		startX: state.startX,
		startY: state.startY,
		isPanning: state.isPanning,
		isFirst,
		isFinal,
		velocity: distance / (duration || 1),
	}
}

/**
 * Get position from event
 */
function getPosition(e: TouchEvent | MouseEvent): { x: number, y: number } {
	if ('touches' in e && e.touches.length > 0) {
		return { x: e.touches[0].clientX, y: e.touches[0].clientY }
	}
	return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
}

/**
 * Check if direction is allowed
 */
function isDirectionAllowed(direction: 'left' | 'right' | 'up' | 'down', constraint?: 'horizontal' | 'vertical' | 'all'): boolean {
	if (!constraint || constraint === 'all') return true
	if (constraint === 'horizontal') return direction === 'left' || direction === 'right'
	return direction === 'up' || direction === 'down'
}

/**
 * v-pan directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-pan="handlePan">Swipe me</div>
 *
 *   <div v-pan="{
 *     onPan: handlePan,
 *     direction: 'horizontal',
 *     threshold: 20
 *   }">
 *     Horizontal only
 *   </div>
 * </template>
 *
 * <script setup>
 * function handlePan(e) {
 *   console.log('Direction:', e.direction)
 *   console.log('Distance:', e.distance)
 * }
 * </script>
 * ```
 */
export const vPan = defineDirective<PanBinding, HTMLElement>({
	name: 'pan',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)
		const state: PanState = {
			options,
			startX: 0,
			startY: 0,
			currentX: 0,
			currentY: 0,
			isPanning: false,
			startTime: 0,
			touchstartHandler: (e: Event) => handleStart(e, state, el),
			touchmoveHandler: (e: Event) => handleMove(e, state, el),
			touchendHandler: (e: Event) => handleEnd(e, state),
			mousedownHandler: (e: Event) => handleStart(e, state, el),
			mousemoveHandler: (e: Event) => handleMove(e, state, el),
			mouseupHandler: (e: Event) => handleEnd(e, state),
		}

		;(el as any).__pan = state

		// Touch events
		if (options.pointers?.includes('touch')) {
			on(el, 'touchstart', state.touchstartHandler, { passive: false })
			on(el, 'touchmove', state.touchmoveHandler, { passive: false })
			on(el, 'touchend', state.touchendHandler)
			on(el, 'touchcancel', state.touchendHandler)
		}

		// Mouse events
		if (options.pointers?.includes('mouse')) {
			on(el, 'mousedown', state.mousedownHandler)
		}

		el.classList.add('v-pan')
	},

	updated(el, binding) {
		const state: PanState = (el as any).__pan
		if (!state) return
		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: PanState = (el as any).__pan
		if (!state) return

		off(el, 'touchstart', state.touchstartHandler)
		off(el, 'touchmove', state.touchmoveHandler)
		off(el, 'touchend', state.touchendHandler)
		off(el, 'touchcancel', state.touchendHandler)
		off(el, 'mousedown', state.mousedownHandler)

		el.classList.remove('v-pan')
		delete (el as any).__pan
	},
})

/**
 * Handle pan start
 */
function handleStart(e: Event, state: PanState, _el: HTMLElement): void {
	const pos = getPosition(e as TouchEvent | MouseEvent)
	state.startX = pos.x
	state.startY = pos.y
	state.currentX = pos.x
	state.currentY = pos.y
	state.isPanning = false
	state.startTime = Date.now()

	if (state.options.preventDefault) {
		e.preventDefault()
	}
	if (state.options.stopPropagation) {
		e.stopPropagation()
	}

	// Add document-level listeners for mouse
	if ((e as MouseEvent).type === 'mousedown') {
		document.addEventListener('mousemove', state.mousemoveHandler)
		document.addEventListener('mouseup', state.mouseupHandler)
	}
}

/**
 * Handle pan move
 */
function handleMove(e: Event, state: PanState, _el: HTMLElement): void {
	const pos = getPosition(e as TouchEvent | MouseEvent)
	state.currentX = pos.x
	state.currentY = pos.y

	const deltaX = state.currentX - state.startX
	const deltaY = state.currentY - state.startY
	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
	const threshold = state.options.threshold || 10

	// Check threshold
	if (!state.isPanning && distance < threshold) {
		return
	}

	// Check direction constraint
	const direction = getDirection(deltaX, deltaY)
	if (!isDirectionAllowed(direction, state.options.direction)) {
		return
	}

	if (state.options.preventDefault) {
		e.preventDefault()
	}

	const wasPanning = state.isPanning
	state.isPanning = true

	const panEvent = createPanEvent(e as TouchEvent | MouseEvent, state, !wasPanning)

	if (!wasPanning) {
		state.options.onStart?.(panEvent)
	}

	state.options.onPan?.(panEvent)
}

/**
 * Handle pan end
 */
function handleEnd(e: Event, state: PanState): void {
	if (!state.isPanning) return

	const panEvent = createPanEvent(e as TouchEvent | MouseEvent, state, false, true)
	state.options.onEnd?.(panEvent)

	state.isPanning = false

	// Remove document-level listeners
	document.removeEventListener('mousemove', state.mousemoveHandler)
	document.removeEventListener('mouseup', state.mouseupHandler)
}

export default vPan
