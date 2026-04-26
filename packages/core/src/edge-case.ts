/**
 * Edge Case Handler Module for Directix
 * Provides robust handling for edge cases and error scenarios
 */

// ============================================================================
// Types
// ============================================================================

export interface EdgeCaseConfig {
	// SSR handling
	ssr: {
		enabled: boolean
		warnOnUnsupported: boolean
		fallbackBehavior: 'skip' | 'mock' | 'throw'
	}

	// DOM ready handling
	domReady: {
		waitForReady: boolean
		timeout: number
		retryCount: number
	}

	// Memory management
	memory: {
		maxObservers: number
		cleanupInterval: number
		warnThreshold: number
	}

	// Error recovery
	errorRecovery: {
		enabled: boolean
		maxRetries: number
		retryDelay: number
		fallbackValue?: any
	}

	// Mobile handling
	mobile: {
		touchDelay: number
		debounceResize: number
		preventDefaultOnTouch: boolean
	}
}

export interface EdgeCaseResult<T> {
	success: boolean
	value?: T
	error?: Error
	recovered: boolean
	retryCount: number
}

export type EdgeCaseType
	= | 'ssr-unsupported'
		| 'dom-not-ready'
		| 'element-not-found'
		| 'observer-limit'
		| 'memory-leak'
		| 'touch-conflict'
		| 'resize-loop'
		| 'scroll-jank'
		| 'invalid-binding'
		| 'missing-dependency'

export interface EdgeCaseWarning {
	type: EdgeCaseType
	message: string
	element?: Element
	directive?: string
	timestamp: number
	handled: boolean
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_EDGE_CASE_CONFIG: EdgeCaseConfig = {
	ssr: {
		enabled: true,
		warnOnUnsupported: true,
		fallbackBehavior: 'skip',
	},
	domReady: {
		waitForReady: true,
		timeout: 5000,
		retryCount: 3,
	},
	memory: {
		maxObservers: 100,
		cleanupInterval: 60000,
		warnThreshold: 80,
	},
	errorRecovery: {
		enabled: true,
		maxRetries: 3,
		retryDelay: 100,
	},
	mobile: {
		touchDelay: 300,
		debounceResize: 150,
		preventDefaultOnTouch: false,
	},
}

// ============================================================================
// Edge Case Handler
// ============================================================================

let _config: EdgeCaseConfig = DEFAULT_EDGE_CASE_CONFIG,
	_warnings: EdgeCaseWarning[] = [],
	_observerCount = 0,
	_cleanupTimer: number | null = null

/**
 * Configure edge case handler
 */
export function configureEdgeCase(config: Partial<EdgeCaseConfig>): void {
	_config = {
		...DEFAULT_EDGE_CASE_CONFIG,
		...config,
		ssr: { ...DEFAULT_EDGE_CASE_CONFIG.ssr, ...config.ssr },
		domReady: { ...DEFAULT_EDGE_CASE_CONFIG.domReady, ...config.domReady },
		memory: { ...DEFAULT_EDGE_CASE_CONFIG.memory, ...config.memory },
		errorRecovery: { ...DEFAULT_EDGE_CASE_CONFIG.errorRecovery, ...config.errorRecovery },
		mobile: { ...DEFAULT_EDGE_CASE_CONFIG.mobile, ...config.mobile },
	}

	// Start cleanup timer if configured
	if (_config.memory.cleanupInterval > 0 && typeof window !== 'undefined') {
		startCleanupTimer()
	}
}

/**
 * Get current configuration
 */
export function getEdgeCaseConfig(): EdgeCaseConfig {
	return { ..._config }
}

/**
 * Check if running in SSR environment
 */
export function isSSR(): boolean {
	return typeof window === 'undefined' || typeof document === 'undefined'
}

/**
 * Handle SSR unsupported operation
 */
export function handleSSRUnsupported(operation: string, directive?: string): EdgeCaseResult<undefined> {
	if (!_config.ssr.enabled) {
		return { success: true, recovered: false, retryCount: 0 }
	}

	if (_config.ssr.warnOnUnsupported) {
		logWarning('ssr-unsupported', `Operation "${operation}" is not supported in SSR environment`, directive)
	}

	switch (_config.ssr.fallbackBehavior) {
		case 'skip':
			return { success: true, recovered: true, retryCount: 0 }
		case 'mock':
			return { success: true, recovered: true, retryCount: 0 }
		case 'throw':
			return { success: false, error: new Error(`SSR unsupported: ${operation}`), recovered: false, retryCount: 0 }
		default:
			return { success: true, recovered: false, retryCount: 0 }
	}
}

/**
 * Wait for DOM ready
 */
export function waitForDOMReady(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (!isSSR() && document.readyState !== 'loading') {
			resolve()
			return
		}

		if (!_config.domReady.waitForReady) {
			resolve()
			return
		}

		const timeout = setTimeout(() => {
			logWarning('dom-not-ready', 'DOM ready timeout exceeded')
			reject(new Error('DOM ready timeout'))
		}, _config.domReady.timeout)

		const onReady = (): void => {
			clearTimeout(timeout)
			document.removeEventListener('DOMContentLoaded', onReady)
			resolve()
		}

		if (isSSR()) {
			clearTimeout(timeout)
			resolve()
		} else {
			document.addEventListener('DOMContentLoaded', onReady)
		}
	})
}

