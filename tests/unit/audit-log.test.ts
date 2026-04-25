import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	audit,
	clearAuditLogs,
	configureAuditLog,
	createAuditLogMiddleware,
	DEFAULT_AUDIT_LOG_CONFIG,
	exportAuditLogs,
	getAuditLogById,
	getAuditLogConfig,
	getAuditLogs,
	getAuditLogStats,
	logAudit,
	logDirectiveOperation,
	logPerformanceIssue,
	logPermissionCheck,
	logSecurityViolation,
	withAuditLog,
} from '../../packages/core/src/audit-log'

describe('Audit Logging System', () => {
	beforeEach(() => {
		clearAuditLogs()
		configureAuditLog(DEFAULT_AUDIT_LOG_CONFIG)
	})

	afterEach(() => {
		clearAuditLogs()
	})

	describe('configureAuditLog', () => {
		it('should configure audit logging', () => {
			configureAuditLog({ enabled: false, level: 'error' })
			const config = getAuditLogConfig()
			expect(config.enabled).toBe(false)
			expect(config.level).toBe('error')
		})
	})

	describe('logAudit', () => {
		it('should create log entry', () => {
			const entry = logAudit('info', 'directive.mount', 'Test directive mounted', { directive: 'test' })
			expect(entry).toBeDefined()
			expect(entry?.level).toBe('info')
			expect(entry?.type).toBe('directive.mount')
			expect(entry?.message).toBe('Test directive mounted')
		})

		it('should not log when disabled', () => {
			configureAuditLog({ enabled: false })
			const entry = logAudit('info', 'directive.mount', 'Test')
			expect(entry).toBeNull()
		})

		it('should respect log level', () => {
			configureAuditLog({ level: 'warn' })
			const debugEntry = logAudit('debug', 'directive.mount', 'Debug message')
			expect(debugEntry).toBeNull()

			const warnEntry = logAudit('warn', 'directive.mount', 'Warn message')
			expect(warnEntry).toBeDefined()
		})

		it('should mask sensitive data', () => {
			configureAuditLog({ maskSensitive: true })
			const entry = logAudit('info', 'directive.mount', 'Test', {
				password: 'secret123',
				token: 'abc123',
				normal: 'value',
			})
			expect(entry?.details.password).toBe('***MASKED***')
			expect(entry?.details.token).toBe('***MASKED***')
			expect(entry?.details.normal).toBe('value')
		})

		it('should include stack trace for errors', () => {
			configureAuditLog({ includeStackTrace: true })
			const entry = logAudit('error', 'error.caught', 'Test error')
			expect(entry?.stackTrace).toBeDefined()
		})

		it('should call custom handlers', () => {
			const onLog = vi.fn()
			const onError = vi.fn()
			configureAuditLog({ handlers: { onLog, onError } })
			logAudit('error', 'error.caught', 'Test error')
			expect(onLog).toHaveBeenCalled()
			expect(onError).toHaveBeenCalled()
		})
	})

	describe('audit convenience methods', () => {
		it('should log debug', () => {
			configureAuditLog({ level: 'debug' })
			audit.debug('directive.mount', 'Debug message')
			expect(getAuditLogs().length).toBe(1)
		})

		it('should log info', () => {
			audit.info('directive.mount', 'Info message')
			expect(getAuditLogs().length).toBe(1)
		})

		it('should log warn', () => {
			audit.warn('directive.update', 'Warn message')
			expect(getAuditLogs().length).toBe(1)
		})

		it('should log error', () => {
			audit.error('error.caught', 'Error message')
			expect(getAuditLogs().length).toBe(1)
		})

		it('should log critical', () => {
			audit.critical('security.violation', 'Critical message')
			expect(getAuditLogs().length).toBe(1)
		})
	})

	describe('logDirectiveOperation', () => {
		it('should log mount operation', () => {
			logDirectiveOperation('mount', 'v-test', { arg: 'custom' })
			const logs = getAuditLogs()
			expect(logs.length).toBe(1)
			expect(logs[0].type).toBe('directive.mount')
		})

		it('should warn for slow operations', () => {
			logDirectiveOperation('mount', 'v-slow', {}, {}, 150)
			const logs = getAuditLogs()
			expect(logs[0].level).toBe('warn')
		})
	})

	describe('logPermissionCheck', () => {
		it('should log granted permission', () => {
			configureAuditLog({ level: 'debug' })
			logPermissionCheck('read', true, 'role')
			const logs = getAuditLogs()
			expect(logs[0].type).toBe('permission.grant')
			expect(logs[0].level).toBe('debug')
		})

		it('should log denied permission', () => {
			logPermissionCheck('admin', false, 'direct')
			const logs = getAuditLogs()
			expect(logs[0].type).toBe('permission.deny')
			expect(logs[0].level).toBe('warn')
		})
	})

	describe('logSecurityViolation', () => {
		it('should log critical security event', () => {
			logSecurityViolation('Unauthorized access attempt', { ip: '1.2.3.4' })
			const logs = getAuditLogs()
			expect(logs[0].level).toBe('critical')
			expect(logs[0].type).toBe('security.violation')
		})
	})

	describe('logPerformanceIssue', () => {
		it('should log slow operation', () => {
			logPerformanceIssue('directive.mount', 200, 100)
			const logs = getAuditLogs()
			expect(logs[0].level).toBe('warn')
			expect(logs[0].type).toBe('performance.slow')
			expect(logs[0].duration).toBe(200)
		})
	})

	describe('getAuditLogs', () => {
		beforeEach(() => {
			clearAuditLogs()
			logAudit('info', 'directive.mount', 'Test 1')
			logAudit('warn', 'directive.update', 'Test 2')
			logAudit('error', 'error.caught', 'Test 3')
		})

		it('should return all logs without filter', () => {
			const logs = getAuditLogs()
			expect(logs.length).toBe(3)
		})

		it('should filter by level', () => {
			const logs = getAuditLogs({ level: 'error' })
			expect(logs.length).toBe(1)
		})

		it('should filter by multiple levels', () => {
			const logs = getAuditLogs({ level: ['info', 'warn'] })
			expect(logs.length).toBe(2)
		})

		it('should filter by type', () => {
			const logs = getAuditLogs({ type: 'directive.mount' })
			expect(logs.length).toBe(1)
		})

		it('should filter by since timestamp', () => {
			clearAuditLogs()
			const now = Date.now()
			logAudit('info', 'directive.mount', 'New log')
			const logs = getAuditLogs({ since: now })
			expect(logs.length).toBe(1)
		})

		it('should limit results', () => {
			const logs = getAuditLogs({ limit: 2 })
			expect(logs.length).toBe(2)
		})

		it('should offset results', () => {
			const logs = getAuditLogs({ offset: 1 })
			expect(logs.length).toBe(2)
		})
	})

	describe('getAuditLogById', () => {
		it('should find log by ID', () => {
			const entry = logAudit('info', 'directive.mount', 'Test')
			expect(entry).not.toBeNull()
			const found = getAuditLogById(entry!.id)
			expect(found).toBeDefined()
			expect(found?.id).toBe(entry!.id)
		})

		it('should return undefined for unknown ID', () => {
			const found = getAuditLogById('unknown-id')
			expect(found).toBeUndefined()
		})
	})

	describe('getAuditLogStats', () => {
		it('should calculate statistics', () => {
			clearAuditLogs()
			configureAuditLog({ ...DEFAULT_AUDIT_LOG_CONFIG, filters: { minDuration: -1 } })

			logAudit('info', 'directive.mount', 'Test 1', {}, { directive: 'v-test' })
			logAudit('warn', 'directive.update', 'Test 2', {}, { directive: 'v-test' })
			logAudit('error', 'error.caught', 'Test 3')
			logAudit('critical', 'security.violation', 'Test 4')

			const stats = getAuditLogStats()
			expect(stats.totalEntries).toBe(4)
			expect(stats.byLevel.info).toBe(1)
			expect(stats.byLevel.warn).toBe(1)
			expect(stats.byLevel.error).toBe(1)
			expect(stats.byLevel.critical).toBe(1)
			expect(stats.criticalCount).toBe(1)
			expect(stats.errorRate).toBeCloseTo(0.25, 1)
		})
	})

	describe('clearAuditLogs', () => {
		it('should clear all logs', () => {
			logAudit('info', 'directive.mount', 'Test')
			expect(getAuditLogs().length).toBe(1)
			clearAuditLogs()
			expect(getAuditLogs().length).toBe(0)
		})
	})

	describe('exportAuditLogs', () => {
		beforeEach(() => {
			clearAuditLogs()
			logAudit('info', 'directive.mount', 'Test directive')
		})

		it('should export as JSON', () => {
			const exported = exportAuditLogs({ format: 'json', includeDetails: true, includeContext: true, dateFormat: 'iso' })
			const parsed = JSON.parse(exported)
			expect(parsed.total).toBe(1)
			expect(parsed.entries[0].message).toBe('Test directive')
		})

		it('should export as CSV', () => {
			const exported = exportAuditLogs({ format: 'csv', includeDetails: true, includeContext: true, dateFormat: 'iso' })
			expect(exported).toContain('id,timestamp,level,type,message')
		})

		it('should export as Markdown', () => {
			const exported = exportAuditLogs({ format: 'markdown', includeDetails: true, includeContext: true, dateFormat: 'iso' })
			expect(exported).toContain('# Directix Audit Logs')
			expect(exported).toContain('Test directive')
		})

		it('should export as HTML', () => {
			const exported = exportAuditLogs({ format: 'html', includeDetails: true, includeContext: true, dateFormat: 'iso' })
			expect(exported).toContain('<!DOCTYPE html>')
			expect(exported).toContain('Test directive')
		})

		it('should use unix timestamp format', () => {
			const exported = exportAuditLogs({ format: 'json', includeDetails: false, includeContext: false, dateFormat: 'unix' })
			const parsed = JSON.parse(exported)
			expect(typeof parsed.entries[0].timestamp).toBe('string')
			expect(Number.isNaN(Number(parsed.entries[0].timestamp))).toBe(false)
		})
	})

	describe('createAuditLogMiddleware', () => {
		it('should create middleware with lifecycle hooks', () => {
			const middleware = createAuditLogMiddleware('v-test')
			expect(middleware.onMount).toBeDefined()
			expect(middleware.onUpdate).toBeDefined()
			expect(middleware.onUnmount).toBeDefined()
		})

		it('should log on mount', () => {
			const middleware = createAuditLogMiddleware('v-test')
			middleware.onMount({} as HTMLElement, { value: 'test' }, { type: { name: 'TestComponent' } })
			const logs = getAuditLogs()
			expect(logs.length).toBe(1)
			expect(logs[0].type).toBe('directive.mount')
		})
	})

	describe('withAuditLog', () => {
		it('should measure and log successful operation', async () => {
			configureAuditLog({ filters: { minDuration: -1 } })
			const result = await withAuditLog('directive.mount', 'Test operation', async () => {
				await new Promise(r => setTimeout(r, 1))
				return 'success'
			})
			expect(result).toBe('success')
			const logs = getAuditLogs()
			expect(logs.length).toBe(1)
		})

		it('should log failed operation', async () => {
			await expect(
				withAuditLog('directive.mount', 'Test operation', () => {
					throw new Error('Test error')
				}),
			).rejects.toThrow('Test error')

			const logs = getAuditLogs()
			expect(logs.length).toBe(1)
			expect(logs[0].level).toBe('error')
		})

		it('should work with async functions', async () => {
			configureAuditLog({ filters: { minDuration: -1 } })
			const result = await withAuditLog('directive.mount', 'Async operation', async () => {
				await new Promise(r => setTimeout(r, 10))
				return 'async-success'
			})
			expect(result).toBe('async-success')
		})
	})

	describe('sample rate', () => {
		it('should respect sample rate', () => {
			configureAuditLog({ sampleRate: 0 })
			logAudit('info', 'directive.mount', 'Test')
			expect(getAuditLogs().length).toBe(0)
		})
	})

	describe('filter types', () => {
		it('should exclude filtered types', () => {
			configureAuditLog({ filters: { excludeTypes: ['directive.mount'], minDuration: -1 } })
			logAudit('info', 'directive.mount', 'Test 1')
			logAudit('info', 'directive.update', 'Test 2')
			const logs = getAuditLogs()
			expect(logs.length).toBe(1)
			expect(logs[0].type).toBe('directive.update')
		})
	})
})

describe('DEFAULT_AUDIT_LOG_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_AUDIT_LOG_CONFIG.enabled).toBe(true)
		expect(DEFAULT_AUDIT_LOG_CONFIG.level).toBe('info')
		expect(DEFAULT_AUDIT_LOG_CONFIG.maxEntries).toBe(10000)
		expect(DEFAULT_AUDIT_LOG_CONFIG.persistToStorage).toBe(false)
		expect(DEFAULT_AUDIT_LOG_CONFIG.consoleOutput).toBe(false)
		expect(DEFAULT_AUDIT_LOG_CONFIG.maskSensitive).toBe(true)
	})
})
