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
 * Vue 3 directive adapter
 * @returns Vue 3 directive object with created/mounted/updated/unmounted hooks
 */
export function createVue3Directive<T, B extends Element>(
	hooks: DirectiveHooks<T, B>,
): Record<string, any> {
	const directive = {
		created(el: B, binding: any, vnode: VNode) {
			// Vue 3's created is called when element is created
			// Initialize state
			const state: ElementState = {
				value: binding.value,
				vnode,
				cleanup: [],
			}

      ;(el as any).__directix_state__ = state
		},

		beforeMount(_el: B, _binding: any, _vnode: VNode) {
			// Before mount
		},

		mounted(el: B, binding: any, vnode: VNode) {
			if (hooks.mounted) {
				hooks.mounted(el, normalizeBindingVue3(binding), vnode)
			}
		},

		beforeUpdate(_el: B, _binding: any, _vnode: VNode, _prevVnode: VNode) {
			// Before update
		},

		updated(el: B, binding: any, vnode: VNode, prevVnode: VNode) {
			const state: ElementState = (el as any).__directix_state__

			if (hooks.updated) {
				hooks.updated(
					el,
					normalizeBindingVue3(binding),
					vnode,
					normalizeBindingVue3({ ...binding, value: binding.oldValue }),
					prevVnode,
				)
			}

			// Update state
			if (state) {
				state.value = binding.value
				state.vnode = vnode
			}
		},

		beforeUnmount(_el: B, _binding: any, _vnode: VNode) {
			// Before unmount
		},

		unmounted(el: B, binding: any, vnode: VNode) {
			if (hooks.unmounted) {
				hooks.unmounted(el, normalizeBindingVue3(binding), vnode)
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
 * Normalize Vue 3 binding to unified format
 */
function normalizeBindingVue3<T>(binding: any): DirectiveBinding<T> {
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
