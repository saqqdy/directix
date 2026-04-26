/**
 * Runtime Performance Optimization Module for Directix
 * Provides utilities for optimizing runtime performance
 */

// ============================================================================
// Types
// ============================================================================

export interface PerformanceOptimizationConfig {
	// Event delegation
	eventDelegation: {
		enabled: boolean
		globalListeners: boolean
		batchProcessing: boolean
		batchSize: number
	}

	// Virtualization
	virtualization: {
		enabled: boolean
		scrollThreshold: number
		listItemHeight: number | 'auto'
		bufferSize: number
	}

	// Caching
	caching: {
		computedResults: boolean
		domQueries: boolean
		styleCalculations: boolean
		maxCacheSize: number
	}

	// Lazy initialization
	lazyInit: {
		directives: boolean
		events: boolean
		observers: boolean
		debounceMs: number
	}

	// Memory management
	memory: {
		objectPool: boolean
		weakReferences: boolean
		cleanupOnUnmount: boolean
		periodicCleanup: number | false
	}
}

export interface ObjectPoolOptions {
	initialSize: number
	maxSize: number
	resetFunction?: (obj: any) => void
	createFunction: () => any
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceOptimizationConfig = {
	eventDelegation: {
		enabled: true,
		globalListeners: true,
		batchProcessing: true,
		batchSize: 10,
	},
	virtualization: {
		enabled: true,
		scrollThreshold: 100,
		listItemHeight: 'auto',
		bufferSize: 5,
	},
	caching: {
		computedResults: true,
		domQueries: true,
		styleCalculations: true,
		maxCacheSize: 100,
	},
	lazyInit: {
		directives: true,
		events: true,
		observers: true,
		debounceMs: 100,
	},
	memory: {
		objectPool: true,
		weakReferences: true,
		cleanupOnUnmount: true,
		periodicCleanup: 60000,
	},
}

// ============================================================================
// Object Pool Implementation
// ============================================================================

/**
 * Generic object pool for memory optimization
 */
export class ObjectPool<T> {
	private pool: T[] = []
	private maxSize: number
	private createFunction: () => T
	private resetFunction?: (obj: T) => void
	private createdCount = 0

	constructor(options: ObjectPoolOptions) {
		this.maxSize = options.maxSize
		this.createFunction = options.createFunction
		this.resetFunction = options.resetFunction

		// Pre-populate pool
		for (let i = 0; i < Math.min(options.initialSize, options.maxSize); i++) {
			this.pool.push(this.createFunction())
			this.createdCount++
		}
	}

	/**
	 * Get an object from the pool
	 */
	acquire(): T {
		if (this.pool.length > 0) {
			const obj = this.pool.pop()!
			if (this.resetFunction) {
				this.resetFunction(obj)
			}
			return obj
		}

		// Create new object if pool is empty and under max limit
		if (this.createdCount < this.maxSize) {
			this.createdCount++
			return this.createFunction()
		}

		// Return a new object without incrementing counter if over max
		return this.createFunction()
	}

	/**
	 * Return an object to the pool
	 */
	release(obj: T): void {
		if (this.pool.length < this.maxSize) {
			if (this.resetFunction) {
				this.resetFunction(obj)
			}
			this.pool.push(obj)
		}
	}

	/**
	 * Clear the pool
	 */
	clear(): void {
		this.pool.length = 0
	}

	/**
	 * Get pool statistics
	 */
	getStats(): {
		poolSize: number
		maxSize: number
		createdCount: number
		availableCount: number
	} {
		return {
			poolSize: this.pool.length,
			maxSize: this.maxSize,
			createdCount: this.createdCount,
			availableCount: this.pool.length,
		}
	}
}

// ============================================================================
// Event Batch Processor
// ============================================================================

/**
 * Batch processor for events to reduce DOM operations
 */
export class EventBatchProcessor {
	private queue: Array<{ target: HTMLElement, event: string, handler: EventListener }> = []
	private processing = false
	private batchSize: number
	private scheduled = false

