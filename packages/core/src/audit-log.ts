/**
 * Comprehensive Audit Logging System for Directix
 * Provides detailed logging for directive operations, permission checks, and security events
 */

// ============================================================================
// Types
// ============================================================================

export type AuditLogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'
export type AuditEventType
	= | 'directive.mount'
		| 'directive.update'
		| 'directive.unmount'
		| 'permission.check'
		| 'permission.grant'
		| 'permission.deny'
		| 'security.violation'
		| 'performance.slow'
		| 'compatibility.warning'
		| 'migration.detected'
		| 'config.change'
		| 'error.caught'
		| 'user.action'

export interface AuditLogEntry {
	id: string
	timestamp: number
	level: AuditLogLevel
	type: AuditEventType
	message: string
	details: Record<string, unknown>
	context: AuditContext
	duration?: number
	stackTrace?: string
}

export interface AuditContext {
	directive?: string
	component?: string
	file?: string
	line?: number
	userAgent?: string
	url?: string
	sessionId?: string
	userId?: string
	environment?: string
	version?: string
	[key: string]: unknown
}

export interface AuditLogFilter {
	level?: AuditLogLevel | AuditLogLevel[]
	type?: AuditEventType | AuditEventType[]
	since?: number
	until?: number
	directive?: string | string[]
	component?: string | string[]
	limit?: number
	offset?: number
}

export interface AuditLogConfig {
	enabled: boolean
	level: AuditLogLevel
	maxEntries: number
	persistToStorage: boolean
	storageKey: string
	consoleOutput: boolean
	consoleLevel: AuditLogLevel
	includeStackTrace: boolean
	sampleRate: number
	filters: {
		excludeTypes?: AuditEventType[]
		excludeLevels?: AuditLogLevel[]
		minDuration?: number
	}
	handlers: {
		onLog?: (entry: AuditLogEntry) => void
		onError?: (entry: AuditLogEntry) => void
		onCritical?: (entry: AuditLogEntry) => void
	}
	sensitiveFields: string[]
	maskSensitive: boolean
}

export interface AuditLogStats {
	totalEntries: number
	byLevel: Record<AuditLogLevel, number>
	byType: Record<AuditEventType, number>
	byDirective: Record<string, number>
	avgDuration: number
	errorRate: number
	criticalCount: number
	last24Hours: number
	lastHour: number
}

export interface AuditLogExportOptions {
	format: 'json' | 'csv' | 'markdown' | 'html'
	includeDetails: boolean
	includeContext: boolean
	dateFormat: 'iso' | 'unix' | 'locale'
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_AUDIT_LOG_CONFIG: AuditLogConfig = {
	enabled: true,
	level: 'info',
	maxEntries: 10000,
	persistToStorage: false,
	storageKey: '__directix_audit_logs',
	consoleOutput: false,
	consoleLevel: 'warn',
	includeStackTrace: true,
	sampleRate: 1.0,
	filters: {
		excludeTypes: [],
		excludeLevels: [],
		minDuration: 0,
	},
	handlers: {},
	sensitiveFields: ['password', 'token', 'secret', 'apiKey', 'authorization', 'credential'],
	maskSensitive: true,
}

// ============================================================================
// Audit Logger
// ============================================================================

const LEVELS: AuditLogLevel[] = ['debug', 'info', 'warn', 'error', 'critical']

let _config: AuditLogConfig = DEFAULT_AUDIT_LOG_CONFIG,
	_logs: AuditLogEntry[] = [],
	_sessionId: string | null = null

/**
 * Configure audit logging
 */
export function configureAuditLog(config: Partial<AuditLogConfig>): void {
	_config = {
		...DEFAULT_AUDIT_LOG_CONFIG,
		...config,
		filters: { ...DEFAULT_AUDIT_LOG_CONFIG.filters, ...config.filters },
		handlers: { ...DEFAULT_AUDIT_LOG_CONFIG.handlers, ...config.handlers },
	}

	// Load persisted logs if enabled
	if (_config.persistToStorage && typeof localStorage !== 'undefined') {
		try {
			const stored = localStorage.getItem(_config.storageKey)
			if (stored) {
				_logs = JSON.parse(stored)
			}
		} catch {
			// Ignore storage errors
		}
	}
}

/**
 * Get current configuration
 */
export function getAuditLogConfig(): AuditLogConfig {
	return { ..._config }
}

/**
 * Generate unique ID for log entry
 */
function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Mask sensitive data in an object
 */
function maskSensitiveData(data: Record<string, unknown>, sensitiveFields: string[]): Record<string, unknown> {
	const masked: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(data)) {
		const lowerKey = key.toLowerCase()
		const isSensitive = sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))

		if (isSensitive) {
			masked[key] = '***MASKED***'
		} else if (typeof value === 'object' && value !== null) {
			masked[key] = maskSensitiveData(value as Record<string, unknown>, sensitiveFields)
		} else {
			masked[key] = value
		}
	}

	return masked
}

