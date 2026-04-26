/**
 * Enterprise Permission Management Module for Directix
 * Provides advanced permission management with multi-source support, role inheritance, and audit logging
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Permission source type
 */
export type PermissionSourceType = 'static' | 'api' | 'localStorage' | 'sessionStorage' | 'custom'

/**
 * Permission check result
 */
export interface PermissionCheckResult {
	granted: boolean
	permission: string
	source: string
	timestamp: number
	context?: Record<string, any>
	reason?: string
}

/**
 * Permission source configuration
 */
export interface PermissionSourceConfig {
	type: PermissionSourceType
	permissions?: string[]
	api?: {
		url: string
		method: 'GET' | 'POST'
		headers?: Record<string, string>
		transform?: (response: any) => string[]
		refreshInterval?: number
	}
	storage?: {
		key: string
		parse?: (value: string) => string[]
	}
	custom?: () => string[] | Promise<string[]>
}

/**
 * Role definition
 */
export interface RoleDefinition {
	name: string
	permissions: string[]
	inherits?: string[]
	description?: string
	metadata?: Record<string, any>
}

/**
 * Permission configuration
 */
export interface EnterprisePermissionConfig {
	// Permission sources
	sources: PermissionSourceConfig[]

	// Role definitions
	roles: Record<string, RoleDefinition>

	// Caching
	cache: {
		enabled: boolean
		ttl: number
		key: string
	}

	// Audit logging
	audit: {
		enabled: boolean
		onCheck?: (result: PermissionCheckResult) => void
		onGrant?: (result: PermissionCheckResult) => void
		onDeny?: (result: PermissionCheckResult) => void
		logToConsole?: boolean
	}

	// Default behavior
	defaultBehavior: 'allow' | 'deny'

	// Custom check handler
	customCheck?: (permission: string, context?: any) => boolean | Promise<boolean>
}

/**
 * Permission audit log entry
 */
export interface PermissionAuditLogEntry {
	id: string
	timestamp: number
	permission: string
	result: 'granted' | 'denied'
	source: string
	context?: Record<string, any>
	reason?: string
	userAgent?: string
	url?: string
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_ENTERPRISE_PERMISSION_CONFIG: EnterprisePermissionConfig = {
	sources: [],
	roles: {},
	cache: {
		key: '__directix_permissions',
		enabled: true,
		ttl: 300000, // 5 minutes
	},
	audit: {
		enabled: true,
		logToConsole: false,
	},
	defaultBehavior: 'deny',
}

// ============================================================================
// Permission Manager
// ============================================================================

/**
 * Enterprise Permission Manager
 */
export class EnterprisePermissionManager {
	private config: EnterprisePermissionConfig
	private permissions: Set<string> = new Set()
	private resolvedRoles: Map<string, Set<string>> = new Map()
	private auditLogs: PermissionAuditLogEntry[] = []
	private cacheTimestamp = 0
	private refreshTimer: number | null = null
	private initialized = false

	constructor(config: Partial<EnterprisePermissionConfig> = {}) {
		this.config = {
			...DEFAULT_ENTERPRISE_PERMISSION_CONFIG,
			...config,
			cache: { ...DEFAULT_ENTERPRISE_PERMISSION_CONFIG.cache, ...config.cache },
			audit: { ...DEFAULT_ENTERPRISE_PERMISSION_CONFIG.audit, ...config.audit },
		}
	}

	/**
	 * Initialize permission manager
	 */
	async initialize(): Promise<void> {
		if (this.initialized) return

		// Load permissions from all sources
		await this.loadPermissions()

		// Resolve role inheritance
		this.resolveAllRoles()

		// Set up refresh timer if API source with refresh interval
		this.setupRefreshTimer()

		this.initialized = true
	}