	constructor(batchSize: number = 10) {
		this.batchSize = batchSize
	}

	/**
	 * Add event to batch queue
	 */
	add(target: HTMLElement, event: string, handler: EventListener): void {
		this.queue.push({ target, event, handler })

		if (!this.scheduled) {
			this.scheduled = true
			requestAnimationFrame(() => this.processBatch())
		}
	}

	/**
	 * Process batched events
	 */
	private processBatch(): void {
		this.scheduled = false

		if (this.processing || this.queue.length === 0) return

		this.processing = true

		// Process up to batchSize events
		const batch = this.queue.splice(0, this.batchSize)

		for (const item of batch) {
			item.target.addEventListener(item.event, item.handler, { passive: true })
		}

		this.processing = false

		// Schedule next batch if more items
		if (this.queue.length > 0) {
			this.scheduled = true
			requestAnimationFrame(() => this.processBatch())
		}
	}

	/**
	 * Clear the queue
	 */
	clear(): void {
		this.queue.length = 0
		this.scheduled = false
	}
}

// ============================================================================
// Weak Reference Cache
// ============================================================================

/**
 * Cache using WeakMap for automatic cleanup when references are removed
 */
export class WeakCache<K extends object, V> {
	private cache = new WeakMap<K, V>()
	private strongCache = new Map<K, V>()
	private maxStrongSize: number

	constructor(maxStrongSize: number = 50) {
		this.maxStrongSize = maxStrongSize
	}

	/**
	 * Get cached value
	 */
	get(key: K): V | undefined {
		return this.cache.get(key) ?? this.strongCache.get(key)
	}

	/**
	 * Set cached value
	 */
	set(key: K, value: V): void {
		this.cache.set(key, value)

		// Also store in strong cache for non-object keys or important entries
		if (this.strongCache.size < this.maxStrongSize) {
			this.strongCache.set(key, value)
		}
	}

	/**
	 * Check if key exists
	 */
	has(key: K): boolean {
		return this.cache.has(key) || this.strongCache.has(key)
	}

	/**
	 * Delete cached value
	 */
	delete(key: K): boolean {
		const weakDeleted = this.cache.delete(key)
		const strongDeleted = this.strongCache.delete(key)
		return weakDeleted || strongDeleted
	}

	/**
	 * Clear strong cache (weak cache auto-clears)
	 */
	clearStrong(): void {
		this.strongCache.clear()
	}

	/**
	 * Get cache size
	 */
	size(): number {
		return this.strongCache.size
	}
}

// ============================================================================
// Lazy Initialization Helper
// ============================================================================

/**
 * Lazy initialization helper to defer expensive operations
 */
export class LazyInitializer<T> {
	private value: T | null = null
	private initFunction: () => T
	private initialized = false
	private pendingPromise: Promise<T> | null = null

	constructor(initFunction: () => T | Promise<T>) {
		this.initFunction = initFunction as () => T
	}

	/**
	 * Get value, initializing if needed
	 */
	get(): T {
		if (!this.initialized) {
			this.value = this.initFunction()
			this.initialized = true
		}
		return this.value!
	}

	/**
	 * Get value asynchronously
	 */
	async getAsync(): Promise<T> {
		if (this.initialized) {
			return this.value!
		}

		if (this.pendingPromise) {
			return this.pendingPromise
		}

		this.pendingPromise = Promise.resolve(this.initFunction())
		this.value = await this.pendingPromise
		this.initialized = true
		this.pendingPromise = null

		return this.value!
	}

	/**
	 * Check if initialized
	 */
	isInitialized(): boolean {
		return this.initialized
	}