/**
 * Check if log should be recorded
 */
function shouldLog(level: AuditLogLevel, type: AuditEventType): boolean {
	if (!_config.enabled) return false

	// Check sample rate
	if (_config.sampleRate < 1.0 && Math.random() > _config.sampleRate) {
		return false
	}

	// Check level
	const levels: AuditLogLevel[] = ['debug', 'info', 'warn', 'error', 'critical']
	if (levels.indexOf(level) < levels.indexOf(_config.level)) {
		return false
	}

	// Check filters
	if (_config.filters.excludeTypes?.includes(type)) {
		return false
	}

	if (_config.filters.excludeLevels?.includes(level)) {
		return false
	}

	return true
}

/**
 * Get session ID
 */
function getSessionId(): string {
	if (!_sessionId) {
		_sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
	}
	return _sessionId
}

// Global version declaration for build-time injection
declare const __DIRECTIX_VERSION__: string | undefined

/**
 * Build context for log entry
 */
function buildContext(additionalContext?: Partial<AuditContext>): AuditContext {
	return {
		sessionId: getSessionId(),
		userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
		url: typeof window !== 'undefined' ? window.location.href : undefined,
		version: typeof __DIRECTIX_VERSION__ !== 'undefined' ? __DIRECTIX_VERSION__ : undefined,
		environment: typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined,
		...additionalContext,
	}
}

/**
 * Get stack trace
 */
function getStackTrace(): string | undefined {
	if (!_config.includeStackTrace) return undefined

	const stack = new Error('getStackTrace').stack
	if (!stack) return undefined

	// Clean up the stack trace
	const lines = stack.split('\n').filter(line => !line.includes('audit-log'))
	return lines.join('\n')
}

/**
 * Persist logs to storage
 */
function persistLogs(): void {
	if (!_config.persistToStorage || typeof localStorage === 'undefined') return

	try {
		localStorage.setItem(_config.storageKey, JSON.stringify(_logs))
	} catch {
		// Storage full or unavailable
	}
}

/**
 * Core logging function
 */
export function logAudit(
	level: AuditLogLevel,
	type: AuditEventType,
	message: string,
	details: Record<string, unknown> = {},
	context?: Partial<AuditContext>,
	duration?: number,
): AuditLogEntry | null {
	if (!shouldLog(level, type)) return null

	// Mask sensitive data if enabled
	const processedDetails = _config.maskSensitive ? maskSensitiveData(details, _config.sensitiveFields) : details

	const entry: AuditLogEntry = {
		id: generateId(),
		type,
		timestamp: Date.now(),
		level,
		message,
		details: processedDetails,
		context: buildContext(context),
		duration,
		stackTrace: level === 'error' || level === 'critical' ? getStackTrace() : undefined,
	}

	// Add to logs array
	_logs.push(entry)

	// Trim if over max entries
	if (_logs.length > _config.maxEntries) {
		_logs = _logs.slice(-_config.maxEntries)
	}

	// Persist to storage
	persistLogs()

	// Console output
	if (_config.consoleOutput && LEVELS.indexOf(level) >= LEVELS.indexOf(_config.consoleLevel)) {
		const consoleMethod = level === 'critical' || level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info'
		// eslint-disable-next-line no-console
		console[consoleMethod](`[Directix Audit] [${level.toUpperCase()}] [${type}] ${message}`, processedDetails)
	}

	// Call handlers
	_config.handlers.onLog?.(entry)

	if (level === 'error') {
		_config.handlers.onError?.(entry)
	}

	if (level === 'critical') {
		_config.handlers.onCritical?.(entry)
	}

	return entry
}

