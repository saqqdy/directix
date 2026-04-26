/**
 * Web Components Support for Directix
 *
 * This module provides utilities for using Directix directives
 * with Web Components / Custom Elements.
 */

import type { DirectiveBinding } from '@directix/core'
import type { Directive, VNode } from 'vue'

/**
 * Options for creating a custom element directive
 */
export interface CustomElementDirectiveOptions {
	/** The element name (must contain a hyphen) */
	name: string
	/** The Vue directive to apply */
	directive: Directive
	/** Default binding value */
	defaultValue?: any
	/** Whether to use shadow DOM */
	shadow?: boolean
	/** Shadow DOM mode */
	shadowMode?: 'open' | 'closed'
}

/**
 * Check if an element is a custom element
 */
export function isCustomElement(el: Element): boolean {
	return el.tagName.includes('-') || customElements.get(el.tagName.toLowerCase()) !== undefined
}

/**
 * Apply a Vue directive to a custom element
 *
 * @example
 * ```ts
 * import { vLazy } from 'directix'
 * import { applyDirectiveToCustomElement } from 'directix/web-components'
 *
 * const myElement = document.querySelector('my-component')
 * applyDirectiveToCustomElement(myElement, vLazy, { threshold: 0.5 })
 * ```
 */
export function applyDirectiveToCustomElement<T = any>(
	el: Element,
	directive: Directive,
	value?: T,
	options?: {
		arg?: string
		modifiers?: Record<string, boolean>
	},
): () => void {
	// Create a mock binding object
	const binding: DirectiveBinding<T> = {
		value: value as T,
		oldValue: null,
		arg: options?.arg,
		modifiers: options?.modifiers || {},
		instance: null,
	}

	// Create a mock VNode
	const vnode = { el } as unknown as VNode

	// Call mounted hook
	const mountedHook = (directive as any).mounted
	if (mountedHook) {
		mountedHook(el, binding, vnode, null)
	}

	// Return cleanup function
	return () => {
		const unmountedHook = (directive as any).unmounted
		if (unmountedHook) {
			unmountedHook(el, binding, vnode, null)
		}
	}
}

/**
 * Define a custom element that wraps a Vue directive
 *
 * @example
 * ```ts
 * import { vClickOutside, defineCustomElementDirective } from 'directix'
 *
 * defineCustomElementDirective({
 *   name: 'click-outside',
 *   directive: vClickOutside,
 * })
 *
 * // Now you can use: <click-outside></click-outside>
 * ```
 */
export function defineCustomElementDirective(
	options: CustomElementDirectiveOptions,
): void {
	const { name, directive, defaultValue, shadow = false, shadowMode = 'open' } = options

	class DirectiveCustomElement extends HTMLElement {
		private cleanup?: () => void
		private currentValue: any = defaultValue

		public constructor() {
			super()

			if (shadow) {
				this.attachShadow({ mode: shadowMode })
			}
		}

		public connectedCallback(): void {
			// Apply the directive when element is connected
			this.cleanup = applyDirectiveToCustomElement(
				this,
				directive,
				this.currentValue,
			)
		}

		public disconnectedCallback(): void {
			// Cleanup when element is removed
			if (this.cleanup) {
				this.cleanup()
				this.cleanup = undefined
			}
		}

		// Allow setting value via attribute
		public static get observedAttributes(): string[] {
			return ['value']
		}

		public attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
			if (attrName === 'value' && oldValue !== newValue) {
				this.currentValue = newValue

				// Re-apply directive with new value
				if (this.cleanup) {
					this.cleanup()
				}
				this.cleanup = applyDirectiveToCustomElement(
					this,
					directive,
					this.currentValue,
				)
			}
		}
	}

	customElements.define(name, DirectiveCustomElement)
}

/**
 * Create a directive element wrapper
 *
 * @example
 * ```ts
 * import { createDirectiveElement, vLazy } from 'directix'
 *
 * const LazyImage = createDirectiveElement('lazy-image', vLazy)
 * customElements.define('lazy-image', LazyImage)
 * ```
 */
export function createDirectiveElement(
	_name: string,
	directive: Directive,
	options?: Omit<CustomElementDirectiveOptions, 'name' | 'directive'>,
): CustomElementConstructor {
	const { defaultValue, shadow = false, shadowMode = 'open' } = options || {}

	return class extends HTMLElement {
		private cleanup?: () => void
		private currentValue: any = defaultValue

		public constructor() {
			super()

			if (shadow) {
				this.attachShadow({ mode: shadowMode })
			}
		}

		public connectedCallback(): void {
			this.cleanup = applyDirectiveToCustomElement(
				this,
				directive,
				this.currentValue,
			)
		}

		public disconnectedCallback(): void {
			if (this.cleanup) {
				this.cleanup()
				this.cleanup = undefined
			}
		}

		public static get observedAttributes(): string[] {
			return ['value']
		}

		public attributeChangedCallback(_attrName: string, oldValue: string, newValue: string): void {
			if (oldValue !== newValue) {
				this.currentValue = newValue

				if (this.cleanup) {
					this.cleanup()
				}
				this.cleanup = applyDirectiveToCustomElement(
					this,
					directive,
					this.currentValue,
				)
			}
		}
	}
}

/**
 * Register multiple directives as custom elements
 *
 * @example
 * ```ts
 * import { registerDirectiveElements, vLazy, vClickOutside } from 'directix'
 *
 * registerDirectiveElements({
 *   'lazy-img': vLazy,
 *   'click-outside': vClickOutside,
 * })
 * ```
 */
export function registerDirectiveElements(
	elements: Record<string, Directive>,
): void {
	Object.entries(elements).forEach(([elementName, elementDirective]) => {
		const elementClass = createDirectiveElement(elementName, elementDirective)
		customElements.define(elementName, elementClass)
	})
}
