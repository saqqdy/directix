import type { App, Directive, Plugin } from 'vue'
import type { DirectiveInstallOptions } from '@directix/core'
import { setVueVersion } from '@directix/core'
import {
	vClickOutside,
	vCopy,
	vDebounce,
	vFocus,
	vHover,
	vInfiniteScroll,
	vIntersect,
	vLazy,
	vLoading,
	vLongPress,
	vMask,
	vMutation,
	vPermission,
	vResize,
	vRipple,
	vSanitize,
	vScroll,
	vSticky,
	vThrottle,
	vVisible,
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
	lazy: vLazy,
	intersect: vIntersect,
	visible: vVisible,
	loading: vLoading,
	scroll: vScroll,
	'infinite-scroll': vInfiniteScroll,
	sticky: vSticky,
	'long-press': vLongPress,
	hover: vHover,
	ripple: vRipple,
	mask: vMask,
	permission: vPermission,
	sanitize: vSanitize,
	resize: vResize,
	mutation: vMutation,
}

/**
 * Install all directives
 */
const install = (app: App | any, options: DirectiveInstallOptions = {}): void => {
	// Detect Vue version from app instance
	// Vue 2: app is the Vue constructor (has version static property, has directive static method)
	// Vue 3: app is an app instance (has config property, version on app.constructor or as _context)

	let vueVersion: 2 | 3 | null = null

	// Check if it's Vue 2 constructor
	if (typeof app === 'function' && app.version?.startsWith('2')) {
		vueVersion = 2
	} else if (app?.config && app?.version?.startsWith('3')) {
		// Check if it's Vue 3 app instance
		vueVersion = 3
	} else if (typeof app?.directive === 'function' && typeof app?.mixin === 'function' && app.version?.startsWith('2')) {
		// Check for Vue 2 static methods (directive, component, mixin, etc.)
		vueVersion = 2
	} else if (typeof window !== 'undefined') {
		// Fallback: check global Vue
		const win = window as any

		if (win.Vue?.version?.startsWith('2')) {
			vueVersion = 2
		} else if (win.Vue?.version?.startsWith('3')) {
			vueVersion = 3
		}
	}

	// Set the detected version
	if (vueVersion) {
		setVueVersion(vueVersion)
	}

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
