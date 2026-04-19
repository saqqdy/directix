// Export plugin manager
/**
 * Directive Template System
 *
 * Provides a template-based approach for creating custom directives,
 * reducing boilerplate and enforcing best practices.
 */

import type { Directive } from 'vue'
import { defineDirective } from '@directix/core'

export * from './manager'

// Export plugin registry
export * from './registry'

// Export plugin types
export * from './types'

/**
 * Directive template options
 */
export interface DirectiveTemplateOptions<T = any, B extends Element = Element> {
	/** Directive name */
	name: string
	/** SSR safe */
	ssr?: boolean
	/** Default options */
	defaults?: Partial<T>
	/** Called when directive is mounted */
	onMount: (el: B, options: T, binding: any) => void
	/** Called when directive is updated */
	onUpdate?: (el: B, options: T, binding: any) => void
	/** Called when directive is unmounted */
	onUnmount: (el: B, state: Record<string, any>) => void
	/** Validate options */
	validate?: (options: T) => string | null
	/** Normalize binding value to options */
	normalize?: (binding: any) => T
}

/**
 * Create a directive from a template
 *
 * @example
 * ```ts
 * const vMyDirective = createDirectiveTemplate({
 *   name: 'my-directive',
 *   onMount(el, options) {
 *     el.style.color = options.color
 *   },
 *   onUpdate(el, options) {
 *     el.style.color = options.color
 *   },
 *   onUnmount(el) {
 *     el.style.color = ''
 *   },
 * })
 * ```
 */
export function createDirectiveTemplate<T = any, B extends Element = Element>(
	template: DirectiveTemplateOptions<T, B>,
): Directive {
	const {
		name,
		ssr = true,
		defaults,
		onMount,
		onUpdate,
		onUnmount,
		validate,
		normalize,
	} = template

	return defineDirective<any, B>({
		name,
		ssr,
		defaults,

		mounted(el, binding) {
			const options = normalize ? normalize(binding) : binding.value

			// Validate options
			if (validate) {
				const error = validate(options)
				if (error) {
					console.warn(`[Directix] v-${name}: ${error}`)
					return
				}
			}

			const state: Record<string, any> = {}
			onMount(el, options, binding)
			;(el as any).__directix_state = state
			;(el as any).__directix_options = options
		},

		updated(el, binding) {
			const options = normalize ? normalize(binding) : binding.value

			// Validate options
			if (validate) {
				const error = validate(options)
				if (error) {
					console.warn(`[Directix] v-${name}: ${error}`)
					return
				}
			}

			;(el as any).__directix_options = options
			onUpdate?.(el, options, binding)
		},

		unmounted(el) {
			const state = (el as any).__directix_state
			if (state) {
				onUnmount(el, state)
				delete (el as any).__directix_state
				delete (el as any).__directix_options
			}
		},
	})
}

/**
 * Create a simple event-based directive template
 *
 * @example
 * ```ts
 * const vTrack = createEventDirective({
 *   name: 'track',
 *   eventName: 'click',
 *   handler(el, binding, event) {
 *     analytics.track(binding.value, { element: el.tagName })
 *   },
 * })
 * ```
 */
export function createEventDirective(options: {
	name: string
	eventName: string
	handler: (el: HTMLElement, binding: any, event: Event) => void
	/** Options for addEventListener */
	listenerOptions?: boolean | AddEventListenerOptions
	ssr?: boolean
}): Directive {
	const { name, eventName, handler, listenerOptions, ssr = true } = options

	return defineDirective<any, HTMLElement>({
		name,
		ssr,

		mounted(el, binding) {
			const eventHandler = (event: Event): void => handler(el, binding, event)
			el.addEventListener(eventName, eventHandler, listenerOptions)
			;(el as any).__directix_event_handler = eventHandler
		},

		unmounted(el) {
			const eventHandler = (el as any).__directix_event_handler
			if (eventHandler) {
				el.removeEventListener(eventName, eventHandler, listenerOptions)
				delete (el as any).__directix_event_handler
			}
		},
	})
}

/**
 * Create a style-based directive template
 *
 * @example
 * ```ts
 * const vOpacity = createStyleDirective({
 *   name: 'opacity',
 *   cssProperty: 'opacity',
 *   defaultUnit: '',
 * })
 * ```
 */
export function createStyleDirective(options: {
	name: string
	/** CSS property name */
	cssProperty: string
	/** Default unit (e.g., 'px', '%') */
	defaultUnit?: string
	/** Validate value */
	validate?: (value: any) => boolean
	ssr?: boolean
}): Directive {
	const { name, cssProperty, defaultUnit = '', validate, ssr = true } = options

	return defineDirective<any, HTMLElement>({
		name,
		ssr,

		mounted(el, binding) {
			const value = binding.value
			if (validate && !validate(value)) {
				console.warn(`[Directix] v-${name}: Invalid value "${value}"`)
				return
			}

			const unit = typeof value === 'number' && defaultUnit ? defaultUnit : ''
			el.style.setProperty(cssProperty, `${value}${unit}`)
		},

		updated(el, binding) {
			const value = binding.value
			if (validate && !validate(value)) {
				console.warn(`[Directix] v-${name}: Invalid value "${value}"`)
				return
			}

			const unit = typeof value === 'number' && defaultUnit ? defaultUnit : ''
			el.style.setProperty(cssProperty, `${value}${unit}`)
		},

		unmounted(el) {
			el.style.removeProperty(cssProperty)
		},
	})
}
