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
 * Vue 2 指令适配器
 * @returns Vue 2 directive object with bind/inserted/update/unbind hooks
 */
export function createVue2Directive<T, B extends Element>(
	hooks: DirectiveHooks<T, B>,
): Record<string, any> {
	const directive = {
		bind(el: B, binding: any, vnode: VNode) {
			// 存储状态
			const state: ElementState = {
				value: binding.value,
				vnode,
				cleanup: [],
			}

      ;(el as any).__directix_state__ = state

			// 调用 mounted
			if (hooks.mounted) {
				hooks.mounted(el, normalizeBinding(binding), vnode)
			}
		},

		inserted(_el: B, _binding: any, _vnode: VNode) {
			// Vue 2 的 inserted 在 DOM 插入后调用
			// 某些指令可能需要在这里执行 DOM 相关操作
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

			// 更新状态
			if (state) {
				state.value = binding.value
				state.vnode = vnode
			}
		},

		componentUpdated(_el: B, _binding: any, _vnode: VNode, _oldVnode: VNode) {
			// Vue 2 特有，组件更新完成后调用
			// 通常 update 已经足够
		},

		unbind(el: B, binding: any, vnode: VNode) {
			if (hooks.unmounted) {
				hooks.unmounted(el, normalizeBinding(binding), vnode)
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
 * 标准化 Vue 2 binding 为统一格式
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
 * 添加清理函数到元素
 */
export function addCleanup(el: Element, fn: () => void): void {
	const state = (el as any).__directix_state__

	if (state) {
		state.cleanup.push(fn)
	}
}
