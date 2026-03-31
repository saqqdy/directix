import { defineDirective, isBrowser } from '@directix/core'
import { bindEvents, deleteState, getState, setState } from '@directix/shared'
import { useTimer } from '../utils/directive'

/**
 * Hover state change handler
 */
export type HoverHandler = (isHovering: boolean, event: MouseEvent) => void

/**
 * Hover directive options
 */
export interface HoverOptions {
	/**
	 * Callback when hover state changes
	 */
	handler?: HoverHandler

	/**
	 * Callback when mouse enters
	 */
	onEnter?: (event: MouseEvent) => void

	/**
	 * Callback when mouse leaves
	 */
	onLeave?: (event: MouseEvent) => void

	/**
	 * CSS class to add when hovering
	 * @default 'v-hover'
	 */
	class?: string

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Delay in milliseconds before triggering enter
	 * @default 0
	 */
	enterDelay?: number

	/**
	 * Delay in milliseconds before triggering leave
	 * @default 0
	 */
	leaveDelay?: number
}

/**
 * Directive binding value type
 */
export type HoverBinding = HoverHandler | HoverOptions

/**
 * Element state storage
 */
interface HoverState {
	options: HoverOptions
	isHovering: boolean
	timer: ReturnType<typeof useTimer>
	cleanup: (() => void) | null
}

const STATE_KEY = 'hover'

/**
 * Normalize options
 */
function normalizeOptions(binding: HoverBinding | undefined): HoverOptions {
	if (typeof binding === 'function') {
		return { handler: binding, class: 'v-hover' }
	}

	return {
		class: 'v-hover',
		disabled: false,
		enterDelay: 0,
		leaveDelay: 0,
		...binding,
	}
}

/**
 * Apply hover state
 */
function applyHoverState(el: HTMLElement, state: HoverState, e: MouseEvent): void {
	const { options } = state

	// Add class
	if (options.class) {
		el.classList.add(options.class)
	}

	// Dispatch custom event
	el.dispatchEvent(new CustomEvent('hover:enter', { detail: { event: e } }))

	// Trigger callbacks
	options.onEnter?.(e)
	options.handler?.(true, e)
}

/**
 * Apply leave state
 */
function applyLeaveState(el: HTMLElement, state: HoverState, e: MouseEvent): void {
	const { options } = state

	// Remove class
	if (options.class) {
		el.classList.remove(options.class)
	}

	// Dispatch custom event
	el.dispatchEvent(new CustomEvent('hover:leave', { detail: { event: e } }))

	// Trigger callbacks
	options.onLeave?.(e)
	options.handler?.(false, e)
}

/**
 * v-hover directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-hover="handleHover">Hover me</div>
 *   <div v-hover="{ onEnter: handleEnter, onLeave: handleLeave, class: 'is-hovering' }">Hover me</div>
 * </template>
 * ```
 */
export const vHover = defineDirective<HoverBinding, HTMLElement>({
	name: 'hover',
	ssr: false,
	defaults: {
		class: 'v-hover',
		disabled: false,
		enterDelay: 0,
		leaveDelay: 0,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		const timer = useTimer()
		let isHovering = false

		const state: HoverState = {
			options,
			isHovering: false,
			timer,
			cleanup: null,
		}

		// Enter handler
		const enterHandler = (e: Event): void => {
			const event = e as MouseEvent

			// Clear leave timer if exists
			timer.clearAll()

			// If already hovering, do nothing
			if (isHovering) return

			// Handle enter delay
			if (options.enterDelay && options.enterDelay > 0) {
				timer.setTimeout(() => {
					isHovering = true
					state.isHovering = true
					applyHoverState(el, state, event)
				}, options.enterDelay)
			} else {
				isHovering = true
				state.isHovering = true
				applyHoverState(el, state, event)
			}
		}

		// Leave handler
		const leaveHandler = (e: Event): void => {
			const event = e as MouseEvent

			// Clear enter timer if exists
			timer.clearAll()

			// If not hovering, do nothing
			if (!isHovering) return

			// Handle leave delay
			if (options.leaveDelay && options.leaveDelay > 0) {
				timer.setTimeout(() => {
					isHovering = false
					state.isHovering = false
					applyLeaveState(el, state, event)
				}, options.leaveDelay)
			} else {
				isHovering = false
				state.isHovering = false
				applyLeaveState(el, state, event)
			}
		}

		// Bind events using bindEvents helper
		state.cleanup = bindEvents(el, {
			mouseenter: enterHandler,
			mouseleave: leaveHandler,
		})

		setState(el, STATE_KEY, state)
	},

	updated(el, binding) {
		const state = getState<HTMLElement, HoverState>(el, STATE_KEY)

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Handle disabled state change
		if (newOptions.disabled && !state.options.disabled) {
			// Was enabled, now disabled - remove class
			el.classList.remove(state.options.class || 'v-hover')
		} else if (!newOptions.disabled && state.options.disabled) {
			// Was disabled, now enabled - re-add listeners (already bound)
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state = getState<HTMLElement, HoverState>(el, STATE_KEY)

		if (!state) return

		// Clear timers
		state.timer.clearAll()

		// Unbind events
		state.cleanup?.()

		// Remove class
		el.classList.remove(state.options.class || 'v-hover')

		deleteState(el, STATE_KEY)
	},
})

export default vHover
