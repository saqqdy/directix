import { defineDirective } from '@directix/core'
import { parseTime, throttle } from '@directix/shared'
import type { DirectiveBinding } from '@directix/core'

/**
 * Throttled function type
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void
	cancel: () => void
}

/**
 * Throttle directive options
 */
export interface ThrottleOptions<T extends (...args: any[]) => any = any> {
	/**
   * Function to throttle
   */
	handler: T

	/**
   * Delay time in milliseconds
   * @default 300
   */
	wait?: number

	/**
   * Whether to invoke immediately before delay starts
   * @default true
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
export type ThrottleBinding<T extends (...args: any[]) => any = any> =
  | T
  | ThrottleOptions<T>

/**
 * Element state storage
 */
interface ThrottleState {
	throttledFn: ThrottledFunction<any>
	eventType: string
	options: ThrottleOptions
}

/**
 * v-throttle directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-throttle="handleClick">Throttled Button</button>
 *   <button v-throttle:1s="handleClick">1s Throttled</button>
 *   <div v-throttle.scroll="handleScroll">Scroll Throttle</div>
 *   <div v-throttle:100.scroll="handleScroll">100ms Scroll Throttle</div>
 * </template>
 * ```
 */
export const vThrottle = defineDirective<ThrottleBinding, HTMLElement>({
	name: 'throttle',
	ssr: true, // SSR safe - event binding is skipped on server
	defaults: {
		wait: 300,
		leading: true,
		trailing: true,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value, binding)
		// Prefer event type from modifiers, otherwise infer from element type
		const eventType = getEventTypeFromModifiers(binding.modifiers) || getEventType(el)

		// Create throttled function
		const throttledFn = throttle(options.handler, options.wait, {
			leading: options.leading,
			trailing: options.trailing,
		})

		// Bind event
		el.addEventListener(eventType, throttledFn as any)

		;(el as any).__throttle = {
			throttledFn,
			eventType,
			options,
		}
	},

	updated(el, binding) {
		const state: ThrottleState = (el as any).__throttle

		if (!state) return

		const newOptions = normalizeOptions(binding.value, binding)

		// If configuration changes, recreate throttled function
		if (
			newOptions.wait !== state.options.wait ||
			newOptions.leading !== state.options.leading ||
			newOptions.trailing !== state.options.trailing
		) {
			// Cancel old one
			state.throttledFn.cancel()

			// Create new one
			const throttledFn = throttle(newOptions.handler, newOptions.wait, {
				leading: newOptions.leading,
				trailing: newOptions.trailing,
			})

			el.removeEventListener(state.eventType, state.throttledFn as any)
			el.addEventListener(state.eventType, throttledFn as any)

			;(el as any).__throttle = {
				throttledFn,
				eventType: state.eventType,
				options: newOptions,
			}
		} else if (newOptions.handler !== state.options.handler) {
			// Only update handler
			state.options.handler = newOptions.handler
		}
	},

	unmounted(el) {
		const state: ThrottleState = (el as any).__throttle

		if (!state) return

		state.throttledFn.cancel()
		el.removeEventListener(state.eventType, state.throttledFn as any)
		delete (el as any).__throttle
	},
})

/**
 * Normalize options
 */
function normalizeOptions(
	binding: ThrottleBinding,
	directiveBinding: DirectiveBinding<ThrottleBinding>,
): ThrottleOptions {
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

export default vThrottle
