/**
 * First Screen Loading Optimization Module for Directix
 * Provides utilities for optimizing initial page load performance
 */

// ============================================================================
// Types
// ============================================================================

export interface FirstScreenConfig {
	// Lazy loading
	lazyLoading: {
		enabled: boolean
		rootMargin: string
		threshold: number
		deferNonCritical: boolean
	}

	// Code splitting
	codeSplitting: {
		enabled: boolean
		preloadAfter: number
		prefetchVisible: boolean
	}

	// Resource hints
	resourceHints: {
		preconnect: string[]
		preload: string[]
		prefetch: string[]
		dnsPrefetch: string[]
	}

	// Deferred execution
	deferredExecution: {
		enabled: boolean
		deferDelay: number
		priorityQueue: boolean
	}

	// Critical CSS
	criticalCSS: {
		extract: boolean
		inline: boolean
		inlineThreshold: number
	}
}

export interface LoadPriority {
	critical: string[]
	high: string[]
	medium: string[]
	low: string[]
}

export interface DeferredTask {
	id: string
	priority: 'critical' | 'high' | 'medium' | 'low'
	execute: () => void | Promise<void>
	executed: boolean
}

export interface FirstScreenMetrics {
	domContentLoaded: number
	load: number
	firstPaint: number
	firstContentfulPaint: number
	largestContentfulPaint: number
	timeToInteractive: number
	totalBlockingTime: number
	cumulativeLayoutShift: number
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_FIRST_SCREEN_CONFIG: FirstScreenConfig = {
	lazyLoading: {
		enabled: true,
		rootMargin: '50px',
		threshold: 0.1,
		deferNonCritical: true,
	},
	codeSplitting: {
		enabled: true,
		preloadAfter: 1000,
		prefetchVisible: true,
	},
	resourceHints: {
		preconnect: [],
		preload: [],
		prefetch: [],
		dnsPrefetch: [],
	},
	deferredExecution: {
		enabled: true,
		deferDelay: 100,
		priorityQueue: true,
	},
	criticalCSS: {
		extract: false,
		inline: true,
		inlineThreshold: 14000,
	},
}

// ============================================================================
// First Screen Optimizer
// ============================================================================

let _config: FirstScreenConfig = DEFAULT_FIRST_SCREEN_CONFIG,
	_deferredTasks: DeferredTask[] = [],
	_metrics: Partial<FirstScreenMetrics> = {},
	_isDOMReady = false,
	_isPageLoaded = false

/**
 * Configure first screen optimization
 */
export function configureFirstScreen(config: Partial<FirstScreenConfig>): void {
	_config = {
		...DEFAULT_FIRST_SCREEN_CONFIG,
		...config,
		lazyLoading: { ...DEFAULT_FIRST_SCREEN_CONFIG.lazyLoading, ...config.lazyLoading },
		codeSplitting: { ...DEFAULT_FIRST_SCREEN_CONFIG.codeSplitting, ...config.codeSplitting },
		resourceHints: { ...DEFAULT_FIRST_SCREEN_CONFIG.resourceHints, ...config.resourceHints },
		deferredExecution: { ...DEFAULT_FIRST_SCREEN_CONFIG.deferredExecution, ...config.deferredExecution },
		criticalCSS: { ...DEFAULT_FIRST_SCREEN_CONFIG.criticalCSS, ...config.criticalCSS },
	}
}

/**
 * Get current configuration
 */
export function getFirstScreenConfig(): FirstScreenConfig {
	return { ..._config }
}

/**
 * Check if SSR
 */
function isSSR(): boolean {
	return typeof window === 'undefined'
}

/**
 * Initialize first screen optimizer
 */
export function initFirstScreenOptimizer(): void {
	if (isSSR()) return

	// Inject resource hints
	injectResourceHints()

	// Setup performance observer
	setupPerformanceObserver()

	// Mark DOM ready
	if (document.readyState !== 'loading') {
		_isDOMReady = true
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			_isDOMReady = true
			_metrics.domContentLoaded = performance.now()
		})
	}

	// Mark page loaded
	if (document.readyState === 'complete') {
		_isPageLoaded = true
	} else {
		window.addEventListener('load', () => {
			_isPageLoaded = true
			_metrics.load = performance.now()

			// Execute deferred tasks after load
			if (_config.deferredExecution.enabled) {
				executeDeferredTasks()
			}
		})
	}
}