/**
 * Convenience logging methods
 */
export const audit = {
	debug: (type: AuditEventType, message: string, details?: Record<string, unknown>, context?: Partial<AuditContext>) =>
		logAudit('debug', type, message, details, context),

	info: (type: AuditEventType, message: string, details?: Record<string, unknown>, context?: Partial<AuditContext>) =>
		logAudit('info', type, message, details, context),

	warn: (type: AuditEventType, message: string, details?: Record<string, unknown>, context?: Partial<AuditContext>) =>
		logAudit('warn', type, message, details, context),

	error: (type: AuditEventType, message: string, details?: Record<string, unknown>, context?: Partial<AuditContext>) =>
		logAudit('error', type, message, details, context),

	critical: (type: AuditEventType, message: string, details?: Record<string, unknown>, context?: Partial<AuditContext>) =>
		logAudit('critical', type, message, details, context),
}

/**
 * Log directive operation
 */
export function logDirectiveOperation(
	operation: 'mount' | 'update' | 'unmount',
	directive: string,
	details?: Record<string, unknown>,
	context?: Partial<AuditContext>,
	duration?: number,
): void {
	const type: AuditEventType = `directive.${operation}` as AuditEventType
	const level: AuditLogLevel = duration && duration > 100 ? 'warn' : 'info'

	logAudit(level, type, `Directive ${directive} ${operation}`, { directive, ...details }, { directive, ...context }, duration)
}

/**
 * Log permission check
 */
export function logPermissionCheck(
	permission: string,
	granted: boolean,
	source: string,
	context?: Partial<AuditContext>,
): void {
	const type: AuditEventType = granted ? 'permission.grant' : 'permission.deny'
	const level: AuditLogLevel = granted ? 'debug' : 'warn'

	logAudit(level, type, `Permission ${permission}: ${granted ? 'granted' : 'denied'}`, { permission, granted, source }, context)
}

/**
 * Log security violation
 */
export function logSecurityViolation(
	violation: string,
	details: Record<string, unknown>,
	context?: Partial<AuditContext>,
): void {
	logAudit('critical', 'security.violation', `Security violation: ${violation}`, details, context)
}

/**
 * Log performance issue
 */
export function logPerformanceIssue(
	operation: string,
	duration: number,
	threshold: number,
	context?: Partial<AuditContext>,
): void {
	logAudit('warn', 'performance.slow', `Slow operation: ${operation} took ${duration}ms (threshold: ${threshold}ms)`, { operation, duration, threshold }, context, duration)
}

/**
 * Get audit logs with filtering
 */
export function getAuditLogs(filter?: AuditLogFilter): AuditLogEntry[] {
	let logs = [..._logs]

	if (!filter) return logs

	if (filter.level) {
		const levels = Array.isArray(filter.level) ? filter.level : [filter.level]
		logs = logs.filter(l => levels.includes(l.level))
	}

	if (filter.type) {
		const types = Array.isArray(filter.type) ? filter.type : [filter.type]
		logs = logs.filter(l => types.includes(l.type))
	}

	if (filter.since) {
		logs = logs.filter(l => l.timestamp >= filter.since!)
	}

	if (filter.until) {
		logs = logs.filter(l => l.timestamp <= filter.until!)
	}

	if (filter.directive) {
		const directives = Array.isArray(filter.directive) ? filter.directive : [filter.directive]
		logs = logs.filter(l => l.context.directive && directives.includes(l.context.directive as string))
	}

	if (filter.component) {
		const components = Array.isArray(filter.component) ? filter.component : [filter.component]
		logs = logs.filter(l => l.context.component && components.includes(l.context.component as string))
	}

	if (filter.offset) {
		logs = logs.slice(filter.offset)
	}

	if (filter.limit) {
		logs = logs.slice(0, filter.limit)
	}

	return logs
}

