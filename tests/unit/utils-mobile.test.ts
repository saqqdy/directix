import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	triggerHaptic,
	applyVisualFeedback,
	addPassiveListener,
	addNonPassiveListener,
	isTouchDevice,
	isMobileDevice,
	getDevicePixelRatio,
	ObjectPool,
	PASSIVE_OPTIONS,
	NON_PASSIVE_OPTIONS,
} from '../../src/utils/mobile'

describe('Mobile Utilities', () => {
	let container: HTMLElement

	beforeEach(() => {
		container = document.createElement('div')
		document.body.appendChild(container)
	})

	afterEach(() => {
		document.body.removeChild(container)
	})

	describe('PASSIVE_OPTIONS', () => {
		it('should have passive: true', () => {
			expect(PASSIVE_OPTIONS.passive).toBe(true)
		})
	})

	describe('NON_PASSIVE_OPTIONS', () => {
		it('should have passive: false', () => {
			expect(NON_PASSIVE_OPTIONS.passive).toBe(false)
		})
	})

	describe('triggerHaptic', () => {
		it('should be a function', () => {
			expect(typeof triggerHaptic).toBe('function')
		})

		it('should accept haptic types', () => {
			// In non-browser environment, it returns early
			triggerHaptic('light')
			triggerHaptic('medium')
			triggerHaptic('heavy')
			triggerHaptic('selection')
		})
	})

	describe('applyVisualFeedback', () => {
		it('should add visual class to element', () => {
			const cleanup = applyVisualFeedback(container, { visualClass: 'feedback-active' })
			expect(container.classList.contains('feedback-active')).toBe(true)
			cleanup()
		})

		it('should remove visual class after duration', async () => {
			const cleanup = applyVisualFeedback(container, { visualClass: 'feedback-active', visualDuration: 50 })
			expect(container.classList.contains('feedback-active')).toBe(true)
			await new Promise(resolve => setTimeout(resolve, 60))
			expect(container.classList.contains('feedback-active')).toBe(false)
			cleanup()
		})

		it('should use default class when not specified', () => {
			const cleanup = applyVisualFeedback(container)
			expect(container.classList.contains('directix-touch-active')).toBe(true)
			cleanup()
		})

		it('should return cleanup function', () => {
			const cleanup = applyVisualFeedback(container, { visualClass: 'feedback' })
			expect(typeof cleanup).toBe('function')
			cleanup()
		})
	})

	describe('addPassiveListener', () => {
		it('should add event listener with passive options', () => {
			const handler = vi.fn()
			addPassiveListener(container, 'touchstart', handler)
			container.dispatchEvent(new Event('touchstart'))
			expect(handler).toHaveBeenCalled()
		})
	})

	describe('addNonPassiveListener', () => {
		it('should add event listener without passive options', () => {
			const handler = vi.fn()
			addNonPassiveListener(container, 'touchmove', handler)
			container.dispatchEvent(new Event('touchmove'))
			expect(handler).toHaveBeenCalled()
		})
	})

	describe('isTouchDevice', () => {
		it('should return a boolean', () => {
			const result = isTouchDevice()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('isMobileDevice', () => {
		it('should return a boolean', () => {
			const result = isMobileDevice()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('getDevicePixelRatio', () => {
		it('should return device pixel ratio', () => {
			const result = getDevicePixelRatio()
			expect(typeof result).toBe('number')
			expect(result).toBeGreaterThan(0)
		})
	})

	describe('ObjectPool', () => {
		it('should create objects using factory', () => {
			const factory = () => ({ value: 0 })
			const reset = (item: { value: number }) => { item.value = 0 }
			const pool = new ObjectPool(factory, reset)
			const obj = pool.acquire()
			expect(obj).toBeDefined()
			expect(obj.value).toBe(0)
		})

		it('should reuse objects after release', () => {
			const factory = () => ({ value: 0 })
			const reset = (item: { value: number }) => { item.value = 0 }
			const pool = new ObjectPool(factory, reset)
			const obj1 = pool.acquire()
			obj1.value = 10
			pool.release(obj1)
			const obj2 = pool.acquire()
			expect(obj2).toBe(obj1)
			expect(obj2.value).toBe(0) // Reset was called
		})

		it('should track pool size', () => {
			const factory = () => ({ value: 0 })
			const reset = (item: { value: number }) => { item.value = 0 }
			const pool = new ObjectPool(factory, reset, 5)
			expect(pool.size).toBe(0)
			const obj1 = pool.acquire()
			const obj2 = pool.acquire()
			pool.release(obj1)
			pool.release(obj2)
			expect(pool.size).toBe(2)
		})

		it('should respect maxSize', () => {
			const factory = () => ({ value: 0 })
			const reset = (item: { value: number }) => { item.value = 0 }
			const pool = new ObjectPool(factory, reset, 2)
			const obj1 = pool.acquire()
			const obj2 = pool.acquire()
			const obj3 = pool.acquire()
			pool.release(obj1)
			pool.release(obj2)
			pool.release(obj3) // Should not be added
			expect(pool.size).toBeLessThanOrEqual(2)
		})

		it('should clear all pooled objects', () => {
			const factory = () => ({ value: 0 })
			const reset = (item: { value: number }) => { item.value = 0 }
			const pool = new ObjectPool(factory, reset)
			const obj1 = pool.acquire()
			pool.release(obj1)
			pool.clear()
			expect(pool.size).toBe(0)
		})
	})
})