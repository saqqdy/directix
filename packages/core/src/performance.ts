/**
 * Performance Monitoring
 *
 * Provides performance metrics and monitoring for Directix directives.
 */

import { isSSR } from './env'

/**
 * Performance metric types
 */
export interface PerformanceMetric {
	/** Metric name */
	name: string
	/** Directive name */
	directive: string
	/** Duration in milliseconds */
	duration: number
	/** Timestamp */
	timestamp: number
	/** Additional metadata */
	metadata?: Record<string, any>
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
	/** Total calls */
	totalCalls: number
	/** Average duration */
	averageDuration: number
	/** Min duration */
	minDuration: number
	/** Max duration */
	maxDuration: number
	/** P50 (median) */
	p50: number
	/** P95 */
	p95: number
	/** P99 */
	p99: number
}

/**
 * Directive performance metrics
 */
export interface DirectivePerformance {
	/** Directive name */
	name: string
	/** Mount stats */
	mount: PerformanceStats
	/** Update stats */
	update: PerformanceStats
	/** Unmount stats */
	unmount: PerformanceStats
	/** Total time spent */
	totalTime: number
	/** Call count */
	callCount: number
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
	/** Enable performance monitoring */
	enabled: boolean
	/** Maximum metrics to store */
	maxMetrics: number
	/** Sample rate (0-1) */
	sampleRate: number
	/** Warn threshold in ms */
	warnThreshold: number
}

/**
 * Global performance state
 */
const state = {
	config: {
		enabled: false,
		maxMetrics: 1000,
		sampleRate: 1,
		warnThreshold: 16,
	} as PerformanceConfig,
	metrics: [] as PerformanceMetric[],
	directiveMetrics: new Map<string, PerformanceMetric[]>(),
	observers: new Map<string, PerformanceObserver>(),
	startMarks: new Map<string, number>(),
}

/**
 * Configure performance monitoring
 */
export function configurePerformance(config: Partial<PerformanceConfig>): void {
	state.config = { ...state.config, ...config }
}

/**
 * Enable performance monitoring
 */
export function enablePerformance(): void {
	state.config.enabled = true
}

/**
 * Disable performance monitoring
 */
export function disablePerformance(): void {
	state.config.enabled = false
}

/**
 * Check if performance monitoring is enabled
 */
export function isPerformanceEnabled(): boolean {
	return state.config.enabled
}

/**
 * Start a performance measurement
 */
export function startMeasure(directive: string, phase: 'mount' | 'update' | 'unmount'): string {
	if (!state.config.enabled || isSSR()) return ''

	// Check sample rate
	if (state.config.sampleRate < 1 && Math.random() > state.config.sampleRate) {
		return ''
	}

	const markId = `${directive}:${phase}:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`
	state.startMarks.set(markId, performance.now())

	// Use Performance API if available
	if (typeof performance !== 'undefined' && performance.mark) {
		try {
			performance.mark(`${markId}-start`)
		} catch {
			// Ignore if mark fails
		}
	}

	return markId
}

/**
 * End a performance measurement
 */
export function endMeasure(markId: string, directive: string, phase: 'mount' | 'update' | 'unmount', metadata?: Record<string, any>): void {
	if (!markId || !state.config.enabled || isSSR()) return

	const startTime = state.startMarks.get(markId)
	if (startTime === undefined) return

	const duration = performance.now() - startTime
	state.startMarks.delete(markId)

	// Use Performance API if available
	if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
		try {
			performance.mark(`${markId}-end`)
			performance.measure(`directix:${directive}:${phase}`, `${markId}-start`, `${markId}-end`)
		} catch {
			// Ignore if measure fails
		}
	}

	// Record metric
	const metric: PerformanceMetric = {
		name: phase,
		directive,
		duration,
		timestamp: Date.now(),
		metadata,
	}

	// Store in global metrics
	state.metrics.push(metric)
	if (state.metrics.length > state.config.maxMetrics) {
		state.metrics.shift()
	}

	// Store in directive-specific metrics
	if (!state.directiveMetrics.has(directive)) {
		state.directiveMetrics.set(directive, [])
	}
	const directiveMetricList = state.directiveMetrics.get(directive)!
	directiveMetricList.push(metric)
	if (directiveMetricList.length > state.config.maxMetrics) {
		directiveMetricList.shift()
	}

	// Warn if exceeding threshold
	if (duration > state.config.warnThreshold) {
		console.warn(`[Directix Performance] v-${directive} ${phase} took ${duration.toFixed(2)}ms (threshold: ${state.config.warnThreshold}ms)`)
	}
}

/**
 * Get all performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetric[] {
	return [...state.metrics]
}

/**
 * Get performance metrics for a specific directive
 */