	/**
	 * Load permissions from all configured sources
	 */
	private async loadPermissions(): Promise<void> {
		const loadedPermissions: string[] = []

		for (const source of this.config.sources) {
			try {
				const perms = await this.loadFromSource(source)
				loadedPermissions.push(...perms)
			} catch (error) {
				console.warn(`[Directix] Failed to load permissions from ${source.type}:`, error)
			}
		}

		this.permissions = new Set(loadedPermissions)
		this.cacheTimestamp = Date.now()
	}

	/**
	 * Load permissions from a single source
	 */
	private async loadFromSource(source: PermissionSourceConfig): Promise<string[]> {
		switch (source.type) {
			case 'static':
				return source.permissions || []

			case 'api':
				return this.loadFromApi(source)

			case 'localStorage':
			case 'sessionStorage':
				return this.loadFromStorage(source)

			case 'custom':
				return source.custom ? await source.custom() : []

			default:
				return []
		}
	}

	/**
	 * Load permissions from API
	 */
	private async loadFromApi(source: PermissionSourceConfig): Promise<string[]> {
		if (!source.api) return []

		try {
			const response = await fetch(source.api.url, {
				method: source.api.method,
				headers: source.api.headers,
			})

			if (!response.ok) {
				throw new Error(`API returned ${response.status}`)
			}

			const data = await response.json()
			return source.api.transform ? source.api.transform(data) : data.permissions || []
		} catch (error) {
			throw new Error(`API permission load failed: ${error}`)
		}
	}

	/**
	 * Load permissions from storage
	 */
	private loadFromStorage(source: PermissionSourceConfig): string[] {
		if (typeof window === 'undefined') return []

		const storage = source.type === 'localStorage' ? localStorage : sessionStorage
		const value = storage.getItem(source.storage?.key || 'permissions')

		if (!value) return []

		return source.storage?.parse ? source.storage.parse(value) : JSON.parse(value)
	}

	/**
	 * Resolve all role inheritances
	 */
	private resolveAllRoles(): void {
		for (const roleName of Object.keys(this.config.roles)) {
			this.resolveRole(roleName, new Set())
		}
	}

	/**
	 * Resolve a single role with inheritance
	 */
	private resolveRole(roleName: string, visited: Set<string>): Set<string> {
		if (this.resolvedRoles.has(roleName)) {
			return this.resolvedRoles.get(roleName)!
		}

		if (visited.has(roleName)) {
			console.warn(`[Directix] Circular role inheritance detected: ${roleName}`)
			return new Set()
		}

		visited.add(roleName)
		const role = this.config.roles[roleName]

		if (!role) {
			return new Set()
		}

		const permissions = new Set(role.permissions)

		// Inherit from parent roles
		if (role.inherits) {
			for (const parentRole of role.inherits) {
				const parentPerms = this.resolveRole(parentRole, new Set(visited))
				parentPerms.forEach(p => permissions.add(p))
			}
		}

		this.resolvedRoles.set(roleName, permissions)
		return permissions
	}

	/**
	 * Set up automatic refresh timer
	 */
	private setupRefreshTimer(): void {
		// Find API source with refresh interval
		const apiSource = this.config.sources.find(s => s.type === 'api' && s.api?.refreshInterval)

		if (apiSource?.api?.refreshInterval && typeof window !== 'undefined') {
			this.refreshTimer = window.setInterval(
				() => this.loadPermissions(),
				apiSource.api.refreshInterval,
			)
		}
	}

