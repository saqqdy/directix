import type { App, Directive, Plugin } from 'vue'
import type { DirectiveInstallOptions } from '@directix/core'
import {
	vClickOutside,
	vCopy,
	vDebounce,
	vFocus,
	vThrottle,
} from './directives'

// Export all directives
export * from './directives'

// Export core utilities
export * from '@directix/core'

// Export shared utilities (excluding tools with the same name as directives)
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
// Export debounce and throttle utility functions separately (with aliases)
export {
	debounce as debounceFn,
	throttle as throttleFn,
} from '@directix/shared'

// All directives list
const allDirectives: Record<string, Directive> = {
	'click-outside': vClickOutside,
	copy: vCopy,
	debounce: vDebounce,
	throttle: vThrottle,
	focus: vFocus,
}

/**
 * Install all directives
 */
const install = (app: App, options: DirectiveInstallOptions = {}): void => {
	const { directives, all = false } = options

	if (all || !directives) {
		// Register all directives
		Object.entries(allDirectives).forEach(([name, directive]) => {
			app.directive(name, directive)
		})
	} else {
		// Register specified directives
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
 * Directix plugin
 */
export const Directix: Plugin = {
	install,
}
