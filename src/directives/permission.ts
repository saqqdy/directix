import { defineDirective } from '@directix/core'
import type { DirectiveBinding } from '@directix/core'

// ============ Types ============

/**
 * Permission action mode
 */
export type PermissionAction = 'remove' | 'disable' | 'hide'

/**
 * Permission check mode
 */
export type PermissionMode = 'some' | 'every'

/**
 * Permission directive options
 */
export interface PermissionOptions {
	/** Permission value(s) to check */
	value: string | string[]
	/** Logic for multiple permissions: 'some' (OR) or 'every' (AND). Default: 'some' */
	mode?: PermissionMode
	/** Action when permission denied. Default: 'remove' */
	action?: PermissionAction
	/** Custom permission check function */
	check?: (permission: string | string[], mode: PermissionMode) => boolean
	/** Callback when permission state changes */
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
	/** Get current user's permissions */
	getPermissions: () => string[]
	/** Get current user's roles */
	getRoles?: () => string[]
	/** Role to permission mapping */
	roleMap?: Record<string, string[]>
}

// ============ Constants ============

const STATE_KEY = '__permission' as const
const WILDCARD = '*' as const

// ============ State ============

interface ElementState {
	options: PermissionOptions
	originalDisplay: string
	originalDisabled: boolean | string
	parentNode: Node | null
	placeholder: Comment | null
}

// Global configuration
let globalConfig: PermissionConfig | null = null

// ============ Configuration ============

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

// ============ Helpers ============

/**
 * Normalize binding value to options object
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
 * Check if a permission is granted (supports wildcard)
 */
function hasPermission(required: string, permissions: string[]): boolean {
	return permissions.includes(WILDCARD) || permissions.includes(required)
}

/**
 * Verify permission against configuration
 */
function verifyPermission(options: PermissionOptions): boolean {
	// Custom check function takes priority
	if (options.check) {
		return options.check(options.value, options.mode || 'some')
	}

	// Require global configuration
	if (!globalConfig) {
		console.warn('[Directix] v-permission: No permission config provided')

		return true
	}

	const permissions = globalConfig.getPermissions()
	const roles = globalConfig.getRoles?.() || []
	const roleMap = globalConfig.roleMap || {}
	const required = Array.isArray(options.value) ? options.value : [options.value]
	const mode = options.mode || 'some'

	/**
	 * Check a single value - can be a role name or permission
	 */
	function checkSingle(value: string): boolean {
		// If value is a role name in roleMap, check if user has that role
		if (value in roleMap) {
			return roles.includes(value)
		}

		// Check direct permission
		if (hasPermission(value, permissions)) {
			return true
		}

		// Check if any of user's roles grant this permission
		for (const role of roles) {
			const rolePermissions = roleMap[role] || []

			if (hasPermission(value, rolePermissions)) {
				return true
			}
		}

		return false
	}

	return mode === 'every' ? required.every(checkSingle) : required.some(checkSingle)
}

/**
 * Handle element when permission is denied
 */
function handleDenied(el: HTMLElement, action: PermissionAction, state: ElementState): void {
	switch (action) {
		case 'remove':
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
 * Restore element when permission is granted
 */
function handleGranted(el: HTMLElement, action: PermissionAction, state: ElementState): void {
	switch (action) {
		case 'remove':
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
 * Get or create element state
 */
function getState(el: HTMLElement): ElementState {
	if (!(el as any)[STATE_KEY]) {
		;(el as any)[STATE_KEY] = {
			options: { value: '' },
			originalDisplay: '',
			originalDisabled: false,
			parentNode: null,
			placeholder: null,
		} as ElementState
	}

	return (el as any)[STATE_KEY]
}

/**
 * Check permission and update element state
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionBinding>): void {
	const state = getState(el)

	state.options = normalizeOptions(binding.value)

	const granted = verifyPermission(state.options)

	// Trigger change callback
	state.options.onChange?.(granted)

	const action = state.options.action || 'remove'

	if (granted) {
		handleGranted(el, action, state)
	} else {
		handleDenied(el, action, state)
	}
}

/**
 * Cleanup element state
 */
function cleanup(el: HTMLElement): void {
	const state: ElementState = (el as any)[STATE_KEY]

	if (state?.placeholder && state.parentNode) {
		state.parentNode.removeChild(state.placeholder)
	}

	delete (el as any)[STATE_KEY]
}

// ============ Directive ============

/**
 * v-permission directive
 *
 * Controls element visibility and state based on user permissions.
 * Supports role-based and permission-based access control with wildcard support.
 *
 * @example
 * ```vue
 * <template>
 *   <button v-permission="'admin'">Admin Only</button>
 *   <button v-permission="['admin', 'editor']">Admin or Editor</button>
 *   <button v-permission="{ value: ['read', 'write'], mode: 'every' }">Read & Write</button>
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
	ssr: true,

	mounted(el, binding) {
		checkPermission(el, binding)
	},

	updated(el, binding) {
		checkPermission(el, binding)
	},

	unmounted(el) {
		cleanup(el)
	},
})

export default vPermission
