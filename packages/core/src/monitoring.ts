/**
 * Monitoring and Alerting Integration Module for Directix
 * Provides real-time monitoring, metrics collection, and alerting capabilities
 */

// ============================================================================
// Types
// ============================================================================

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical'
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary'
export type AlertStatus = 'active' | 'resolved' | 'acknowledged'

export interface MonitoringConfig {
	enabled: boolean
	metrics: {
		enabled: boolean
		prefix: string
		labels: Record<string, string>
		flushInterval: number
		maxBatchSize: number
	}
	alerts: {
		enabled: boolean
		channels: AlertChannel[]
		rules: AlertRule[]
		cooldown: number
		aggregation: boolean
		aggregationWindow: number
	}
	health: {
		enabled: boolean
		endpoint: string
		checks: HealthCheck[]
		interval: number
	}
	integrations: {
		prometheus?: PrometheusConfig
		datadog?: DatadogConfig
		sentry?: SentryConfig
		custom?: CustomIntegration
	}
}

export interface AlertChannel {
	type: 'webhook' | 'email' | 'slack' | 'pagerduty' | 'custom'
	name: string
	config: Record<string, any>
	severity: AlertSeverity[]
}

export interface AlertRule {
	id: string
	name: string
	description: string
	condition: string
	severity: AlertSeverity
	duration: number
	labels: Record<string, string>
	annotations: Record<string, string>
	enabled: boolean
}

export interface Alert {
	id: string
	ruleId: string
	name: string
	severity: AlertSeverity
	status: AlertStatus
	message: string
	labels: Record<string, string>
	value: number
	threshold: number
	startedAt: number
	resolvedAt?: number
	acknowledgedAt?: number
	acknowledgedBy?: string
}

export interface Metric {
	name: string
	type: MetricType
	value: number
	labels: Record<string, string>
	timestamp: number
}

export interface HealthCheck {
	name: string
	check: () => Promise<boolean> | boolean
	interval: number
	timeout: number
	enabled: boolean
}

export interface HealthStatus {
	name: string
	healthy: boolean
	lastCheck: number
	error?: string
	latency: number
}

export interface PrometheusConfig {
	enabled: boolean
	endpoint: string
}

export interface DatadogConfig {
	enabled: boolean
	apiKey: string
	appKey?: string
	host?: string
}

export interface SentryConfig {
	enabled: boolean
	dsn: string
	environment?: string
	release?: string
}

export interface CustomIntegration {
	enabled: boolean
	pushMetrics: (metrics: Metric[]) => Promise<void>
	pushAlert: (alert: Alert) => Promise<void>
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_MONITORING_CONFIG: MonitoringConfig = {
	enabled: true,
	metrics: {
		enabled: true,
		prefix: 'directix_',
		labels: {},
		flushInterval: 60000,
		maxBatchSize: 100,
	},
	alerts: {
		enabled: true,
		channels: [],
		rules: [],
		cooldown: 300000,
		aggregation: true,
		aggregationWindow: 60000,
	},
	health: {
		enabled: true,
		endpoint: '/health',
		checks: [],
		interval: 30000,
	},
	integrations: {},
}

// ============================================================================
// Monitoring Manager
// ============================================================================

let _config: MonitoringConfig = DEFAULT_MONITORING_CONFIG,
	_metrics: Metric[] = [],
	_alerts: Alert[] = [],
	_flushTimer: number | null = null,
	_healthTimer: number | null = null
const _counters: Map<string, number> = new Map()
const _gauges: Map<string, number> = new Map()
const _histograms: Map<string, number[]> = new Map()
const _alertCooldowns: Map<string, number> = new Map()
const _healthStatus: Map<string, HealthStatus> = new Map()

/**
 * Configure monitoring
 */
export function configureMonitoring(config: Partial<MonitoringConfig>): void {
	_config = {
		...DEFAULT_MONITORING_CONFIG,
		...config,
		metrics: { ...DEFAULT_MONITORING_CONFIG.metrics, ...config.metrics },
		alerts: { ...DEFAULT_MONITORING_CONFIG.alerts, ...config.alerts },
		health: { ...DEFAULT_MONITORING_CONFIG.health, ...config.health },
		integrations: { ...DEFAULT_MONITORING_CONFIG.integrations, ...config.integrations },
	}

	if (_config.enabled) {
		startFlushTimer()
		startHealthChecks()
	}
}

/**
 * Get current configuration
 */
export function getMonitoringConfig(): MonitoringConfig {
	return { ..._config }
}

// ============================================================================
// Metrics
// ============================================================================

/**
 * Increment counter
 */
export function incrementCounter(name: string, labels?: Record<string, string>, value: number = 1): void {
	if (!_config.enabled || !_config.metrics.enabled) return

	const key = getMetricKey(name, labels)
	const current = _counters.get(key) ?? 0
	_counters.set(key, current + value)

	addMetric(name, 'counter', current + value, labels)
}

/**
 * Set gauge
 */
export function setGauge(name: string, value: number, labels?: Record<string, string>): void {
	if (!_config.enabled || !_config.metrics.enabled) return

	const key = getMetricKey(name, labels)
	_gauges.set(key, value)

	addMetric(name, 'gauge', value, labels)
}

/**
 * Record histogram value
 */
export function recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
	if (!_config.enabled || !_config.metrics.enabled) return

