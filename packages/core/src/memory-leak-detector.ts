/**
 * Memory Leak Detector for Directix
 * Provides automatic detection and reporting of memory leaks
 * in directive instances, event listeners, observers, and timers.
 *
 * @since 2.2.0
 */

// ============================================================================
// Types
// ============================================================================

export interface MemoryLeakDetectorConfig {
	/** Whether detection is enabled */
	enabled: boolean
	/** Snapshot interval in ms */
	snapshotInterval: number
	/** Maximum snapshots to keep */
	maxSnapshots: number
	/** Threshold for warning (bytes) */
	warningThreshold: number
	/** Threshold for critical alert (bytes) */
	criticalThreshold: number
	/** Whether to auto-start detection */
	autoStart: boolean
	/** Callback for leak detection */
	onLeakDetected?: (report: LeakReport) => void
}

export interface TrackedResource {
	/** Unique ID */
	id: string
	/** Resource type */
	type: 'event-listener' | 'observer' | 'timer' | 'directive-instance' | 'custom'
	/** Description */
	description: string
	/** Creation timestamp */
	createdAt: number
	/** Associated element or target (WeakRef if available) */
	target?: { deref: () => object | undefined } | null
	/** Cleanup function */
	cleanup: () => void
	/** Tags for grouping */
	tags: string[]
}

export interface MemorySnapshot {
	/** Snapshot timestamp */
	timestamp: number
	/** Estimated memory usage (if available) */
	memoryUsage: number | null
	/** Number of tracked resources */
	resourceCount: number
	/** Resources by type */
	resourcesByType: Record<string, number>
	/** Number of DOM nodes */
	domNodeCount: number
	/** Number of event listeners (estimated) */
	eventListenerCount: number
}

export interface LeakReport {
	/** Report timestamp */
	timestamp: number
	/** Leak severity */
	severity: 'low' | 'medium' | 'high' | 'critical'
	/** Description of the leak */
	description: string
	/** Suspected leaked resources */
	suspectedResources: TrackedResource[]
	/** Memory delta since last snapshot */
	memoryDelta: number | null
	/** Snapshots compared */
	snapshotRange: { from: number, to: number }
	/** Optimization suggestions */
	suggestions: string[]
}

