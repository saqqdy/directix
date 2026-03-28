import { defineDirective } from '@directix/core'
import type { DirectiveBinding } from '@directix/core'

/**
 * Permission action mode
 */
export type PermissionAction = 'remove' | 'disable' | 'hide'

/**
 * Permission directive options
 */
export interface PermissionOptions {
	/**
	 * Permission value(s) to check
	 */
	value: string | string[]

	/**
	 * Logic for multiple permissions
	 * - 'some': any one permission is enough (OR)
	 * - 'every': all permissions are required (AND)
	 * @default 'some'
	 */
	mode?: 'some' | 'every'

	/**
	 * Action when permission is denied
	 * - 'remove': remove element from DOM
	 * - 'disable': disable element
	 * - 'hide': hide element
	 * @default 'remove'
	 */
	action?: PermissionAction

	/**
	 * Custom permission check function
	 */
	check?: (permission: string | string[], mode: 'some' | 'every') => boolean

	/**
	 * Callback when permission changes
	 */
	onChange?: (hasPermission: boolean) => void
}

/**
 * Directive binding value type
 */
export type PermissionBinding = string | string[] | PermissionOptions

/**
 * Permission configuration
 */
export interface PermissionConfig {
	/**
	 * Get current user's permissions
	 */
	getPermissions: () => string[]

	/**
	 * Get current user's roles
	 */
	getRoles?: () => string[]

	/**
	 * Role to permission mapping
	 */
	roleMap?: Record<string, string[]>
}

/**
 * Element state storage
 */
interface PermissionState {
	options: PermissionOptions
	originalDisplay: string
	originalDisabled: boolean | string
	parentNode: Node | null
	placeholder: Comment | null
}

// Global configuration
let globalConfig: PermissionConfig | null = null

/**
 * Configure permission directive
 */
export function configurePermission(config: PermissionConfig): void {
	globalConfig = config
}

/**
 * Get current configuration
 */
export function getPermissionConfig(): PermissionConfig | null {
	return globalConfig
}

/**
 * Normalize options
 */
function normalizeOptions(binding: PermissionBinding | undefined): PermissionOptions {
	if (!binding) {
		throw new Error('[Directix] v-permission: permission value is required')
	}

	if (typeof binding === 'string') {
		return { value: binding }
	}

	if (Array.isArray(binding)) {
		return { value: binding }
	}

	return binding
}

/**
 * Verify permission
 */
function verifyPermission(options: PermissionOptions): boolean {
	// Custom check function takes priority
	if (options.check) {
		return options.check(options.value, options.mode || 'some')
	}

	// Use global configuration
	if (!globalConfig) {
		console.warn('[Directix] v-permission: No permission config provided')

		return true
	}

	const permissions = globalConfig.getPermissions()
	const required = Array.isArray(options.value) ? options.value : [options.value]
	const mode = options.mode || 'some'

	// Check permissions
	const result =
		mode === 'every' ? required.every(p => permissions.includes(p)) : required.some(p => permissions.includes(p))

	// If failed and has role mapping, check roles too
	if (!result && globalConfig.getRoles && globalConfig.roleMap) {
		const roles = globalConfig.getRoles()

		for (const role of roles) {
			const rolePermissions = globalConfig.roleMap[role] || []
			const roleResult =
				mode === 'every' ? required.every(p => rolePermissions.includes(p)) : required.some(p => rolePermissions.includes(p))

			if (roleResult) return true
		}
	}

	return result
}

/**
 * Handle no permission state
 */
function handleNoPermission(el: HTMLElement, action: PermissionAction, state: PermissionState): void {
	switch (action) {
		case 'remove':
			// Store parent and create placeholder
			state.parentNode = el.parentNode
			state.placeholder = document.createComment('v-permission')
			el.parentNode?.insertBefore(state.placeholder, el)
			el.parentNode?.removeChild(el)
			break
		case 'disable':
			state.originalDisabled = el.getAttribute('disabled') || false
			el.setAttribute('disabled', 'true')
			el.classList.add('v-permission--disabled')
			break
		case 'hide':
			state.originalDisplay = el.style.display
			el.style.display = 'none'
			el.classList.add('v-permission--hidden')
			break
	}
}

/**
 * Restore element
 */
function restoreElement(el: HTMLElement, action: PermissionAction, state: PermissionState): void {
	switch (action) {
		case 'remove':
			// Re-insert element if it was removed
			if (state.placeholder && state.parentNode) {
				state.parentNode.insertBefore(el, state.placeholder)
				state.parentNode.removeChild(state.placeholder)
				state.placeholder = null
			}
			break
		case 'disable':
			if (state.originalDisabled === false) {
				el.removeAttribute('disabled')
			} else if (state.originalDisabled) {
				el.setAttribute('disabled', state.originalDisabled as string)
			}
			el.classList.remove('v-permission--disabled')
			break
		case 'hide':
			el.style.display = state.originalDisplay || ''
			el.classList.remove('v-permission--hidden')
			break
	}
}

/**
 * Check permission and update element
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionBinding>): void {
	let state: PermissionState = (el as any).__permission

	// Initialize state on first call
	if (!state) {
		state = {
			options: normalizeOptions(binding.value),
			originalDisplay: '',
			originalDisabled: false,
			parentNode: null,
			placeholder: null,
		}
		;(el as any).__permission = state
	} else {
		state.options = normalizeOptions(binding.value)
	}

	const hasPermission = verifyPermission(state.options)

	// Trigger change callback
	if (state.options.onChange) {
		state.options.onChange(hasPermission)
	}

	const action = state.options.action || 'remove'

	// Handle element based on permission
	if (!hasPermission) {
		handleNoPermission(el, action, state)
	} else {
		restoreElement(el, action, state)
	}
}

/**
 * v-permission directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-permission="'admin'">Admin Only</button>
 *   <button v-permission="['admin', 'editor']">Admin or Editor</button>
 *   <button v-permission="{ value: ['admin', 'editor'], mode: 'every' }">Admin and Editor</button>
 *   <button v-permission="{ value: 'admin', action: 'disable' }">Disabled for non-admin</button>
 * </template>
 *
 * <script setup>
 * import { configurePermission } from 'directix'
 *
 * configurePermission({
 *   getPermissions: () => store.getters.permissions,
 *   getRoles: () => store.getters.roles,
 *   roleMap: { admin: ['*'], editor: ['read', 'write'] }
 * })
 * </script>
 * ```
 */
export const vPermission = defineDirective<PermissionBinding, HTMLElement>({
	name: 'permission',
	ssr: true, // SSR compatible

	mounted(el, binding) {
		checkPermission(el, binding)
	},

	updated(el, binding) {
		checkPermission(el, binding)
	},

	unmounted(el) {
		const state: PermissionState = (el as any).__permission

		if (state?.placeholder && state.parentNode) {
			state.parentNode.removeChild(state.placeholder)
		}

		delete (el as any).__permission
	},
})

export default vPermission