	const key = getMetricKey(name, labels)
	const values = _histograms.get(key) ?? []
	values.push(value)
	_histograms.set(key, values)

	addMetric(name, 'histogram', value, labels)
}

/**
 * Time an operation
 */
export async function timeOperation<T>(
	name: string,
	fn: () => T | Promise<T>,
	labels?: Record<string, string>,
): Promise<T> {
	const start = performance.now()
	try {
		const result = await fn()
		const duration = performance.now() - start
		recordHistogram(`${name}_duration`, duration, labels)
		incrementCounter(`${name}_total`, labels)
		incrementCounter(`${name}_success`, labels)
		return result
	} catch (error) {
		incrementCounter(`${name}_total`, labels)
		incrementCounter(`${name}_error`, labels)
		throw error
	}
}

/**
 * Get metric key
 */
function getMetricKey(name: string, labels?: Record<string, string>): string {
	const labelStr = labels ? Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(',') : ''
	return `${name}{${labelStr}}`
}

/**
 * Add metric to batch
 */
function addMetric(name: string, type: MetricType, value: number, labels?: Record<string, string>): void {
	_metrics.push({
		name: `${_config.metrics.prefix}${name}`,
		type,
		value,
		labels: { ..._config.metrics.labels, ...labels },
		timestamp: Date.now(),
	})

	// Flush if batch size exceeded
	if (_metrics.length >= _config.metrics.maxBatchSize) {
		flushMetrics()
	}
}

/**
 * Get metrics
 */
export function getMetrics(filter?: {
	name?: string
	type?: MetricType
	since?: number
}): Metric[] {
	let result = [..._metrics]

	if (filter?.name) {
		result = result.filter(m => m.name.includes(filter.name!))
	}

	if (filter?.type) {
		result = result.filter(m => m.type === filter.type)
	}

	if (filter?.since) {
		result = result.filter(m => m.timestamp >= filter.since!)
	}

	return result
}

/**
 * Get counter value
 */
export function getCounterValue(name: string, labels?: Record<string, string>): number {
	const key = getMetricKey(name, labels)
	return _counters.get(key) ?? 0
}

/**
 * Get gauge value
 */
export function getGaugeValue(name: string, labels?: Record<string, string>): number | undefined {
	const key = getMetricKey(name, labels)
	return _gauges.get(key)
}

/**
 * Get histogram statistics
 */
export function getHistogramStats(name: string, labels?: Record<string, string>): {
	count: number
	min: number
	max: number
	mean: number
	p50: number
	p95: number
	p99: number
} | undefined {
	const key = getMetricKey(name, labels)
	const values = _histograms.get(key)

	if (!values || values.length === 0) return undefined

	const sorted = [...values].sort((a, b) => a - b)
	const sum = sorted.reduce((a, b) => a + b, 0)

	return {
		count: sorted.length,
		min: sorted[0],
		max: sorted[sorted.length - 1],
		mean: sum / sorted.length,
		p50: sorted[Math.floor(sorted.length * 0.5)],
		p95: sorted[Math.floor(sorted.length * 0.95)],
		p99: sorted[Math.floor(sorted.length * 0.99)],
	}
}

/**
 * Flush metrics
 */
function flushMetrics(): void {
	if (_metrics.length === 0) return

	const batch = [..._metrics]
	_metrics = []

	// Push to integrations
	pushToIntegrations(batch)
}

/**
 * Push to integrations
 */
async function pushToIntegrations(metrics: Metric[]): Promise<void> {
	const { prometheus, datadog, custom } = _config.integrations

	// Custom integration
	if (custom?.enabled && custom.pushMetrics) {
		await custom.pushMetrics(metrics)
	}

	// Datadog
	if (datadog?.enabled) {
		await pushToDatadog(metrics, datadog)
	}

	// Prometheus format export
	if (prometheus?.enabled) {
		// Prometheus pulls, not pushes
	}
}

