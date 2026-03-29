import { defineDirective } from '@directix/core'
import { debounce, parseTime } from '@directix/shared'
import type { DirectiveBinding } from '@directix/core'

/**
 * Debounced function type
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void
	cancel: () => void
	flush: () => void
}

/**
 * Debounce directive options
 */
export interface DebounceOptions<T extends (...args: any[]) => any = any> {
	/**
   * Function to debounce
   */
	handler: T

	/**
   * Delay time in milliseconds
   * @default 300
   */
	wait?: number

	/**
   * Whether to invoke immediately before delay starts
   * @default false
   */
	leading?: boolean

	/**
   * Whether to invoke after delay ends
   * @default true
   */
	trailing?: boolean
}

/**
 * Directive binding value type
 */
export type DebounceBinding<T extends (...args: any[]) => any = any> =
  | T
  | DebounceOptions<T>

/**
 * Element state storage
 */
interface DebounceState {
	debouncedFn: DebouncedFunction<any>
	eventType: string
	options: DebounceOptions
}

/**
 * v-debounce directive
 *
 * @example
 * ```vue
 * <template>
 *   <input v-debounce="handleInput" />
 *   <input v-debounce:500ms="handleInput" />
 *   <input v-debounce="{ handler: handleInput, wait: 500 }" />
 *   <div v-debounce.scroll="handleScroll">Scroll Debounce</div>
 *   <div v-debounce:100.scroll="handleScroll">100ms Scroll Debounce</div>
 * </template>
 * ```
 */
export const vDebounce = defineDirective<DebounceBinding, HTMLElement>({
	name: 'debounce',
	ssr: true, // SSR safe - event binding is skipped on server
	defaults: {
		wait: 300,
		leading: false,
		trailing: true,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value, binding)
		// Prefer event type from modifiers, otherwise infer from element type
		const eventType = getEventTypeFromModifiers(binding.modifiers) || getEventType(el)

		// Create debounced function
		const debouncedFn = debounce(options.handler, options.wait, {
			leading: options.leading,
			trailing: options.trailing,
		})

		// Bind event
		el.addEventListener(eventType, debouncedFn as any)

		;(el as any).__debounce = {
			debouncedFn,
			eventType,
			options,
		}
	},

	updated(el, binding) {
		const state: DebounceState = (el as any).__debounce

		if (!state) return

		const newOptions = normalizeOptions(binding.value, binding)

		// If configuration changes, recreate debounced function
		if (
			newOptions.wait !== state.options.wait ||
			newOptions.leading !== state.options.leading ||
			newOptions.trailing !== state.options.trailing
		) {
			// Cancel old one
			state.debouncedFn.cancel()

			// Create new one
			const debouncedFn = debounce(newOptions.handler, newOptions.wait, {
				leading: newOptions.leading,
				trailing: newOptions.trailing,
			})

			el.removeEventListener(state.eventType, state.debouncedFn as any)
			el.addEventListener(state.eventType, debouncedFn as any)

			;(el as any).__debounce = {
				debouncedFn,
				eventType: state.eventType,
				options: newOptions,
			}
		} else if (newOptions.handler !== state.options.handler) {
			// Only update handler
			state.options.handler = newOptions.handler
		}
	},

	unmounted(el) {
		const state: DebounceState = (el as any).__debounce

		if (!state) return

		state.debouncedFn.cancel()
		el.removeEventListener(state.eventType, state.debouncedFn as any)
		delete (el as any).__debounce
	},
})

/**
 * Normalize options
 */
function normalizeOptions(
	binding: DebounceBinding,
	directiveBinding: DirectiveBinding<DebounceBinding>,
): DebounceOptions {
	const wait = parseTime(directiveBinding.arg) || 300

	if (typeof binding === 'function') {
		return { handler: binding, wait }
	}

	return { ...binding, wait: binding.wait || wait }
}

/**
 * Get default event type for element
 */
function getEventType(el: HTMLElement): string {
	const tagName = el.tagName.toLowerCase()

	if (tagName === 'input' || tagName === 'textarea') {
		return 'input'
	}

	return 'click'
}

/**
 * Supported event type modifiers list
 */
const EVENT_MODIFIERS = [
	'click',
	'input',
	'change',
	'submit',
	'scroll',
	'resize',
	'mouseenter',
	'mouseleave',
	'mousemove',
	'mousedown',
	'mouseup',
	'keydown',
	'keyup',
	'focus',
	'blur',
	'touchstart',
	'touchmove',
	'touchend',
] as const

/**
 * Extract event type from modifiers
 */
function getEventTypeFromModifiers(modifiers: Record<string, boolean>): string | null {
	for (const modifier of EVENT_MODIFIERS) {
		if (modifiers[modifier]) {
			return modifier
		}
	}

	return null
}

export default vDebounce