	/**
	 * Reset and clear value
	 */
	reset(): void {
		this.value = null
		this.initialized = false
		this.pendingPromise = null
	}
}

// ============================================================================
// Computed Result Cache
// ============================================================================

interface CachedComputed<T> {
	dependencies: any[]
	value: T
	timestamp: number
}

/**
 * Cache for computed results with dependency tracking
 */
export class ComputedCache<K, V> {
	private cache = new Map<K, CachedComputed<V>>()
	private maxSize: number
	private computeFunction: (key: K, ...deps: any[]) => V
	private ttl: number

	constructor(
		computeFunction: (key: K, ...deps: any[]) => V,
		maxSize: number = 100,
		ttl: number = 60000,
	) {
		this.computeFunction = computeFunction
		this.maxSize = maxSize
		this.ttl = ttl
	}

	/**
	 * Get or compute cached value
	 */
	get(key: K, dependencies: any[]): V {
		const cached = this.cache.get(key)

		// Check if cache is valid
		if (cached) {
			const depsEqual = this.compareDependencies(cached.dependencies, dependencies)
			const notExpired = Date.now() - cached.timestamp < this.ttl

			if (depsEqual && notExpired) {
				return cached.value
			}
		}

		// Compute new value
		const value = this.computeFunction(key, ...dependencies)

		// Store in cache
		if (this.cache.size >= this.maxSize) {
			// Remove oldest entry
			const oldestKey = this.cache.keys().next().value
			if (oldestKey !== undefined) {
				this.cache.delete(oldestKey)
			}
		}

		this.cache.set(key, {
			value,
			dependencies,
			timestamp: Date.now(),
		})

		return value
	}

	/**
	 * Compare dependencies
	 */
	private compareDependencies(a: any[], b: any[]): boolean {
		if (a.length !== b.length) return false

		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) return false
		}

		return true
	}

	/**
	 * Invalidate specific key
	 */
	invalidate(key: K): void {
		this.cache.delete(key)
	}

	/**
	 * Clear all cache
	 */
	clear(): void {
		this.cache.clear()
	}

	/**
	 * Get cache size
	 */
	size(): number {
		return this.cache.size
	}
}

// ============================================================================
// DOM Query Cache
// ============================================================================

/**
 * Cache for DOM queries to reduce repeated queries
 */
export class DOMQueryCache {
	private queryCache = new WeakCache<Element, Map<string, Element | Element[] | null>>()
	private styleCache = new WeakCache<Element, CSSStyleDeclaration>()

	/**
	 * Query selector with caching
	 */
	querySelector(element: Element, selector: string): Element | null {
		const elementCache = this.queryCache.get(element) ?? new Map()
		this.queryCache.set(element, elementCache)

		if (elementCache.has(selector)) {
			return elementCache.get(selector) as Element | null
		}

		const result = element.querySelector(selector)
		elementCache.set(selector, result)
		return result
	}

	/**
	 * Query selector all with caching
	 */
	querySelectorAll(element: Element, selector: string): Element[] {
		const cacheKey = `all:${selector}`
		const elementCache = this.queryCache.get(element) ?? new Map()
		this.queryCache.set(element, elementCache)

		if (elementCache.has(cacheKey)) {
			return elementCache.get(cacheKey) as Element[]
		}

		const result = Array.from(element.querySelectorAll(selector))
		elementCache.set(cacheKey, result)
		return result
	}

	/**
	 * Get computed style with caching
	 */
	getComputedStyle(element: Element): CSSStyleDeclaration {
		const cached = this.styleCache.get(element)

		if (cached) {
			return cached
		}

		const style = window.getComputedStyle(element as HTMLElement)
		this.styleCache.set(element, style)
		return style
	}

	/**
	 * Invalidate cache for element
	 */
	invalidate(element: Element): void {
		this.queryCache.delete(element)
		this.styleCache.delete(element)
	}
}

// ============================================================================
// Memory Cleanup Manager
// ============================================================================

/**
 * Manager for periodic memory cleanup
 */
export class MemoryCleanupManager {
	private cleanupCallbacks: Set<() => void> = new Set()
	private intervalId: number | null = null
	private cleanupInterval: number

