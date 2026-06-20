import {
	DEFAULT_VIRTUAL_LIST_OPTIMIZER_CONFIG,
	VirtualListOptimizer,
} from '@directix/core'
/**
 * Tests for VirtualListOptimizer (v2.2.0)
 */
import { beforeEach, describe, expect, it } from 'vitest'

describe('VirtualListOptimizer', () => {
	let optimizer: VirtualListOptimizer

	beforeEach(() => {
		optimizer = new VirtualListOptimizer()
	})

	describe('constructor', () => {
		it('should use default config', () => {
			const stats = optimizer.getStats()
			expect(stats.cachedHeights).toBe(0)
			expect(stats.recalculations).toBe(0)
		})

		it('should accept custom config', () => {
			const opt = new VirtualListOptimizer({
				bufferSize: 10,
				estimatedItemHeight: 50,
				dynamicHeight: false,
			})
			expect(opt).toBeDefined()
		})
	})

	describe('init', () => {
		it('should initialize with total items and container height', () => {
			optimizer.init(1000, 600)
			// No error means success
			expect(true).toBe(true)
		})
	})

	describe('height caching', () => {
		beforeEach(() => {
			optimizer.init(1000, 600)
		})

		it('should cache item heights', () => {
			optimizer.cacheItemHeight(0, 48)
			optimizer.cacheItemHeight(1, 72)

			expect(optimizer.getItemHeight(0)).toBe(48)
			expect(optimizer.getItemHeight(1)).toBe(72)
		})

		it('should return estimated height for uncached items', () => {
			expect(optimizer.getItemHeight(999)).toBe(DEFAULT_VIRTUAL_LIST_OPTIMIZER_CONFIG.estimatedItemHeight)
		})

		it('should update cached height', () => {
			optimizer.cacheItemHeight(0, 48)
			optimizer.cacheItemHeight(0, 60)
			expect(optimizer.getItemHeight(0)).toBe(60)
		})

		it('should clear height cache', () => {
			optimizer.cacheItemHeight(0, 48)
			optimizer.clearHeightCache()
			expect(optimizer.getStats().cachedHeights).toBe(0)
		})
	})

	describe('calculateVisibleRange', () => {
		beforeEach(() => {
			optimizer.init(1000, 600)
		})

		it('should calculate visible range at top', () => {
			const range = optimizer.calculateVisibleRange(0)
			expect(range.start).toBe(0)
			expect(range.end).toBeGreaterThanOrEqual(0)
			expect(range.total).toBe(1000)
		})

		it('should return startOffset and endOffset', () => {
			const range = optimizer.calculateVisibleRange(0)
			expect(range.startOffset).toBeGreaterThanOrEqual(0)
			expect(typeof range.endOffset).toBe('number')
		})

		it('should recalculate with cached heights', () => {
			// Cache all heights
			for (let i = 0; i < 1000; i++) {
				optimizer.cacheItemHeight(i, 40)
			}
			const range = optimizer.calculateVisibleRange(0)
			expect(range.start).toBe(0)
		})
	})

	describe('handleScroll', () => {
		it('should track scroll info', () => {
			optimizer.init(1000, 600)
			const info = optimizer.handleScroll(100)
			expect(info.scrollTop).toBe(100)
			expect(typeof info.direction).toBe('number')
			expect(typeof info.velocity).toBe('number')
			expect(typeof info.isScrolling).toBe('boolean')
		})

		it('should detect scroll direction', () => {
			optimizer.init(1000, 600)
			optimizer.handleScroll(0)
			const info = optimizer.handleScroll(100)
			expect(info.direction).toBe(1) // scrolling down
		})
	})

	describe('VNode recycling', () => {
		it('should recycle and acquire VNodes', () => {
			const node = { tag: 'div', data: {} }
			optimizer.recycleVNode('item', node)
			const recycled = optimizer.acquireRecycledVNode('item')
			expect(recycled).toBe(node)
		})

		it('should return null for empty pool', () => {
			expect(optimizer.acquireRecycledVNode('non-existent')).toBeNull()
		})

		it('should clear recycle pool', () => {
			optimizer.recycleVNode('item', {})
			optimizer.clearRecyclePool()
			expect(optimizer.acquireRecycledVNode('item')).toBeNull()
		})
	})

	describe('getStats', () => {
		it('should return stats', () => {
			const stats = optimizer.getStats()
			expect(stats).toHaveProperty('cachedHeights')
			expect(stats).toHaveProperty('recyclePoolSize')
			expect(stats).toHaveProperty('recalculations')
			expect(stats).toHaveProperty('scrollEventsProcessed')
			expect(stats).toHaveProperty('avgRecalcTime')
		})
	})

	describe('destroy', () => {
		it('should clean up all caches', () => {
			optimizer.cacheItemHeight(0, 48)
			optimizer.recycleVNode('item', {})
			optimizer.destroy()
			expect(optimizer.getStats().cachedHeights).toBe(0)
			expect(optimizer.getStats().recyclePoolSize).toBe(0)
		})
	})
})
