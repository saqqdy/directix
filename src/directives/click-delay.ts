import { defineDirective } from '@directix/core'
import type { DirectiveBinding } from '@directix/core'

/**
 * Click delay handler
 */
export type ClickDelayHandler = (event: MouseEvent | TouchEvent) => void

/**
 * Click delay directive options
 */
export interface ClickDelayOptions {
	/**
	 * Click handler
	 * @required
	 */
	handler: ClickDelayHandler

	/**
	 * Delay time in milliseconds
	 * @default 300
	 */
	delay?: number

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * CSS class to add during delay
	 * @default 'v-click-delay--pending'
	 */
	pendingClass?: string

	/**
	 * Whether to show visual feedback
	 * @default true
	 */
	feedback?: boolean
}

/**
 * Directive binding value type
 */
export type ClickDelayBinding = ClickDelayHandler | ClickDelayOptions

/**
 * Element state storage
 */
interface ClickDelayState {
	options: ClickDelayOptions
	handler: (event: Event) => void
	isPending: boolean
	timeoutId: ReturnType<typeof setTimeout> | null
}

/**
 * v-click-delay directive
 *
 * Prevents repeated clicks within a specified time period.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Basic usage -->
 *   <button v-click-delay="handleClick">Click Me</button>
 *
 *   <!-- With delay time -->
 *   <button v-click-delay:500="handleClick">Click Me (500ms)</button>
 *
 *   <!-- With options -->
 *   <button v-click-delay="{ handler: handleClick, delay: 1000 }">
 *     Click Me (1s)
 *   </button>
 * </template>
 * ```
 */
export const vClickDelay = defineDirective<ClickDelayBinding, HTMLElement>({
	name: 'click-delay',
	ssr: true,
	defaults: {
		delay: 300,
		disabled: false,
		pendingClass: 'v-click-delay--pending',
		feedback: true,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value, binding)

		if (options.disabled) return

		const state: ClickDelayState = {
			options,
			handler: createClickHandler(el, options),
			isPending: false,
			timeoutId: null,
		}

		;(el as any).__clickDelay = state

		// Bind click event
		el.addEventListener('click', state.handler)
		el.addEventListener('touchend', state.handler)
	},

	updated(el, binding) {
		const state: ClickDelayState = (el as any).__clickDelay

		if (!state) {
			// If previously disabled, reinitialize
			const options = normalizeOptions(binding.value, binding)
			if (!options.disabled) {
				const newState: ClickDelayState = {
					options,
					handler: createClickHandler(el, options),
					isPending: false,
					timeoutId: null,
				}
				;(el as any).__clickDelay = newState
				el.addEventListener('click', newState.handler)
				el.addEventListener('touchend', newState.handler)
			}
			return
		}

		const newOptions = normalizeOptions(binding.value, binding)

		// If disabled state changes
		if (newOptions.disabled && !state.options.disabled) {
			// Disable: remove listeners
			el.removeEventListener('click', state.handler)
			el.removeEventListener('touchend', state.handler)
			if (state.timeoutId) {
				clearTimeout(state.timeoutId)
			}
			removePendingClass(el, state.options)
			delete (el as any).__clickDelay
		} else if (!newOptions.disabled && state.options.disabled) {
			// Enable: add listeners
			state.handler = createClickHandler(el, newOptions)
			state.isPending = false
			state.timeoutId = null
			el.addEventListener('click', state.handler)
			el.addEventListener('touchend', state.handler)
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: ClickDelayState = (el as any).__clickDelay

		if (!state) return

		el.removeEventListener('click', state.handler)
		el.removeEventListener('touchend', state.handler)

		if (state.timeoutId) {
			clearTimeout(state.timeoutId)
		}

		removePendingClass(el, state.options)
		delete (el as any).__clickDelay
	},
})

/**
 * Create click handler with delay logic
 */
function createClickHandler(
	el: HTMLElement,
	options: ClickDelayOptions,
): (event: Event) => void {
	return (event: Event) => {
		const state: ClickDelayState = (el as any).__clickDelay

		if (!state || state.isPending) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		// Mark as pending
		state.isPending = true

		// Add visual feedback
		if (options.feedback && options.pendingClass) {
			el.classList.add(options.pendingClass)
		}

		// Call handler
		options.handler(event as MouseEvent | TouchEvent)

		// Set timeout to reset pending state
		state.timeoutId = setTimeout(() => {
			state.isPending = false
			state.timeoutId = null
			removePendingClass(el, options)
		}, options.delay)
	}
}

/**
 * Remove pending class from element
 */
function removePendingClass(el: HTMLElement, options: ClickDelayOptions): void {
	if (options.feedback && options.pendingClass) {
		el.classList.remove(options.pendingClass)
	}
}

/**
 * Parse time from argument
 * Supports formats: "300" | "300ms" | "1s"
 */
function parseTime(arg?: string): number | null {
	if (!arg) return null

	if (arg.endsWith('ms')) {
		return parseInt(arg, 10)
	}

	if (arg.endsWith('s')) {
		return parseFloat(arg) * 1000
	}

	const num = parseInt(arg, 10)
	return Number.isNaN(num) ? null : num
}

/**
 * Normalize options
 */
function normalizeOptions(
	binding: ClickDelayBinding | undefined,
	directiveBinding: DirectiveBinding<ClickDelayBinding>,
): ClickDelayOptions {
	const delay = parseTime(directiveBinding.arg) || 300

	if (typeof binding === 'function') {
		return {
			handler: binding,
			delay,
			disabled: false,
			pendingClass: 'v-click-delay--pending',
			feedback: true,
		}
	}

	if (!binding) {
		throw new Error('[Directix] v-click-delay: handler is required')
	}

	return {
		handler: binding.handler,
		delay: binding.delay ?? delay,
		disabled: binding.disabled ?? false,
		pendingClass: binding.pendingClass ?? 'v-click-delay--pending',
		feedback: binding.feedback ?? true,
	}
}

export default vClickDelay
