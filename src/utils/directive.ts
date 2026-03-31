/**
 * Directive utilities - high-level helpers for directive implementations
 * Layer: Directive (depends on @directix/core and @directix/shared)
 *
 * This module provides utilities specifically designed for directive implementations,
 * building on top of the low-level utilities in @directix/shared.
 */

import type { DirectiveBinding } from '@directix/core'
import { parseTime } from '@directix/shared'

// Re-export state management from shared for convenience
export { deleteState, getState, hasState, setState } from '@directix/shared'

/**
 * Options for creating a normalizer
 */
export interface NormalizerOptions<T> {
	/** Default values */
	defaults: T
	/** Key to use when binding is a function */
	handlerKey?: keyof T
	/** Key to use when binding is a string */
	valueKey?: keyof T
}

/**
 * Create a normalize function for directive options
 * @param options - Normalizer configuration
 * @returns Normalize function
 *
 * @example
 * ```ts
 * const normalize = createNormalizer({
 *   defaults: { capture: true, disabled: false },
 *   handlerKey: 'handler'
 * })
 *
 * // Function binding
 * normalize(fn) // { handler: fn, capture: true, disabled: false }
 *
 * // Object binding
 * normalize({ capture: false }) // { capture: false, disabled: false }
 * ```
 */
export function createNormalizer<T extends Record<string, any>>(
	options: NormalizerOptions<T>,
): (binding: unknown) => T {
	const { defaults, handlerKey, valueKey } = options

	return (binding: unknown): T => {
		// Handle function binding
		if (typeof binding === 'function' && handlerKey) {
			return { ...defaults, [handlerKey]: binding } as T
		}

		// Handle string binding
		if (typeof binding === 'string' && valueKey) {
			return { ...defaults, [valueKey]: binding } as T
		}

		// Handle boolean binding (e.g., v-ripple="false")
		if (typeof binding === 'boolean') {
			return { ...defaults, disabled: !binding } as T
		}

		// Handle object binding
		if (binding && typeof binding === 'object') {
			return { ...defaults, ...binding } as T
		}

		// Return defaults for undefined/null
		return { ...defaults } as T
	}
}

/**
 * Simple normalize function for common handler pattern
 * @param binding - Directive binding value
 * @param defaults - Default options
 * @returns Normalized options with handler
 *
 * @example
 * ```ts
 * // For directives like v-click-outside, v-long-press
 * normalizeHandlerOptions(fn, { disabled: false })
 * normalizeHandlerOptions({ handler: fn, disabled: true }, { disabled: false })
 * ```
 */
export function normalizeHandlerOptions<T extends { handler?: (...args: any[]) => any }>(
	binding: ((...args: any[]) => any) | T | undefined,
	defaults: Omit<T, 'handler'> & Partial<Pick<T, 'handler'>>,
): T {
	if (typeof binding === 'function') {
		return { ...defaults, handler: binding } as T
	}
	return { ...defaults, ...binding } as T
}

/**
 * Normalize options with time parsing from directive argument
 * @param binding - Directive binding value
 * @param directiveBinding - Full directive binding with arg
 * @param defaults - Default options
 * @returns Normalized options with parsed time
 *
 * @example
 * ```ts
 * // v-debounce:500="handler" or v-debounce:1s="handler"
 * normalizeTimeOptions(binding, binding, { wait: 300, handler: fn })
 * ```
 */
export function normalizeTimeOptions<T extends { handler?: (...args: any[]) => any, wait?: number }>(
	binding: ((...args: any[]) => any) | T | undefined,
	directiveBinding: DirectiveBinding<any>,
	defaults: Omit<T, 'handler'> & { wait: number },
): T {
	const wait = parseTime(directiveBinding.arg) || defaults.wait

	if (typeof binding === 'function') {
		return { ...defaults, handler: binding, wait } as T
	}

	return { ...defaults, ...binding, wait: binding?.wait ?? wait } as T
}

/**
 * Timer manager for directives that use setTimeout/setInterval
 * Automatically tracks and cleans up timers
 *
 * @example
 * ```ts
 * const timer = useTimer()
 *
 * timer.setTimeout(() => {}, 1000)
 * timer.setInterval(() => {}, 500)
 *
 * // Clean up all timers on unmount
 * timer.clearAll()
 * ```
 */
export function useTimer(): TimerManager {
	const timeouts = new Set<ReturnType<typeof setTimeout>>()
	const intervals = new Set<ReturnType<typeof setInterval>>()

	return {
		/**
		 * Set a timeout (tracked for cleanup)
		 */
		setTimeout(fn: () => void, delay: number): ReturnType<typeof setTimeout> {
			const id = setTimeout(() => {
				timeouts.delete(id)
				fn()
			}, delay)
			timeouts.add(id)
			return id
		},

		/**
		 * Clear a specific timeout
		 */
		clearTimeout(id: ReturnType<typeof setTimeout>): void {
			clearTimeout(id)
			timeouts.delete(id)
		},

		/**
		 * Set an interval (tracked for cleanup)
		 */
		setInterval(fn: () => void, delay: number): ReturnType<typeof setInterval> {
			const id = setInterval(fn, delay)
			intervals.add(id)
			return id
		},

		/**
		 * Clear a specific interval
		 */
		clearInterval(id: ReturnType<typeof setInterval>): void {
			clearInterval(id)
			intervals.delete(id)
		},

		/**
		 * Clear all tracked timers
		 */
		clearAll(): void {
			timeouts.forEach(id => clearTimeout(id))
			intervals.forEach(id => clearInterval(id))
			timeouts.clear()
			intervals.clear()
		},

		/**
		 * Check if there are any active timers
		 */
		hasActive(): boolean {
			return timeouts.size > 0 || intervals.size > 0
		},
	}
}

/**
 * Timer state interface
 */
export type TimerManager = ReturnType<typeof useTimer>
