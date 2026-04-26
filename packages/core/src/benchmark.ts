/**
 * Performance Benchmark Module for Directix
 * Provides utilities for measuring and comparing directive performance
 */

// ============================================================================
// Types
// ============================================================================

export interface BenchmarkConfig {
	iterations: number
	warmupIterations: number
	samples: number
	timeout: number
	gc: boolean
	verbose: boolean
}

export interface BenchmarkResult {
	name: string
	iterations: number
	samples: number
	mean: number
	median: number
	min: number
	max: number
	stdDev: number
	percentiles: {
		p50: number
		p75: number
		p90: number
		p95: number
		p99: number
	}
	opsPerSecond: number
	marginOfError: number
	timestamp: number
}

export interface BenchmarkComparison {
	baseline: BenchmarkResult
	current: BenchmarkResult
	improvement: number
	significant: boolean
	regression: boolean
}

export interface BenchmarkSuite {
	name: string
	benchmarks: BenchmarkResult[]
	summary: {
		totalTime: number
		averageTime: number
		fastest: string
		slowest: string
	}
	timestamp: number
}

export type BenchmarkFunction = () => void | Promise<void>

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_BENCHMARK_CONFIG: BenchmarkConfig = {
	iterations: 1000,
	warmupIterations: 100,
	samples: 10,
	timeout: 30000,
	gc: false,
	verbose: false,
}

// ============================================================================
// Benchmark Runner
// ============================================================================

let _config: BenchmarkConfig = DEFAULT_BENCHMARK_CONFIG
const _results: Map<string, BenchmarkResult> = new Map()

/**
 * Configure benchmark
 */
export function configureBenchmark(config: Partial<BenchmarkConfig>): void {
	_config = {
		...DEFAULT_BENCHMARK_CONFIG,
		...config,
	}
}

/**
 * Get current configuration
 */
export function getBenchmarkConfig(): BenchmarkConfig {
	return { ..._config }
}

/**
 * Run a single benchmark
 */
export async function runBenchmark(
	name: string,
	fn: BenchmarkFunction,
	config?: Partial<BenchmarkConfig>,
): Promise<BenchmarkResult> {
	const cfg = { ..._config, ...config }
	const samples: number[] = []

	// Warmup
	for (let i = 0; i < cfg.warmupIterations; i++) {
		await fn()
	}

	// Run samples
	for (let s = 0; s < cfg.samples; s++) {
		const sampleTimes: number[] = []

		// Force GC if available and configured
		if (cfg.gc && typeof (globalThis as any).gc === 'function') {
			;(globalThis as any).gc()
		}

		const startSample = performance.now()

		for (let i = 0; i < cfg.iterations; i++) {
			const start = performance.now()
			await fn()
			sampleTimes.push(performance.now() - start)

			// Check timeout
			if (performance.now() - startSample > cfg.timeout) {
				if (cfg.verbose) {
					console.warn(`[Benchmark] Timeout exceeded for ${name}`)
				}
				break
			}
		}

		// Average time per iteration for this sample
		const avgTime = sampleTimes.reduce((a, b) => a + b, 0) / sampleTimes.length
		samples.push(avgTime)
	}

	// Calculate statistics
	const result = calculateStatistics(name, samples, cfg.iterations, cfg.samples)

	// Store result
	_results.set(name, result)

	if (cfg.verbose) {
		console.info(`[Benchmark] ${name}: ${result.mean.toFixed(4)}ms ± ${result.marginOfError.toFixed(4)}ms`)
	}

	return result
}

/**
 * Calculate statistics from samples
 */
function calculateStatistics(
	name: string,
	samples: number[],
	iterations: number,
	sampleCount: number,
): BenchmarkResult {
	// Sort for percentile calculation
	const sorted = [...samples].sort((a, b) => a - b)

	// Mean
	const mean = samples.reduce((a, b) => a + b, 0) / samples.length

	// Median
	const median = sorted[Math.floor(sorted.length / 2)]

	// Min/Max
	const min = sorted[0]
	const max = sorted[sorted.length - 1]

	// Standard deviation
	const variance = samples.reduce((sum, val) => sum + (val - mean) ** 2, 0) / samples.length
	const stdDev = Math.sqrt(variance)

	// Percentiles
	const percentile = (p: number): number => {
		const index = Math.ceil((p / 100) * sorted.length) - 1
		return sorted[Math.max(0, index)]
	}

	// Operations per second
	const opsPerSecond = 1000 / mean

	// Margin of error (95% confidence)
	const standardError = stdDev / Math.sqrt(samples.length)
	const marginOfError = standardError * 1.96

	return {
		name,
		iterations,
		samples: sampleCount,
		mean,
		median,
		min,
		max,
		stdDev,
		percentiles: {
			p50: percentile(50),
			p75: percentile(75),
			p90: percentile(90),
			p95: percentile(95),
			p99: percentile(99),
		},
		opsPerSecond,
		marginOfError,
		timestamp: Date.now(),
	}
}

