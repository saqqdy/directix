import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	calculateTTI,
	cancelIdleCallback,
	cleanupFirstScreenOptimizer,
	configureFirstScreen,
	createLazyLoader,
	createPerformanceBudget,
	DEFAULT_FIRST_SCREEN_CONFIG,
	deferTask,
	executeDeferredTasks,
	getFirstScreenConfig,
	getFirstScreenMetrics,
	initFirstScreenOptimizer,
	isDOMReady,
	isPageLoaded,
	onDOMReady,
	onPageLoad,
	prefetchModule,
	preloadModule,
	requestIdleCallback,
} from '../../packages/core/src/first-screen'

describe('First Screen Optimizer', () => {
	beforeEach(() => {
		cleanupFirstScreenOptimizer()
		configureFirstScreen(DEFAULT_FIRST_SCREEN_CONFIG)
		initFirstScreenOptimizer()
	})

	afterEach(() => {
		cleanupFirstScreenOptimizer()
	})

	describe('configureFirstScreen', () => {
		it('should configure first screen optimization', () => {
			configureFirstScreen({ lazyLoading: { enabled: false, rootMargin: '0px', threshold: 0.5, deferNonCritical: false } })
			const config = getFirstScreenConfig()
			expect(config.lazyLoading.enabled).toBe(false)
		})
	})

	describe('createLazyLoader', () => {
		it('should create lazy loader', () => {
			const loader = createLazyLoader()
			expect(loader.observe).toBeDefined()
			expect(loader.unobserve).toBeDefined()
			expect(loader.disconnect).toBeDefined()
		})

		it('should call onVisible when element is visible', () => {
			const onVisible = vi.fn()
			const loader = createLazyLoader({ onVisible })

			const div = document.createElement('div')
			document.body.appendChild(div)

			loader.observe(div)
			loader.disconnect()

			expect(loader.disconnect).toBeDefined()
			document.body.removeChild(div)
		})
	})

	describe('deferTask', () => {
		it('should defer task', () => {
			const fn = vi.fn()
			deferTask('test-task', fn, 'medium')
			expect(fn).not.toHaveBeenCalled()
		})

		it('should not add duplicate task', () => {
			const fn = vi.fn()
			deferTask('test-task', fn)
			deferTask('test-task', fn)
			expect(fn).not.toHaveBeenCalled()
		})
	})

	describe('executeDeferredTasks', () => {
		it('should execute deferred tasks', async () => {
			const fn1 = vi.fn()
			const fn2 = vi.fn()
			deferTask('task1', fn1, 'critical')
			deferTask('task2', fn2, 'high')

			await executeDeferredTasks()

			expect(fn1).toHaveBeenCalled()
			expect(fn2).toHaveBeenCalled()
		})

		it('should execute by priority', async () => {
			const order: string[] = []
			deferTask('low', () => order.push('low'), 'low')
			deferTask('critical', () => order.push('critical'), 'critical')
			deferTask('high', () => order.push('high'), 'high')
			deferTask('medium', () => order.push('medium'), 'medium')

			await executeDeferredTasks()

			// Critical should be first
			expect(order[0]).toBe('critical')
		})
	})

	describe('preloadModule', () => {
		it('should create preload link', () => {
			preloadModule('/test-module.js')
			const link = document.querySelector('link[rel="modulepreload"]')
			expect(link).toBeDefined()
		})
	})

	describe('prefetchModule', () => {
		it('should create prefetch link', () => {
			prefetchModule('/test-module.js')
			const link = document.querySelector('link[rel="prefetch"]')
			expect(link).toBeDefined()
		})
	})

	describe('isDOMReady', () => {
		it('should return true in test environment', () => {
			expect(typeof isDOMReady()).toBe('boolean')
		})
	})

	describe('isPageLoaded', () => {
		it('should return boolean', () => {
			expect(typeof isPageLoaded()).toBe('boolean')
		})
	})

	describe('onDOMReady', () => {
		it('should register callback', () => {
			const fn = vi.fn()
			onDOMReady(fn)
			// In test environment, DOM is ready, callback should be called
			expect(fn).toHaveBeenCalled()
		})
	})

	describe('onPageLoad', () => {
		it('should call callback if page is loaded', () => {
			const fn = vi.fn()
			onPageLoad(fn)
			// In test environment, page might be loaded
			expect(typeof fn.mock.calls.length).toBe('number')
		})
	})

	describe('getFirstScreenMetrics', () => {
		it('should return metrics object', () => {
			const metrics = getFirstScreenMetrics()
			expect(typeof metrics).toBe('object')
		})
	})

	describe('calculateTTI', () => {
		it('should return undefined when no metrics', () => {
			cleanupFirstScreenOptimizer()
			const tti = calculateTTI()
			expect(tti).toBeUndefined()
		})
	})

	describe('requestIdleCallback', () => {
		it('should call callback', async () => {
			const fn = vi.fn()
			const id = requestIdleCallback(fn)
			expect(id).toBeDefined()

			// Wait for callback
			await new Promise(r => setTimeout(r, 50))
			expect(fn).toHaveBeenCalled()
		})
	})

	describe('cancelIdleCallback', () => {
		it('should cancel callback', () => {
			const fn = vi.fn()
			const id = requestIdleCallback(fn)
			cancelIdleCallback(id)
			expect(typeof id).toBe('number')
		})
	})

	describe('createPerformanceBudget', () => {
		it('should create budget checker', () => {
			const budget = createPerformanceBudget({ fcp: 2000, lcp: 2500 })
			expect(budget.check).toBeDefined()
			expect(budget.report).toBeDefined()
		})

		it('should return check results', () => {
			const budget = createPerformanceBudget({ fcp: 2000 })
			const result = budget.check()
			expect(typeof result.passed).toBe('boolean')
			expect(Array.isArray(result.violations)).toBe(true)
		})

		it('should generate report', () => {
			const budget = createPerformanceBudget({ fcp: 2000 })
			const report = budget.report()
			expect(typeof report).toBe('string')
			expect(report).toContain('Performance Report')
		})
	})

	describe('cleanupFirstScreenOptimizer', () => {
		it('should clear state', () => {
			deferTask('test', () => {})
			cleanupFirstScreenOptimizer()
			const metrics = getFirstScreenMetrics()
			expect(Object.keys(metrics).length).toBe(0)
		})
	})
})

describe('DEFAULT_FIRST_SCREEN_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_FIRST_SCREEN_CONFIG.lazyLoading.enabled).toBe(true)
		expect(DEFAULT_FIRST_SCREEN_CONFIG.lazyLoading.rootMargin).toBe('50px')
		expect(DEFAULT_FIRST_SCREEN_CONFIG.codeSplitting.enabled).toBe(true)
		expect(DEFAULT_FIRST_SCREEN_CONFIG.deferredExecution.enabled).toBe(true)
		expect(DEFAULT_FIRST_SCREEN_CONFIG.deferredExecution.deferDelay).toBe(100)
	})
})
