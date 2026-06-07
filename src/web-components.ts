/**
 * Web Components Support for Directix
 *
 * This module provides utilities for using Directix directives
 * with Web Components / Custom Elements.
 *
 * @module web-components
 * @version 2.1.0
 */

import type { DirectiveBinding } from '@directix/core'
import type { Directive, VNode } from 'vue'

// ============================================================================
// Types
// ============================================================================

/**
 * Lifecycle hooks for custom element
 */
export interface CustomElementLifecycleHooks {
	/** Called when element is connected to DOM */
	onConnect?: (el: HTMLElement) => void
	/** Called when element is disconnected from DOM */
	onDisconnect?: (el: HTMLElement) => void
	/** Called when element is adopted to a new document */
	onAdopt?: (el: HTMLElement) => void
	/** Called when an attribute changes */
	onAttributeChange?: (el: HTMLElement, name: string, oldValue: string | null, newValue: string | null) => void
}

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
	/** CSS styles to inject into shadow DOM (v2.1.0) */
	styles?: string | string[]
	/** Attributes to observe for changes (v2.1.0) */
	observedAttributes?: string[]
	/** Lifecycle hooks (v2.1.0) */
	lifecycle?: CustomElementLifecycleHooks
	/** Enable slot content projection (v2.1.0) */
	slots?: boolean
}

/**
 * SSR-safe custom element result (v2.1.0)
 */
export interface SSRSafeCustomElement {
	elementClass: CustomElementConstructor
	ssrRender: (attrs?: Record<string, string>) => string
}

// ============================================================================
// Core Functions
// ============================================================================

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

// ============================================================================
// v2.1.0 Enhanced Functions
// ============================================================================

/**
 * Check if custom element is defined
 *
 * @param name - Element name
 * @returns True if element is defined
 *
 * @example
 * ```ts
 * import { isCustomElementDefined } from 'directix'
 *
 * if (!isCustomElementDefined('lazy-img')) {
 *   customElements.define('lazy-img', LazyImage)
 * }
 * ```
 */
export function isCustomElementDefined(name: string): boolean {
	return customElements.get(name) !== undefined
}

/**
 * Wait for custom element to be defined
 *
 * @param name - Element name
 * @returns Promise that resolves when element is defined
 *
 * @example
 * ```ts
 * import { whenCustomElementDefined } from 'directix'
 *
 * await whenCustomElementDefined('lazy-img')
 * // Element is now ready to use
 * ```
 */
export async function whenCustomElementDefined(name: string): Promise<void> {
	await customElements.whenDefined(name)
}

/**
 * Get all registered custom element names
 *
 * @returns Array of custom element names
 *
 * @example
 * ```ts
 * import { getRegisteredCustomElements } from 'directix'
 *
 * const elements = getRegisteredCustomElements()
 * console.log('Registered:', elements)
 * ```
 */
export function getRegisteredCustomElements(): string[] {
	// Access internal registry if available
	const registry = (customElements as any).__registry
	if (registry && typeof registry.keys === 'function') {
		return Array.from(registry.keys())
	}
	return []
}

/**
 * Hydrate custom elements on the client (SSR support)
 *
 * @param root - Root element to hydrate
 *
 * @example
 * ```ts
 * import { hydrateCustomElements, registerDirectiveElements } from 'directix'
 *
 * // Register directives first
 * registerDirectiveElements({ 'lazy-img': vLazy })
 *
 * // Then hydrate
 * hydrateCustomElements(document.body)
 * ```
 */
export function hydrateCustomElements(root: Element = document.body): void {
	const customElementsList = root.querySelectorAll('*')
	customElementsList.forEach(el => {
		if (isCustomElement(el)) {
			// Trigger re-connection to apply directive
			const clone = el.cloneNode(true)
			el.parentNode?.replaceChild(clone, el)
		}
	})
}

/**
 * Create SSR-safe custom element with declarative shadow DOM support
 *
 * @param name - Element name
 * @param directive - Vue directive
 * @param options - Element options
 * @returns SSR-safe custom element definition
 *
 * @example
 * ```ts
 * import { createSSRSafeCustomElement, vLazy } from 'directix'
 *
 * const LazyImage = createSSRSafeCustomElement('lazy-image', vLazy, {
 *   shadow: true,
 *   styles: ':host { display: block; }',
 * })
 *
 * // SSR render
 * const html = LazyImage.ssrRender({ src: 'image.jpg' })
 *
 * // Register in browser
 * if (typeof window !== 'undefined') {
 *   customElements.define('lazy-image', LazyImage.elementClass)
 * }
 * ```
 */
export function createSSRSafeCustomElement(
	name: string,
	directive: Directive,
	options?: Omit<CustomElementDirectiveOptions, 'name' | 'directive'>,
): SSRSafeCustomElement {
	const { styles, shadow = false } = options || {}

	// SSR render function
	const ssrRender = (attrs: Record<string, string> = {}): string => {
		const attrString = Object.entries(attrs)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ')

		if (shadow) {
			// Declarative Shadow DOM for SSR
			const stylesString = styles ? `<style>${Array.isArray(styles) ? styles.join('') : styles}</style>` : ''

			return `<${name} ${attrString}><template shadowroot="open">${stylesString}<slot></slot></template></${name}>`
		}

		return `<${name} ${attrString}></${name}>`
	}

	// Create element class (only in browser)
	const elementClass = typeof window === 'undefined' ? class extends HTMLElement {} as CustomElementConstructor : createDirectiveElement(name, directive, options)

	return {
		elementClass,
		ssrRender,
	}
}
