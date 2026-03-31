/**
 * Event type modifiers for directives like v-debounce, v-throttle
 */

/**
 * Supported event type modifiers list
 */
export const EVENT_MODIFIERS = [
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

export type EventModifier = (typeof EVENT_MODIFIERS)[number]

/**
 * Extract event type from directive modifiers
 * @param modifiers - Directive modifiers object
 * @returns Event type if found, null otherwise
 *
 * @example
 * ```ts
 * // v-debounce.click="handler" -> 'click'
 * // v-debounce.scroll="handler" -> 'scroll'
 * getEventTypeFromModifiers({ click: true }) // 'click'
 * ```
 */
export function getEventTypeFromModifiers(modifiers: Record<string, boolean>): string | null {
	for (const modifier of EVENT_MODIFIERS) {
		if (modifiers[modifier]) {
			return modifier
		}
	}

	return null
}

/**
 * Get default event type for element
 * @param el - Target element
 * @returns Default event type based on element tag
 */
export function getDefaultEventType(el: HTMLElement): string {
	const tagName = el.tagName.toLowerCase()

	if (tagName === 'input' || tagName === 'textarea') {
		return 'input'
	}

	return 'click'
}
