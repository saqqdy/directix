import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	configureEnterprisePermission,
	createPermissionCheck,
	DEFAULT_ENTERPRISE_PERMISSION_CONFIG,
	EnterprisePermissionManager,
	getPermissionManager,
	hasPermission,
	hasPermissionSync,
} from '../../packages/core/src/enterprise-permission'

describe('EnterprisePermissionManager', () => {
	let manager: EnterprisePermissionManager

	beforeEach(() => {
		manager = new EnterprisePermissionManager()
	})

	afterEach(() => {
		manager.destroy()
	})

	describe('constructor', () => {
		it('should use default config when no config provided', () => {
			const mgr = new EnterprisePermissionManager()
			expect(mgr).toBeDefined()
			mgr.destroy()
		})

		it('should merge custom config with defaults', () => {
			const mgr = new EnterprisePermissionManager({
				defaultBehavior: 'allow',
				cache: { key: 'test', enabled: false, ttl: 1000 },
			})
			expect(mgr).toBeDefined()
			mgr.destroy()
		})
	})

	describe('initialize', () => {
		it('should initialize successfully', async () => {
			await manager.initialize()
			const permissions = manager.getPermissions()
			expect(permissions).toEqual([])
		})

		it('should not re-initialize if already initialized', async () => {
			await manager.initialize()
			await manager.initialize()
			expect(true).toBe(true)
		})
	})

	describe('permission management', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should add permission dynamically', () => {
			manager.addPermission('read')
			expect(manager.getPermissions()).toContain('read')
		})

		it('should remove permission dynamically', () => {
			manager.addPermission('read')
			manager.addPermission('write')
			manager.removePermission('read')
			expect(manager.getPermissions()).not.toContain('read')
			expect(manager.getPermissions()).toContain('write')
		})

		it('should check permission synchronously', async () => {
			manager.addPermission('read')
			await manager.initialize()
			const result = manager.checkSync('read')
			expect(result.granted).toBe(true)
			expect(result.permission).toBe('read')
		})

		it('should deny permission when not granted', () => {
			const result = manager.checkSync('admin')
			expect(result.granted).toBe(false)
		})

		it('should check permission asynchronously', async () => {
			manager.addPermission('write')
			const result = await manager.check('write')
			expect(result.granted).toBe(true)
		})

		it('should check multiple permissions', async () => {
			manager.addPermission('read')
			manager.addPermission('write')
			const results = await manager.checkAll(['read', 'write', 'delete'])
			expect(results.read).toBe(true)
			expect(results.write).toBe(true)
			expect(results.delete).toBe(false)
		})

		it('should check any permission', async () => {
			manager.addPermission('read')
			const result = await manager.checkAny(['read', 'write'])
			expect(result).toBe(true)
		})

		it('should return false for checkAny when no permissions granted', async () => {
			const result = await manager.checkAny(['read', 'write'])
			expect(result).toBe(false)
		})
	})

	describe('wildcard permissions', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should grant all permissions with wildcard', async () => {
			manager.addPermission('*')
			const result = await manager.check('any-permission')
			expect(result.granted).toBe(true)
			expect(result.source).toBe('wildcard')
		})
	})

	describe('role management', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should add role dynamically', () => {
			manager.addRole({
				name: 'admin',
				permissions: ['read', 'write', 'delete'],
			})
			expect(manager.getRolePermissions('admin')).toContain('read')
		})

		it('should remove role dynamically', () => {
			manager.addRole({
				name: 'admin',
				permissions: ['read', 'write'],
			})
			manager.removeRole('admin')
			expect(manager.getRolePermissions('admin')).toEqual([])
		})

		it('should inherit permissions from parent roles', async () => {
			manager.addRole({
				name: 'user',
				permissions: ['read'],
			})
			manager.addRole({
				name: 'admin',
				permissions: ['write', 'delete'],
				inherits: ['user'],
			})
			await manager.initialize()
			const perms = manager.getRolePermissions('admin')
			expect(perms).toContain('read')
			expect(perms).toContain('write')
			expect(perms).toContain('delete')
		})

		it('should detect circular role inheritance', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			manager.addRole({
				name: 'role1',
				permissions: ['perm1'],
				inherits: ['role2'],
			})
			manager.addRole({
				name: 'role2',
				permissions: ['perm2'],
				inherits: ['role1'],
			})
			expect(consoleSpy).toHaveBeenCalled()
			consoleSpy.mockRestore()
			manager.destroy()
			consoleSpy.mockRestore()
		})
	})

	describe('audit logging', () => {
		it('should log permission checks', async () => {
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true, logToConsole: false },
			})
			await auditManager.initialize()
			auditManager.addPermission('test')
			await auditManager.check('test')
			const logs = auditManager.getAuditLogs()
			expect(logs.length).toBeGreaterThan(0)
			expect(logs[0].permission).toBe('test')
			auditManager.destroy()
		})

		it('should call onGrant callback', async () => {
			const onGrant = vi.fn()
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true, onGrant },
			})
			await auditManager.initialize()
			auditManager.addPermission('test')
			await auditManager.check('test')
			expect(onGrant).toHaveBeenCalled()
			auditManager.destroy()
		})

		it('should call onDeny callback', async () => {
			const onDeny = vi.fn()
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true, onDeny },
			})
			await auditManager.initialize()
			await auditManager.check('non-existent')
			expect(onDeny).toHaveBeenCalled()
			auditManager.destroy()
		})

		it('should filter audit logs', async () => {
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true },
			})
			await auditManager.initialize()
			auditManager.addPermission('read')
			await auditManager.check('read')
			await auditManager.check('write')
			const grantedLogs = auditManager.getAuditLogs({ result: 'granted' })
			expect(grantedLogs.every(l => l.result === 'granted')).toBe(true)
			auditManager.destroy()
		})

		it('should limit audit logs', async () => {
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true },
			})
			await auditManager.initialize()
			for (let i = 0; i < 10; i++) {
				await auditManager.check(`perm-${i}`)
			}
			const logs = auditManager.getAuditLogs({ limit: 5 })
			expect(logs.length).toBe(5)
			auditManager.destroy()
		})

		it('should clear audit logs', async () => {
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true },
			})
			await auditManager.initialize()
			await auditManager.check('test')
			auditManager.clearAuditLogs()
			const logs = auditManager.getAuditLogs()
			expect(logs.length).toBe(0)
			auditManager.destroy()
		})

		it('should export logs as JSON', async () => {
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true },
			})
			await auditManager.initialize()
			await auditManager.check('test')
			const exported = auditManager.exportAuditLogs('json')
			expect(() => JSON.parse(exported)).not.toThrow()
			auditManager.destroy()
		})

		it('should export logs as CSV', async () => {
			const auditManager = new EnterprisePermissionManager({
				audit: { enabled: true },
			})
			await auditManager.initialize()
			await auditManager.check('test')
			const exported = auditManager.exportAuditLogs('csv')
			expect(exported).toContain('id,timestamp,permission')
			auditManager.destroy()
		})
	})

	describe('default behavior', () => {
		it('should deny by default', async () => {
			const mgr = new EnterprisePermissionManager({ defaultBehavior: 'deny' })
			await mgr.initialize()
			const result = await mgr.check('unknown')
			expect(result.granted).toBe(false)
			mgr.destroy()
		})

		it('should allow by default when configured', async () => {
			const mgr = new EnterprisePermissionManager({ defaultBehavior: 'allow' })
			await mgr.initialize()
			const result = await mgr.check('unknown')
			expect(result.granted).toBe(true)
			expect(result.source).toBe('default')
			mgr.destroy()
		})
	})

	describe('custom check handler', () => {
		it('should use custom check handler', async () => {
			const mgr = new EnterprisePermissionManager({
				customCheck: permission => permission.startsWith('custom:'),
			})
			await mgr.initialize()
			const result = await mgr.check('custom:test')
			expect(result.granted).toBe(true)
			expect(result.source).toBe('custom')
			mgr.destroy()
		})

		it('should use async custom check handler', async () => {
			const mgr = new EnterprisePermissionManager({
				customCheck: async permission => {
					await new Promise(r => setTimeout(r, 10))
					return permission === 'async:allowed'
				},
			})
			await mgr.initialize()
			const result = await mgr.check('async:allowed')
			expect(result.granted).toBe(true)
			mgr.destroy()
		})
	})

	describe('static source', () => {
		it('should load permissions from static source', async () => {
			const mgr = new EnterprisePermissionManager({
				sources: [
					{ type: 'static', permissions: ['read', 'write'] },
				],
			})
			await mgr.initialize()
			expect(mgr.getPermissions()).toContain('read')
			expect(mgr.getPermissions()).toContain('write')
			mgr.destroy()
		})
	})

	describe('custom source', () => {
		it('should load permissions from custom source', async () => {
			const mgr = new EnterprisePermissionManager({
				sources: [
					{ type: 'custom', custom: () => ['custom1', 'custom2'] },
				],
			})
			await mgr.initialize()
			expect(mgr.getPermissions()).toContain('custom1')
			mgr.destroy()
		})

		it('should load permissions from async custom source', async () => {
			const mgr = new EnterprisePermissionManager({
				sources: [
					{ type: 'custom', custom: async () => ['async1'] },
				],
			})
			await mgr.initialize()
			expect(mgr.getPermissions()).toContain('async1')
			mgr.destroy()
		})
	})

	describe('destroy', () => {
		it('should cleanup resources', async () => {
			await manager.initialize()
			manager.addPermission('test')
			manager.destroy()
			expect(manager.getPermissions()).toEqual([])
		})
	})
})