/**
 * Push to Datadog
 */
async function pushToDatadog(metrics: Metric[], config: DatadogConfig): Promise<void> {
	try {
		await fetch('https://api.datadoghq.com/api/v1/series', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'DD-API-KEY': config.apiKey,
				'DD-APPLICATION-KEY': config.appKey ?? '',
			},
			body: JSON.stringify({
				series: metrics.map(m => ({
					metric: m.name,
					points: [[m.timestamp / 1000, m.value]],
					tags: Object.entries(m.labels).map(([k, v]) => `${k}:${v}`),
					host: config.host,
				})),
			}),
		})
	} catch {
		// Ignore push errors
	}
}

/**
 * Start flush timer
 */
function startFlushTimer(): void {
	if (_flushTimer) clearInterval(_flushTimer)

	_flushTimer = window.setInterval(() => {
		flushMetrics()
	}, _config.metrics.flushInterval)
}

// ============================================================================
// Alerts
// ============================================================================

/**
 * Trigger alert
 */
export function triggerAlert(
	ruleId: string,
	message: string,
	value: number,
	threshold: number,
	labels?: Record<string, string>,
): Alert | null {
	if (!_config.enabled || !_config.alerts.enabled) return null

	// Check cooldown
	if (_alertCooldowns.has(ruleId)) {
		const lastTriggered = _alertCooldowns.get(ruleId)!
		if (Date.now() - lastTriggered < _config.alerts.cooldown) {
			return null
		}
	}

	const rule = _config.alerts.rules.find(r => r.id === ruleId)
	if (!rule || !rule.enabled) return null

	const alert: Alert = {
		id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		name: rule.name,
		value,
		ruleId,
		severity: rule.severity,
		status: 'active',
		message,
		labels: { ...rule.labels, ...labels },
		threshold,
		startedAt: Date.now(),
	}

	_alerts.push(alert)
	_alertCooldowns.set(ruleId, Date.now())

	// Send to channels
	sendAlertToChannels(alert)

	// Custom integration
	if (_config.integrations.custom?.enabled && _config.integrations.custom.pushAlert) {
		_config.integrations.custom.pushAlert(alert)
	}

	return alert
}

/**
 * Resolve alert
 */
export function resolveAlert(alertId: string): boolean {
	const alert = _alerts.find(a => a.id === alertId)
	if (!alert || alert.status === 'resolved') return false

	alert.status = 'resolved'
	alert.resolvedAt = Date.now()

	return true
}

/**
 * Acknowledge alert
 */
export function acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
	const alert = _alerts.find(a => a.id === alertId)
	if (!alert || alert.status !== 'active') return false

	alert.status = 'acknowledged'
	alert.acknowledgedAt = Date.now()
	alert.acknowledgedBy = acknowledgedBy

	return true
}

/**
 * Send alert to channels
 */
async function sendAlertToChannels(alert: Alert): Promise<void> {
	for (const channel of _config.alerts.channels) {
		if (!channel.severity.includes(alert.severity)) continue

		try {
			switch (channel.type) {
				case 'webhook':
					await sendWebhookAlert(alert, channel.config)
					break

				case 'slack':
					await sendSlackAlert(alert, channel.config)
					break

				case 'custom':
					if (channel.config.handler) {
						await channel.config.handler(alert)
					}
					break
			}
		} catch {
			// Ignore channel errors
		}
	}
}

/**
 * Send webhook alert
 */
async function sendWebhookAlert(alert: Alert, config: Record<string, any>): Promise<void> {
	await fetch(config.url, {
		method: 'POST',
		headers: config.headers || { 'Content-Type': 'application/json' },
		body: JSON.stringify(alert),
	})
}

/**
 * Send Slack alert
 */
async function sendSlackAlert(alert: Alert, config: Record<string, any>): Promise<void> {
	const color = {
		info: '#36a64f',
		warning: '#ff9900',
		error: '#ff0000',
		critical: '#990000',
	}[alert.severity]

	await fetch(config.webhookUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			attachments: [{
				color,
				title: alert.name,
				text: alert.message,
				fields: [
					{ value: alert.severity, title: 'Severity', short: true },
					{ value: alert.status, title: 'Status', short: true },
					{ value: String(alert.value), title: 'Value', short: true },
					{ value: String(alert.threshold), title: 'Threshold', short: true },
				],
				ts: Math.floor(alert.startedAt / 1000),
			}],
		}),
	})
}

/**
 * Get alerts
 */