/**
 * Inject resource hints
 */
function injectResourceHints(): void {
	if (!_config.resourceHints) return

	const head = document.head

	// Preconnect
	for (const url of _config.resourceHints.preconnect) {
		const link = document.createElement('link')
		link.rel = 'preconnect'
		link.href = url
		head.appendChild(link)
	}

	// DNS Prefetch
	for (const url of _config.resourceHints.dnsPrefetch) {
		const link = document.createElement('link')
		link.rel = 'dns-prefetch'
		link.href = url
		head.appendChild(link)
	}

	// Preload
	for (const url of _config.resourceHints.preload) {
		const link = document.createElement('link')
		link.rel = 'preload'
		link.href = url
		link.as = getResourceType(url)
		head.appendChild(link)
	}

	// Prefetch
	for (const url of _config.resourceHints.prefetch) {
		const link = document.createElement('link')
		link.rel = 'prefetch'
		link.href = url
		head.appendChild(link)
	}
}

/**
 * Get resource type for preload
 */
function getResourceType(url: string): string {
	if (url.endsWith('.js')) return 'script'
	if (url.endsWith('.css')) return 'style'
	if (/\.(woff2?|ttf|otf|eot)$/.test(url)) return 'font'
	if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/.test(url)) return 'image'
	return 'fetch'
}

/**
 * Setup performance observer for metrics
 */
function setupPerformanceObserver(): void {
	if (!('PerformanceObserver' in window)) return

	try {
		// Paint timing
		const paintObserver = new PerformanceObserver(list => {
			for (const entry of list.getEntries()) {
				if (entry.name === 'first-paint') {
					_metrics.firstPaint = entry.startTime
				} else if (entry.name === 'first-contentful-paint') {
					_metrics.firstContentfulPaint = entry.startTime
				}
			}
		})
		paintObserver.observe({ type: 'paint', buffered: true })

		// Largest Contentful Paint
		const lcpObserver = new PerformanceObserver(list => {
			const entries = list.getEntries()
			if (entries.length > 0) {
				_metrics.largestContentfulPaint = entries[entries.length - 1].startTime
			}
		})
		lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

		// Layout Shift
		let clsValue = 0
		const clsObserver = new PerformanceObserver(list => {
			for (const entry of list.getEntries()) {
				if (!(entry as any).hadRecentInput) {
					clsValue += (entry as any).value
				}
			}
			_metrics.cumulativeLayoutShift = clsValue
		})
		clsObserver.observe({ type: 'layout-shift', buffered: true })

		// Long Tasks
		const longTaskObserver = new PerformanceObserver(list => {
			let totalBlockingTime = _metrics.totalBlockingTime ?? 0
			for (const entry of list.getEntries()) {
				totalBlockingTime += entry.duration - 50
			}
			_metrics.totalBlockingTime = totalBlockingTime
		})
		longTaskObserver.observe({ type: 'longtask', buffered: true })
	} catch {
		// Performance observer not supported
	}
}

/**
 * Create lazy loader for directives
 */
export function createLazyLoader(options?: {
	rootMargin?: string
	threshold?: number
	onVisible?: (element: Element) => void
}): {
	observe: (element: Element) => void
	unobserve: (element: Element) => void
	disconnect: () => void
} {
	if (isSSR() || !('IntersectionObserver' in window)) {
		return {
			observe: () => {},
			unobserve: () => {},
			disconnect: () => {},
		}
	}

	const observer = new IntersectionObserver(
		entries => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					options?.onVisible?.(entry.target)
					observer.unobserve(entry.target)
				}
			}
		},
		{
			rootMargin: options?.rootMargin ?? _config.lazyLoading.rootMargin,
			threshold: options?.threshold ?? _config.lazyLoading.threshold,
		},
	)

	return {
		observe: (element: Element) => observer.observe(element),
		unobserve: (element: Element) => observer.unobserve(element),
		disconnect: () => observer.disconnect(),
	}
}

/**
 * Defer task execution
 */
export function deferTask(
	id: string,
	execute: () => void | Promise<void>,
	priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
): void {
	if (!_config.deferredExecution.enabled) {
		execute()
		return
	}

	// Check if already exists
	if (_deferredTasks.some(t => t.id === id)) {
		return
	}

	_deferredTasks.push({
		id,
		priority,
		execute,
		executed: false,
	})
}