/**
 * Get audit log by ID
 */
export function getAuditLogById(id: string): AuditLogEntry | undefined {
	return _logs.find(l => l.id === id)
}

/**
 * Get audit log statistics
 */
export function getAuditLogStats(): AuditLogStats {
	const now = Date.now()
	const hourAgo = now - 3600000
	const dayAgo = now - 86400000

	const byLevel: Record<AuditLogLevel, number> = {
		debug: 0,
		info: 0,
		warn: 0,
		error: 0,
		critical: 0,
	}

	const byType: Record<AuditEventType, number> = {} as Record<AuditEventType, number>
	const byDirective: Record<string, number> = {}

	let totalDuration = 0,
		durationCount = 0,
		errorCount = 0,
		criticalCount = 0

	for (const log of _logs) {
		byLevel[log.level]++

		byType[log.type] = (byType[log.type] || 0) + 1

		if (log.context.directive) {
			const directive = log.context.directive as string
			byDirective[directive] = (byDirective[directive] || 0) + 1
		}

		if (log.duration) {
			totalDuration += log.duration
			durationCount++
		}

		if (log.level === 'error') errorCount++
		if (log.level === 'critical') criticalCount++
	}

	return {
		totalEntries: _logs.length,
		byLevel,
		byType,
		byDirective,
		avgDuration: durationCount > 0 ? totalDuration / durationCount : 0,
		errorRate: _logs.length > 0 ? errorCount / _logs.length : 0,
		criticalCount,
		last24Hours: _logs.filter(l => l.timestamp >= dayAgo).length,
		lastHour: _logs.filter(l => l.timestamp >= hourAgo).length,
	}
}

/**
 * Clear audit logs
 */
export function clearAuditLogs(): void {
	_logs = []
	if (_config.persistToStorage && typeof localStorage !== 'undefined') {
		localStorage.removeItem(_config.storageKey)
	}
}

/**
 * Export audit logs
 */
