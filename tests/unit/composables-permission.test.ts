import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createPermissionChecker, usePermission } from '../../src/composables/use-permission'

describe('usePermission', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should return granted as false initially when permission check fails', async () => {
			const { granted } = usePermission({
				value: 'admin',
				getPermissions: () => ['read', 'write'],
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(false)
		})

		it('should return granted as true when permission is present', async () => {
			const { granted } = usePermission({
				value: 'read',
				getPermissions: () => ['read', 'write'],
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})

		it('should return recheck function', () => {
			const { recheck } = usePermission({
				value: 'read',
				getPermissions: () => ['read'],
			})

			expect(typeof recheck).toBe('function')
		})
	})

	describe('permission modes', () => {
		it('should use "some" mode by default (OR logic)', async () => {
			const { granted } = usePermission({
				value: ['read', 'delete'],
				mode: 'some',
				getPermissions: () => ['read', 'write'],
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true) // Has 'read'
		})

		it('should use "every" mode when specified (AND logic)', async () => {
			const { granted } = usePermission({
				value: ['read', 'delete'],
				mode: 'every',
				getPermissions: () => ['read', 'write'],
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(false) // Lacks 'delete'
		})

		it('should pass with "every" mode when all permissions present', async () => {
			const { granted } = usePermission({
				value: ['read', 'write'],
				mode: 'every',
				getPermissions: () => ['read', 'write', 'delete'],
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})

		it('should support reactive mode', async () => {
			const mode = ref<'some' | 'every'>('some')
			const { granted } = usePermission({
				value: ['read', 'delete'],
				mode,
				getPermissions: () => ['read'],
			})

			await vi.runAllTimersAsync()
			expect(granted.value).toBe(true) // 'some' mode, has 'read'

			mode.value = 'every'
			await vi.runAllTimersAsync()
			expect(granted.value).toBe(false) // 'every' mode, lacks 'delete'
		})
	})

	describe('wildcard permission', () => {
		it('should grant access with wildcard permission', async () => {
			const { granted } = usePermission({
				value: 'any-permission',
				getPermissions: () => ['*'],
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})

		it('should grant access with wildcard via role', async () => {
			const { granted } = usePermission({
				value: 'any-permission',
				getPermissions: () => [],
				getRoles: () => ['admin'],
				roleMap: { admin: ['*'] },
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})
	})

	describe('role-based permission', () => {
		it('should check role permissions via roleMap', async () => {
			const { granted } = usePermission({
				value: 'edit',
				getPermissions: () => [],
				getRoles: () => ['editor'],
				roleMap: { editor: ['read', 'write', 'edit'] },
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})

		it('should grant access if role name matches directly', async () => {
			const { granted } = usePermission({
				value: 'admin',
				getPermissions: () => [],
				getRoles: () => ['admin'],
				roleMap: { admin: ['*'] },
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})

		it('should deny access if role name is not in user roles', async () => {
			const { granted } = usePermission({
				value: 'admin',
				getPermissions: () => [],
				getRoles: () => ['user'],
				roleMap: { admin: ['*'], user: ['read'] },
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(false)
		})

		it('should check multiple roles for permission', async () => {
			const { granted } = usePermission({
				value: 'delete',
				getPermissions: () => [],
				getRoles: () => ['editor', 'admin'],
				roleMap: {
					editor: ['read', 'write'],
					admin: ['delete'],
				},
			})

			await vi.runAllTimersAsync()

			expect(granted.value).toBe(true)
		})
	})

	describe('custom check function', () => {
		it('should use custom check function', async () => {
			const customCheck = vi.fn().mockReturnValue(true)
			const { granted } = usePermission({
				value: 'custom',
				check: customCheck,
				getPermissions: () => [],
			})

			await vi.runAllTimersAsync()

			expect(customCheck).toHaveBeenCalledWith('custom', 'some')
			expect(granted.value).toBe(true)
		})

		it('should pass array to custom check function', async () => {
			const customCheck = vi.fn().mockReturnValue(true)
			const { granted } = usePermission({
				value: ['perm1', 'perm2'],
				mode: 'every',
				check: customCheck,
				getPermissions: () => [],
			})

			await vi.runAllTimersAsync()

			expect(customCheck).toHaveBeenCalledWith(['perm1', 'perm2'], 'every')
			expect(granted.value).toBe(true)
		})
	})

	describe('reactive value', () => {
		it('should react to value changes', async () => {
			const value = ref<string>('read')
			const { granted } = usePermission({
				value,
				getPermissions: () => ['read', 'write'],
			})

			await vi.runAllTimersAsync()
			expect(granted.value).toBe(true)

			value.value = 'delete'
			await vi.runAllTimersAsync()
			expect(granted.value).toBe(false)
		})

		it('should react to array value changes', async () => {
			const value = ref<string[]>(['read'])
			const { granted } = usePermission({
				value,
				mode: 'every',
				getPermissions: () => ['read', 'write'],
			})

			await vi.runAllTimersAsync()
			expect(granted.value).toBe(true)

			value.value = ['read', 'delete']
			await vi.runAllTimersAsync()
			expect(granted.value).toBe(false)
		})
	})

	describe('recheck function', () => {
		it('should recheck permission when called', async () => {
			let permissions = ['read']
			const { granted, recheck } = usePermission({
				value: 'write',
				getPermissions: () => permissions,
			})

			await vi.runAllTimersAsync()
			expect(granted.value).toBe(false)

			// Change permissions
			permissions = ['read', 'write']
			recheck()

			await vi.runAllTimersAsync()
			expect(granted.value).toBe(true)
		})
	})

	describe('warning for missing getPermissions', () => {
		it('should warn and return true when getPermissions is not provided', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const { granted } = usePermission({
				value: 'read',
			} as any)

			await vi.runAllTimersAsync()

			expect(warnSpy).toHaveBeenCalledWith('[Directix] usePermission: getPermissions function is required')
			expect(granted.value).toBe(true)

			warnSpy.mockRestore()
		})
	})

	describe('createPermissionChecker', () => {
		it('should create a permission checker function', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => ['read', 'write'],
			})

			expect(typeof checkPermission).toBe('function')
		})

		it('should check single permission', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => ['read', 'write'],
			})

			expect(checkPermission('read')).toBe(true)
			expect(checkPermission('delete')).toBe(false)
		})

		it('should check multiple permissions with "some" mode', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => ['read', 'write'],
			})

			expect(checkPermission(['read', 'delete'], 'some')).toBe(true)
		})

		it('should check multiple permissions with "every" mode', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => ['read', 'write'],
			})

			expect(checkPermission(['read', 'delete'], 'every')).toBe(false)
			expect(checkPermission(['read', 'write'], 'every')).toBe(true)
		})

		it('should support wildcard permission', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => ['*'],
			})

			expect(checkPermission('any-permission')).toBe(true)
		})

		it('should support role-based permission', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => [],
				getRoles: () => ['editor'],
				roleMap: { editor: ['read', 'write'] },
			})

			expect(checkPermission('read')).toBe(true)
			expect(checkPermission('delete')).toBe(false)
		})

		it('should grant access if role name matches directly', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => [],
				getRoles: () => ['admin'],
				roleMap: { admin: ['*'] },
			})

			expect(checkPermission('admin')).toBe(true)
		})

		it('should check multiple roles for permission', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => [],
				getRoles: () => ['user', 'editor'],
				roleMap: {
					user: ['read'],
					editor: ['write', 'edit'],
				},
			})

			expect(checkPermission('read')).toBe(true)
			expect(checkPermission('write')).toBe(true)
			expect(checkPermission('delete')).toBe(false)
		})

		it('should support wildcard in roleMap', () => {
			const checkPermission = createPermissionChecker({
				getPermissions: () => [],
				getRoles: () => ['superadmin'],
				roleMap: { superadmin: ['*'] },
			})

			expect(checkPermission('any-permission')).toBe(true)
		})
	})
})
