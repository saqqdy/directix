/**
 * Virtual List Optimizer for Directix
 * Provides performance optimizations for virtual scrolling lists:
 * - Dynamic item height caching
 * - VNode recycling pool
 * - Scroll optimization with RAF
 * - Buffer zone rendering
 *
 * @since 2.2.0
 */

// ============================================================================
// Types
// ============================================================================

export interface VirtualListOptimizerConfig {
	/** Number of items to render above/below the viewport */
	bufferSize: number
	/** Estimated item height when not cached */
	estimatedItemHeight: number
	/** Whether to cache item heights dynamically */
	dynamicHeight: boolean
	/** Maximum number of recycled VNodes to keep */
	recyclePoolSize: number
	/** Scroll threshold (px) before recalculating visible range */
	scrollThreshold: number
	/** Whether to use IntersectionObserver for visibility */
	useIntersectionObserver: boolean
	/** Whether to enable scroll direction detection */
	detectScrollDirection: boolean
}

export interface ItemHeightCache {
	/** Cached heights by item index or key */
	heights: Map<string | number, number>
	/** Total cached height */
	totalCachedHeight: number
	/** Number of cached items */
	cachedCount: number
}

export interface VisibleRange {
	/** First visible index */
	start: number
	/** Last visible index (inclusive) */
	end: number
	/** Total items count */
	total: number
	/** Start offset in pixels */
	startOffset: number
	/** End offset in pixels */
	endOffset: number
}

export interface VirtualScrollInfo {
	/** Current scroll position */
	scrollTop: number
	/** Scroll direction: 1 = down, -1 = up, 0 = none */
	direction: number
	/** Scroll velocity (px/ms) */
	velocity: number
	/** Whether the list is scrolling */
	isScrolling: boolean
}

export interface VNodeRecyclePoolEntry {
	/** Pool key (usually item type or component name) */
	key: string
	/** The recycled VNode or element */
	node: any
	/** When this entry was recycled */
	recycledAt: number
}

export interface VirtualListOptimizerStats {
	/** Number of items in height cache */
	cachedHeights: number
	/** Number of entries in recycle pool */
	recyclePoolSize: number
	/** Number of visible range recalculations */
	recalculations: number
	/** Number of scroll events processed */
	scrollEventsProcessed: number
	/** Average recalculation time in ms */
	avgRecalcTime: number
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_VIRTUAL_LIST_OPTIMIZER_CONFIG: VirtualListOptimizerConfig = {
	bufferSize: 5,
	estimatedItemHeight: 40,
	dynamicHeight: true,
	recyclePoolSize: 100,
	scrollThreshold: 5,
	useIntersectionObserver: false,
	detectScrollDirection: true,
}

// ============================================================================
// Virtual List Optimizer
// ============================================================================

/**
 * Optimizer for virtual list rendering performance.
 * Provides height caching, visible range calculation, and VNode recycling.
 */
export class VirtualListOptimizer {
	private config: VirtualListOptimizerConfig
	private heightCache: ItemHeightCache
	private recyclePool: Map<string, VNodeRecyclePoolEntry[]>
	private scrollInfo: VirtualScrollInfo
	private lastScrollTop = 0
	private lastScrollTime = 0
	private stats: VirtualListOptimizerStats
	private observer: IntersectionObserver | null = null
	private totalItems = 0
	private containerHeight = 0

	constructor(config: Partial<VirtualListOptimizerConfig> = {}) {
		this.config = { ...DEFAULT_VIRTUAL_LIST_OPTIMIZER_CONFIG, ...config }
		this.heightCache = { heights: new Map(), totalCachedHeight: 0, cachedCount: 0 }
		this.recyclePool = new Map()
		this.scrollInfo = { scrollTop: 0, direction: 0, velocity: 0, isScrolling: false }
		this.stats = {
			cachedHeights: 0,
			recyclePoolSize: 0,
			recalculations: 0,
			scrollEventsProcessed: 0,
			avgRecalcTime: 0,
		}
	}

	/**
	 * Initialize the optimizer with container information
	 */
	init(totalItems: number, containerHeight: number): void {
		this.totalItems = totalItems
		this.containerHeight = containerHeight
		this.heightCache.heights.clear()
		this.heightCache.totalCachedHeight = 0
		this.heightCache.cachedCount = 0
	}

	/**
	 * Update total items count
	 */
	setTotalItems(count: number): void {
		this.totalItems = count
	}

	/**
	 * Update container height
	 */
	setContainerHeight(height: number): void {
		this.containerHeight = height
	}

	/**
	 * Cache an item's height
	 */
	cacheItemHeight(key: string | number, height: number): void {
		const existing = this.heightCache.heights.get(key)
		if (existing !== undefined) {
			this.heightCache.totalCachedHeight -= existing
		} else {
			this.heightCache.cachedCount++
		}
		this.heightCache.heights.set(key, height)
		this.heightCache.totalCachedHeight += height
		this.stats.cachedHeights = this.heightCache.cachedCount
	}

	/**
	 * Get cached item height
	 */
	getItemHeight(key: string | number): number {
		return this.heightCache.heights.get(key) ?? this.config.estimatedItemHeight
	}

	/**
	 * Get the estimated total height of the list
	 */
	getEstimatedTotalHeight(): number {
		if (this.heightCache.cachedCount === this.totalItems) {
			return this.heightCache.totalCachedHeight
		}
		const uncachedCount = this.totalItems - this.heightCache.cachedCount
		return this.heightCache.totalCachedHeight + uncachedCount * this.config.estimatedItemHeight
	}

