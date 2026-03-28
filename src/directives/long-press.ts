import { defineDirective, isBrowser } from '@directix/core'
import { getEventPosition, off, on } from '@directix/shared'

/**
 * Long press handler
 */
export type LongPressHandler = (event: MouseEvent | TouchEvent) => void

/**
 * Long press directive options
 */
export interface LongPressOptions {
	/**
	 * Callback when long press is triggered
	 * @required
	 */
	handler: LongPressHandler

	/**
	 * Duration in milliseconds to trigger long press
	 * @default 500
	 */
	duration?: number

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Maximum movement distance before canceling
	 * @default 10
	 */
	distance?: number

	/**
	 * Callback when long press starts (on mousedown/touchstart)
	 */
	onStart?: (event: MouseEvent | TouchEvent) => void

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

	/**
	 * Whether to stop propagation
	 * @default false
	 */
	stop?: boolean
}

/**
 * Directive binding value type
 */
export type LongPressBinding = LongPressHandler | LongPressOptions

/**
 * Element state storage
 */
interface LongPressState {
	options: LongPressOptions
	timerId: ReturnType<typeof setTimeout> | null
	tickTimerId: ReturnType<typeof setInterval> | null
	startTime: number
	startPos: { x: number; y: number }
	startHandler: (e: Event) => void
	endHandler: (e: Event) => void
	moveHandler: (e: Event) => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: LongPressBinding | undefined): LongPressOptions {
	if (typeof binding === 'function') {
		return { handler: binding, duration: 500, distance: 10 }
	}

	if (!binding) {
		throw new Error('[Directix] v-long-press: handler is required')
	}

	return {
		duration: 500,
		distance: 10,
		disabled: false,
		prevent: true,
		stop: false,
		tickInterval: 100,
		...binding,
	}
}

/**
 * Calculate distance between two points
 */
function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
	return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

/**
 * v-long-press directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-long-press="handleLongPress">Long Press Me</button>
 *   <button v-long-press="{ handler: handleLongPress, duration: 1000 }">1 Second Press</button>
 * </template>
 * ```
 */
export const vLongPress = defineDirective<LongPressBinding, HTMLElement>({
	name: 'long-press',
	ssr: false,
	defaults: {
		duration: 500,
		distance: 10,
		disabled: false,
		prevent: true,
		stop: false,
		tickInterval: 100,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		const state: LongPressState = {
			options,
			timerId: null,
			tickTimerId: null,
			startTime: 0,
			startPos: { x: 0, y: 0 },
			startHandler: () => {},
			endHandler: () => {},
			moveHandler: () => {},
		}

		// Start handler
		state.startHandler = (e: Event) => {
			const event = e as MouseEvent | TouchEvent

			// Prevent context menu on long press
			if (options.prevent) {
				event.preventDefault()
			}

			if (options.stop) {
				event.stopPropagation()
			}

			// Clear any existing timer
			if (state.timerId) {
				clearTimeout(state.timerId)
				state.timerId = null
			}

			if (state.tickTimerId) {
				clearInterval(state.tickTimerId)
				state.tickTimerId = null
			}

			// Store start position
			const pos = getEventPosition(event)

			state.startPos = { x: pos.x, y: pos.y }
			state.startTime = Date.now()

			// Trigger start callback
			options.onStart?.(event)

			// Start tick timer
			if (options.onTick) {
				let remaining = options.duration!

				state.tickTimerId = setInterval(() => {
					remaining -= options.tickInterval!
					options.onTick?.(Math.max(0, remaining))
				}, options.tickInterval)
			}

			// Start long press timer
			state.timerId = setTimeout(() => {
				if (state.tickTimerId) {
					clearInterval(state.tickTimerId)
					state.tickTimerId = null
				}
				options.handler(event)
			}, options.duration)
		}

		// End handler
		state.endHandler = (e: Event) => {
			const event = e as MouseEvent | TouchEvent

			if (state.timerId) {
				clearTimeout(state.timerId)
				state.timerId = null
			}

			if (state.tickTimerId) {
				clearInterval(state.tickTimerId)
				state.tickTimerId = null
			}

			// Trigger cancel callback if was in progress
			if (state.startTime > 0) {
				options.onCancel?.(event)
			}

			state.startTime = 0
		}

		// Move handler - cancel if moved too far
		state.moveHandler = (e: Event) => {
			if (!state.timerId) return

			const event = e as MouseEvent | TouchEvent
			const pos = getEventPosition(event)
			const distance = getDistance(state.startPos, { x: pos.x, y: pos.y })

			if (distance > (options.distance || 10)) {
				if (state.timerId) {
					clearTimeout(state.timerId)
					state.timerId = null
				}

				if (state.tickTimerId) {
					clearInterval(state.tickTimerId)
					state.tickTimerId = null
				}

				options.onCancel?.(event)
				state.startTime = 0
			}
		}

		// Store state
		;(el as any).__longPress = state

		// Bind events - mouse
		on(el, 'mousedown', state.startHandler)
		on(el, 'mouseup', state.endHandler)
		on(el, 'mouseleave', state.endHandler)
		on(el, 'mousemove', state.moveHandler)

		// Bind events - touch
		on(el, 'touchstart', state.startHandler, { passive: !options.prevent })
		on(el, 'touchend', state.endHandler)
		on(el, 'touchcancel', state.endHandler)
		on(el, 'touchmove', state.moveHandler, { passive: true })
	},

	updated(el, binding) {
		const state: LongPressState = (el as any).__longPress

		if (!state) {
			// Re-initialize if not exists
			const options = normalizeOptions(binding.value)

			if (!options.disabled) {
				// Re-mount by clearing and re-setting
				;(el as any).__longPress = null
			}

			return
		}

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: LongPressState = (el as any).__longPress

		if (!state) return

		// Clear timers
		if (state.timerId) {
			clearTimeout(state.timerId)
		}

		if (state.tickTimerId) {
			clearInterval(state.tickTimerId)
		}

		// Unbind events - mouse
		off(el, 'mousedown', state.startHandler)
		off(el, 'mouseup', state.endHandler)
		off(el, 'mouseleave', state.endHandler)
		off(el, 'mousemove', state.moveHandler)

		// Unbind events - touch
		off(el, 'touchstart', state.startHandler)
		off(el, 'touchend', state.endHandler)
		off(el, 'touchcancel', state.endHandler)
		off(el, 'touchmove', state.moveHandler)

		delete (el as any).__longPress
	},
})

export default vLongPress
