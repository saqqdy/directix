import { defineDirective } from '@directix/core'
import { getElement, off, on } from '@directix/shared'

/**
 * Click outside handler
 */
export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void

/**
 * Click outside directive options
 */
export interface ClickOutsideOptions {
	/**
   * Callback when clicking outside
   * @required
   */
	handler: ClickOutsideHandler

	/**
   * Excluded element selectors or element references
   */
	exclude?: (string | HTMLElement | (() => HTMLElement | null))[]

	/**
   * Whether to use capture mode
   * @default true
   */
	capture?: boolean

	/**
   * Event types to listen for
   * @default ['click']
   */
	events?: ('click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend')[]

	/**
   * Whether to disable
   * @default false
   */
	disabled?: boolean

	/**
   * Stop propagation
   * @default false
   */
	stop?: boolean

	/**
   * Prevent default behavior
   * @default false
   */
	prevent?: boolean
}

/**
 * Directive binding value type
 */
export type ClickOutsideBinding = ClickOutsideHandler | ClickOutsideOptions

/**
 * Element state storage
 */
interface ClickOutsideState {
	options: ClickOutsideOptions
	handlers: Map<string, (event: Event) => void>
}

/**
 * v-click-outside directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-click-outside="handleClickOutside">
 *     Dropdown menu
 *   </div>
 * </template>
 * ```
 */
export const vClickOutside = defineDirective<ClickOutsideBinding, HTMLElement>({
	name: 'click-outside',
	ssr: false,
	defaults: {
		capture: true,
		events: ['click'],
		disabled: false,
		stop: false,
		prevent: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		const state: ClickOutsideState = {
			options,
			handlers: new Map(),
		}

    ;(el as any).__clickOutside = state

		// Create event handler
		const createHandler = (_eventType: string) => {
			return (event: Event) => {
				// Check event target
				if (!isValidClick(el, event, options)) {
					return
				}

				// Stop propagation
				if (options.stop) {
					event.stopPropagation()
				}

				// Prevent default behavior
				if (options.prevent) {
					event.preventDefault()
				}

				// Call handler
				options.handler(event as MouseEvent | TouchEvent)
			}
		}

		// Bind events
		options.events!.forEach(eventType => {
			const handler = createHandler(eventType)

			state.handlers.set(eventType, handler)

			const listenerOptions = {
				capture: options.capture,
				passive: !options.prevent,
			}

			on(document, eventType, handler, listenerOptions)
		})
	},

	updated(el, binding) {
		const state: ClickOutsideState = (el as any).__clickOutside

		if (!state) return

		const oldOptions = state.options
		const newOptions = normalizeOptions(binding.value)

		// If disabled state changes
		if (oldOptions.disabled !== newOptions.disabled) {
			if (newOptions.disabled) {
				// Remove all listeners
				state.handlers.forEach((handler, eventType) => {
					off(document, eventType, handler, { capture: oldOptions.capture })
				})
				state.handlers.clear()
			} else {
				// Re-add listeners
				const createHandler = (_eventType: string) => {
					return (event: Event) => {
						if (!isValidClick(el, event, newOptions)) return
						if (newOptions.stop) event.stopPropagation()
						if (newOptions.prevent) event.preventDefault()
						newOptions.handler(event as MouseEvent | TouchEvent)
					}
				}

				newOptions.events!.forEach(eventType => {
					const handler = createHandler(eventType)

					state.handlers.set(eventType, handler)
					on(document, eventType, handler, {
						capture: newOptions.capture,
						passive: !newOptions.prevent,
					})
				})
			}
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: ClickOutsideState = (el as any).__clickOutside

		if (!state) return

		// Remove all event listeners
		state.handlers.forEach((handler, eventType) => {
			off(document, eventType, handler, { capture: state.options.capture })
		})

		delete (el as any).__clickOutside
	},
})

/**
 * Normalize options
 */
function normalizeOptions(binding: ClickOutsideBinding | undefined): ClickOutsideOptions {
	if (typeof binding === 'function') {
		return {
			handler: binding,
			capture: true,
			events: ['click'],
			disabled: false,
			stop: false,
			prevent: false,
		}
	}

	if (!binding) {
		throw new Error('[Directix] v-click-outside: handler is required')
	}

	return {
		capture: binding.capture ?? true,
		events: binding.events ?? ['click'],
		disabled: binding.disabled ?? false,
		stop: binding.stop ?? false,
		prevent: binding.prevent ?? false,
		...binding,
	}
}

/**
 * Check if click is valid (outside the element)
 */
function isValidClick(
	el: HTMLElement,
	event: Event,
	options: ClickOutsideOptions,
): boolean {
	const target = event.target as Node

	// Check if clicked on element itself or its children
	if (el.contains(target)) {
		return false
	}

	// Check excluded elements
	if (options.exclude?.length) {
		for (const exclude of options.exclude) {
			const excludeEl = typeof exclude === 'function' ? exclude() : getElement(exclude)

			if (excludeEl && (excludeEl === target || excludeEl.contains(target))) {
				return false
			}
		}
	}

	return true
}

export default vClickOutside