/**
 * Safely query element with retry
 */
export async function safeQueryElement(
	selector: string,
	options?: { retryCount?: number, retryDelay?: number, parent?: Element | Document },
): Promise<Element | null> {
	const retries = options?.retryCount ?? _config.domReady.retryCount
	const delay = options?.retryDelay ?? _config.errorRecovery.retryDelay
	const parent = options?.parent ?? document

	for (let i = 0; i <= retries; i++) {
		const element = parent.querySelector(selector)
		if (element) return element

		if (i < retries) {
			await new Promise(r => setTimeout(r, delay))
		}
	}

	logWarning('element-not-found', `Element not found: ${selector}`)
	return null
}

/**
 * Track observer count
 */
export function trackObserver(): boolean {
	_observerCount++

	if (_observerCount > _config.memory.maxObservers) {
		logWarning('observer-limit', `Observer limit exceeded: ${_observerCount}/${_config.memory.maxObservers}`)
		return false
	}

	if (_observerCount > _config.memory.warnThreshold) {
		logWarning('observer-limit', `Observer count approaching limit: ${_observerCount}/${_config.memory.maxObservers}`)
	}

	return true
}

/**
 * Untrack observer
 */
export function untrackObserver(): void {
	if (_observerCount > 0) {
		_observerCount--
	}
}

/**
 * Get observer count
 */
export function getObserverCount(): number {
	return _observerCount
}

/**
 * Execute with error recovery
 */
export async function withErrorRecovery<T>(
	operation: () => T | Promise<T>,
	options?: {
		maxRetries?: number
		retryDelay?: number
		fallbackValue?: T
		onError?: (error: Error, attempt: number) => void
	},
): Promise<EdgeCaseResult<T>> {
	if (!_config.errorRecovery.enabled) {
		try {
			const value = await operation()
			return { value, success: true, recovered: false, retryCount: 0 }
		} catch (error) {
			return { success: false, error: error as Error, recovered: false, retryCount: 0 }
		}
	}

	const maxRetries = options?.maxRetries ?? _config.errorRecovery.maxRetries
	const retryDelay = options?.retryDelay ?? _config.errorRecovery.retryDelay
	const fallbackValue = options?.fallbackValue ?? _config.errorRecovery.fallbackValue

	let lastError: Error | undefined

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const value = await operation()
			return { value, success: true, recovered: attempt > 0, retryCount: attempt }
		} catch (error) {
			lastError = error as Error
			options?.onError?.(lastError, attempt)

			if (attempt < maxRetries) {
				await new Promise(r => setTimeout(r, retryDelay * (attempt + 1)))
			}
		}
	}

	// Return fallback value if available
	if (fallbackValue !== undefined) {
		return { value: fallbackValue, success: true, recovered: true, retryCount: maxRetries }
	}

	return { success: false, error: lastError, recovered: false, retryCount: maxRetries }
}

/**
 * Handle touch conflict (for mobile)
 */