	constructor(cleanupInterval: number = 60000) {
		this.cleanupInterval = cleanupInterval
	}

	/**
	 * Register cleanup callback
	 */
	register(callback: () => void): void {
		this.cleanupCallbacks.add(callback)
	}

	/**
	 * Unregister cleanup callback
	 */
	unregister(callback: () => void): void {
		this.cleanupCallbacks.delete(callback)
	}

	/**
	 * Start periodic cleanup
	 */
	start(): void {
		if (this.intervalId !== null) return

		this.intervalId = window.setInterval(() => {
			this.runCleanup()
		}, this.cleanupInterval)
	}

	/**
	 * Stop periodic cleanup
	 */
	stop(): void {
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId)
			this.intervalId = null
		}
	}

	/**
	 * Run cleanup manually
	 */
	runCleanup(): void {
		for (const callback of this.cleanupCallbacks) {
			try {
				callback()
			} catch (error) {
				console.warn('[Directix] Cleanup callback failed:', error)
			}
		}
	}

	/**
	 * Get registered callbacks count
	 */
	size(): number {
		return this.cleanupCallbacks.size
	}
}

// ============================================================================
// Global Performance Optimizer
// ============================================================================

let _config: PerformanceOptimizationConfig = DEFAULT_PERFORMANCE_CONFIG,
	_eventBatchProcessor: EventBatchProcessor | null = null,
	_domQueryCache: DOMQueryCache | null = null,
	_memoryCleanupManager: MemoryCleanupManager | null = null

/**
 * Configure performance optimization
 */
export function configurePerformanceOptimization(config: Partial<PerformanceOptimizationConfig>): void {
	_config = {
		...DEFAULT_PERFORMANCE_CONFIG,
		...config,
		eventDelegation: { ...DEFAULT_PERFORMANCE_CONFIG.eventDelegation, ...config.eventDelegation },
		virtualization: { ...DEFAULT_PERFORMANCE_CONFIG.virtualization, ...config.virtualization },
		caching: { ...DEFAULT_PERFORMANCE_CONFIG.caching, ...config.caching },
		lazyInit: { ...DEFAULT_PERFORMANCE_CONFIG.lazyInit, ...config.lazyInit },
		memory: { ...DEFAULT_PERFORMANCE_CONFIG.memory, ...config.memory },
	}

	// Initialize components based on config
	if (_config.eventDelegation.enabled && _config.eventDelegation.batchProcessing) {
		_eventBatchProcessor = new EventBatchProcessor(_config.eventDelegation.batchSize)
	}

	if (_config.caching.domQueries || _config.caching.styleCalculations) {
		_domQueryCache = new DOMQueryCache()
	}

	if (_config.memory.periodicCleanup) {
		_memoryCleanupManager = new MemoryCleanupManager(_config.memory.periodicCleanup)
		_memoryCleanupManager.start()
	}
}

/**
 * Get current performance config
 */
export function getPerformanceOptimizationConfig(): PerformanceOptimizationConfig {
	return { ..._config }
}

/**
 * Get event batch processor
 */
export function getEventBatchProcessor(): EventBatchProcessor | null {
	return _eventBatchProcessor
}

/**
 * Get DOM query cache
 */
export function getDOMQueryCache(): DOMQueryCache | null {
	return _domQueryCache
}

/**
 * Get memory cleanup manager
 */
export function getMemoryCleanupManager(): MemoryCleanupManager | null {
	return _memoryCleanupManager
}

/**
 * Run manual cleanup
 */
export function runMemoryCleanup(): void {
	if (_memoryCleanupManager) {
		_memoryCleanupManager.runCleanup()
	}
}

/**
 * Reset performance optimizer
 */
export function resetPerformanceOptimizer(): void {
	if (_eventBatchProcessor) {
		_eventBatchProcessor.clear()
	}
	if (_memoryCleanupManager) {
		_memoryCleanupManager.stop()
	}
	_config = DEFAULT_PERFORMANCE_CONFIG
}
