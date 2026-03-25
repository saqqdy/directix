import type { VNode } from 'vue'
import type { DirectiveBinding, DirectiveHooks } from '../types'

/**
 * 元素状态存储
 */
interface ElementState {
	value: any
	vnode: VNode
	cleanup: (() => void)[]
}

/**
 * Vue 3 指令适配器
 * @returns Vue 3 directive object with created/mounted/updated/unmounted hooks
 */
export function createVue3Directive<T, B extends Element>(
	hooks: DirectiveHooks<T, B>,
): Record<string, any> {
	const directive = {
		created(el: B, binding: any, vnode: VNode) {
			// Vue 3 的 created 在元素创建时调用
			// 初始化状态
			const state: ElementState = {
				value: binding.value,
				vnode,
				cleanup: [],
			}

      ;(el as any).__directix_state__ = state
		},

		beforeMount(_el: B, _binding: any, _vnode: VNode) {
			// 挂载前
		},

		mounted(el: B, binding: any, vnode: VNode) {
			if (hooks.mounted) {
				hooks.mounted(el, normalizeBindingVue3(binding), vnode)
			}
		},

		beforeUpdate(_el: B, _binding: any, _vnode: VNode, _prevVnode: VNode) {
			// 更新前
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

			// 更新状态
			if (state) {
				state.value = binding.value
				state.vnode = vnode
			}
		},

		beforeUnmount(_el: B, _binding: any, _vnode: VNode) {
			// 卸载前
		},

		unmounted(el: B, binding: any, vnode: VNode) {
			if (hooks.unmounted) {
				hooks.unmounted(el, normalizeBindingVue3(binding), vnode)
			}

			// 执行清理函数
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
 * 标准化 Vue 3 binding
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
 * 添加清理函数到元素
 */
export function addCleanup(el: Element, fn: () => void): void {
	const state = (el as any).__directix_state__

	if (state) {
		state.cleanup.push(fn)
	}
}