export function handleTouchConflict(
	element: Element,
	event: TouchEvent,
	directive?: string,
): boolean {
	if (!_config.mobile.preventDefaultOnTouch) {
		return false
	}

	// Check if touch should be prevented based on directive type
	const shouldPrevent = element.hasAttribute('data-prevent-touch')
		|| element.closest('[data-prevent-touch]')

	if (shouldPrevent) {
		event.preventDefault()
		logWarning('touch-conflict', 'Touch event prevented due to conflict', directive)
		return true
	}

	return false
}

/**
 * Debounce resize handler
 */
export function createDebouncedResizeHandler(
	handler: () => void,
	delay?: number,
): () => void {
	let timeoutId: number | null = null
	const actualDelay = delay ?? _config.mobile.debounceResize

	return () => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId)
		}

		timeoutId = window.setTimeout(() => {
			handler()
			timeoutId = null
		}, actualDelay)
	}
}

/**
 * Detect resize loop
 */
export function detectResizeLoop(
	_entries: ResizeObserverEntry[],
	threshold: number = 3,
): boolean {
	// Check for rapid consecutive resizes
	// Note: entries parameter available for future entry-based analysis
	const now = Date.now()
	const timestamps = (detectResizeLoop as any)._timestamps || []
	;(detectResizeLoop as any)._timestamps = timestamps.filter((t: number) => now - t < 1000)
	;(detectResizeLoop as any)._timestamps.push(now)

	if ((detectResizeLoop as any)._timestamps.length > threshold) {
		logWarning('resize-loop', 'Potential resize loop detected')
		return true
	}

	return false
}

/**
 * Detect scroll jank
 */
export function detectScrollJank(frameTime: number, threshold: number = 50): boolean {
	if (frameTime > threshold) {
		logWarning('scroll-jank', `Scroll jank detected: ${frameTime}ms frame time`)
		return true
	}
	return false
}

/**
 * Validate binding value
 */
export function validateBinding(
	binding: any,
	schema: {
		type?: string | string[]
		required?: boolean
		validator?: (value: any) => boolean
	},
	directive?: string,
): EdgeCaseResult<any> {
	const { type, required, validator } = schema

	// Check required
	if (required && (binding === undefined || binding === null)) {
		const error = new Error('Binding value is required')
		logWarning('invalid-binding', error.message, directive)
		return { success: false, error, recovered: false, retryCount: 0 }
	}

	// Check type
	if (type && binding !== undefined && binding !== null) {
		const types = Array.isArray(type) ? type : [type]
		const actualType = Array.isArray(binding) ? 'array' : typeof binding

		if (!types.includes(actualType)) {
			const error = new Error(`Expected type ${types.join(' | ')}, got ${actualType}`)
			logWarning('invalid-binding', error.message, directive)
			return { success: false, error, recovered: false, retryCount: 0 }
		}
	}

	// Custom validator
	if (validator && !validator(binding)) {
		const error = new Error('Binding validation failed')
		logWarning('invalid-binding', error.message, directive)
		return { success: false, error, recovered: false, retryCount: 0 }
	}

	return { value: binding, success: true, recovered: false, retryCount: 0 }
}

/**
 * Check dependency availability
 */
export function checkDependency(name: string, globalPath?: string): boolean {
	if (isSSR()) {
		return false
	}

	// Check global path like 'window.ResizeObserver'
	if (globalPath) {
		const parts = globalPath.split('.')
		let current: any = window
		for (const part of parts) {
			current = current?.[part]
			if (!current) {
				logWarning('missing-dependency', `Missing dependency: ${name}`)
				return false
			}
		}
		return true
	}

	// Check direct window property
	if ((window as any)[name]) {
		return true
	}

	logWarning('missing-dependency', `Missing dependency: ${name}`)
	return false
}

/**
 * Log warning
 */
function logWarning(type: EdgeCaseType, message: string, directive?: string, element?: Element): void {
	const warning: EdgeCaseWarning = {
		type,
		message,
		element,
		directive,
		timestamp: Date.now(),
		handled: true,
	}

	_warnings.push(warning)

	// Keep only last 100 warnings
	if (_warnings.length > 100) {
		_warnings = _warnings.slice(-100)
	}

	// Console output
	console.warn(`[Directix Edge Case] [${type}] ${message}${directive ? ` (directive: ${directive})` : ''}`)
}