	/**
	 * Check if permission is granted
	 */
	async check(permission: string, context?: Record<string, any>): Promise<PermissionCheckResult> {
		// Refresh cache if expired
		if (this.config.cache.enabled && Date.now() - this.cacheTimestamp > this.config.cache.ttl) {
			await this.loadPermissions()
		}

		let granted = false,
			source = 'direct',
			reason: string | undefined

		// Check custom handler first
		if (this.config.customCheck) {
			const result = await this.config.customCheck(permission, context)
			if (result) {
				granted = true
				source = 'custom'
			}
		}

		// Check direct permissions
		if (!granted && this.permissions.has(permission)) {
			granted = true
			source = 'permission'
		}

		// Check wildcard permissions
		if (!granted && this.permissions.has('*')) {
			granted = true
			source = 'wildcard'
			reason = 'User has wildcard permission'
		}

		// Check role-based permissions
		if (!granted) {
			for (const [roleName, rolePerms] of this.resolvedRoles) {
				if (rolePerms.has(permission)) {
					granted = true
					source = `role:${roleName}`
					break
				}
			}
		}

		// Check wildcard in roles
		if (!granted) {
			for (const [roleName, rolePerms] of this.resolvedRoles) {
				if (rolePerms.has('*')) {
					granted = true
					source = `role:${roleName}:wildcard`
					reason = `Role ${roleName} has wildcard permission`
					break
				}
			}
		}

		// Apply default behavior
		if (!granted && this.config.defaultBehavior === 'allow') {
			granted = true
			source = 'default'
			reason = 'Default behavior is allow'
		}

		const result: PermissionCheckResult = {
			granted,
			permission,
			source,
			timestamp: Date.now(),
			context,
			reason,
		}

		// Audit logging
		if (this.config.audit.enabled) {
			this.logAudit(result)
		}

		return result
	}

	/**
	 * Check permission synchronously (without API refresh)
	 */
	checkSync(permission: string, context?: Record<string, any>): PermissionCheckResult {
		let granted = false,
			source = 'direct'

		// Check direct permissions
		if (this.permissions.has(permission)) {
			granted = true
			source = 'permission'
		}

		// Check wildcard
		if (!granted && this.permissions.has('*')) {
			granted = true
			source = 'wildcard'
		}

		// Check roles
		if (!granted) {
			for (const [roleName, rolePerms] of this.resolvedRoles) {
				if (rolePerms.has(permission) || rolePerms.has('*')) {
					granted = true
					source = `role:${roleName}`
					break
				}
			}
		}

		const result: PermissionCheckResult = {
			granted,
			permission,
			source,
			timestamp: Date.now(),
			context,
		}

		if (this.config.audit.enabled) {
			this.logAudit(result)
		}

		return result
	}

	/**
	 * Check multiple permissions
	 */
	async checkAll(permissions: string[], context?: Record<string, any>): Promise<Record<string, boolean>> {
		const results: Record<string, boolean> = {}

		for (const permission of permissions) {
			const result = await this.check(permission, context)
			results[permission] = result.granted
		}

		return results
	}

	/**
	 * Check if any of the permissions is granted
	 */
	async checkAny(permissions: string[], context?: Record<string, any>): Promise<boolean> {
		for (const permission of permissions) {
			const result = await this.check(permission, context)
			if (result.granted) return true
		}
		return false
	}

	/**
	 * Log audit entry
	 */
	private logAudit(result: PermissionCheckResult): void {
		const entry: PermissionAuditLogEntry = {
			id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
			timestamp: result.timestamp,
			permission: result.permission,
			result: result.granted ? 'granted' : 'denied',
			source: result.source,
			context: result.context,
			reason: result.reason,
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
			url: typeof window !== 'undefined' ? window.location.href : undefined,
		}

		this.auditLogs.push(entry)

		// Call audit callbacks
		if (this.config.audit.onCheck) {
			this.config.audit.onCheck(result)
		}

		if (result.granted && this.config.audit.onGrant) {
			this.config.audit.onGrant(result)
		}

		if (!result.granted && this.config.audit.onDeny) {
			this.config.audit.onDeny(result)
		}

		// Console logging
		if (this.config.audit.logToConsole) {
			console.info(`[Directix Permission] ${result.permission}: ${result.granted ? 'GRANTED' : 'DENIED'} (${result.source})`)
		}
	}

