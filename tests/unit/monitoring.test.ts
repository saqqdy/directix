import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
	acknowledgeAlert,
	addHealthCheck,
	clearAlerts,
	configureMonitoring,
	DEFAULT_MONITORING_CONFIG,
	exportPrometheusMetrics,
	getAlerts,
	getCounterValue,
	getGaugeValue,
	getHealthStatus,
	getHistogramStats,
	getMetrics,
	getMonitoringConfig,
	getMonitoringStats,
	incrementCounter,
	recordHistogram,
	removeHealthCheck,
	resetMonitoring,
	resolveAlert,
	setGauge,
	timeOperation,
	triggerAlert,
} from '../../packages/core/src/monitoring'

describe('Monitoring System', () => {
	beforeEach(() => {
		resetMonitoring()
		configureMonitoring(DEFAULT_MONITORING_CONFIG)
	})

	afterEach(() => {
		resetMonitoring()
	})

	describe('configureMonitoring', () => {
		it('should configure monitoring', () => {
			configureMonitoring({ enabled: false })
			const config = getMonitoringConfig()
			expect(config.enabled).toBe(false)
		})
	})

	describe('incrementCounter', () => {
		it('should increment counter', () => {
			incrementCounter('test_counter')
			expect(getCounterValue('test_counter')).toBe(1)

			incrementCounter('test_counter', undefined, 5)
			expect(getCounterValue('test_counter')).toBe(6)
		})

		it('should increment with labels', () => {
			incrementCounter('requests', { method: 'GET' })
			incrementCounter('requests', { method: 'POST' })

			expect(getCounterValue('requests', { method: 'GET' })).toBe(1)
			expect(getCounterValue('requests', { method: 'POST' })).toBe(1)
		})
	})

	describe('setGauge', () => {
		it('should set gauge value', () => {
			setGauge('memory_usage', 50)
			expect(getGaugeValue('memory_usage')).toBe(50)

			setGauge('memory_usage', 60)
			expect(getGaugeValue('memory_usage')).toBe(60)
		})
	})

	describe('recordHistogram', () => {
		it('should record histogram values', () => {
			recordHistogram('response_time', 10)
			recordHistogram('response_time', 20)
			recordHistogram('response_time', 30)

			const stats = getHistogramStats('response_time')
			expect(stats?.count).toBe(3)
			expect(stats?.min).toBe(10)
			expect(stats?.max).toBe(30)
			expect(stats?.mean).toBe(20)
		})
	})

	describe('timeOperation', () => {
		it('should time successful operation', async () => {
			const result = await timeOperation('api_call', async () => {
				await new Promise(r => setTimeout(r, 10))
				return 'success'
			})

			expect(result).toBe('success')
			expect(getCounterValue('api_call_total')).toBe(1)
			expect(getCounterValue('api_call_success')).toBe(1)
		})

		it('should track failed operation', async () => {
			await expect(
				timeOperation('failing_op', async () => {
					throw new Error('fail')
				}),
			).rejects.toThrow('fail')

			expect(getCounterValue('failing_op_error')).toBe(1)
		})
	})

	describe('getMetrics', () => {
		it('should return metrics', () => {
			incrementCounter('metric1')
			setGauge('metric2', 100)

			const metrics = getMetrics()
			expect(metrics.length).toBeGreaterThan(0)
		})

		it('should filter by name', () => {
			incrementCounter('test_metric')
			incrementCounter('other_metric')

			const metrics = getMetrics({ name: 'test_metric' })
			expect(metrics.every(m => m.name.includes('test_metric'))).toBe(true)
		})
	})

	describe('triggerAlert', () => {
		it('should trigger alert when rule exists', () => {
			configureMonitoring({
				enabled: true,
				alerts: {
					enabled: true,
					channels: [],
					rules: [{
						id: 'test-rule',
						name: 'Test Alert',
						description: 'Test',
						condition: 'value > threshold',
						severity: 'warning',
						duration: 0,
						labels: {},
						annotations: {},
						enabled: true,
					}],
					cooldown: 0,
					aggregation: false,
					aggregationWindow: 0,
				},
			})

			const alert = triggerAlert('test-rule', 'Test message', 10, 5)
			expect(alert).toBeDefined()
			expect(alert?.severity).toBe('warning')
			expect(alert?.status).toBe('active')
		})

		it('should not trigger alert for disabled rule', () => {
			configureMonitoring({
				alerts: {
					enabled: true,
					channels: [],
					rules: [{
						id: 'disabled-rule',
						name: 'Disabled',
						description: '',
						condition: '',
						severity: 'info',
						duration: 0,
						labels: {},
						annotations: {},
						enabled: false,
					}],
					cooldown: 0,
					aggregation: false,
					aggregationWindow: 0,
				},
			})

			const alert = triggerAlert('disabled-rule', 'msg', 1, 0)
			expect(alert).toBeNull()
		})
	})

	describe('resolveAlert', () => {
		it('should resolve alert', () => {
			configureMonitoring({
				alerts: {
					enabled: true,
					channels: [],
					rules: [{
						id: 'test',
						name: 'Test',
						description: '',
						condition: '',
						severity: 'info',
						duration: 0,
						labels: {},
						annotations: {},
						enabled: true,
					}],
					cooldown: 0,
					aggregation: false,
					aggregationWindow: 0,
				},
			})

			const alert = triggerAlert('test', 'msg', 1, 0)
			expect(alert).not.toBeNull()
			const result = resolveAlert(alert!.id)
			expect(result).toBe(true)

			const resolved = getAlerts({ status: 'resolved' })
			expect(resolved.length).toBe(1)
		})
	})

	describe('acknowledgeAlert', () => {
		it('should acknowledge alert', () => {
			configureMonitoring({
				alerts: {
					enabled: true,
					channels: [],
					rules: [{
						id: 'ack-test',
						name: 'Ack Test',
						description: '',
						condition: '',
						severity: 'info',
						duration: 0,
						labels: {},
						annotations: {},
						enabled: true,
					}],
					cooldown: 0,
					aggregation: false,
					aggregationWindow: 0,
				},
			})

			const alert = triggerAlert('ack-test', 'msg', 1, 0)
			expect(alert).not.toBeNull()
			const result = acknowledgeAlert(alert!.id, 'user')
			expect(result).toBe(true)

			const acked = getAlerts({ status: 'acknowledged' })
			expect(acked.length).toBe(1)
			expect(acked[0].acknowledgedBy).toBe('user')
		})
	})

	describe('getAlerts', () => {
		it('should return alerts', () => {
			configureMonitoring({
				alerts: {
					enabled: true,
					channels: [],
					rules: [{
						id: 'alert1',
						name: 'Alert 1',
						description: '',
						condition: '',
						severity: 'warning',
						duration: 0,
						labels: {},
						annotations: {},
						enabled: true,
					}],
					cooldown: 0,
					aggregation: false,
					aggregationWindow: 0,
				},
			})

			triggerAlert('alert1', 'msg', 1, 0)
			const alerts = getAlerts()
			expect(alerts.length).toBeGreaterThan(0)
		})
	})

	describe('clearAlerts', () => {
		it('should clear alerts', () => {
			clearAlerts()
			expect(getAlerts().length).toBe(0)
		})
	})

	describe('addHealthCheck', () => {
		it('should add health check', () => {
			addHealthCheck({
				name: 'test-check',
				check: () => true,
				interval: 1000,
				timeout: 5000,
				enabled: true,
			})

			const status = getHealthStatus()
			expect(status.checks.some(c => c.name === 'test-check')).toBe(true)
		})
	})

	describe('removeHealthCheck', () => {
		it('should remove health check', () => {
			addHealthCheck({
				name: 'to-remove',
				check: () => true,
				interval: 1000,
				timeout: 5000,
				enabled: true,
			})

			removeHealthCheck('to-remove')

			const status = getHealthStatus()
			expect(status.checks.every(c => c.name !== 'to-remove')).toBe(true)
		})
	})

	describe('getHealthStatus', () => {
		it('should return health status', () => {
			addHealthCheck({
				name: 'healthy-check',
				check: () => true,
				interval: 1000,
				timeout: 5000,
				enabled: true,
			})

			const status = getHealthStatus()
			expect(typeof status.healthy).toBe('boolean')
			expect(Array.isArray(status.checks)).toBe(true)
		})
	})

	describe('exportPrometheusMetrics', () => {
		it('should export Prometheus format', () => {
			incrementCounter('http_requests')
			setGauge('active_users', 10)

			const exported = exportPrometheusMetrics()
			expect(exported).toContain('http_requests')
			expect(exported).toContain('active_users')
		})
	})

	describe('getMonitoringStats', () => {
		it('should return monitoring stats', () => {
			incrementCounter('test')

			const stats = getMonitoringStats()
			expect(typeof stats.metricsCount).toBe('number')
			expect(typeof stats.alertsCount).toBe('number')
		})
	})

	describe('resetMonitoring', () => {
		it('should reset all monitoring data', () => {
			incrementCounter('test')
			resetMonitoring()

			expect(getMetrics().length).toBe(0)
			expect(getAlerts().length).toBe(0)
		})
	})
})

describe('DEFAULT_MONITORING_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_MONITORING_CONFIG.enabled).toBe(true)
		expect(DEFAULT_MONITORING_CONFIG.metrics.enabled).toBe(true)
		expect(DEFAULT_MONITORING_CONFIG.metrics.prefix).toBe('directix_')
		expect(DEFAULT_MONITORING_CONFIG.alerts.enabled).toBe(true)
		expect(DEFAULT_MONITORING_CONFIG.health.enabled).toBe(true)
	})
})
