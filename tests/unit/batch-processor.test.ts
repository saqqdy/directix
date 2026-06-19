/**
 * Tests for BatchProcessor and DOMBatchUpdater (v2.2.0)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	BatchProcessor,
	DOMBatchUpdater,
	getDOMBatchUpdater,
	domRead,
	domWrite,
	DEFAULT_BATCH_PROCESSOR_CONFIG,
} from '@directix/core'

describe('BatchProcessor', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('constructor', () => {
		it('should use default config', () => {
			const processor = new BatchProcessor((tasks) => [])
			const stats = processor.getStats()
			expect(stats.queueSize).toBe(0)
		})

		it('should accept custom config', () => {
			const processor = new BatchProcessor(
				(tasks) => [],
				{ maxBatchSize: 10, flushInterval: 32, useRAF: false },
			)
			const stats = processor.getStats()
			expect(stats.queueSize).toBe(0)
		})
	})

	describe('add', () => {
		it('should add tasks to the queue', () => {
			const processor = new BatchProcessor((tasks) => [], { useRAF: false })
			const id = processor.add({ value: 1 }, 'test')
			expect(id).toBeTruthy()
			expect(processor.getStats().queueSize).toBe(1)
		})

		it('should add multiple tasks', () => {
			const processor = new BatchProcessor((tasks) => [], { useRAF: false })
			const ids = processor.addMany([
				{ data: { value: 1 } },
				{ data: { value: 2 } },
			])
			expect(ids).toHaveLength(2)
			expect(processor.getStats().queueSize).toBe(2)
		})
	})

	describe('cancel', () => {
		it('should cancel a task by ID', () => {
			const processor = new BatchProcessor((tasks) => [], { useRAF: false })
			const id = processor.add({ value: 1 })
			const result = processor.cancel(id)
			expect(result).toBe(true)
			expect(processor.getStats().queueSize).toBe(0)
		})

		it('should return false for non-existent task', () => {
			const processor = new BatchProcessor((tasks) => [], { useRAF: false })
			const result = processor.cancel('non-existent')
			expect(result).toBe(false)
		})

		it('should cancel tasks by type', () => {
			const processor = new BatchProcessor((tasks) => [], { useRAF: false })
			processor.add({ value: 1 }, 'type-a')
			processor.add({ value: 2 }, 'type-b')
			processor.add({ value: 3 }, 'type-a')

			const count = processor.cancelByType('type-a')
			expect(count).toBe(2)
			expect(processor.getStats().queueSize).toBe(1)
		})
	})

	describe('flush', () => {
		it('should process all pending tasks', () => {
			const results: any[] = []
			const processor = new BatchProcessor(
				(tasks) => tasks.map(t => ({ id: t.id, success: true, duration: 0 })),
				{ useRAF: false },
			)

			processor.add({ value: 1 })
			processor.add({ value: 2 })

			const batchResults = processor.flush()
			expect(batchResults).toHaveLength(2)
			expect(batchResults[0].success).toBe(true)
			expect(processor.getStats().totalProcessed).toBe(2)
		})

		it('should sort tasks by priority', () => {
			const processed: number[] = []
			const processor = new BatchProcessor(
				(tasks) => {
					for (const t of tasks) processed.push(t.priority)
					return tasks.map(t => ({ id: t.id, success: true, duration: 0 }))
				},
				{ useRAF: false },
			)

			processor.add({ value: 3 }, 'default', 300)
			processor.add({ value: 1 }, 'default', 100)
			processor.add({ value: 2 }, 'default', 200)

			processor.flush()
			expect(processed).toEqual([100, 200, 300])
		})
	})

	describe('clear', () => {
		it('should clear all pending tasks', () => {
			const processor = new BatchProcessor((tasks) => [], { useRAF: false })
			processor.add({ value: 1 })
			processor.add({ value: 2 })
			processor.clear()
			expect(processor.getStats().queueSize).toBe(0)
		})
	})

	describe('getStats', () => {
		it('should return accurate statistics', () => {
			const processor = new BatchProcessor(
				(tasks) => tasks.map(t => ({ id: t.id, success: true, duration: 0 })),
				{ useRAF: false },
			)

			processor.add({ value: 1 })
			processor.flush()

			const stats = processor.getStats()
			expect(stats.totalProcessed).toBe(1)
			expect(stats.totalSuccesses).toBe(1)
			expect(stats.totalFailures).toBe(0)
		})
	})
})

describe('DOMBatchUpdater', () => {
	it('should schedule reads and writes', () => {
		const updater = new DOMBatchUpdater()
		const pending = updater.getPendingCount()
		expect(pending.reads).toBe(0)
		expect(pending.writes).toBe(0)
	})

	it('should return global instance', () => {
		const instance = getDOMBatchUpdater()
		expect(instance).toBeInstanceOf(DOMBatchUpdater)
	})

	it('should provide domRead and domWrite helpers', () => {
		// These are convenience wrappers, just verify they don't throw
		expect(() => domRead(() => {})).not.toThrow()
		expect(() => domWrite(() => {})).not.toThrow()
	})
})