	/**
	 * Get audit logs
	 */
	getAuditLogs(filter?: {
		permission?: string
		result?: 'granted' | 'denied'
		since?: number
		limit?: number
	}): PermissionAuditLogEntry[] {
		let logs = [...this.auditLogs]

		if (filter) {
			if (filter.permission) {
				logs = logs.filter(l => l.permission === filter.permission)
			}
			if (filter.result) {
				logs = logs.filter(l => l.result === filter.result)
			}
			if (filter.since !== undefined) {
				logs = logs.filter(l => l.timestamp >= filter.since!)
			}
		}

		if (filter?.limit) {
			logs = logs.slice(-filter.limit)
		}

		return logs
	}

	/**
	 * Clear audit logs
	 */
	clearAuditLogs(): void {
		this.auditLogs = []
	}

	/**
	 * Add permission dynamically
	 */
	addPermission(permission: string): void {
		this.permissions.add(permission)
	}

	/**
	 * Remove permission dynamically
	 */
	removePermission(permission: string): void {
		this.permissions.delete(permission)
	}

	/**
	 * Get all current permissions
	 */
	getPermissions(): string[] {
		return Array.from(this.permissions)
	}

	/**
	 * Add role dynamically
	 */
	addRole(role: RoleDefinition): void {
		this.config.roles[role.name] = role
		this.resolveRole(role.name, new Set())
	}

	/**
	 * Remove role dynamically
	 */
	removeRole(roleName: string): void {
		delete this.config.roles[roleName]
		this.resolvedRoles.delete(roleName)
	}

	/**
	 * Get resolved permissions for a role
	 */
	getRolePermissions(roleName: string): string[] {
		const perms = this.resolvedRoles.get(roleName)
		return perms ? Array.from(perms) : []
	}

	/**
	 * Export audit logs
	 */
	exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
		if (format === 'csv') {
			const headers = ['id', 'timestamp', 'permission', 'result', 'source', 'reason', 'url']
			const rows = this.auditLogs.map(l => [
				l.id,
				l.timestamp,
				l.permission,
				l.result,
				l.source,
				l.reason || '',
				l.url || '',
			])
			return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
		}

		return JSON.stringify(this.auditLogs, null, 2)
	}

	/**
	 * Destroy and cleanup
	 */
	destroy(): void {
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer)
			this.refreshTimer = null
		}
		this.permissions.clear()
		this.resolvedRoles.clear()
		this.auditLogs = []
		this.initialized = false
	}
}

// ============================================================================
// Global Instance
// ============================================================================

let _globalManager: EnterprisePermissionManager | null = null

/**
 * Configure global permission manager
 */
export function configureEnterprisePermission(config: Partial<EnterprisePermissionConfig>): EnterprisePermissionManager {
	_globalManager = new EnterprisePermissionManager(config)
	return _globalManager
}

/**
 * Get global permission manager
 */
export function getPermissionManager(): EnterprisePermissionManager | null {
	return _globalManager
}

/**
 * Check permission using global manager
 */
export async function hasPermission(permission: string, context?: Record<string, any>): Promise<boolean> {
	if (!_globalManager) {
		console.warn('[Directix] Permission manager not initialized')
		return false
	}
	const result = await _globalManager.check(permission, context)
	return result.granted
}

/**
 * Check permission synchronously
 */
export function hasPermissionSync(permission: string, context?: Record<string, any>): boolean {
	if (!_globalManager) {
		return false
	}
	return _globalManager.checkSync(permission, context).granted
}

/**
 * Create permission directive helper
 */
export function createPermissionCheck(permission: string | string[], mode: 'any' | 'all' = 'any') {
	return async (context?: Record<string, any>): Promise<boolean> => {
		if (!_globalManager) return false

		const permissions = Array.isArray(permission) ? permission : [permission]

		if (mode === 'all') {
			const results = await _globalManager.checkAll(permissions, context)
			return Object.values(results).every(Boolean)
		}

		return _globalManager.checkAny(permissions, context)
	}
}
