import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
	clearBenchmarkResults,
	compareBenchmarks,
	compareSnapshots,
	configureBenchmark,
	DEFAULT_BENCHMARK_CONFIG,
	exportBenchmarkResults,
	generateBenchmarkReport,
	getAllBenchmarkResults,
	getBenchmarkConfig,
	getBenchmarkResult,
	runBenchmark,
	runBenchmarkSuite,
	takePerformanceSnapshot,
} from '../../packages/core/src/benchmark'

describe('Benchmark System', () => {
	beforeEach(() => {
		clearBenchmarkResults()
		configureBenchmark(DEFAULT_BENCHMARK_CONFIG)
	})

	afterEach(() => {
		clearBenchmarkResults()
	})

	describe('configureBenchmark', () => {
		it('should configure benchmark', () => {
			configureBenchmark({ iterations: 100, warmupIterations: 10 })
			const config = getBenchmarkConfig()
			expect(config.iterations).toBe(100)
			expect(config.warmupIterations).toBe(10)
		})
	})

	describe('runBenchmark', () => {
		it('should run benchmark and return result', async () => {
			const result = await runBenchmark(
				'test-benchmark',
				() => {
					// Simple operation
					const arr = [1, 2, 3]
					arr.map(x => x * 2)
				},
				{ iterations: 100, warmupIterations: 10, samples: 5 },
			)

			expect(result.name).toBe('test-benchmark')
			expect(result.iterations).toBe(100)
			expect(result.mean).toBeGreaterThan(0)
			expect(result.min).toBeLessThanOrEqual(result.max)
			expect(result.opsPerSecond).toBeGreaterThan(0)
			expect(result.percentiles.p50).toBeDefined()
			expect(result.percentiles.p95).toBeDefined()
		})

		it('should store result', async () => {
			await runBenchmark('stored-test', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			const stored = getBenchmarkResult('stored-test')
			expect(stored).toBeDefined()
			expect(stored?.name).toBe('stored-test')
		})

		it('should handle async functions', async () => {
			const result = await runBenchmark(
				'async-test',
				async () => {
					await new Promise(r => setTimeout(r, 1))
				},
				{ iterations: 10, warmupIterations: 5, samples: 3 },
			)
			expect(result.mean).toBeGreaterThan(1)
		})
	})

	describe('runBenchmarkSuite', () => {
		it('should run benchmark suite', async () => {
			const suite = await runBenchmarkSuite(
				'test-suite',
				[
					{ name: 'op1', fn: () => [1, 2, 3].map(x => x) },
					{ name: 'op2', fn: () => [1, 2, 3].filter(x => x > 1) },
				],
				{ iterations: 50, warmupIterations: 10, samples: 5 },
			)

			expect(suite.name).toBe('test-suite')
			expect(suite.benchmarks.length).toBe(2)
			expect(suite.summary.fastest).toBeDefined()
			expect(suite.summary.slowest).toBeDefined()
			expect(suite.summary.averageTime).toBeGreaterThan(0)
		})
	})

	describe('compareBenchmarks', () => {
		it('should compare two results', async () => {
			const baseline = await runBenchmark(
				'baseline',
				() => [1, 2, 3].map(x => x),
				{ iterations: 50, warmupIterations: 10, samples: 5 },
			)

			const current = await runBenchmark(
				'current',
				() => [1, 2, 3].map(x => x * 2),
				{ iterations: 50, warmupIterations: 10, samples: 5 },
			)

			const comparison = compareBenchmarks(baseline, current)

			expect(comparison.baseline).toBe(baseline)
			expect(comparison.current).toBe(current)
			expect(typeof comparison.improvement).toBe('number')
			expect(typeof comparison.significant).toBe('boolean')
			expect(typeof comparison.regression).toBe('boolean')
		})
	})

	describe('getBenchmarkResult', () => {
		it('should return undefined for unknown benchmark', () => {
			const result = getBenchmarkResult('unknown')
			expect(result).toBeUndefined()
		})

		it('should return stored result', async () => {
			await runBenchmark('known', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			const result = getBenchmarkResult('known')
			expect(result).toBeDefined()
		})
	})

	describe('getAllBenchmarkResults', () => {
		it('should return empty map when no results', () => {
			const results = getAllBenchmarkResults()
			expect(results.size).toBe(0)
		})

		it('should return all results', async () => {
			await runBenchmark('test1', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			await runBenchmark('test2', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			const results = getAllBenchmarkResults()
			expect(results.size).toBe(2)
		})
	})

	describe('clearBenchmarkResults', () => {
		it('should clear all results', async () => {
			await runBenchmark('test', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			clearBenchmarkResults()
			const results = getAllBenchmarkResults()
			expect(results.size).toBe(0)
		})
	})

	describe('exportBenchmarkResults', () => {
		it('should export as JSON', async () => {
			await runBenchmark('test', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			const exported = exportBenchmarkResults('json')
			const parsed = JSON.parse(exported)
			expect(Array.isArray(parsed)).toBe(true)
			expect(parsed.length).toBe(1)
		})

		it('should export as CSV', async () => {
			await runBenchmark('test', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			const exported = exportBenchmarkResults('csv')
			expect(exported).toContain('name,iterations,samples')
			expect(exported).toContain('test')
		})
	})

	describe('generateBenchmarkReport', () => {
		it('should return message when no results', () => {
			const report = generateBenchmarkReport()
			expect(report).toContain('No benchmark results')
		})

		it('should generate report with results', async () => {
			await runBenchmark('test', () => {}, { iterations: 10, warmupIterations: 5, samples: 3 })
			const report = generateBenchmarkReport()
			expect(report).toContain('Benchmark Report')
			expect(report).toContain('test')
			expect(report).toContain('Mean')
		})
	})

	describe('takePerformanceSnapshot', () => {
		it('should take snapshot', () => {
			const snapshot = takePerformanceSnapshot()
			expect(snapshot.timestamp).toBeDefined()
			expect(snapshot.entries).toBeDefined()
			expect(snapshot.timing).toBeDefined()
		})
	})

	describe('compareSnapshots', () => {
		it('should compare snapshots', () => {
			const before = takePerformanceSnapshot()
			const after = takePerformanceSnapshot()
			const diff = compareSnapshots(before, after)
			expect(diff.timeDiff).toBeDefined()
		})
	})
})

describe('DEFAULT_BENCHMARK_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_BENCHMARK_CONFIG.iterations).toBe(1000)
		expect(DEFAULT_BENCHMARK_CONFIG.warmupIterations).toBe(100)
		expect(DEFAULT_BENCHMARK_CONFIG.samples).toBe(10)
		expect(DEFAULT_BENCHMARK_CONFIG.timeout).toBe(30000)
		expect(DEFAULT_BENCHMARK_CONFIG.gc).toBe(false)
	})
})