export function exportAuditLogs(options: AuditLogExportOptions = {
	format: 'json',
	includeDetails: true,
	includeContext: true,
	dateFormat: 'iso',
}): string {
	const { format, includeDetails, includeContext, dateFormat } = options

	const formatDate = (timestamp: number): string => {
		switch (dateFormat) {
			case 'unix':
				return String(timestamp)
			case 'locale':
				return new Date(timestamp).toLocaleString()
			case 'iso':
			default:
				return new Date(timestamp).toISOString()
		}
	}

	switch (format) {
		case 'csv': {
			const headers = ['id', 'timestamp', 'level', 'type', 'message']
			if (includeDetails) headers.push('details')
			if (includeContext) headers.push('context')

			const rows = _logs.map(l => {
				const row = [l.id, formatDate(l.timestamp), l.level, l.type, l.message]
				if (includeDetails) row.push(JSON.stringify(l.details))
				if (includeContext) row.push(JSON.stringify(l.context))
				return row.join(',')
			})

			return [headers.join(','), ...rows].join('\n')
		}

		case 'markdown': {
			let md = `# Directix Audit Logs\n\nGenerated: ${new Date().toISOString()}\n\n`
			md += `## Summary\n\n- Total entries: ${_logs.length}\n\n`
			md += `## Logs\n\n`

			for (const l of _logs) {
				md += `### ${l.level.toUpperCase()}: ${l.message}\n\n`
				md += `- **Type**: ${l.type}\n`
				md += `- **Time**: ${formatDate(l.timestamp)}\n`
				if (includeDetails && Object.keys(l.details).length > 0) {
					md += `- **Details**: \`\`\`json\n${JSON.stringify(l.details, null, 2)}\n\`\`\`\n`
				}
				md += '\n'
			}

			return md
		}

		case 'html': {
			let html = `<!DOCTYPE html>
<html>
<head>
	<title>Directix Audit Logs</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; }
		.log { border: 1px solid #ddd; margin: 10px 0; padding: 10px; border-radius: 4px; }
		.log.debug { background: #f5f5f5; }
		.log.info { background: #e3f2fd; }
		.log.warn { background: #fff3e0; }
		.log.error { background: #ffebee; }
		.log.critical { background: #ffcdd2; border: 2px solid #f44336; }
		.header { display: flex; justify-content: space-between; margin-bottom: 5px; }
		.level { font-weight: bold; text-transform: uppercase; }
		.timestamp { color: #666; }
		.type { color: #888; font-size: 0.9em; }
		pre { margin: 5px 0; font-size: 0.85em; background: #f8f8f8; padding: 5px; border-radius: 3px; }
	</style>
</head>
<body>
	<h1>Directix Audit Logs</h1>
	<p>Generated: ${new Date().toISOString()}</p>
	<p>Total entries: ${_logs.length}</p>
`

			for (const l of _logs) {
				html += `
	<div class="log ${l.level}">
		<div class="header">
			<span class="level">${l.level}</span>
			<span class="timestamp">${formatDate(l.timestamp)}</span>
		</div>
		<p><strong>${l.message}</strong> <span class="type">[${l.type}]</span></p>
`
				if (includeDetails && Object.keys(l.details).length > 0) {
					html += `		<pre>${JSON.stringify(l.details, null, 2)}</pre>\n`
				}
				html += '	</div>\n'
			}

			html += '</body></html>'
			return html
		}

		case 'json':
		default: {
			const entries = _logs.map(l => ({
				id: l.id,
				type: l.type,
				timestamp: formatDate(l.timestamp),
				level: l.level,
				message: l.message,
				...(includeDetails && { details: l.details }),
				...(includeContext && { context: l.context }),
				...(l.duration && { duration: l.duration }),
			}))

			return JSON.stringify({ generatedAt: new Date().toISOString(), total: entries.length, entries }, null, 2)
		}
	}
}

/**
 * Create audit log middleware for directives
 */
export function createAuditLogMiddleware(directiveName: string): {
	onMount: (_el: HTMLElement, binding: any, vnode: any) => void
	onUpdate: (_el: HTMLElement, binding: any, vnode: any, oldBinding: any) => void
	onUnmount: (_el: HTMLElement, _binding: any, vnode: any) => void
} {
	return {
		onMount: (_el: HTMLElement, binding: any, vnode: any) => {
			logDirectiveOperation('mount', directiveName, {
				value: binding.value,
				arg: binding.arg,
				modifiers: binding.modifiers,
			}, {
				component: vnode?.type?.name,
			})
		},
		onUpdate: (_el: HTMLElement, binding: any, vnode: any, oldBinding: any) => {
			logDirectiveOperation('update', directiveName, {
				newValue: binding.value,
				oldValue: oldBinding?.value,
			}, {
				component: vnode?.type?.name,
			})
		},
		onUnmount: (_el: HTMLElement, _binding: any, vnode: any) => {
			logDirectiveOperation('unmount', directiveName, {}, {
				component: vnode?.type?.name,
			})
		},
	}
}

/**
 * Measure and log performance
 */
export async function withAuditLog<T>(
	type: AuditEventType,
	message: string,
	fn: () => T | Promise<T>,
	details?: Record<string, unknown>,
	context?: Partial<AuditContext>,
): Promise<T> {
	const start = Date.now()
	let error: Error | null = null

	try {
		const result = await fn()
		const duration = Date.now() - start

		if (duration > (_config.filters.minDuration || 0)) {
			logAudit('info', type, message, { ...details, duration }, context, duration)
		}

		return result
	} catch (e) {
		error = e as Error
		const duration = Date.now() - start

		logAudit('error', type, `${message} (failed: ${error.message})`, { ...details, error: error.message, stack: error.stack }, context, duration)

		throw error
	}
}