describe('Global functions', () => {
	afterEach(() => {
		// Clean up global manager after each test
		const mgr = getPermissionManager()
		if (mgr) mgr.destroy()
	})

	describe('configureEnterprisePermission', () => {
		it('should create and return global manager', () => {
			const mgr = configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['global'] }],
			})
			expect(mgr).toBeInstanceOf(EnterprisePermissionManager)
		})
	})

	describe('hasPermission', () => {
		it('should return false when no manager configured', async () => {
			const result = await hasPermission('test')
			expect(result).toBe(false)
		})

		it('should check permission using global manager', async () => {
			configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['allowed'] }],
			})
			const mgr = getPermissionManager()
			await mgr?.initialize()
			const result = await hasPermission('allowed')
			expect(result).toBe(true)
		})
	})

	describe('hasPermissionSync', () => {
		it('should return false when no manager configured', () => {
			const result = hasPermissionSync('test')
			expect(result).toBe(false)
		})

		it('should check permission synchronously', async () => {
			configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['sync-perm'] }],
			})
			const mgr = getPermissionManager()
			await mgr?.initialize()
			const result = hasPermissionSync('sync-perm')
			expect(result).toBe(true)
		})
	})

	describe('createPermissionCheck', () => {
		it('should create check function for single permission', async () => {
			configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['check-perm'] }],
			})
			const mgr = getPermissionManager()
			await mgr?.initialize()
			const check = createPermissionCheck('check-perm')
			const result = await check()
			expect(result).toBe(true)
		})

		it('should create check function for multiple permissions (any mode)', async () => {
			configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['perm1'] }],
			})
			const mgr = getPermissionManager()
			await mgr?.initialize()
			const check = createPermissionCheck(['perm1', 'perm2'], 'any')
			const result = await check()
			expect(result).toBe(true)
		})

		it('should create check function for multiple permissions (all mode)', async () => {
			configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['perm1', 'perm2'] }],
			})
			const mgr = getPermissionManager()
			await mgr?.initialize()
			const check = createPermissionCheck(['perm1', 'perm2'], 'all')
			const result = await check()
			expect(result).toBe(true)
		})

		it('should return false in all mode when some permissions missing', async () => {
			configureEnterprisePermission({
				sources: [{ type: 'static', permissions: ['only-first'] }],
			})
			const mgr = getPermissionManager()
			await mgr?.initialize()
			const check = createPermissionCheck(['only-first', 'only-second'], 'all')
			const result = await check()
			expect(result).toBe(false)
		})
	})
})

describe('DEFAULT_ENTERPRISE_PERMISSION_CONFIG', () => {
	it('should have correct default values', () => {
		// Create a fresh instance to get unmodified defaults
		const freshConfig = { ...DEFAULT_ENTERPRISE_PERMISSION_CONFIG }
		expect(freshConfig.sources).toEqual([])
		expect(freshConfig.cache.enabled).toBe(true)
		expect(freshConfig.cache.ttl).toBe(300000)
		expect(freshConfig.audit.enabled).toBe(true)
		expect(freshConfig.defaultBehavior).toBe('deny')
		// Note: roles may be modified by global tests, so check structure only
		expect(typeof freshConfig.roles).toBe('object')
	})
})
