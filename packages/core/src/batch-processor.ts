/**
 * Batch Processor and DOM Batch Updater for Directix
 * Provides utilities for batching operations to reduce layout thrashing
 * and improve runtime performance.
 *
 * @since 2.2.0
 */

// ============================================================================
// Types
// ============================================================================

export interface BatchProcessorConfig {
	/** Maximum batch size before forced flush */
	maxBatchSize: number
	/** Maximum time (ms) to wait before auto-flush */
	flushInterval: number
	/** Whether to use requestAnimationFrame for scheduling */
	useRAF: boolean
}

export interface BatchTask<T = any> {
	/** Unique ID */
	id: string
	/** Task type for grouping */
	type: string
	/** Task payload */
	data: T
	/** Priority (lower = earlier) */
	priority: number
	/** Creation timestamp */
	createdAt: number
}

export interface BatchResult<T = any> {
	/** Task ID */
	id: string
	/** Whether the task succeeded */
	success: boolean
	/** Result data */
	data?: T
	/** Error if failed */
	error?: Error
	/** Processing duration in ms */
	duration: number
}

export interface BatchProcessorStats {
	/** Total tasks processed */
	totalProcessed: number
	/** Total successes */
	totalSuccesses: number
	/** Total failures */
	totalFailures: number
	/** Current queue size */
	queueSize: number
	/** Average processing time in ms */
	avgProcessingTime: number
	/** Last flush timestamp */
	lastFlushAt: number | null
}

export interface DOMUpdateTask {
	/** Target element */
	element: Element
	/** Update type */
	type: 'attribute' | 'style' | 'class' | 'text' | 'property'
	/** Property/key name */
	key: string
	/** Value to set */
	value: string | number | boolean | null
	/** Whether to merge with existing value (for class/style) */
	merge?: boolean
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_BATCH_PROCESSOR_CONFIG: BatchProcessorConfig = {
	maxBatchSize: 50,
	flushInterval: 16, // ~1 frame at 60fps
	useRAF: true,
}

// ============================================================================
// Generic Batch Processor
// ============================================================================

let _taskCounter = 0

/**
 * Generic batch processor for grouping operations
 */
export class BatchProcessor<T = any, R = any> {
	private queue: BatchTask<T>[] = []
	private results: BatchResult<R>[] = []
	private config: BatchProcessorConfig
	private processorFn: (tasks: BatchTask<T>[]) => BatchResult<R>[]
	private flushTimer: ReturnType<typeof setTimeout> | null = null
	private rafId: number | null = null
	private processing = false
	private stats: BatchProcessorStats = {
		totalProcessed: 0,
		totalSuccesses: 0,
		totalFailures: 0,
		queueSize: 0,
		avgProcessingTime: 0,
		lastFlushAt: null,
	}

	constructor(
		processorFn: (tasks: BatchTask<T>[]) => BatchResult<R>[],
		config: Partial<BatchProcessorConfig> = {},
	) {
		this.processorFn = processorFn
		this.config = { ...DEFAULT_BATCH_PROCESSOR_CONFIG, ...config }
	}

	/**
	 * Add a task to the batch queue
	 */
	add(data: T, type: string = 'default', priority: number = 100): string {
		const task: BatchTask<T> = {
			id: `bt-${++_taskCounter}`,
			type,
			data,
			priority,
			createdAt: Date.now(),
		}

		this.queue.push(task)
		this.stats.queueSize = this.queue.length

		// Auto-schedule flush
		this.scheduleFlush()

		return task.id
	}

	/**
	 * Add multiple tasks at once
	 */
	addMany(tasks: Array<{ data: T, type?: string, priority?: number }>): string[] {
		const ids: string[] = []

		for (const task of tasks) {
			const id = this.add(task.data, task.type, task.priority)
			ids.push(id)
		}

		return ids
	}

	/**
	 * Cancel a task by ID
	 */
	cancel(id: string): boolean {
		const index = this.queue.findIndex(t => t.id === id)
		if (index !== -1) {
			this.queue.splice(index, 1)
			this.stats.queueSize = this.queue.length
			return true
		}
		return false
	}

	/**
	 * Cancel all tasks of a given type
	 */
	cancelByType(type: string): number {
		const before = this.queue.length
		this.queue = this.queue.filter(t => t.type !== type)
		this.stats.queueSize = this.queue.length
		return before - this.queue.length
	}

	/**
	 * Force flush all pending tasks
	 */
	flush(): BatchResult<R>[] {
		this.cancelScheduledFlush()

		if (this.queue.length === 0) return []

		this.processing = true
		const startTime = performance.now()

		// Sort by priority
		this.queue.sort((a, b) => a.priority - b.priority)

		// Take batch
		const batch = this.queue.splice(0, this.config.maxBatchSize)

		try {
			const batchResults = this.processorFn(batch)
			this.results.push(...batchResults)

			// Update stats
			const duration = performance.now() - startTime
			for (const result of batchResults) {
				this.stats.totalProcessed++
				if (result.success) {
					this.stats.totalSuccesses++
				} else {
					this.stats.totalFailures++
				}
			}
			this.stats.avgProcessingTime = this.stats.totalProcessed > 0 ? (this.stats.avgProcessingTime * (this.stats.totalProcessed - batchResults.length) + duration) / this.stats.totalProcessed : 0
			this.stats.lastFlushAt = Date.now()
			this.stats.queueSize = this.queue.length

			this.processing = false

			// If more tasks, schedule next flush
			if (this.queue.length > 0) {
				this.scheduleFlush()
			}

			return batchResults
		} catch (error) {
			this.processing = false
			throw error
		}
	}