export interface MemoryLeakDetectorStats {
	/** Whether the detector is running */
	isRunning: boolean
	/** Number of snapshots taken */
	snapshotCount: number
	/** Number of tracked resources */
	trackedResourceCount: number
	/** Number of leaks detected */
	leaksDetected: number
	/** Last snapshot timestamp */
	lastSnapshotAt: number | null
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_MEMORY_LEAK_DETECTOR_CONFIG: MemoryLeakDetectorConfig = {
	enabled: true,
	snapshotInterval: 30000,
	maxSnapshots: 20,
	warningThreshold: 5 * 1024 * 1024, // 5MB
	criticalThreshold: 20 * 1024 * 1024, // 20MB
	autoStart: false,
}

// ============================================================================
// Memory Leak Detector
// ============================================================================

let _config: MemoryLeakDetectorConfig = { ...DEFAULT_MEMORY_LEAK_DETECTOR_CONFIG },
	_snapshots: MemorySnapshot[] = [],
	_snapshotTimer: ReturnType<typeof setInterval> | null = null,
	_idCounter = 0,
	_isRunning = false
const _trackedResources: Map<string, TrackedResource> = new Map()
const _leakReports: LeakReport[] = []

/**
 * Configure the memory leak detector
 */
export function configureMemoryLeakDetector(config: Partial<MemoryLeakDetectorConfig>): void {
	_config = { ...DEFAULT_MEMORY_LEAK_DETECTOR_CONFIG, ...config }

	if (_config.autoStart && _config.enabled && !_isRunning) {
		startLeakDetection()
	} else if (!_config.enabled && _isRunning) {
		stopLeakDetection()
	}
}

/**
 * Get current configuration
 */
export function getMemoryLeakDetectorConfig(): MemoryLeakDetectorConfig {
	return { ..._config }
}

/**
 * Start periodic leak detection
 */
export function startLeakDetection(): void {
	if (_isRunning || !_config.enabled) return

	_isRunning = true
	_snapshotTimer = setInterval(takeSnapshot, _config.snapshotInterval)

	// Take initial snapshot
	takeSnapshot()
}

/**
 * Stop periodic leak detection
 */
export function stopLeakDetection(): void {
	if (!_isRunning) return

	_isRunning = false
	if (_snapshotTimer !== null) {
		clearInterval(_snapshotTimer)
		_snapshotTimer = null
	}
}

/**
 * Track a resource that should be cleaned up
 */
export function trackResource(
	type: TrackedResource['type'],
	description: string,
	cleanup: () => void,
	options: { target?: object, tags?: string[] } = {},
): string {
	const id = `res-${++_idCounter}`

	const resource: TrackedResource = {
		id,
		type,
		description,
		createdAt: Date.now(),
		cleanup,
		tags: options.tags ?? [],
	}

	if (options.target) {
		try {
			// WeakRef may not be available in all environments
			const WRef = (typeof globalThis !== 'undefined' && 'WeakRef' in globalThis) ? (globalThis as Record<string, unknown>).WeakRef as new (target: object) => { deref: () => object | undefined } : null
			if (WRef) {
				resource.target = new WRef(options.target) as { deref: () => object | undefined }
			}
		} catch {
			// WeakRef not supported
		}
	}

	_trackedResources.set(id, resource)

	return id
}

/**
 * Untrack a resource (call when it's properly cleaned up)
 */
export function untrackResource(id: string): void {
	_trackedResources.delete(id)
}

/**
 * Clean up a tracked resource and untrack it
 */
export function cleanupResource(id: string): boolean {
	const resource = _trackedResources.get(id)
	if (!resource) return false

	try {
		resource.cleanup()
	} catch (error) {
		console.warn(`[Directix] MemoryLeakDetector: Failed to cleanup resource "${id}":`, error)
	}

	_trackedResources.delete(id)
	return true
}

/**
 * Clean up all resources of a given type
 */
export function cleanupResourcesByType(type: TrackedResource['type']): number {
	let count = 0

	for (const [id, resource] of _trackedResources) {
		if (resource.type === type) {
			try {
				resource.cleanup()
			} catch {
				// Ignore cleanup errors
			}
			_trackedResources.delete(id)
			count++
		}
	}

	return count
}

/**
 * Take a memory snapshot
 */
export function takeSnapshot(): MemorySnapshot {
	const resourcesByType: Record<string, number> = {}
	for (const resource of _trackedResources.values()) {
		resourcesByType[resource.type] = (resourcesByType[resource.type] ?? 0) + 1
	}

	const memoryUsage = getMemoryUsage()
	const domNodeCount = getDOMNodeCount()

	const snapshot: MemorySnapshot = {
		timestamp: Date.now(),
		memoryUsage,
		resourceCount: _trackedResources.size,
		resourcesByType,
		domNodeCount,
		eventListenerCount: resourcesByType['event-listener'] ?? 0,
	}

	_snapshots.push(snapshot)

	// Trim old snapshots
	if (_snapshots.length > _config.maxSnapshots) {
		_snapshots = _snapshots.slice(-_config.maxSnapshots)
	}

	// Check for leaks if we have at least 2 snapshots
	if (_snapshots.length >= 2) {
		detectLeaks()
	}

	return snapshot
}

/**
 * Get all snapshots
 */
export function getSnapshots(): MemorySnapshot[] {
	return [..._snapshots]
}

/**
 * Get all leak reports
 */
export function getLeakReports(): LeakReport[] {
	return [..._leakReports]
}

/**
 * Get detector statistics
 */
export function getLeakDetectorStats(): MemoryLeakDetectorStats {
	return {
		isRunning: _isRunning,
		snapshotCount: _snapshots.length,
		trackedResourceCount: _trackedResources.size,
		leaksDetected: _leakReports.length,
		lastSnapshotAt: _snapshots.length > 0 ? _snapshots[_snapshots.length - 1].timestamp : null,
	}
}

/**
 * Get tracked resources info (without cleanup functions)
 */
export function getTrackedResourcesInfo(): Array<Omit<TrackedResource, 'cleanup'>> {
	return Array.from(_trackedResources.values()).map(({ cleanup: _, ...rest }) => rest)
}

/**
 * Clear all leak reports
 */
export function clearLeakReports(): void {
	_leakReports.length = 0
}

/**
 * Reset the detector completely
 */
export function resetMemoryLeakDetector(): void {
	stopLeakDetection()
	_trackedResources.clear()
	_snapshots.length = 0
	_leakReports.length = 0
	_idCounter = 0
}

// ============================================================================
// Internal
// ============================================================================

function detectLeaks(): void {
	if (_snapshots.length < 2) return

	const latest = _snapshots[_snapshots.length - 1]
	const previous = _snapshots[_snapshots.length - 2]

	const memoryDelta = latest.memoryUsage !== null && previous.memoryUsage !== null ? latest.memoryUsage - previous.memoryUsage : null

	// Check for growing resource counts
	const resourceGrowth = latest.resourceCount - previous.resourceCount

	// Check for growing DOM nodes
	const domGrowth = latest.domNodeCount - previous.domNodeCount

	// Detect severity
	let severity: LeakReport['severity'] | null = null
	const suggestions: string[] = []
	const suspectedResources: TrackedResource[] = []

	if (memoryDelta !== null && memoryDelta > _config.criticalThreshold) {
		severity = 'critical'
		suggestions.push('Critical memory growth detected. Check for detached DOM nodes and unreleased observers.')
	} else if (memoryDelta !== null && memoryDelta > _config.warningThreshold) {
		severity = 'high'
		suggestions.push('Significant memory growth detected. Review event listener cleanup and directive unmount handlers.')
	}

	if (resourceGrowth > 20) {
		severity = severity ?? 'medium'
		suggestions.push(`Tracked resources grew by ${resourceGrowth}. Check for unregistered event listeners or observers.`)

		// Find long-lived resources
		const now = Date.now()
		for (const resource of _trackedResources.values()) {
			if (now - resource.createdAt > 300000) { // 5 minutes
				suspectedResources.push(resource)
			}
		}
	}

	if (domGrowth > 50) {
		severity = severity ?? 'medium'
		suggestions.push(`DOM node count grew by ${domGrowth}. Check for detached DOM trees.`)
	}

	if (severity) {
		const report: LeakReport = {
			timestamp: Date.now(),
			severity,
			description: `Memory leak detected: ${severity} severity. Resource growth: ${resourceGrowth}, DOM growth: ${domGrowth}`,
			suspectedResources,
			memoryDelta,
			snapshotRange: { from: previous.timestamp, to: latest.timestamp },
			suggestions,
		}

		_leakReports.push(report)

		// Call callback
		_config.onLeakDetected?.(report)
	}
}

function getMemoryUsage(): number | null {
	// Try performance.memory (Chrome only)
	const perf = performance as any
	if (perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
		return perf.memory.usedJSHeapSize
	}
	return null
}

function getDOMNodeCount(): number {
	if (typeof document === 'undefined') return 0
	return document.querySelectorAll('*').length
}
