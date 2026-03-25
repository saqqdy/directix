import type { App, Directive, Plugin } from 'vue'
import type { DirectiveInstallOptions } from '@directix/core'
import {
	vClickOutside,
	vCopy,
	vDebounce,
	vFocus,
	vThrottle,
} from './directives'

// 导出所有指令
export * from './directives'

// 导出核心工具
export * from '@directix/core'

// 导出共享工具（排除与指令同名的工具）
export {
	isString,
	isNumber,
	isBoolean,
	isFunction,
	isObject,
	isArray,
	isEmpty,
	isPromise,
	deepClone,
	deepMerge,
	get,
	set,
	parseTime,
	generateId,
} from '@directix/shared'
// 单独导出 debounce 和 throttle 工具函数（带别名）
export {
	debounce as debounceFn,
	throttle as throttleFn,
} from '@directix/shared'

// 所有指令列表
const allDirectives: Record<string, Directive> = {
	'click-outside': vClickOutside,
	copy: vCopy,
	debounce: vDebounce,
	throttle: vThrottle,
	focus: vFocus,
}

/**
 * 安装所有指令
 */
const install = (app: App, options: DirectiveInstallOptions = {}): void => {
	const { directives, all = false } = options

	if (all || !directives) {
		// 注册所有指令
		Object.entries(allDirectives).forEach(([name, directive]) => {
			app.directive(name, directive)
		})
	} else {
		// 注册指定指令
		directives.forEach(name => {
			const directive = allDirectives[name]

			if (directive) {
				app.directive(name, directive)
			} else {
				console.warn(`[Directix] Unknown directive: ${name}`)
			}
		})
	}
}

/**
 * Directix 插件
 */
export const Directix: Plugin = {
	install,
}