export function getDirectiveMetrics(directive: string): PerformanceMetric[] {
	return [...(state.directiveMetrics.get(directive) || [])]
}

/**
 * Calculate statistics from metrics
 */
export function calculateStats(metrics: PerformanceMetric[]): PerformanceStats {
	if (metrics.length === 0) {
		return {
			totalCalls: 0,
			averageDuration: 0,
			minDuration: 0,
			maxDuration: 0,
			p50: 0,
			p95: 0,
			p99: 0,
		}
	}

	const durations = metrics.map(m => m.duration).sort((a, b) => a - b)
	const total = durations.reduce((sum, d) => sum + d, 0)

	return {
		totalCalls: metrics.length,
		averageDuration: total / metrics.length,
		minDuration: durations[0],
		maxDuration: durations[durations.length - 1],
		p50: durations[Math.floor(durations.length * 0.5)],
		p95: durations[Math.floor(durations.length * 0.95)],
		p99: durations[Math.floor(durations.length * 0.99)],
	}
}

/**
 * Get performance report for all directives
 */
export function getPerformanceReport(): DirectivePerformance[] {
	const reports: DirectivePerformance[] = []

	for (const [directive, metrics] of state.directiveMetrics) {
		const mountMetrics = metrics.filter(m => m.name === 'mount')
		const updateMetrics = metrics.filter(m => m.name === 'update')
		const unmountMetrics = metrics.filter(m => m.name === 'unmount')

		const totalTime = metrics.reduce((sum, m) => sum + m.duration, 0)

		reports.push({
			name: directive,
			mount: calculateStats(mountMetrics),
			update: calculateStats(updateMetrics),
			unmount: calculateStats(unmountMetrics),
			totalTime,
			callCount: metrics.length,
		})
	}

	// Sort by total time descending
	return reports.sort((a, b) => b.totalTime - a.totalTime)
}

/**
 * Get slowest directives
 */
export function getSlowestDirectives(limit = 10): DirectivePerformance[] {
	const report = getPerformanceReport()
	return report.slice(0, limit)
}

/**
 * Get most frequently called directives
 */
export function getMostFrequentDirectives(limit = 10): DirectivePerformance[] {
	const report = getPerformanceReport()
	return report.sort((a, b) => b.callCount - a.callCount).slice(0, limit)
}

/**
 * Clear all performance metrics
 */
export function clearPerformanceMetrics(): void {
	state.metrics = []
	state.directiveMetrics.clear()
	state.startMarks.clear()
}

/**
 * Export performance metrics as JSON
 */
export function exportPerformanceData(): {
	config: PerformanceConfig
	metrics: PerformanceMetric[]
	report: DirectivePerformance[]
} {
	return {
		config: state.config,
		metrics: getPerformanceMetrics(),
		report: getPerformanceReport(),
	}
}

/**
 * Performance measurement helper
 * Use this to wrap directive lifecycle methods
 */
export function measurePerformance<T>(
	directive: string,
	phase: 'mount' | 'update' | 'unmount',
	fn: () => T,
	metadata?: Record<string, any>,
): T {
	if (!state.config.enabled || isSSR()) {
		return fn()
	}

	const markId = startMeasure(directive, phase)
	try {
		const result = fn()
		endMeasure(markId, directive, phase, metadata)
		return result
	} catch (error) {
		endMeasure(markId, directive, phase, { ...metadata, error: true })
		throw error
	}
}

/**
 * Async performance measurement helper
 */
export async function measurePerformanceAsync<T>(
	directive: string,
	phase: 'mount' | 'update' | 'unmount',
	fn: () => Promise<T>,
	metadata?: Record<string, any>,
): Promise<T> {
	if (!state.config.enabled || isSSR()) {
		return fn()
	}

	const markId = startMeasure(directive, phase)
	try {
		const result = await fn()
		endMeasure(markId, directive, phase, metadata)
		return result
	} catch (error) {
		endMeasure(markId, directive, phase, { ...metadata, error: true })
		throw error
	}
}

/**
 * Create a performance monitor decorator for directives
 */
export function withPerformanceMonitoring<T extends Record<string, any>>(
	directiveName: string,
	directive: T,
): T {
	if (!state.config.enabled) return directive

	const wrapped: Record<string, any> = {}

	for (const [key, value] of Object.entries(directive)) {
		if (typeof value === 'function' && ['mounted', 'updated', 'unmounted'].includes(key)) {
			const phase = key === 'mounted' ? 'mount' : key === 'updated' ? 'update' : 'unmount'
			wrapped[key] = function (this: any, ...args: any[]) {
				return measurePerformance(directiveName, phase, () => value.apply(this, args))
			}
		} else {
			wrapped[key] = value
		}
	}

	return wrapped as T
}