/**
 * Get warnings
 */
export function getEdgeCaseWarnings(filter?: {
	type?: EdgeCaseType
	directive?: string
	since?: number
}): EdgeCaseWarning[] {
	let result = [..._warnings]

	if (filter?.type) {
		result = result.filter(w => w.type === filter.type)
	}

	if (filter?.directive) {
		result = result.filter(w => w.directive === filter.directive)
	}

	if (filter?.since !== undefined) {
		result = result.filter(w => w.timestamp >= filter.since!)
	}

	return result
}

/**
 * Clear warnings
 */
export function clearEdgeCaseWarnings(): void {
	_warnings = []
}

/**
 * Start cleanup timer
 */
function startCleanupTimer(): void {
	if (_cleanupTimer !== null) {
		clearInterval(_cleanupTimer)
	}

	_cleanupTimer = window.setInterval(() => {
		// Check memory usage
		if (_observerCount > _config.memory.warnThreshold) {
			logWarning('memory-leak', `High observer count during cleanup: ${_observerCount}`)
		}
	}, _config.memory.cleanupInterval)
}

/**
 * Stop cleanup timer
 */
export function stopCleanupTimer(): void {
	if (_cleanupTimer !== null) {
		clearInterval(_cleanupTimer)
		_cleanupTimer = null
	}
}

/**
 * Create safe directive wrapper
 */
export function createSafeDirectiveWrapper<T>(
	directiveName: string,
	operation: (el: HTMLElement, binding: any, vnode: any) => T | Promise<T>,
	options?: {
		requireDOM?: boolean
		validateBinding?: (binding: any) => boolean
	},
): (el: HTMLElement, binding: any, vnode: any) => Promise<T | undefined> {
	return async (el: HTMLElement, binding: any, vnode: any) => {
		// SSR check
		if (options?.requireDOM !== false && isSSR()) {
			handleSSRUnsupported(directiveName, directiveName)
			return undefined
		}

		// Binding validation
		if (options?.validateBinding) {
			const result = validateBinding(binding.value, { validator: options.validateBinding }, directiveName)
			if (!result.success) {
				return undefined
			}
		}

		// Execute with error recovery
		const result = await withErrorRecovery(
			() => operation(el, binding, vnode),
			{
				onError: (error, attempt) => {
					logWarning('invalid-binding', `${directiveName} error (attempt ${attempt + 1}): ${error.message}`, directiveName)
				},
			},
		)

		return result.success ? result.value : undefined
	}
}

/**
 * Get element with edge case handling
 */
export function getElementWithFallback(
	selector: string,
	fallbackSelectors?: string[],
): Element | null {
	let element = document.querySelector(selector)

	if (!element && fallbackSelectors) {
		for (const fallback of fallbackSelectors) {
			element = document.querySelector(fallback)
			if (element) break
		}
	}

	if (!element) {
		logWarning('element-not-found', `Element not found: ${selector}`)
	}

	return element
}

/**
 * Check if element is in viewport (with fallback)
 */
export function isInViewport(element: Element): boolean {
	if (isSSR()) return false

	try {
		const rect = element.getBoundingClientRect()
		return (
			rect.top >= 0
			&& rect.left >= 0
			&& rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
			&& rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		)
	} catch {
		logWarning('element-not-found', 'Failed to get element bounds')
		return false
	}
}

/**
 * Cleanup on page unload
 */
export function setupCleanupOnUnload(cleanupFn: () => void): void {
	if (isSSR()) return

	window.addEventListener('beforeunload', cleanupFn)
	window.addEventListener('pagehide', cleanupFn)
}

/**
 * Get memory statistics
 */
export function getMemoryStats(): {
	observerCount: number
	maxObservers: number
	warningCount: number
	usedPercentage: number
} {
	return {
		observerCount: _observerCount,
		maxObservers: _config.memory.maxObservers,
		warningCount: _warnings.length,
		usedPercentage: (_observerCount / _config.memory.maxObservers) * 100,
	}
}