/**
 * Run benchmark suite
 */
export async function runBenchmarkSuite(
	suiteName: string,
	benchmarks: Array<{ name: string, fn: BenchmarkFunction }>,
	config?: Partial<BenchmarkConfig>,
): Promise<BenchmarkSuite> {
	const results: BenchmarkResult[] = []

	for (const { name, fn } of benchmarks) {
		const result = await runBenchmark(`${suiteName}/${name}`, fn, config)
		results.push(result)
	}

	// Calculate summary
	const totalTime = results.reduce((sum, r) => sum + r.mean, 0)
	const averageTime = totalTime / results.length
	const fastest = results.reduce((a, b) => a.mean < b.mean ? a : b).name
	const slowest = results.reduce((a, b) => a.mean > b.mean ? a : b).name

	return {
		name: suiteName,
		benchmarks: results,
		summary: {
			totalTime,
			averageTime,
			fastest,
			slowest,
		},
		timestamp: Date.now(),
	}
}

/**
 * Compare two benchmark results
 */
export function compareBenchmarks(
	baseline: BenchmarkResult,
	current: BenchmarkResult,
	threshold: number = 0.05,
): BenchmarkComparison {
	const improvement = ((baseline.mean - current.mean) / baseline.mean) * 100

	// Calculate significance using t-test approximation
	const pooledStdDev = Math.sqrt(
		(baseline.stdDev ** 2 + current.stdDev ** 2) / 2,
	)
	const standardError = pooledStdDev * Math.sqrt(2 / baseline.samples)
	const tValue = Math.abs(current.mean - baseline.mean) / standardError

	// Significant if t > 2 (roughly 95% confidence)
	const significant = tValue > 2

	// Check for regression
	const regression = improvement < -threshold * 100 && significant

	return {
		baseline,
		current,
		improvement,
		significant,
		regression,
	}
}

/**
 * Get stored benchmark result
 */
export function getBenchmarkResult(name: string): BenchmarkResult | undefined {
	return _results.get(name)
}

/**
 * Get all stored results
 */
export function getAllBenchmarkResults(): Map<string, BenchmarkResult> {
	return new Map(_results)
}

/**
 * Clear stored results
 */
export function clearBenchmarkResults(): void {
	_results.clear()
}

/**
 * Create benchmark for directive
 */
export function createDirectiveBenchmark(
	directiveName: string,
	setup: () => HTMLElement,
	teardown?: (el: HTMLElement) => void,
): {
	measureMount: () => Promise<BenchmarkResult>
	measureUpdate: (newValue: any) => Promise<BenchmarkResult>
	measureUnmount: () => Promise<BenchmarkResult>
	measureFullCycle: () => Promise<BenchmarkResult>
} {
	let element: HTMLElement

	return {
		measureMount: async () => {
			return runBenchmark(`${directiveName}/mount`, () => {
				element = setup()
			})
		},

		measureUpdate: async (newValue: any) => {
			return runBenchmark(`${directiveName}/update`, () => {
				// Simulate update
				if (element) {
					element.setAttribute('data-value', JSON.stringify(newValue))
				}
			})
		},

		measureUnmount: async () => {
			return runBenchmark(`${directiveName}/unmount`, () => {
				if (element && teardown) {
					teardown(element)
				}
			})
		},

		measureFullCycle: async () => {
			return runBenchmark(`${directiveName}/full-cycle`, () => {
				const el = setup()
				if (teardown) teardown(el)
			})
		},
	}
}

/**
 * Performance snapshot
 */
export interface PerformanceSnapshot {
	memory?: {
		usedJSHeapSize: number
		totalJSHeapSize: number
		jsHeapSizeLimit: number
	}
	timing: {
		domContentLoaded: number
		loadComplete: number
		domInteractive: number
	}
	entries: PerformanceEntry[]
	timestamp: number
}

