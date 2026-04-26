import type { VNode } from 'vue'
import type { DirectiveBinding, DirectiveHooks } from '../types'
import { markRaw, shallowReactive } from 'vue'

/**
 * Element state storage (Vue 3 optimized)
 */
interface ElementState {
	value: any
	vnode: VNode
	cleanup: (() => void)[]
}

/**
 * Create Vue 3 directive with optimizations
 * Uses markRaw for DOM elements and shallowReactive for state
 * @returns Vue 3 directive object
 */
export function createVue3Directive<T, B extends Element>(
	hooks: DirectiveHooks<T, B>,
): Record<string, any> {
	return {
		created(el: B, binding: any, vnode: VNode) {
			// Use shallowReactive for better performance with large objects
			// Only use markRaw for non-null/undefined values
			const state: ElementState = shallowReactive({
				value: binding.value != null ? markRaw(binding.value) : binding.value,
				vnode,
				cleanup: [],
			})

			// Store state on element
			;(el as any).__directix_state__ = state
		},

		beforeMount(_el: B, _binding: any, _vnode: VNode) {
			// Before mount hook (can be used for pre-mount setup)
		},

		mounted(el: B, binding: any, vnode: VNode) {
			if (hooks.mounted) {
				hooks.mounted(el, normalizeBinding(binding), vnode)
			}
		},

		beforeUpdate(_el: B, _binding: any, _vnode: VNode, _prevVnode: VNode) {
			// Before update hook
		},

		updated(el: B, binding: any, vnode: VNode, prevVnode: VNode) {
			const state: ElementState = (el as any).__directix_state__

			if (hooks.updated) {
				hooks.updated(
					el,
					normalizeBinding(binding),
					vnode,
					normalizeBinding({ ...binding, value: binding.oldValue }),
					prevVnode,
				)
			}

			// Update state
			if (state) {
				state.value = binding.value != null ? markRaw(binding.value) : binding.value
				state.vnode = vnode
			}
		},

		beforeUnmount(_el: B, _binding: any, _vnode: VNode) {
			// Before unmount hook
		},

		unmounted(el: B, binding: any, vnode: VNode) {
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
}

/**
 * Normalize Vue 3 binding to unified format
 */
function normalizeBinding<T>(binding: any): DirectiveBinding<T> {
	return {
		value: binding.value,
		oldValue: binding.oldValue ?? null,
		arg: binding.arg,
		modifiers: binding.modifiers || {},
		instance: binding.instance,
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
