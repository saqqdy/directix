/**
 * Directive state management utilities
 * Layer: Shared (no Vue dependency)
 *
 * These are low-level utilities for storing state on DOM elements.
 * For higher-level directive utilities, see src/utils/directive.ts
 */

/**
 * State key prefix for storing directive state on elements
 */
const STATE_PREFIX = '__directix_'

/**
 * Set directive state on element
 * @param el - Target element
 * @param key - Directive name/key
 * @param state - State to store
 */
export function setState<E extends Element, T>(el: E, key: string, state: T): void {
	;(el as any)[STATE_PREFIX + key] = state
}

/**
 * Get directive state from element
 * @param el - Target element
 * @param key - Directive name/key
 * @returns Stored state or undefined
 */
export function getState<E extends Element, T>(el: E, key: string): T | undefined {
	return (el as any)[STATE_PREFIX + key]
}

/**
 * Delete directive state from element
 * @param el - Target element
 * @param key - Directive name/key
 */
export function deleteState<E extends Element>(el: E, key: string): void {
	delete (el as any)[STATE_PREFIX + key]
}

/**
 * Check if element has directive state
 * @param el - Target element
 * @param key - Directive name/key
 */
export function hasState<E extends Element>(el: E, key: string): boolean {
	return STATE_PREFIX + key in (el as any)
}
