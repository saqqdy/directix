import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

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
	enterTimerId: ReturnType<typeof setTimeout> | null
	leaveTimerId: ReturnType<typeof setTimeout> | null
	enterHandler: (e: Event) => void
	leaveHandler: (e: Event) => void
}

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

		const state: HoverState = {
			options,
			isHovering: false,
			enterTimerId: null,
			leaveTimerId: null,
			enterHandler: () => {},
			leaveHandler: () => {},
		}

		// Enter handler
		state.enterHandler = (e: Event) => {
			const event = e as MouseEvent

			// Clear leave timer if exists
			if (state.leaveTimerId) {
				clearTimeout(state.leaveTimerId)
				state.leaveTimerId = null
			}

			// If already hovering, do nothing
			if (state.isHovering) return

			// Handle enter delay
			if (options.enterDelay && options.enterDelay > 0) {
				state.enterTimerId = setTimeout(() => {
					state.isHovering = true
					applyHoverState(el, state, event)
				}, options.enterDelay)
			} else {
				state.isHovering = true
				applyHoverState(el, state, event)
			}
		}

		// Leave handler
		state.leaveHandler = (e: Event) => {
			const event = e as MouseEvent

			// Clear enter timer if exists
			if (state.enterTimerId) {
				clearTimeout(state.enterTimerId)
				state.enterTimerId = null
			}

			// If not hovering, do nothing
			if (!state.isHovering) return

			// Handle leave delay
			if (options.leaveDelay && options.leaveDelay > 0) {
				state.leaveTimerId = setTimeout(() => {
					state.isHovering = false
					applyLeaveState(el, state, event)
				}, options.leaveDelay)
			} else {
				state.isHovering = false
				applyLeaveState(el, state, event)
			}
		}

		// Store state
		;(el as any).__hover = state

		// Bind events
		on(el, 'mouseenter', state.enterHandler)
		on(el, 'mouseleave', state.leaveHandler)
	},

	updated(el, binding) {
		const state: HoverState = (el as any).__hover

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Handle disabled state change
		if (newOptions.disabled && !state.options.disabled) {
			// Was enabled, now disabled - remove class and listeners
			el.classList.remove(state.options.class || 'v-hover')
		} else if (!newOptions.disabled && state.options.disabled) {
			// Was disabled, now enabled - re-add listeners (already bound)
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: HoverState = (el as any).__hover

		if (!state) return

		// Clear timers
		if (state.enterTimerId) {
			clearTimeout(state.enterTimerId)
		}

		if (state.leaveTimerId) {
			clearTimeout(state.leaveTimerId)
		}

		// Unbind events
		off(el, 'mouseenter', state.enterHandler)
		off(el, 'mouseleave', state.leaveHandler)

		// Remove class
		el.classList.remove(state.options.class || 'v-hover')

		delete (el as any).__hover
	},
})

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

export default vHover