export function getAlerts(filter?: {
	status?: AlertStatus
	severity?: AlertSeverity
	ruleId?: string
	since?: number
}): Alert[] {
	let result = [..._alerts]

	if (filter?.status) {
		result = result.filter(a => a.status === filter.status)
	}

	if (filter?.severity) {
		result = result.filter(a => a.severity === filter.severity)
	}

	if (filter?.ruleId) {
		result = result.filter(a => a.ruleId === filter.ruleId)
	}

	if (filter?.since) {
		result = result.filter(a => a.startedAt >= filter.since!)
	}

	return result
}

/**
 * Clear alerts
 */
export function clearAlerts(): void {
	_alerts = []
	_alertCooldowns.clear()
}

// ============================================================================
// Health Checks
// ============================================================================

/**
 * Start health checks
 */
function startHealthChecks(): void {
	if (!_config.health.enabled || _config.health.checks.length === 0) return

	// Run immediately
	runHealthChecks()

	// Then run on interval
	if (_healthTimer) clearInterval(_healthTimer)

	_healthTimer = window.setInterval(runHealthChecks, _config.health.interval)
}

/**
 * Run health checks
 */
async function runHealthChecks(): Promise<void> {
	for (const check of _config.health.checks) {
		if (!check.enabled) continue

		const start = performance.now()

		try {
			const timeoutPromise = new Promise<boolean>((_, reject) =>
				setTimeout(() => reject(new Error('Timeout')), check.timeout),
			)

			const healthy = await Promise.race([
				Promise.resolve(check.check()),
				timeoutPromise,
			])

			_healthStatus.set(check.name, {
				name: check.name,
				healthy,
				lastCheck: Date.now(),
				latency: performance.now() - start,
			})
		} catch (error) {
			_healthStatus.set(check.name, {
				name: check.name,
				healthy: false,
				lastCheck: Date.now(),
				error: String(error),
				latency: performance.now() - start,
			})
		}
	}
}

/**
 * Get health status
 */
export function getHealthStatus(): {
	healthy: boolean
	checks: HealthStatus[]
	timestamp: number
} {
	const checks = Array.from(_healthStatus.values())
	const healthy = checks.every(c => c.healthy)

	return {
		healthy,
		checks,
		timestamp: Date.now(),
	}
}

/**
 * Add health check
 */
export function addHealthCheck(check: HealthCheck): void {
	_config.health.checks.push(check)
	_healthStatus.set(check.name, {
		name: check.name,
		healthy: true,
		lastCheck: 0,
		latency: 0,
	})
}

/**
 * Remove health check
 */
export function removeHealthCheck(name: string): void {
	_config.health.checks = _config.health.checks.filter(c => c.name !== name)
	_healthStatus.delete(name)
}

// ============================================================================
// Export / Cleanup
// ============================================================================

/**
 * Export metrics in Prometheus format
 */
export function exportPrometheusMetrics(): string {
	const lines: string[] = []

	for (const [key, value] of _counters) {
		lines.push(`# TYPE ${key.split('{')[0]} counter`)
		lines.push(`${key} ${value}`)
	}

	for (const [key, value] of _gauges) {
		lines.push(`# TYPE ${key.split('{')[0]} gauge`)
		lines.push(`${key} ${value}`)
	}

	for (const [key, values] of _histograms) {
		const baseName = key.split('{')[0]
		lines.push(`# TYPE ${baseName} histogram`)

		const sorted = [...values].sort((a, b) => a - b)
		for (const v of sorted) {
			lines.push(`${key} ${v}`)
		}
	}

	return lines.join('\n')
}

/**
 * Reset monitoring
 */
export function resetMonitoring(): void {
	if (_flushTimer) {
		clearInterval(_flushTimer)
		_flushTimer = null
	}

	if (_healthTimer) {
		clearInterval(_healthTimer)
		_healthTimer = null
	}

	_metrics = []
	_counters.clear()
	_gauges.clear()
	_histograms.clear()
	_alerts = []
	_alertCooldowns.clear()
	_healthStatus.clear()
}

/**
 * Get monitoring statistics
 */
export function getMonitoringStats(): {
	metricsCount: number
	alertsCount: number
	activeAlerts: number
	healthChecksCount: number
	healthyChecks: number
} {
	return {
		metricsCount: _metrics.length,
		alertsCount: _alerts.length,
		activeAlerts: _alerts.filter(a => a.status === 'active').length,
		healthChecksCount: _config.health.checks.length,
		healthyChecks: Array.from(_healthStatus.values()).filter(s => s.healthy).length,
	}
}