	/**
	 * Calculate the visible range based on scroll position
	 */
	calculateVisibleRange(scrollTop: number): VisibleRange {
		const startTime = performance.now()

		const viewHeight = this.containerHeight

		// Calculate start offset (sum of heights before visible area)
		let currentOffset = 0,
			startIndex = 0

		for (let i = 0; i < this.totalItems; i++) {
			const itemHeight = this.getItemHeight(i)
			if (currentOffset + itemHeight > scrollTop) {
				startIndex = Math.max(0, i - this.config.bufferSize)
				break
			}
			currentOffset += itemHeight
		}

		// Calculate end index
		const endScrollPos = scrollTop + viewHeight
		// eslint-disable-next-line one-var
		let endOffset = currentOffset,
			endIndex = startIndex

		for (let i = startIndex; i < this.totalItems; i++) {
			endOffset += this.getItemHeight(i)
			if (endOffset >= endScrollPos) {
				endIndex = Math.min(this.totalItems - 1, i + this.config.bufferSize)
				break
			}
		}

		// Ensure end doesn't exceed total
		endIndex = Math.min(endIndex, this.totalItems - 1)

		// Calculate start offset
		// eslint-disable-next-line one-var
		let startOffset = 0,
			offsetFromEnd = 0
		for (let i = 0; i < startIndex; i++) {
			startOffset += this.getItemHeight(i)
		}

		// Calculate end offset
		for (let i = endIndex + 1; i < this.totalItems; i++) {
			offsetFromEnd += this.getItemHeight(i)
		}

		// Update stats
		const duration = performance.now() - startTime
		this.stats.recalculations++
		this.stats.avgRecalcTime = this.stats.recalculations > 0 ? (this.stats.avgRecalcTime * (this.stats.recalculations - 1) + duration) / this.stats.recalculations : 0

		return {
			start: startIndex,
			end: endIndex,
			total: this.totalItems,
			startOffset,
			endOffset: offsetFromEnd,
		}
	}

	/**
	 * Process a scroll event and update scroll info
	 */
	handleScroll(scrollTop: number): VirtualScrollInfo {
		const now = Date.now()
		const deltaTime = now - this.lastScrollTime
		const deltaScroll = scrollTop - this.lastScrollTop

		this.scrollInfo.direction = deltaScroll > 0 ? 1 : deltaScroll < 0 ? -1 : 0
		this.scrollInfo.velocity = deltaTime > 0 ? Math.abs(deltaScroll / deltaTime) : 0
		this.scrollInfo.isScrolling = Math.abs(deltaScroll) > this.config.scrollThreshold
		this.scrollInfo.scrollTop = scrollTop

		this.lastScrollTop = scrollTop
		this.lastScrollTime = now
		this.stats.scrollEventsProcessed++

		return { ...this.scrollInfo }
	}

	/**
	 * Recycle a VNode for reuse
	 */
	recycleVNode(key: string, node: any): void {
		const pool = this.recyclePool.get(key) ?? []

		if (pool.length >= this.config.recyclePoolSize) {
			// Drop the oldest entry
			pool.shift()
		}

		pool.push({ key, node, recycledAt: Date.now() })
		this.recyclePool.set(key, pool)
		this.stats.recyclePoolSize = this.getTotalRecyclePoolSize()
	}

	/**
	 * Acquire a recycled VNode
	 */
	acquireRecycledVNode(key: string): any | null {
		const pool = this.recyclePool.get(key)
		if (!pool || pool.length === 0) return null

		const entry = pool.pop()!
		this.recyclePool.set(key, pool)
		this.stats.recyclePoolSize = this.getTotalRecyclePoolSize()
		return entry.node
	}

	/**
	 * Get optimizer statistics
	 */
	getStats(): VirtualListOptimizerStats {
		return { ...this.stats }
	}

	/**
	 * Get current scroll info
	 */
	getScrollInfo(): VirtualScrollInfo {
		return { ...this.scrollInfo }
	}

	/**
	 * Get height cache info
	 */
	getHeightCacheInfo(): ItemHeightCache {
		return {
			heights: new Map(this.heightCache.heights),
			totalCachedHeight: this.heightCache.totalCachedHeight,
			cachedCount: this.heightCache.cachedCount,
		}
	}

	/**
	 * Clear the height cache
	 */
	clearHeightCache(): void {
		this.heightCache.heights.clear()
		this.heightCache.totalCachedHeight = 0
		this.heightCache.cachedCount = 0
		this.stats.cachedHeights = 0
	}

	/**
	 * Clear the recycle pool
	 */
	clearRecyclePool(): void {
		this.recyclePool.clear()
		this.stats.recyclePoolSize = 0
	}

	/**
	 * Destroy the optimizer
	 */
	destroy(): void {
		this.clearHeightCache()
		this.clearRecyclePool()
		if (this.observer) {
			this.observer.disconnect()
			this.observer = null
		}
		this.stats = {
			cachedHeights: 0,
			recyclePoolSize: 0,
			recalculations: 0,
			scrollEventsProcessed: 0,
			avgRecalcTime: 0,
		}
	}

	// -- Internal --

	private getTotalRecyclePoolSize(): number {
		let size = 0
		for (const pool of this.recyclePool.values()) {
			size += pool.length
		}
		return size
	}
}

// ============================================================================
// Global instance
// ============================================================================

let _globalOptimizer: VirtualListOptimizer | null = null

/**
 * Get or create the global VirtualListOptimizer
 */
export function getVirtualListOptimizer(
	config: Partial<VirtualListOptimizerConfig> = {},
): VirtualListOptimizer {
	if (!_globalOptimizer) {
		_globalOptimizer = new VirtualListOptimizer(config)
	}
	return _globalOptimizer
}
