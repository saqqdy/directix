import { readonly, ref, type Ref, unref, watch } from 'vue'

/**
 * Permission check mode
 */
export type PermissionMode = 'some' | 'every'

/**
 * Options for usePermission composable
 */
export interface UsePermissionOptions {
	/**
	 * Permission value(s) to check
	 */
	value: string | string[] | Ref<string | string[]>

	/**
	 * Logic for multiple permissions: 'some' (OR) or 'every' (AND)
	 * @default 'some'
	 */
	mode?: PermissionMode | Ref<PermissionMode>

	/**
	 * Custom permission check function
	 */
	check?: (permission: string | string[], mode: PermissionMode) => boolean

	/**
	 * Get current user's permissions
	 */
	getPermissions?: () => string[]

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
 * Return type for usePermission composable
 */
export interface UsePermissionReturn {
	/** Whether the permission is granted */
	granted: Readonly<Ref<boolean>>

	/** Re-check permission */
	recheck: () => void
}

const WILDCARD = '*'

/**
 * Check if a permission is granted (supports wildcard)
 */
function hasPermission(required: string, permissions: string[]): boolean {
	return permissions.includes(WILDCARD) || permissions.includes(required)
}

/**
 * Composable for checking user permissions
 *
 * @param options - Configuration options
 * @returns Permission utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePermission } from 'directix'
 *
 * const { granted } = usePermission({
 *   value: 'admin',
 *   getPermissions: () => store.getters.permissions,
 *   getRoles: () => store.getters.roles,
 *   roleMap: { admin: ['*'], editor: ['read', 'write'] }
 * })
 * </script>
 *
 * <template>
 *   <button v-if="granted">Admin Only Action</button>
 * </template>
 * ```
 */
export function usePermission(options: UsePermissionOptions): UsePermissionReturn {
	const {
		value,
		mode = 'some',
		check,
		getPermissions,
		getRoles,
		roleMap = {},
	} = options

	const granted = ref(false)

	function verifyPermission(): boolean {
		// Custom check function takes priority
		if (check) {
			return check(unref(value), unref(mode))
		}

		// Require getPermissions function
		if (!getPermissions) {
			console.warn('[Directix] usePermission: getPermissions function is required')
			return true
		}

		const permissions = getPermissions()
		const roles = getRoles?.() || []
		const required = (Array.isArray(unref(value)) ? unref(value) : [unref(value)]) as string[]
		const currentMode = unref(mode)

		function checkSingle(perm: string): boolean {
			// If perm is a role name in roleMap, check if user has that role
			if (perm in roleMap) {
				return roles.includes(perm)
			}

			// Check direct permission
			if (hasPermission(perm, permissions)) {
				return true
			}

			// Check if any of user's roles grant this permission
			for (const role of roles) {
				const rolePermissions = roleMap[role] || []
				if (hasPermission(perm, rolePermissions)) {
					return true
				}
			}

			return false
		}

		return currentMode === 'every' ? required.every(checkSingle) : required.some(checkSingle)
	}

	function recheck(): void {
		granted.value = verifyPermission()
	}

	// Watch for value changes
	watch(
		() => unref(value),
		() => recheck(),
		{ immediate: true },
	)

	// Watch for mode changes
	if (typeof mode === 'object' && 'value' in mode) {
		watch(mode, () => recheck())
	}

	return {
		granted: readonly(granted),
		recheck,
	}
}

/**
 * Create a permission checker with shared configuration
 *
 * @param config - Shared configuration
 * @returns Permission checker function
 *
 * @example
 * ```ts
 * import { createPermissionChecker } from 'directix'
 *
 * const checkPermission = createPermissionChecker({
 *   getPermissions: () => store.getters.permissions,
 *   getRoles: () => store.getters.roles,
 *   roleMap: { admin: ['*'], editor: ['read', 'write'] }
 * })
 *
 * // Usage
 * const isAdmin = checkPermission('admin')
 * const canEdit = checkPermission(['read', 'write'], 'every')
 * ```
 */
export function createPermissionChecker(config: {
	getPermissions: () => string[]
	getRoles?: () => string[]
	roleMap?: Record<string, string[]>
}): (value: string | string[], mode?: PermissionMode) => boolean {
	const { getPermissions, getRoles, roleMap = {} } = config

	return (value: string | string[], mode: PermissionMode = 'some'): boolean => {
		const permissions = getPermissions()
		const roles = getRoles?.() || []
		const required = Array.isArray(value) ? value : [value]

		function checkSingle(perm: string): boolean {
			if (perm in roleMap) {
				return roles.includes(perm)
			}

			if (hasPermission(perm, permissions)) {
				return true
			}

			for (const role of roles) {
				const rolePermissions = roleMap[role] || []
				if (hasPermission(perm, rolePermissions)) {
					return true
				}
			}

			return false
		}

		return mode === 'every' ? required.every(checkSingle) : required.some(checkSingle)
	}
}
