import type { ComponentPublicInstance, Directive, VNode } from 'vue'

/**
 * Unified directive binding object
 */
export interface DirectiveBinding<T = any> {
	/** The value passed to the directive */
	value: T
	/** The previous value */
	oldValue: T | null
	/** The directive argument (v-xxx:arg) */
	arg?: string
	/** The modifiers object (v-xxx.modifier) */
	modifiers: Record<string, boolean>
	/** The component instance */
	instance: ComponentPublicInstance | null
}

/**
 * Unified directive hooks
 */
export interface DirectiveHooks<T = any, B extends Element = Element> {
	/**
	 * Called when the directive is bound to an element
	 * @param el The bound DOM element
	 * @param binding The binding object
	 * @param vnode The Vue virtual node
	 */
	mounted?: (el: B, binding: DirectiveBinding<T>, vnode: VNode) => void

	/**
	 * Called when the element is updated
	 * @param el The bound DOM element
	 * @param binding The new binding object
	 * @param vnode The new virtual node
	 * @param prevBinding The previous binding object
	 * @param prevVnode The previous virtual node
	 */
	updated?: (
		el: B,
		binding: DirectiveBinding<T>,
		vnode: VNode,
		prevBinding: DirectiveBinding<T>,
		prevVnode: VNode,
	) => void

	/**
	 * Called when the directive is unbound
	 * @param el The bound DOM element
	 * @param binding The binding object
	 * @param vnode The virtual node
	 */
	unmounted?: (el: B, binding: DirectiveBinding<T>, vnode: VNode) => void
}

/**
 * Directive definition interface
 */
export interface DirectiveDefinition<T = any, B extends Element = Element>
	extends DirectiveHooks<T, B> {
	/** The directive name */
	name: string
	/** The Vue version compatibility */
	version?: '2' | '3' | 'both'
	/** Whether SSR compatible */
	ssr?: boolean
	/** Default values */
	defaults?: Partial<T>
}

/**
 * Vue 2 directive hooks
 */
export interface Vue2DirectiveHooks {
	bind?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	inserted?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	update?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	componentUpdated?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	unbind?: (el: any, binding: any, vnode: any, oldVnode: any) => void
}

/**
 * Vue 3 directive hooks
 */
export interface Vue3DirectiveHooks {
	created?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	beforeMount?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	mounted?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	beforeUpdate?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	updated?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	beforeUnmount?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	unmounted?: (el: any, binding: any, vnode: any, prevVnode: any) => void
}

/**
 * Cross-version directive type (compatible with Vue 2/3)
 */
export type CrossVersionDirective = Directive | Vue2DirectiveHooks | Vue3DirectiveHooks

/**
 * Directive installation options
 */
export interface DirectiveInstallOptions {
	/** List of directive names to register, registers all if not provided */
	directives?: string[]
	/** Whether to register all directives */
	all?: boolean
	/** Global configuration */
	config?: Record<string, any>
}
