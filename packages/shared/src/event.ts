import { isBrowser, supportsPassive } from '@directix/core'

export interface EventOptions {
	capture?: boolean
	passive?: boolean
	once?: boolean
}

/**
 * Add event listener
 */
export function on(
	target: EventTarget,
	event: string,
	handler: (event: Event) => void,
	options: boolean | EventOptions = false,
): void {
	if (!isBrowser()) return
	const opts = normalizeOptions(options)

	target.addEventListener(event, handler, opts)
}

/**
 * Remove event listener
 */
export function off(
	target: EventTarget,
	event: string,
	handler: (event: Event) => void,
	options: boolean | EventOptions = false,
): void {
	if (!isBrowser()) return
	const opts = normalizeOptions(options)

	target.removeEventListener(event, handler, opts)
}

/**
 * Emit custom event
 */
export function emit(target: EventTarget, event: string, detail?: any): boolean {
	if (!isBrowser()) return false

	return target.dispatchEvent(new CustomEvent(event, { detail }))
}

/**
 * Normalize event options
 */
function normalizeOptions(options: boolean | EventOptions): boolean | { capture: boolean, passive: boolean, once: boolean } {
	if (typeof options === 'boolean') {
		return options
	}

	const { capture = false, passive = false, once = false } = options

	if (supportsPassive()) {
		return { capture, passive, once }
	}

	return capture
}

/**
 * Create event delegation
 */
export function delegate(
	container: Element,
	selector: string,
	event: string,
	handler: (el: Element, e: Event) => void,
	options?: EventOptions,
): () => void {
	const listener = (e: Event): void => {
		const target = e.target as Element
		const matched = target.closest(selector)

		if (matched && container.contains(matched)) {
			handler(matched, e)
		}
	}

	on(container, event, listener, options)

	return () => off(container, event, listener, options)
}

/**
 * Stop event propagation
 */
export function stopPropagation(e: Event): void {
	e.stopPropagation()
}

/**
 * Prevent default behavior
 */
export function preventDefault(e: Event): void {
	e.preventDefault()
}

/**
 * Stop event propagation and prevent default behavior
 */
export function stopEvent(e: Event): void {
	stopPropagation(e)
	preventDefault(e)
}

/**
 * Get event target
 */
export function getEventTarget<T extends EventTarget = EventTarget>(e: Event): T | null {
	return e.target as T | null
}

/**
 * Get current event target
 */
export function getCurrentTarget<T extends EventTarget = EventTarget>(e: Event): T | null {
	return e.currentTarget as T | null
}

/**
 * Get mouse/touch position from event
 */
export function getEventPosition(
	e: MouseEvent | TouchEvent,
): { x: number, y: number, clientX: number, clientY: number } {
	let clientX = 0,
		clientY = 0

	if ('touches' in e && e.touches.length > 0) {
		clientX = e.touches[0].clientX
		clientY = e.touches[0].clientY
	} else if ('clientX' in e) {
		clientX = e.clientX
		clientY = e.clientY
	}

	return {
		x: clientX,
		y: clientY,
		clientX,
		clientY,
	}
}

/**
 * Event handlers map for batch binding
 */
export type EventHandlerMap = Record<string, (event: Event) => void>

/**
 * Bind multiple events to a target
 * @param target - Event target
 * @param events - Map of event names to handlers
 * @param options - Event options
 * @returns Cleanup function to unbind all events
 *
 * @example
 * ```ts
 * const cleanup = bindEvents(el, {
 *   touchstart: handleStart,
 *   touchmove: handleMove,
 *   touchend: handleEnd,
 * })
 *
 * // Later, clean up
 * cleanup()
 * ```
 */
export function bindEvents(
	target: EventTarget,
	events: EventHandlerMap,
	options: boolean | EventOptions = false,
): () => void {
	Object.entries(events).forEach(([event, handler]) => {
		target.addEventListener(event, handler, typeof options === 'boolean' ? options : normalizeOptionsObject(options))
	})

	return () => {
		Object.entries(events).forEach(([event, handler]) => {
			target.removeEventListener(event, handler, typeof options === 'boolean' ? options : normalizeOptionsObject(options))
		})
	}
}

/**
 * Normalize event options (internal use for bindEvents)
 */
function normalizeOptionsObject(options: EventOptions): boolean | { capture: boolean, passive: boolean, once: boolean } {
	const { capture = false, passive = false, once = false } = options

	if (supportsPassive()) {
		return { capture, passive, once }
	}

	return capture
}

/**
 * Create a keyboard event matcher
 * @param key - Key to match
 * @param modifiers - Required modifiers
 * @returns Matcher function
 */
export function createKeyMatcher(
	key: string,
	modifiers?: { ctrl?: boolean, alt?: boolean, shift?: boolean, meta?: boolean },
): (event: KeyboardEvent) => boolean {
	const normalizedKey = key.toLowerCase()

	return (event: KeyboardEvent): boolean => {
		if (event.key.toLowerCase() !== normalizedKey) return false

		if (modifiers) {
			if (modifiers.ctrl && !event.ctrlKey) return false
			if (modifiers.alt && !event.altKey) return false
			if (modifiers.shift && !event.shiftKey) return false
			if (modifiers.meta && !event.metaKey) return false

			// Check that no extra modifiers are pressed
			if (!modifiers.ctrl && event.ctrlKey) return false
			if (!modifiers.alt && event.altKey) return false
			if (!modifiers.shift && event.shiftKey) return false
			if (!modifiers.meta && event.metaKey) return false
		}

		return true
	}
}