	/**
	 * Get processor statistics
	 */
	getStats(): BatchProcessorStats {
		return { ...this.stats, queueSize: this.queue.length }
	}

	/**
	 * Get recent results
	 */
	getResults(limit: number = 50): BatchResult<R>[] {
		return this.results.slice(-limit)
	}

	/**
	 * Clear all pending tasks and results
	 */
	clear(): void {
		this.cancelScheduledFlush()
		this.queue.length = 0
		this.results.length = 0
		this.stats.queueSize = 0
	}

	/**
	 * Destroy the processor
	 */
	destroy(): void {
		this.clear()
		this.stats = {
			totalProcessed: 0,
			totalSuccesses: 0,
			totalFailures: 0,
			queueSize: 0,
			avgProcessingTime: 0,
			lastFlushAt: null,
		}
	}

	// -- Internal --

	private scheduleFlush(): void {
		if (this.processing) return

		// Immediate flush if batch is full
		if (this.queue.length >= this.config.maxBatchSize) {
			this.flush()
			return
		}

		if (this.config.useRAF) {
			if (this.rafId === null) {
				this.rafId = requestAnimationFrame(() => {
					this.rafId = null
					this.flush()
				})
			}
		} else if (this.flushTimer === null) {
			this.flushTimer = setTimeout(() => {
				this.flushTimer = null
				this.flush()
			}, this.config.flushInterval)
		}
	}

	private cancelScheduledFlush(): void {
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId)
			this.rafId = null
		}
		if (this.flushTimer !== null) {
			clearTimeout(this.flushTimer)
			this.flushTimer = null
		}
	}
}

// ============================================================================
// DOM Batch Updater
// ============================================================================

/**
 * Batch DOM updates to avoid layout thrashing.
 * Separates reads and writes to minimize forced synchronous layouts.
 */
export class DOMBatchUpdater {
	private reads: Array<() => void> = []
	private writes: Array<() => void> = []
	private scheduled = false

	/**
	 * Schedule a DOM read operation
	 */
	read(fn: () => void): void {
		this.reads.push(fn)
		this.scheduleFlush()
	}

	/**
	 * Schedule a DOM write operation
	 */
	write(fn: () => void): void {
		this.writes.push(fn)
		this.scheduleFlush()
	}

	/**
	 * Apply a DOM update task directly
	 */
	applyUpdate(task: DOMUpdateTask): void {
		const el = task.element as HTMLElement
		if (!el) return

		this.write(() => {
			switch (task.type) {
				case 'attribute':
					if (task.value === null) {
						el.removeAttribute(task.key)
					} else {
						el.setAttribute(task.key, String(task.value))
					}
					break

				case 'style':
					if (task.value === null) {
						el.style.removeProperty(task.key)
					} else {
						if (task.merge && typeof task.value === 'string') {
							el.style.cssText += `;${task.key}:${task.value}`
						} else {
							el.style.setProperty(task.key, String(task.value))
						}
					}
					break

				case 'class':
					if (task.value === true || task.value === '') {
						el.classList.add(task.key)
					} else if (task.value === false) {
						el.classList.remove(task.key)
					} else if (typeof task.value === 'string') {
						if (task.merge) {
							el.classList.add(...task.value.split(/\s+/).filter(Boolean))
						} else {
							el.className = task.value
						}
					}
					break

				case 'text':
					el.textContent = String(task.value ?? '')
					break

				case 'property':

					;(el as any)[task.key] = task.value
					break
			}
		})
	}

	/**
	 * Apply multiple DOM update tasks at once
	 */
	applyUpdates(tasks: DOMUpdateTask[]): void {
		for (const task of tasks) {
			this.applyUpdate(task)
		}
	}

	/**
	 * Force flush all pending reads and writes
	 */
	flush(): void {
		this.scheduled = false

		// Process all reads first (to get current layout values)
		const readsToProcess = this.reads.slice()
		this.reads.length = 0

		for (const fn of readsToProcess) {
			try {
				fn()
			} catch (error) {
				console.warn('[Directix] DOMBatchUpdater: Read error:', error)
			}
		}

		// Then process all writes (batched DOM mutations)
		const writesToProcess = this.writes.slice()
		this.writes.length = 0

		for (const fn of writesToProcess) {
			try {
				fn()
			} catch (error) {
				console.warn('[Directix] DOMBatchUpdater: Write error:', error)
			}
		}
	}

	/**
	 * Clear all pending operations
	 */
	clear(): void {
		this.reads.length = 0
		this.writes.length = 0
		this.scheduled = false
	}

	/**
	 * Get pending operation counts
	 */
	getPendingCount(): { reads: number, writes: number } {
		return {
			reads: this.reads.length,
			writes: this.writes.length,
		}
	}

	// -- Internal --

	private scheduleFlush(): void {
		if (this.scheduled) return
		this.scheduled = true
		requestAnimationFrame(() => this.flush())
	}
}

// ============================================================================
// Global instances
// ============================================================================

// eslint-disable-next-line one-var
let _globalDOMBatchUpdater: DOMBatchUpdater | null = null

/**
 * Get the global DOM Batch Updater instance
 */
export function getDOMBatchUpdater(): DOMBatchUpdater {
	if (!_globalDOMBatchUpdater) {
		_globalDOMBatchUpdater = new DOMBatchUpdater()
	}
	return _globalDOMBatchUpdater
}

/**
 * Schedule a DOM read via the global updater
 */
export function domRead(fn: () => void): void {
	getDOMBatchUpdater().read(fn)
}

/**
 * Schedule a DOM write via the global updater
 */
export function domWrite(fn: () => void): void {
	getDOMBatchUpdater().write(fn)
}
