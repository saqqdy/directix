import type { VNode } from 'vue'
import type { DirectiveBinding, DirectiveHooks } from '../types'

/**
 * Element state storage
 */
interface ElementState {
	value: any
	vnode: VNode
	cleanup: (() => void)[]
}

/**
 * Vue 2 directive adapter
 * @returns Vue 2 directive object with bind/inserted/update/unbind hooks
 */
export function createVue2Directive<T, B extends Element>(
	hooks: DirectiveHooks<T, B>,
): Record<string, any> {
	const directive = {
		bind(el: B, binding: any, vnode: VNode) {
			// Store state
			const state: ElementState = {
				value: binding.value,
				vnode,
				cleanup: [],
			}

      ;(el as any).__directix_state__ = state
		},

		inserted(el: B, binding: any, vnode: VNode) {
			// Vue 2's inserted is called after element is inserted into DOM
			// Call mounted here to ensure element is in DOM
			if (hooks.mounted) {
				hooks.mounted(el, normalizeBinding(binding), vnode)
			}
		},

		update(el: B, binding: any, vnode: VNode, oldVnode: VNode) {
			const state = (el as any).__directix_state__

			if (hooks.updated) {
				hooks.updated(
					el,
					normalizeBinding(binding),
					vnode,
					normalizeBinding({ ...binding, value: binding.oldValue }),
					oldVnode,
				)
			}

			// Update state
			if (state) {
				state.value = binding.value
				state.vnode = vnode
			}
		},

		componentUpdated(_el: B, _binding: any, _vnode: VNode, _oldVnode: VNode) {
			// Vue 2 specific, called after component update completes
			// Usually update is sufficient
		},

		unbind(el: B, binding: any, vnode: VNode) {
			if (hooks.unmounted) {
				hooks.unmounted(el, normalizeBinding(binding), vnode)
			}

			// Execute cleanup functions
			const state: ElementState = (el as any).__directix_state__

			if (state?.cleanup) {
				state.cleanup.forEach(fn => fn())
			}
			delete (el as any).__directix_state__
		},
	}

	return directive
}

/**
 * Normalize Vue 2 binding to unified format
 */
function normalizeBinding<T>(binding: any): DirectiveBinding<T> {
	return {
		value: binding.value,
		oldValue: binding.oldValue ?? null,
		arg: binding.arg,
		modifiers: binding.modifiers || {},
		instance: binding.instance || null,
	}
}

/**
 * Add cleanup function to element
 */
export function addCleanup(el: Element, fn: () => void): void {
	const state = (el as any).__directix_state__

	if (state) {
		state.cleanup.push(fn)
	}
}
