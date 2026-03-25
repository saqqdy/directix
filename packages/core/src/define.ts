import type { Directive } from 'vue'
import { isSSR, isVue2 } from './env'
import { createVue2Directive } from './adapter/vue2'
import { createVue3Directive } from './adapter/vue3'
import type { DirectiveBinding, DirectiveDefinition, DirectiveHooks } from './types'

/**
 * 定义一个跨版本兼容的指令
 * @param definition 指令定义
 * @returns Vue 指令对象
 */
export function defineDirective<T = any, B extends Element = Element>(
	definition: DirectiveDefinition<T, B>,
): Directive {
	const { name, version, ssr, defaults, ...hooks } = definition

	// SSR 检查
	if (isSSR() && !ssr) {
		if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
			console.warn(
        `[Directix] Directive "${name}" is not compatible with SSR. ` +
        'It will be a no-op on the server side.',
			)
		}

		return createNoOpDirective()
	}

	// 应用默认值包装
	const wrappedHooks: DirectiveHooks<T, B> = {
		mounted: hooks.mounted ? (el, binding, vnode) => {
			const mergedBinding = applyDefaults(binding, defaults)

			hooks.mounted!(el, mergedBinding, vnode)
		} : undefined,

		updated: hooks.updated ? (el, binding, vnode, prevBinding, prevVnode) => {
			const mergedBinding = applyDefaults(binding, defaults)

			hooks.updated!(el, mergedBinding, vnode, prevBinding, prevVnode)
		} : undefined,

		unmounted: hooks.unmounted,
	}

	// 根据版本创建对应指令
	if (isVue2()) {
		return createVue2Directive(wrappedHooks) as Directive
	}

	return createVue3Directive(wrappedHooks) as Directive
}

/**
 * 应用默认值
 */
function applyDefaults<T>(
	binding: DirectiveBinding<T>,
	defaults?: Partial<T>,
): DirectiveBinding<T> {
	if (!defaults) return binding

	const value =
		typeof binding.value === 'object' && binding.value !== null ? { ...defaults, ...binding.value } : binding.value

	return { ...binding, value: value as T }
}

/**
 * 创建空操作指令（用于 SSR）
 */
function createNoOpDirective(): Directive {
	return {
		mounted: () => {},
		updated: () => {},
		unmounted: () => {},
	}
}

/**
 * 定义指令组
 */
export function defineDirectiveGroup(
	name: string,
	directives: Record<string, any>,
): { name: string; directives: Record<string, any>; install: (app: any) => void } {
	return {
		name,
		directives,
		install(app: any, _options?: any) {
			Object.entries(directives).forEach(([directiveName, directive]) => {
				const fullName = `${name}-${directiveName}`

				app.directive(fullName, directive)
			})
		},
	}
}