/**
 * Execute deferred tasks
 */
export async function executeDeferredTasks(): Promise<void> {
	if (!_config.deferredExecution.priorityQueue) {
		for (const task of _deferredTasks) {
			if (!task.executed) {
				await task.execute()
				task.executed = true
			}
		}
		return
	}

	// Execute by priority
	const priorities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low']

	for (const priority of priorities) {
		const tasks = _deferredTasks.filter(t => t.priority === priority && !t.executed)

		// Use requestIdleCallback for low priority tasks
		if (priority === 'low' && 'requestIdleCallback' in window) {
			for (const task of tasks) {
				;(window as any).requestIdleCallback(async () => {
					await task.execute()
					task.executed = true
				})
			}
		} else {
			for (const task of tasks) {
				await task.execute()
				task.executed = true
			}
		}
	}
}

/**
 * Preload module
 */
export function preloadModule(url: string): void {
	if (isSSR()) return

	const link = document.createElement('link')
	link.rel = 'modulepreload'
	link.href = url
	document.head.appendChild(link)
}

/**
 * Prefetch module
 */
export function prefetchModule(url: string): void {
	if (isSSR()) return

	const link = document.createElement('link')
	link.rel = 'prefetch'
	link.href = url
	link.as = 'script'
	document.head.appendChild(link)
}

/**
 * Defer non-critical directive
 */
export function deferNonCriticalDirective(
	_directiveName: string,
	setup: () => void | Promise<void>,
	isCritical: boolean = false,
): void {
	// Note: directiveName available for logging/debugging in future
	if (isCritical || !_config.lazyLoading.deferNonCritical) {
		setup()
		return
	}

	// Defer until idle
	if ('requestIdleCallback' in window) {
		(window as any).requestIdleCallback(() => {
			setup()
		}, { timeout: _config.codeSplitting.preloadAfter })
	} else {
		setTimeout(setup, _config.codeSplitting.preloadAfter)
	}
}

/**
 * Prefetch visible elements
 */
export function prefetchVisibleElements(
	selector: string,
	getUrl: (element: Element) => string,
	options?: { rootMargin?: string },
): void {
	if (!_config.codeSplitting.prefetchVisible || isSSR()) return

	const loader = createLazyLoader({
		rootMargin: options?.rootMargin ?? '200px',
		onVisible: element => {
			const url = getUrl(element)
			if (url) {
				prefetchModule(url)
			}
		},
	})

	document.querySelectorAll(selector).forEach(el => loader.observe(el))
}

/**
 * Get first screen metrics
 */
export function getFirstScreenMetrics(): Partial<FirstScreenMetrics> {
	return { ..._metrics }
}

/**
 * Calculate Time to Interactive estimate
 */
export function calculateTTI(): number | undefined {
	if (!_metrics.load || !_metrics.domContentLoaded) {
		return undefined
	}

	// Simple TTI estimate
	return Math.max(_metrics.load, _metrics.domContentLoaded)
}

/**
 * Get Critical CSS
 */
export function extractCriticalCSS(): string {
	if (isSSR()) return ''

	const criticalCSS: string[] = []
	const sheets = Array.from(document.styleSheets)

	for (const sheet of sheets) {
		try {
			const rules = Array.from(sheet.cssRules || [])
			for (const rule of rules) {
				// Check if rule applies to above-fold content
				if (isCriticalRule(rule)) {
					criticalCSS.push(rule.cssText)
				}
			}
		} catch {
			// Cross-origin stylesheet, skip
		}
	}

	return criticalCSS.join('\n')
}

/**
 * Check if CSS rule is critical
 */
function isCriticalRule(rule: CSSRule): boolean {
	if (rule instanceof CSSStyleRule) {
		// Check if selector matches visible elements
		try {
			const elements = document.querySelectorAll(rule.selectorText)
			for (const el of elements) {
				if (isElementAboveFold(el)) {
					return true
				}
			}
		} catch {
			// Invalid selector
		}
	}
	return false
}

/**
 * Check if element is above fold
 */