/**
 * Take performance snapshot
 */
export function takePerformanceSnapshot(): PerformanceSnapshot {
	const snapshot: PerformanceSnapshot = {
		timing: {
			domContentLoaded: 0,
			loadComplete: 0,
			domInteractive: 0,
		},
		entries: [],
		timestamp: Date.now(),
	}

	if (typeof performance === 'undefined') {
		return snapshot
	}

	// Memory info (Chrome only)
	if ((performance as any).memory) {
		const memory = (performance as any).memory
		snapshot.memory = {
			usedJSHeapSize: memory.usedJSHeapSize,
			totalJSHeapSize: memory.totalJSHeapSize,
			jsHeapSizeLimit: memory.jsHeapSizeLimit,
		}
	}

	// Navigation timing
	const timing = performance.timing
	if (timing) {
		snapshot.timing = {
			domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
			loadComplete: timing.loadEventEnd - timing.navigationStart,
			domInteractive: timing.domInteractive - timing.navigationStart,
		}
	}

	// Performance entries
	try {
		snapshot.entries = performance.getEntries()
	} catch {
		// Some browsers restrict getEntries()
	}

	return snapshot
}

/**
 * Compare performance snapshots
 */
export function compareSnapshots(
	before: PerformanceSnapshot,
	after: PerformanceSnapshot,
): {
	memoryDiff?: {
		usedJSHeapSize: number
		totalJSHeapSize: number
	}
	timeDiff: number
} {
	const result: any = {
		timeDiff: after.timestamp - before.timestamp,
	}

	if (before.memory && after.memory) {
		result.memoryDiff = {
			usedJSHeapSize: after.memory.usedJSHeapSize - before.memory.usedJSHeapSize,
			totalJSHeapSize: after.memory.totalJSHeapSize - before.memory.totalJSHeapSize,
		}
	}

	return result
}

/**
 * Export results as JSON
 */
export function exportBenchmarkResults(format: 'json' | 'csv' = 'json'): string {
	const results = Array.from(_results.values())

	if (format === 'csv') {
		const headers = ['name', 'iterations', 'samples', 'mean', 'median', 'min', 'max', 'stdDev', 'opsPerSecond']
		const rows = results.map(r => [
			r.name,
			r.iterations,
			r.samples,
			r.mean.toFixed(6),
			r.median.toFixed(6),
			r.min.toFixed(6),
			r.max.toFixed(6),
			r.stdDev.toFixed(6),
			r.opsPerSecond.toFixed(2),
		])
		return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
	}

	return JSON.stringify(results, null, 2)
}

/**
 * Generate benchmark report
 */
export function generateBenchmarkReport(): string {
	const results = Array.from(_results.values())

	if (results.length === 0) {
		return 'No benchmark results available.'
	}

	const lines: string[] = [
		'# Benchmark Report',
		`Generated: ${new Date().toISOString()}`,
		'',
		'## Summary',
		`Total benchmarks: ${results.length}`,
		`Total time: ${results.reduce((s, r) => s + r.mean, 0).toFixed(4)}ms`,
		'',
		'## Results',
		'',
	]

	// Sort by mean time
	const sorted = [...results].sort((a, b) => a.mean - b.mean)

	for (const result of sorted) {
		lines.push(`### ${result.name}`)
		lines.push(`- **Mean**: ${result.mean.toFixed(4)}ms`)
		lines.push(`- **Median**: ${result.median.toFixed(4)}ms`)
		lines.push(`- **Std Dev**: ${result.stdDev.toFixed(4)}ms`)
		lines.push(`- **Min/Max**: ${result.min.toFixed(4)}ms / ${result.max.toFixed(4)}ms`)
		lines.push(`- **Ops/sec**: ${result.opsPerSecond.toFixed(2)}`)
		lines.push(`- **P95**: ${result.percentiles.p95.toFixed(4)}ms`)
		lines.push(`- **P99**: ${result.percentiles.p99.toFixed(4)}ms`)
		lines.push('')
	}

	return lines.join('\n')
}

/**
 * Simple benchmark decorator
 */
export function benchmark(name?: string) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value
		const benchmarkName = name || `${target.constructor.name}.${propertyKey}`

		descriptor.value = async function (...args: any[]) {
			const result = await runBenchmark(benchmarkName, () => originalMethod.apply(this, args))
			return result
		}

		return descriptor
	}
}
