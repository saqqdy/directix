import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	checkDependency,
	clearEdgeCaseWarnings,
	configureEdgeCase,
	createDebouncedResizeHandler,
	createSafeDirectiveWrapper,
	DEFAULT_EDGE_CASE_CONFIG,
	detectResizeLoop,
	detectScrollJank,
	getEdgeCaseConfig,
	getEdgeCaseWarnings,
	getMemoryStats,
	getObserverCount,
	handleSSRUnsupported,
	handleTouchConflict,
	isInViewport,
	isSSR as isSSREnvironment,
	safeQueryElement,
	trackObserver,
	untrackObserver,
	validateBinding,
	withErrorRecovery,
} from '../../packages/core/src/edge-case'

describe('Edge Case Handler', () => {
	beforeEach(() => {
		clearEdgeCaseWarnings()
		configureEdgeCase(DEFAULT_EDGE_CASE_CONFIG)
	})

	afterEach(() => {
		clearEdgeCaseWarnings()
	})

	describe('configureEdgeCase', () => {
		it('should configure edge case handling', () => {
			configureEdgeCase({ ssr: { enabled: false } })
			const config = getEdgeCaseConfig()
			expect(config.ssr.enabled).toBe(false)
		})
	})

	describe('isSSREnvironment', () => {
		it('should return false in jsdom environment', () => {
			expect(isSSREnvironment()).toBe(false)
		})
	})

	describe('handleSSRUnsupported', () => {
		it('should handle skip behavior', () => {
			configureEdgeCase({ ssr: { enabled: true, warnOnUnsupported: false, fallbackBehavior: 'skip' } })
			const result = handleSSRUnsupported('test-operation')
			expect(result.success).toBe(true)
			expect(result.recovered).toBe(true)
		})
	})

	describe('safeQueryElement', () => {
		it('should find existing element', async () => {
			const div = document.createElement('div')
			div.id = 'test-element'
			document.body.appendChild(div)

			const element = await safeQueryElement('#test-element')
			expect(element).toBeDefined()

			document.body.removeChild(div)
		})

		it('should return null for non-existing element', async () => {
			const element = await safeQueryElement('#non-existing', { retryCount: 0 })
			expect(element).toBeNull()
		})
	})

	describe('trackObserver', () => {
		it('should track observer count', () => {
			expect(getObserverCount()).toBe(0)
			trackObserver()
			expect(getObserverCount()).toBe(1)
			untrackObserver()
			expect(getObserverCount()).toBe(0)
		})

		it('should return false when limit exceeded', () => {
			configureEdgeCase({ memory: { maxObservers: 2, cleanupInterval: 0, warnThreshold: 1 } })
			clearEdgeCaseWarnings()

			expect(trackObserver()).toBe(true)
			expect(trackObserver()).toBe(true)
			expect(trackObserver()).toBe(false)

			untrackObserver()
			untrackObserver()
			untrackObserver()
		})
	})

	describe('getMemoryStats', () => {
		it('should return memory statistics', () => {
			configureEdgeCase({ memory: { maxObservers: 100, cleanupInterval: 0, warnThreshold: 80 } })
			const stats = getMemoryStats()
			expect(stats.maxObservers).toBe(100)
			expect(stats.usedPercentage).toBeGreaterThanOrEqual(0)
		})
	})

	describe('withErrorRecovery', () => {
		it('should return success for successful operation', async () => {
			const result = await withErrorRecovery(() => 'success')
			expect(result.success).toBe(true)
			expect(result.value).toBe('success')
		})

		it('should retry on failure', async () => {
			let attempts = 0
			const result = await withErrorRecovery(
				() => {
					attempts++
					if (attempts < 2) throw new Error('fail')
					return 'success'
				},
				{ maxRetries: 3, retryDelay: 10 },
			)
			expect(result.success).toBe(true)
			expect(result.retryCount).toBe(1)
		})

		it('should return fallback value after max retries', async () => {
			const result = await withErrorRecovery(
				() => {
					throw new Error('always fails')
				},
				{ maxRetries: 2, retryDelay: 10, fallbackValue: 'fallback' },
			)
			expect(result.success).toBe(true)
			expect(result.value).toBe('fallback')
		})

		it('should return failure when no fallback', async () => {
			configureEdgeCase({ errorRecovery: { enabled: true, maxRetries: 1, retryDelay: 10 } })
			const result = await withErrorRecovery(
				() => {
					throw new Error('always fails')
				},
				{ maxRetries: 1, retryDelay: 10 },
			)
			expect(result.success).toBe(false)
			expect(result.error).toBeDefined()
		})
	})

	describe('validateBinding', () => {
		it('should pass valid binding', () => {
			const result = validateBinding('test', { type: 'string' })
			expect(result.success).toBe(true)
		})

		it('should fail invalid type', () => {
			const result = validateBinding(123, { type: 'string' })
			expect(result.success).toBe(false)
		})

		it('should fail missing required value', () => {
			const result = validateBinding(undefined, { required: true })
			expect(result.success).toBe(false)
		})

		it('should pass custom validator', () => {
			const result = validateBinding(10, { validator: v => v > 5 })
			expect(result.success).toBe(true)
		})

		it('should fail custom validator', () => {
			const result = validateBinding(3, { validator: v => v > 5 })
			expect(result.success).toBe(false)
		})

		it('should accept multiple types', () => {
			const result = validateBinding(123, { type: ['string', 'number'] })
			expect(result.success).toBe(true)
		})
	})

	describe('detectResizeLoop', () => {
		it('should detect resize loop', () => {
			// Simulate rapid resizes
			for (let i = 0; i < 5; i++) {
				detectResizeLoop([], 3)
			}
			const warnings = getEdgeCaseWarnings({ type: 'resize-loop' })
			expect(warnings.length).toBeGreaterThan(0)
		})
	})

	describe('detectScrollJank', () => {
		it('should detect scroll jank', () => {
			const result = detectScrollJank(100, 50)
			expect(result).toBe(true)
		})

		it('should not detect normal scroll', () => {
			clearEdgeCaseWarnings()
			const result = detectScrollJank(30, 50)
			expect(result).toBe(false)
		})
	})

	describe('handleTouchConflict', () => {
		it('should handle touch without preventDefault', () => {
			configureEdgeCase({ mobile: { preventDefaultOnTouch: false, touchDelay: 300, debounceResize: 150 } })
			const div = document.createElement('div')
			const event = new TouchEvent('touchstart')
			const result = handleTouchConflict(div, event)
			expect(result).toBe(false)
		})
	})

	describe('createDebouncedResizeHandler', () => {
		it('should create debounced handler', () => {
			const handler = vi.fn()
			const debounced = createDebouncedResizeHandler(handler, 50)
			debounced()
			debounced()
			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('createSafeDirectiveWrapper', () => {
		it('should create safe wrapper', async () => {
			const wrapper = createSafeDirectiveWrapper('test', () => 'result')
			const el = document.createElement('div')
			const result = await wrapper(el, { value: 'test' }, {})
			expect(result).toBe('result')
		})

		it('should handle errors', async () => {
			const wrapper = createSafeDirectiveWrapper(
				'test',
				() => {
					throw new Error('fail')
				},
			)
			const el = document.createElement('div')
			const result = await wrapper(el, { value: 'test' }, {})
			expect(result).toBeUndefined()
		})
	})

	describe('checkDependency', () => {
		it('should check existing dependency', () => {
			const result = checkDependency('ResizeObserver')
			expect(result).toBe(true)
		})
	})

	describe('isInViewport', () => {
		it('should check if element is in viewport', () => {
			const div = document.createElement('div')
			document.body.appendChild(div)
			const result = isInViewport(div)
			expect(typeof result).toBe('boolean')
			document.body.removeChild(div)
		})
	})

	describe('getEdgeCaseWarnings', () => {
		it('should return warnings', () => {
			trackObserver()
			trackObserver()
			configureEdgeCase({ memory: { maxObservers: 1, cleanupInterval: 0, warnThreshold: 0 } })
			trackObserver() // Should trigger warning
			const warnings = getEdgeCaseWarnings()
			expect(warnings.length).toBeGreaterThan(0)
		})
	})

	describe('clearEdgeCaseWarnings', () => {
		it('should clear warnings', () => {
			clearEdgeCaseWarnings()
			const warnings = getEdgeCaseWarnings()
			expect(warnings.length).toBe(0)
		})
	})
})

describe('DEFAULT_EDGE_CASE_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_EDGE_CASE_CONFIG.ssr.enabled).toBe(true)
		expect(DEFAULT_EDGE_CASE_CONFIG.domReady.waitForReady).toBe(true)
		expect(DEFAULT_EDGE_CASE_CONFIG.memory.maxObservers).toBe(100)
		expect(DEFAULT_EDGE_CASE_CONFIG.errorRecovery.enabled).toBe(true)
		expect(DEFAULT_EDGE_CASE_CONFIG.mobile.touchDelay).toBe(300)
	})
})
