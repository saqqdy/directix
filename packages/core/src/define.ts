import type { Directive } from 'vue'
import { isSSR, isVue2 } from './env'
import { createVue2Directive } from './adapter/vue2'
import { createVue3Directive } from './adapter/vue3'
import type { DirectiveBinding, DirectiveDefinition, DirectiveHooks } from './types'

/**
 * Define a cross-version compatible directive
 * @param definition The directive definition
 * @returns Vue directive object
 */
export function defineDirective<T = any, B extends Element = Element>(
	definition: DirectiveDefinition<T, B>,
): Directive {
	const { name, version, ssr, defaults, ...hooks } = definition

	// SSR check
	if (isSSR() && !ssr) {
		if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
			console.warn(
        `[Directix] Directive "${name}" is not compatible with SSR. ` +
        'It will be a no-op on the server side.',
			)
		}

		return createNoOpDirective()
	}

	// Wrap hooks with default values
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

	// Create directive based on Vue version
	if (isVue2()) {
		return createVue2Directive(wrappedHooks) as Directive
	}

	return createVue3Directive(wrappedHooks) as Directive
}

/**
 * Apply default values to binding
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
 * Create a no-op directive (for SSR)
 */
function createNoOpDirective(): Directive {
	return {
		mounted: () => {},
		updated: () => {},
		unmounted: () => {},
	}
}

/**
 * Define a directive group
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