function isElementAboveFold(element: Element): boolean {
	const rect = element.getBoundingClientRect()
	const viewportHeight = window.innerHeight

	return rect.top < viewportHeight && rect.bottom > 0
}

/**
 * Inline critical CSS
 */
export function inlineCriticalCSS(css: string): void {
	if (isSSR() || !css) return

	const style = document.createElement('style')
	style.textContent = css
	document.head.appendChild(style)
}

/**
 * Check if DOM is ready
 */
export function isDOMReady(): boolean {
	return _isDOMReady
}

/**
 * Check if page is loaded
 */
export function isPageLoaded(): boolean {
	return _isPageLoaded
}

/**
 * Execute on DOM ready
 */
export function onDOMReady(callback: () => void): void {
	if (_isDOMReady) {
		callback()
	} else {
		document.addEventListener('DOMContentLoaded', callback)
	}
}

/**
 * Execute on page load
 */
export function onPageLoad(callback: () => void): void {
	if (_isPageLoaded) {
		callback()
	} else {
		window.addEventListener('load', callback)
	}
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number {
	if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
		return (window as any).requestIdleCallback(callback, options)
	}

	// Fallback to setTimeout
	const timeoutId = setTimeout(() => {
		const start = Date.now()
		callback({
			didTimeout: false,
			timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
		})
	}, 1)
	// Return a number for consistency (in Node.js, setTimeout returns an object)
	return typeof timeoutId === 'number' ? timeoutId : Number(timeoutId)
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number): void {
	if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
		(window as any).cancelIdleCallback(id)
	} else {
		clearTimeout(id as any)
	}
}

/**
 * Create performance budget checker
 */
export function createPerformanceBudget(budget: {
	fcp?: number
	lcp?: number
	tti?: number
	cls?: number
	tbt?: number
}): {
	check: () => { passed: boolean, violations: string[] }
	report: () => string
} {
	return {
		check: () => {
			const violations: string[] = []
			const metrics = getFirstScreenMetrics()

			if (budget.fcp && metrics.firstContentfulPaint && metrics.firstContentfulPaint > budget.fcp) {
				violations.push(`FCP exceeded: ${metrics.firstContentfulPaint}ms > ${budget.fcp}ms`)
			}

			if (budget.lcp && metrics.largestContentfulPaint && metrics.largestContentfulPaint > budget.lcp) {
				violations.push(`LCP exceeded: ${metrics.largestContentfulPaint}ms > ${budget.lcp}ms`)
			}

			if (budget.tti && metrics.timeToInteractive && metrics.timeToInteractive > budget.tti) {
				violations.push(`TTI exceeded: ${metrics.timeToInteractive}ms > ${budget.tti}ms`)
			}

			if (budget.cls && metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > budget.cls) {
				violations.push(`CLS exceeded: ${metrics.cumulativeLayoutShift} > ${budget.cls}`)
			}

			if (budget.tbt && metrics.totalBlockingTime && metrics.totalBlockingTime > budget.tbt) {
				violations.push(`TBT exceeded: ${metrics.totalBlockingTime}ms > ${budget.tbt}ms`)
			}

			return {
				passed: violations.length === 0,
				violations,
			}
		},
		report: () => {
			const metrics = getFirstScreenMetrics()
			const lines: string[] = ['First Screen Performance Report', '='.repeat(40)]

			if (metrics.firstPaint) lines.push(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`)
			if (metrics.firstContentfulPaint) lines.push(`FCP: ${metrics.firstContentfulPaint.toFixed(2)}ms`)
			if (metrics.largestContentfulPaint) lines.push(`LCP: ${metrics.largestContentfulPaint.toFixed(2)}ms`)
			if (metrics.domContentLoaded) lines.push(`DCL: ${metrics.domContentLoaded.toFixed(2)}ms`)
			if (metrics.load) lines.push(`Load: ${metrics.load.toFixed(2)}ms`)
			if (metrics.cumulativeLayoutShift) lines.push(`CLS: ${metrics.cumulativeLayoutShift.toFixed(4)}`)
			if (metrics.totalBlockingTime) lines.push(`TBT: ${metrics.totalBlockingTime.toFixed(2)}ms`)

			return lines.join('\n')
		},
	}
}

/**
 * Cleanup
 */
export function cleanupFirstScreenOptimizer(): void {
	_deferredTasks = []
	_metrics = {}
}
