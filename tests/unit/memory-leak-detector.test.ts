import {
	cleanupResource,
	cleanupResourcesByType,
	clearLeakReports,
	configureMemoryLeakDetector,
	getLeakDetectorStats,
	getLeakReports,
	getSnapshots,
	getTrackedResourcesInfo,
	resetMemoryLeakDetector,
	startLeakDetection,
	stopLeakDetection,
	takeSnapshot,
	trackResource,
	untrackResource,
} from '@directix/core'
/**
 * Tests for MemoryLeakDetector (v2.2.0)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('MemoryLeakDetector', () => {
	beforeEach(() => {
		resetMemoryLeakDetector()
	})

	afterEach(() => {
		resetMemoryLeakDetector()
	})

	describe('configureMemoryLeakDetector', () => {
		it('should use default config', () => {
			const config = getLeakDetectorStats()
			expect(config.isRunning).toBe(false)
		})

		it('should accept custom config', () => {
			configureMemoryLeakDetector({ enabled: true, snapshotInterval: 10000 })
			// Should not throw
			expect(true).toBe(true)
		})
	})

	describe('trackResource', () => {
		it('should track a resource and return an ID', () => {
			const id = trackResource('event-listener', 'scroll handler', vi.fn())
			expect(id).toBeTruthy()
			expect(id).toMatch(/^res-\d+$/)
		})

		it('should track multiple resources', () => {
			const id1 = trackResource('event-listener', 'handler 1', vi.fn())
			const id2 = trackResource('observer', 'intersection', vi.fn())
			expect(id1).not.toBe(id2)

			const stats = getLeakDetectorStats()
			expect(stats.trackedResourceCount).toBe(2)
		})

		it('should track resources with tags', () => {
			trackResource('event-listener', 'scroll', vi.fn(), { tags: ['scroll', 'demo'] })
			const info = getTrackedResourcesInfo()
			expect(info[0].tags).toEqual(['scroll', 'demo'])
		})
	})

	describe('untrackResource', () => {
		it('should untrack a resource', () => {
			const id = trackResource('event-listener', 'scroll handler', vi.fn())
			untrackResource(id)
			expect(getLeakDetectorStats().trackedResourceCount).toBe(0)
		})
	})

	describe('cleanupResource', () => {
		it('should cleanup a resource', () => {
			const cleanup = vi.fn()
			const id = trackResource('event-listener', 'scroll handler', cleanup)
			const result = cleanupResource(id)

			expect(result).toBe(true)
			expect(cleanup).toHaveBeenCalledOnce()
			expect(getLeakDetectorStats().trackedResourceCount).toBe(0)
		})

		it('should return false for non-existent resource', () => {
			expect(cleanupResource('non-existent')).toBe(false)
		})
	})

	describe('cleanupResourcesByType', () => {
		it('should cleanup all resources of a type', () => {
			trackResource('event-listener', 'handler 1', vi.fn())
			trackResource('event-listener', 'handler 2', vi.fn())
			trackResource('observer', 'intersection', vi.fn())

			const count = cleanupResourcesByType('event-listener')
			expect(count).toBe(2)
			expect(getLeakDetectorStats().trackedResourceCount).toBe(1)
		})
	})

	describe('takeSnapshot', () => {
		it('should take a snapshot', () => {
			trackResource('event-listener', 'handler', vi.fn())
			const snapshot = takeSnapshot()

			expect(snapshot.timestamp).toBeGreaterThan(0)
			expect(snapshot.resourceCount).toBe(1)
			expect(snapshot.resourcesByType['event-listener']).toBe(1)
			expect(typeof snapshot.domNodeCount).toBe('number')
		})
	})

	describe('getSnapshots', () => {
		it('should return all snapshots', () => {
			takeSnapshot()
			takeSnapshot()
			const snapshots = getSnapshots()
			expect(snapshots.length).toBe(2)
		})
	})

	describe('getLeakReports', () => {
		it('should return empty reports initially', () => {
			expect(getLeakReports()).toEqual([])
		})
	})

	describe('clearLeakReports', () => {
		it('should clear all reports', () => {
			clearLeakReports()
			expect(getLeakReports()).toEqual([])
		})
	})

	describe('getLeakDetectorStats', () => {
		it('should return accurate stats', () => {
			trackResource('event-listener', 'handler', vi.fn())
			const stats = getLeakDetectorStats()

			expect(stats.isRunning).toBe(false)
			expect(stats.trackedResourceCount).toBe(1)
			expect(stats.leaksDetected).toBe(0)
		})
	})

	describe('getTrackedResourcesInfo', () => {
		it('should return resources without cleanup functions', () => {
			trackResource('event-listener', 'handler', vi.fn(), { tags: ['demo'] })
			const info = getTrackedResourcesInfo()

			expect(info.length).toBe(1)
			expect(info[0].type).toBe('event-listener')
			expect(info[0].description).toBe('handler')
			expect(info[0]).not.toHaveProperty('cleanup')
		})
	})

	describe('startLeakDetection / stopLeakDetection', () => {
		it('should start and stop detection', () => {
			configureMemoryLeakDetector({ enabled: true, autoStart: false })
			startLeakDetection()
			expect(getLeakDetectorStats().isRunning).toBe(true)

			stopLeakDetection()
			expect(getLeakDetectorStats().isRunning).toBe(false)
		})
	})

	describe('resetMemoryLeakDetector', () => {
		it('should reset everything', () => {
			trackResource('event-listener', 'handler', vi.fn())
			takeSnapshot()
			resetMemoryLeakDetector()

			const stats = getLeakDetectorStats()
			expect(stats.trackedResourceCount).toBe(0)
			expect(stats.snapshotCount).toBe(0)
		})
	})
})
